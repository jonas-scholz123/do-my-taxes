#%%
import dataclasses
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime
from dataclasses import dataclass, fields, astuple
import config
from utils import DBHandler
import yfinance as yf

@dataclass
class Transaction:
    depot: str
    name: str
    ticker: str
    category: str
    quantity: float
    account_currency: str
    investment_currency: str
    buy_price: float
    buy_date: str
    sell_price: float = None
    sell_date: str = None

    def __post_init__(self):
        self.currency_codes = set(pd.read_csv(config.paths["currency_codes"])["id"])

        self.errors = {}
        self.validate()

    def validate(self):
        valid = True
        valid = self.date_is_valid(self.buy_date)
        valid = valid and self.ticker_is_valid()

        if self.sell_date:
            valid = valid and self.date_is_valid(self.sell_date)

        valid = self.currency_is_valid(self.investment_currency, "investment_currency") and valid
        valid = self.currency_is_valid(self.account_currency, "account_currency") and valid

        self.valid = valid
    
    def date_is_valid(self, date):
        try:
            datetime.strptime(date, "%Y-%m-%d")
            return True
        except:
            print("Date is invalid: ", date)
            self.errors["date"] = "invalid"
            return False
    
    def ticker_is_valid(self):
        invalid = yf.download(self.ticker).empty
        if invalid:
            self.errors["ticker"] = "Not a valid ticker. Please only use Yahoo finance tickers."
        return not invalid

    def currency_is_valid(self, currency, name):
        print("CHECKING: ", currency, name)
        valid = currency in self.currency_codes
        if not valid:
            self.errors[name] = "Invalid currency."
        return valid



class TransactionHandler(DBHandler):

    def __init__(self):
        super().__init__(table_name="transactions")
    
    def create_table(self):
        create_table_sql = ''' CREATE TABLE IF NOT EXISTS transactions (
                                id integer PRIMARY KEY,
                                depot text NOT NULL,
                                name text NOT NULL,
                                ticker text NOT NULL,
                                category text NOT NULL,
                                quantity float NOT NULL,
                                account_currency text NOT NULL,
                                investment_currency text NOT NULL,
                                buy_price float NOT NULL,
                                sell_price float,
                                buy_date text NOT NULL,
                                sell_date text
                                )'''
        self.cursor.execute(create_table_sql)
    
    def reset_table(self):
        self.drop_table()
        self.create_table()
    
    def insert(self, transaction: Transaction):
        if not transaction.valid:
            print("Error: tried to insert invalid transaction")
            return
        self.insert_valid_transaction(transaction)

    def insert_valid_transaction(self, transaction: Transaction):
        insert_sql = ''' INSERT INTO transactions (depot, name, ticker, category,
                                                   quantity, account_currency, investment_currency, 
                                                   buy_price, buy_date, sell_price, sell_date)
                         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
        self.cursor.execute(insert_sql, astuple(transaction))
    
    def insert_csv_transactions(self, path):

        # NaNs are turned into "nan" instead of None in transaction parsing
        # -> change all nans to Nones
        df = pd.read_csv(path).replace({np.nan: None})
        df.apply(self.insert_csv_row, axis=1)
    
    def insert_csv_row(self, row):
        transaction = Transaction(*row)
        self.insert(transaction)
    
    def fetch_open_transactions(self, after_buy_date="0000-00-00", before_buy_date="9999-99-99"):
        query = f'''SELECT * FROM transactions
                    WHERE sell_date IS NULL
                    AND buy_date > "{after_buy_date}"
                    AND buy_date < "{before_buy_date}"
                    '''
        print("query: ", query)
        return self.query_to_pandas(query).drop(["sell_date", "sell_price"], axis=1)

    def fetch_all_transactions(self):
        query = "SELECT * FROM transactions"
        return self.query_to_pandas(query)

    def fetch_closed_transactions(self, after_buy_date="0000-00-00", before_buy_date="9999-99-99"):
        query = f'''SELECT * FROM transactions
                    WHERE sell_date IS NOT NULL 
                    AND buy_date > "{after_buy_date}"
                    AND buy_date < "{before_buy_date}"
                    '''

        return self.query_to_pandas(query)
    
    def fetch_open_between(self, start, end):
        query = f'''SELECT * FROM transactions
                    WHERE buy_date < "{end}"
                    AND (sell_date > "{start}"
                        OR sell_date IS NULL)
                    '''

        return self.query_to_pandas(query)
    
    def fetch_earliest_transaction_date(self):
        query = "SELECT MIN(buy_date) FROM transactions"
        return self.cursor.execute(query).fetchall()[0][0]


if __name__ == "__main__":
    handler = TransactionHandler()

    handler.reset_table()
    handler.insert_csv_transactions(config.paths["transactions_fpath"])
    handler.print_all()


    df = handler.all_to_pandas()
# %%
