#%%
import dataclasses
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime
from dataclasses import dataclass, fields, astuple
import config
from utils import DBHandler

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
    sell_price: float
    buy_date: str
    sell_date: str

    def __post_init__(self):
        self.valid = False
        self.validate()

    def validate(self):
        valid = True
        valid = self.date_is_valid(self.buy_date)
        if self.sell_date:
            valid = valid and self.date_is_valid(self.sell_date)
        self.valid = valid

    def date_is_valid(self, date):
        try:
            datetime.strptime(date, "%Y-%m-%d")
            return True
        except:
            print("Date is invalid: ", date)
            return False

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
                                                   buy_price, sell_price, buy_date, sell_date)
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
    
    def fetch_open_transactions(self):
        query = "SELECT * FROM transactions WHERE sell_date IS NULL"
        return self.query_to_pandas(query)


test_transaction = Transaction('Halifax S&S ISA',
                               'test_name',
                               "MSFT",
                               "Stock",
                               32,
                               "EUR",
                               "USD",
                               176.322,
                               None,
                               "2015-02-02",
                               None)

test_transaction3 = Transaction('Halifax S&S ISA',
                               'test_name',
                               "TSLA",
                               "Stock",
                               2,
                               "EUR",
                               "EUR",
                               126.122,
                               None,
                               "2015-02-02",
                               None)

test_transaction2 = Transaction('Halifax S&S ISA',
                                'hello',
                                "HLLO",
                                "Stock",
                                32,
                                "EUR",
                                "EUR",
                                126.322,
                                182.311,
                                "2015-02-02",
                                "2016-02-03")

if __name__ == "__main__":
    handler = TransactionHandler()

    handler.reset_table()
    #for _ in range(5):
        #handler.insert(test_transaction)
        #handler.insert(test_transaction2)
        #handler.insert(test_transaction3)
    
    handler.insert_csv_transactions(config.paths["transactions_fpath"])
    handler.print_all()


    df = handler.all_to_pandas()
# %%
