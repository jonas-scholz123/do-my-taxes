from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from requests.api import get
from werkzeug.exceptions import MethodNotAllowed
import pandas as pd

from transactions import TransactionHandler, Transaction
from portfolio import Portfolio

transaction_handler = TransactionHandler()
portfolio = Portfolio()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/transactions/all', methods=["GET"])
@cross_origin()
def get_all_transactions():
    return transaction_handler.fetch_all_transactions().sort_values("buy_date").to_json(orient="records")

@app.route('/api/transactions/open', methods=["GET"])
@cross_origin()
def get_open_transactions():
    return transaction_handler.fetch_open_transactions() \
                              .sort_values("buy_date", ascending=False) \
                              .to_json(orient="records")

@app.route('/api/transactions/closed', methods=["GET"])
@cross_origin()
def get_closed_transactions():
    return transaction_handler.fetch_closed_transactions() \
                              .sort_values("sell_date", ascending=False) \
                              .to_json(orient="records")


@app.route('/api/portfolio/history', methods=["GET"])
@cross_origin()
def get_portfolio_history():
    #start = request.args.get("start")
    #end = request.args.get("end")
    #print(f"fetching from {start} to {end}")
    ticker = request.args.get("ticker")
    if ticker is not None:
        return get_ticker_history(ticker)

    df = portfolio.history(None, None, groupby="category").round(2)
    # for speed, limit to ~500 rows
    # n = max(1, int(df.shape[0]/500))
    # df = df.iloc[::n, :]
    return df.to_json(orient="columns")

def get_ticker_history(ticker):
    '''
    Gets the portfolio history with two columns: ticker and all other items in the portfolio (="rest")
    '''
    df = portfolio.history(None, None)
    emphasized_df = pd.DataFrame()
    emphasized_df[ticker] = df[ticker].replace(0, None)
    emphasized_df['rest'] = df.drop(ticker, axis=1).sum(axis=1)
    return emphasized_df.to_json(orient="columns")

@app.route('/api/portfolio/snapshot/now', methods=["GET"])
@cross_origin()
def get_current_portfolio():
    portfolio.generate()
    df = portfolio.df.copy()
    df.drop(["depot", "account_currency", "buy_value", "current_price", "current_value",
             "category", "investment_currency", "exchange_rate"], axis=1, inplace=True)


    df.sort_values("current_value_gbp", inplace=True, ascending=False)
    return df.round(2).to_json(orient="records")

@app.route("/api/transactions/<transaction_id>", methods=["GET", "DELETE"])
@cross_origin()
def single_transaction(transaction_id):
    if request.method == "GET":
        return transaction_handler.fetch_by_id(transaction_id).loc[0, :].to_json(orient="index")
    if request.method == "DELETE":
        transaction_handler.delete(transaction_id)
        return jsonify({'transaction': request.json}), 200

@app.route('/api/transactions/add', methods=["GET", "POST"])
@cross_origin()
def create_transaction():
    transaction = Transaction(**request.json["values"])
    if transaction.valid:
        transaction_handler.insert_valid_transaction(transaction)
        return jsonify({'transaction': request.json}), 201
    # Unprocessable entity => 422
    return jsonify({'errors': transaction.errors, 'transaction': request.json}), 422

@app.route('/api/transactions/edit', methods=["POST"])
@cross_origin()
def edit_transaction():
    received = request.json
    transaction_id = received["id"]
    del received["id"]
    transaction = Transaction(**received)

    if transaction.valid:
        transaction_handler.edit_transaction(transaction_id, transaction)
        return jsonify({'transaction': request.json}), 201
    # Unprocessable entity => 422
    return jsonify({'errors': transaction.errors, 'transaction': request.json}), 422


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, threaded=True)