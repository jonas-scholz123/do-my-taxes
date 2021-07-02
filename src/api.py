from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import MethodNotAllowed

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
    return transaction_handler.fetch_all_transactions().to_json(orient="records")

@app.route('/api/transactions/open', methods=["GET"])
@cross_origin()
def get_open_transactions():
    return transaction_handler.fetch_open_transactions().to_json(orient="records")

@app.route('/api/transactions/closed', methods=["GET"])
@cross_origin()
def get_closed_transactions():
    return transaction_handler.fetch_closed_transactions().to_json(orient="records")

@app.route('/api/portfolio/history', methods=["GET"])
@cross_origin()
def get_portfolio_history():
    #start = request.args.get("start")
    #end = request.args.get("end")
    #print(f"fetching from {start} to {end}")
    df = portfolio.history(None, None, groupby="category").round(2)
    # for speed, limit to ~500 rows
    # n = max(1, int(df.shape[0]/500))
    # df = df.iloc[::n, :]
    return df.to_json(orient="columns")

@app.route('/api/portfolio/snapshot/now', methods=["GET"])
@cross_origin(supports_credentials=True)
def get_current_portfolio():
    portfolio.generate()
    df = portfolio.df.copy()
    df.drop(["depot", "account_currency", "buy_value", "exchange_rate", "current_price", "current_value"], axis=1, inplace=True)
    df.sort_values("current_value_gbp", inplace=True, ascending=False)
    return df.round(2).to_json(orient="records")

@app.route('/api/transactions/add', methods=["GET", "POST"])
@cross_origin()
def create_transaction():
    transaction = Transaction(**request.json["values"])
    print("NEW TRANSACTION: ", transaction)
    print("BUY DATE: ", transaction.buy_date)

    if transaction.valid:
        transaction_handler.insert_valid_transaction(transaction)
        return jsonify({'transaction': request.json}), 201
    # Unprocessable entity => 422
    return jsonify({'errors': transaction.errors, 'transaction': request.json}), 422


if __name__ == '__main__':
    app.run(debug=True, threaded=True)