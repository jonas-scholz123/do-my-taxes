import sqlite3
import config
import pandas as pd

class DBHandler:
    '''
    Base class for handling database
    '''

    def __init__(self, table_name):
        self.conn = sqlite3.connect(config.paths["db_fpath"])
        self.cursor = self.conn.cursor()
        self.table_name = table_name

    def drop_table(self):
        self.cursor.execute(f"DROP TABLE IF EXISTS {self.table_name}")
    
    def create_table(self):
        # pure virtual
        raise NotImplementedError
    
    def reset_table(self):
        self.drop_table()
        self.create_table()
    
    def __del__(self):
        self.conn.commit()

    def print_all(self):
        rows = self.fetch_all()
        for row in rows:
            print(row)
    
    def fetch_all(self):
        self.cursor.execute(f"SELECT * FROM {self.table_name}")
        return self.cursor.fetchall()
    
    def query_to_pandas(self, query):
        return pd.read_sql_query(query, self.conn)
    
    def all_to_pandas(self):
        return pd.read_sql_query(f"SELECT * FROM {self.table_name}", self.conn)