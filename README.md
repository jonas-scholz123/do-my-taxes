# Taxify

<p float="left">
  <img src="images/transactions.png" width="49%" />
  <img src="images/portfolio.png" width="49%" /> 
</p>

<p float="left">
  <img src="/images/single_transaction.png" width="49%" />
  <img src="/images/modal.png" width="49%" />
</p>


## What is it?
It's a financial portfolio tracking app that allows you to input investment transactions that you have made and calculates your portfolio history.

## How to run it (the easier way)
If you have docker, you can just cd into the home directory and run
    ```
    docker-compose up
    ```

## How to run it (the harder way)
We need to enable both the backend and the frontend.

### Backend
1. In one terminal, `cd` into /backend
2. Install requirements using 
    ```
    pip install -r requirements.txt
    ```
3. Set the flask app using
    ```
    export FLASK_APP="api.py"
    ```
4. Start the backend using
    ```
    flask run
    ```

### Frontend
1. In another terminal `cd` into /frontend
2. Install all packages using 
    ```
    npm install
    ```
3. Start the frontend using
    ```
    npm start
    ```

You can now go to localhost:3000/transactions in your browser to check it out.


## TODO:
 - [x] Reopoen closed transaction
 - [x] Implement position browser (click on position => graph adjusts to only that position)
 - [x] Dockerise
 - [ ] Make home page 
 - [ ] Build Custom date range input for PotfolioBrowser 
 - [ ] Make tables frontend sortable
 - [ ] Infer investment currency from ticker
