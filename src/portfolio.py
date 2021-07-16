#%%
from requests.sessions import session
from transactions import TransactionHandler
from forex_python.converter import CurrencyRates
from functools import cache
import config
import yfinance as yf
import timeit
from utils import DBHandler
from datetime import date, datetime, timedelta
import pandas as pd
from collections import defaultdict
import matplotlib.pyplot as plt
from pprint import pprint
import requests_cache
import time

class Portfolio:
    '''
    Class to compute current portfolio from transaction history,
    augment this portfolio with live financial data.

    Also allows for a computation of portfolio history from transaction history.
    '''

    def __init__(self):
        self.transaction_handler = TransactionHandler()
        self.cr = CurrencyRates()
        self.session = requests_cache.CachedSession('yfinance.cache')
        self.session.headers['User-agent'] = 'my-program/1.0'
        self.downloading = False

    
    def generate(self):
        '''
        Computes the current portfolio of positions by grouping all open transactions
        '''
        query = '''SELECT id, depot, name, ticker, category, SUM(quantity) as quantity,
                        AVG(buy_price) as buy_price,
                        account_currency, investment_currency,
                        AVG(buy_price) * SUM(quantity) as buy_value
                   FROM transactions
                   WHERE sell_date IS NULL
                   GROUP BY ticker
                   HAVING SUM(quantity) != 0'''

        self.df = self.transaction_handler.query_to_pandas(query)
        self.df.set_index("id", inplace=True)
        self.add_current_data()


    @cache 
    def get_rate(self, from_cur, to_cur):
        '''
        Fetches current exchange rate from European Central Bank
        '''
        if from_cur == to_cur:
            return 1.
        rate = float(self.cr.get_rate(from_cur, to_cur))
        return rate
    
    def add_current_data(self):
        '''
        Wrapper for all methods that fetch current financial data and augment the portfolio dataframe
        '''
        self.add_exchange_rates()
        self.add_price_data()
        self.add_developments()
        self.df.sort_values("current_value_gbp", ascending=False, inplace=True)
    
    def style(self):
        '''
        Styles dataframe to view portfolio in a more aesthetic way
        '''
        return self.df.style.bar(subset=["current_value_gbp", "percent_change"],
            align="mid", color=['#d65f5f', '#5fba7d'])

    def add_price_data(self):
        '''
        Fetch current price data for given tickers from yfinance and compute current portfolio
        position values
        '''
        tickers = list(self.df["ticker"])
        # Sometimes data is missing, take 10 last days, drop any missing data and take most recent

        while self.downloading:
            time.sleep(0.1)
        self.downloading = True
        prices = yf.download(tickers, period="10d", session=self.session)["Open"].dropna(how="any").iloc[-1]
        self.downloading = False
        self.df["current_price"] = self.df["ticker"].map(prices) * self.df["exchange_rate"]
        self.df["current_value"] = self.df["current_price"] * self.df["quantity"]
        account_cur_to_gbp = self.df.account_currency.apply(self.get_rate, args=["GBP"]).astype(float)
        self.df["current_value_gbp"] = self.df["current_value"] * account_cur_to_gbp
    
    def add_exchange_rates(self):
        '''
        Determines exchange rate from the investment currency to the account currrency
        and adds it to the main dataframe holding portfolio data
        '''
        self.df["exchange_rate"] = self.df.apply(lambda x: self.get_rate(
                                                    x.investment_currency,
                                                    x.account_currency),
                                                 axis=1).astype(float)
    def add_developments(self):
        '''
        Calculate profits and percent changes of each position
        '''
        self.df["profit"] = self.df["current_value"] - self.df["buy_value"]
        self.df["percent_change"] = 100 * self.df["profit"]/self.df["buy_value"]
    
    def value(self, currency="GBP"):
        '''
        Calculates the current portfolio value in the given currency
        '''
        value_gbp = self.df.current_value_gbp.sum()
        return self.get_rate("GBP", currency) * value_gbp
    
    def open_at_date(self, df, date):
        '''
        Given a dataframe df of transactions, returns a dataframe of transactions that
        are open at the given date.
        '''
        return df[(df["buy_date"] <= date)
                & ((df["sell_date"].isnull()) | (df["sell_date"] > date))]
    
    def _make_quantity_date_dict(self, start_date, end_date):
        '''
        Make dict of dicts of tuple, dict of tickers: quantity (start_date, end_date)
             {
                 "GOOG": {
                     0: (start_date, "2021-04-03"),
                     8: ("2021-04-03", "2021-05-03"),
                     22: ("2021-05-04", end_date)
                 }
             }
        '''
        transactions = self.transaction_handler.fetch_open_between(start_date, end_date)
        tickers = list(transactions["ticker"].unique())

        quantities = defaultdict(list)
        for ticker in tickers:
            ticker_transactions = transactions[transactions["ticker"] == ticker].copy()
            dates = [start_date]

            dates += list(pd.concat([
                ticker_transactions["buy_date"],
                ticker_transactions["sell_date"]
                ]).drop_duplicates().dropna())
            
            dates = [d for d in dates if start_date <= d <= end_date]

            dates.append(end_date)
            dates.sort()

            for from_date, to_date in zip(dates, dates[1:]):
                quantity = self.open_at_date(ticker_transactions, from_date)["quantity"].sum()
                quantities[ticker].append((quantity, (from_date, to_date)))

        return quantities
    
    def _price_history_to_value_history(self, price_history, quantities):
        '''
        Multiplies a price history by quantities at different points in time to obtain
        the value of each ticker in the portfolio at this time
        '''
        for ticker, quantity_ranges in quantities.items():
            for quantity, (from_date, to_date) in quantity_ranges:
                rows = (price_history.index >= from_date) & (price_history.index < to_date)
                price_history.loc[rows, ticker] *= quantity
        return price_history
    
    def _group_history_by(self, groupby, history, transactions):
        '''
        Groups a table with columns: tickers by a transaction data attribute, e.g. category
        '''
        if groupby not in transactions.columns:
            raise ValueError(f"Groupby: {groupby} is not a valid category")

        categories = transactions[groupby].unique()
        category_history = pd.DataFrame(columns=categories)
        for category in categories:
            tickers_in_category = transactions[transactions[groupby] == category]["ticker"].unique()
            category_history[category] = history[tickers_in_category].sum(axis=1)
        return category_history
    
    def ticker_history(self, ticker, start_date, end_date):
        if start_date is None:
            start_date = self.transaction_handler.fetch_earliest_transaction_date()
        
        if end_date is None:
            tomorrow = datetime.now() + timedelta(days=1)
            end_date = tomorrow.date().isoformat()
        
        price_history = yf.download(ticker, start=start_date, end=end_date, session=self.session)["Open"].copy()
        price_history.fillna(method="ffill", inplace=True)

        return price_history


    def history(self, start_date, end_date, groupby="ticker"):
        '''
        Creates the history of value developments obtained from the given transactions
        and groups tickers by any attribute (e.g. by category)

        PARAMS:
            start_date : str : date string of ISO format YYYY-MM-DD
            end_date : str : date string of ISO format YYYY-MM-DD
            groupby : str : one of transaction data attributes, e.g. "ticker" or "category"
        RETURNS:
            value_history : pd.DataFrame : a dataframe with rows -> dates, columns -> groupby categories
                                           between start_date and end_date
        '''

        # need to shift by one day to get correct data, not sure why yfinance api works this way.
        if start_date is None:
            start_date = self.transaction_handler.fetch_earliest_transaction_date()
            start_date_plus_1 = datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=1)
            start_date_plus_1 = start_date_plus_1.date().isoformat()
        
        if end_date is None:
            tomorrow = datetime.now() + timedelta(days=1)
            end_date = tomorrow.date().isoformat()

        # 1. Get a list of all tickers ever held between start_date and end_date
        transactions = self.transaction_handler.fetch_open_between(start_date, end_date)
        tickers = list(transactions["ticker"].unique())


        # 2. Make api call between start_date and end_date for all tickers, hold in df
        # Then multiply by exchange rate to have values in GBP

        while self.downloading:
            time.sleep(0.1)
        self.downloading = True
        price_history = yf.download(tickers, start=start_date_plus_1, end=end_date, session=self.session)["Open"].copy()
        self.downloading = False

        for ticker in tickers:
            currency = transactions[transactions["ticker"] == ticker].iloc[0]["investment_currency"]
            rate = self.get_rate(currency, "GBP")
            price_history[ticker] *= rate

        # 3. Make dict of dicts of tuple, dict of tickers: quantity (start_date, end_date)
        #     {
        #         "GOOG": {
        #             0: (start_date, "2021-04-03"),
        #             8: ("2021-04-03", "2021-05-03"),
        #             22: ("2021-05-04", end_date)
        #         }
        #     }

        quantities = self._make_quantity_date_dict(start_date, end_date)

        # 4. Multiply values in df by quantity by the dict created in 3
        value_history = self._price_history_to_value_history(price_history, quantities)

        # fill missing data from api
        value_history.fillna(method="ffill", inplace=True)

        return self._group_history_by(groupby, value_history, transactions)

