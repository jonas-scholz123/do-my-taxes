from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import MethodNotAllowed

from transactions import TransactionHandler

transaction_handler = TransactionHandler()
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

if __name__ == '__main__':
    app.run(debug=True)