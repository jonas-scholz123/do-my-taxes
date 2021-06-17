#%%
from transactions import TransactionHandler
from forex_python.converter import CurrencyRates
from functools import cache
import config
import yfinance as yf
import timeit
from utils import DBHandler
from datetime import datetime

class Portfolio:

    def __init__(self):
        self.transaction_handler = TransactionHandler()
        self.cr = CurrencyRates()
    
    def generate(self):
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
        if from_cur == to_cur:
            return 1.
        rate = self.cr.get_rate(from_cur, to_cur)
        return rate
    
    def add_current_data(self):
        self.add_exchange_rates()
        self.add_price_data()
        self.add_developments()
        self.df.sort_values("current_value_gbp", ascending=False, inplace=True)
    
    def style(self):
        return self.df.style.bar(subset=["current_value_gbp", "percent_change"],
            align="mid", color=['#d65f5f', '#5fba7d'])

    def add_price_data(self):
        tickers = list(self.df["ticker"])
        prices = yf.download(tickers, period="1d")["Open"].iloc[-1]
        self.df["current_price"] = self.df["ticker"].map(prices) * self.df["exchange_rate"]
        self.df["current_value"] = self.df["current_price"] * self.df["quantity"]
        account_cur_to_gbp = self.df.account_currency.apply(self.get_rate, args=["GBP"]).astype(float)
        self.df["current_value_gbp"] = self.df["current_value"] * account_cur_to_gbp
    
    def add_exchange_rates(self):
        self.df["exchange_rate"] = self.df.apply(lambda x: self.get_rate(
                                                    x.investment_currency,
                                                    x.account_currency),
                                                 axis=1).astype(float)
    def add_developments(self):
        self.df["profit"] = self.df["current_value"] - self.df["buy_value"]
        self.df["percent_change"] = 100 * self.df["profit"]/self.df["buy_value"]
    
    def value(self, currency="GBP"):
        value_gbp = self.df.current_value_gbp.sum()
        return self.get_rate("GBP", currency) * value_gbp

    def generate_history(self, date):
        raise NotImplementedError
    
    def save_portfolio(self):
        raise NotImplementedError

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


portfolio = Portfolio()
portfolio.generate()
handler = PortfolioHandler()
#handler.reset_table()
#handler.create_table()
#handler.insert_portfolio(portfolio)
cur = "GBP"
print(f"Portfolio value: {portfolio.value(cur)} {cur}")
portfolio.style()

#%%