class PortfolioHandler(DBHandler):
    '''
    Interacts with portfolio database to save and retrieve portfolios at different points in time
    '''

    def __init__(self):
        super().__init__(table_name="portfolios")
    
    def create_table(self):
        create_table_sql = ''' CREATE TABLE IF NOT EXISTS portfolios (
                                id integer PRIMARY KEY,
                                portfolio_id integer,
                                date text NOT NULL,
                                depot text NOT NULL,
                                name text NOT NULL,
                                ticker text NOT NULL,
                                category text NOT NULL,
                                quantity float NOT NULL,
                                buy_price float NOT NULL,
                                account_currency text NOT NULL,
                                investment_currency text NOT NULL,
                                buy_value float NOT NULL,
                                exchange_rate NOT NULL,
                                current_price float NOT NULL,
                                current_value float NOT NULL,
                                current_value_gbp float NOT NULL,
                                profit float NOT NULL,
                                percent_change float NOT NULL
                                )'''
        self.cursor.execute(create_table_sql)
    
    def insert_portfolio(self, portfolio: Portfolio):
        portfolio.df["date"] = datetime.today().strftime('%Y-%m-%d')
        self.cursor.execute("SELECT MAX(portfolio_id) FROM portfolios")
        max_id = self.cursor.fetchall()[0][0]
        if max_id is None:
            max_id = 0
        portfolio.df["portfolio_id"] = max_id + 1
        portfolio.df.to_sql(self.table_name, self.conn, if_exists="append", index=False)



if __name__ == "__main__":
    portfolio = Portfolio()

    #for _ in range(3):
        #portfolio.generate()
    #handler = PortfolioHandler()
    #handler.reset_table()
    #handler.create_table()
    #handler.insert_portfolio(portfolio)
    #cur = "GBP"
    #print(f"Portfolio value: {portfolio.value(cur)} {cur}")
    #portfolio.style()
    #print(portfolio.history("2018-01-01", "2021-07-01", columns="categories"))
    #portfolio.history("2018-01-01", "2021-07-01", columns="categories").to_json(orient="columns"))
    portfolio.ticker_history("GOOG", None, None)
    hist = portfolio.history(None, None, groupby="ticker")
# %%
