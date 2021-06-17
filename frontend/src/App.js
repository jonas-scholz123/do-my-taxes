import react from 'react';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Menu/>
    </div>
  );
}

function Menu() {

  const transactions = [
    {
      depot: "ING Diba",
      name: "AMC Entertainment",
      ticker: "AMC",
      category: "Stock"
    },
    {
      depot: "Halifax",
      name: "S&P 500",
      ticker: "CSPX",
      category: "ETF"
    }

  ]

  return (
    <div className="Menu">
      <TransactionTable transactions={transactions}/>
      <AddTransactionButton/>
      <ViewPortfolioButton/>
    </div>
  )
}

class TransactionTable extends React.Component {
  render() {
    const rows = this.props.transactions.map(
      (transaction) => {
        return <TransactionRow
          depot={transaction.depot}
          name={transaction.name}
          ticker={transaction.ticker}
          category={transaction.category}
          />
      }
    )
    console.log(rows);

    return (
      <div className="transaction-table">
        <table>
          <thead>
            <tr>
              <th>Depot</th>
              <th>Name</th>
              <th>Ticker</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

function TransactionRow(props) {
  return (
    <tr>
      <td>{props.depot}</td>
      <td>{props.name}</td>
      <td>{props.ticker}</td>
      <td>{props.category}</td>
    </tr>
  )
}

class AddTransactionButton extends React.Component {
  handleClick() {
    console.log("adding transaction...");
  }

  render() {
    return (
        <button onClick={() => this.handleClick()}>Add Transaction</button>
    );
  }
}

class ViewPortfolioButton extends React.Component {
  handleClick() {
    console.log("Opening Portfolio...");
  }

  render() {
    return (
        <button onClick={() => this.handleClick()}>View Portfolio</button>
    );
  }
}

export default App;
