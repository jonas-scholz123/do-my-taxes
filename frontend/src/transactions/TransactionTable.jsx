import React from 'react';
import ShowMoreButton from '../components/ShowMoreButton';
import Table from "../components/Table";

import ClipLoader from "react-spinners/ClipLoader";
import { Navigate } from "react-router"

class TransactionTable extends React.Component {

  constructor(props) {
    super(props)
    const initNrRows = 5
    this.state = {
      transactions: props.data,
      navigate: false,
      navigateTo: null,
      nrRows: initNrRows,
      hideShowMore: initNrRows >= props.data.length,
    }
  }

  handleRowClick(id) {
    this.setState({
      navigate: true,
      navigateTo: id.toString()
    })
  }

  handleShowMore() {
    const rowIncrement = 10;

    this.setState(prevState => ({
        nrRows: Math.min(prevState.nrRows + rowIncrement, prevState.transactions.length),
        hideShowMore: (prevState.nrRows + rowIncrement) >= prevState.transactions.length
    }));
  }

  render() {
    
    const anyTransactions = this.state.transactions.length !== 0;

    const TableAndButtons = ({ visible }) => {
      if (!visible) {
        return <div />
      }
      return (
        <div class="w-full">
          <div class="w-full justify-center">
            <Table
              content={this.state.transactions}
              nrRows={this.state.nrRows}
              keyHeader="id"
              clickable={true}
              onClick={(id) => this.handleRowClick(id)}
            />
          </div>

          <div class="py-6 flex">
            <div class="w-1/3" />
            <div class="w-1/3">
              <div class={"flex justify-center " + (this.state.hideShowMore ? "hidden" : "")}>
                <ShowMoreButton onClick={() => this.handleShowMore()} />
              </div>
            </div>
            {this.props.bottomRightContent}
          </div>
        </div>
      )
    }

    if (this.state.navigate) {
      return <Navigate to={this.state.navigateTo} push={true} />
    }

    return (
      <div class="w-full">
        <TableAndButtons visible={anyTransactions} />
        {anyTransactions ? null : this.props.NoTransactionContent}
      </div>
    )
  }
}

export default TransactionTable;