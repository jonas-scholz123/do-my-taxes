import React from 'react';
import Button from "./components/Button";
import ShowMoreButton from './components/ShowMoreButton';
import Table from "./components/Table";
import Modal from "./transactions/NewTransactionModal";
import Header from "./components/Header";
import HighlightedTitle from "./components/HighlightedTitle";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router"



function Transactions() {
  return (
    <div>
      <Header active="Transactions"/>
      <div class="flex justify-center">
        <div class="w-10/12">
          <p class="text-5xl font-bold p-6">Your Transactions</p>
          <div class="flex justify-between items-center">
            <HighlightedTitle text="Open Transactions" classes="bg-green-200"/>
          </div>
          <div class="flex justify-center block">
            <OpenTransactionsTable
              apiURL= "http://localhost:5000/api/transactions/open"
            />
          </div>
          <div class="flex justify-between items-center block">
            <HighlightedTitle text="Closed Transactions" classes="bg-red-200"/>
          </div>
          <div class="flex justify-center">
            <ClosedTransactionsTable
              apiURL= "http://localhost:5000/api/transactions/closed"
            />
          </div>
        </div>
      </div>
      {/*<Footer/>*/}
    </div>
  );
}

class ClosedTransactionsTable extends React.Component {

  constructor(props) {
    // props: apiURL, mainButton, 
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      transactions: [],
      nrRows: 5,
    };
  }

  componentDidMount() {
    fetch(this.props.apiURL)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          transactions: result,
        });
      },

      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      }
    )
  }

  handleShowMore() {
    this.setState(prevState => ({
        nrRows: Math.min(prevState.nrRows + 10, prevState.transactions.length)
    }));
  }

  handleRowClick(id) {
    this.setState({
      navigate: true,
      navigateTo: id.toString()
    })
  }

  render() {

    const {navigateTo, navigate, error, isLoaded, transactions } = this.state;

    const anyTransactions = transactions.length !== 0;

    if (navigate) {
      return <Navigate to={navigateTo} push={true}/>
    }

    if (error) {
      return <div> Error; {error.message} </div>;
    } else if (!isLoaded) {
      return (
        <div>
          <ClipLoader loading={!isLoaded} size={150} />
        </div>
      )
    }

    const NoTransactionText = ({visible}) => {
      if (!visible) {
        return <div/>
      }
      return (
        <h4 class="text-2xl font-semibold text-gray-400 pb-6">
          You don't have any closed transactions
        </h4>
      )
    }

    const TableAndButtons = ({visible}) => {
      if (!visible) {
        return <div/>
      }
      return (
        <div class="w-full">
          <div class="w-full justify-center">
            <Table
              content={transactions}
              nrRows={this.state.nrRows}
              clickable={true}
              keyHeader="id"
              onClick={(id) => this.handleRowClick(id)}
            />
          </div>

          <div class="py-6 flex justify-center">
            <ShowMoreButton onClick={() => this.handleShowMore()} />
          </div>
        </div>
      )
    }

    return (
      <div>
        <NoTransactionText visible={!anyTransactions}/>
        <TableAndButtons visible={anyTransactions}/>
      </div>
    )
  }
}


class OpenTransactionsTable extends React.Component {

  constructor(props) {
    // props: apiURL, mainButton, 
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      transactions: [],
      nrRows: 10,
      modalOpen: false,
      navigate: false,
      navigateTo: ""
    };
  }

  componentDidMount() {
    this.loadTransactions()
  }

  handleRowClick(id) {
    this.setState({
      navigate: true,
      navigateTo: id.toString()
    })
  }

  loadTransactions() {
    fetch(this.props.apiURL)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          transactions: result
        });
      },

      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      }
    )
  }

  handleShowMore() {
    this.setState(prevState => ({
        nrRows: Math.min(prevState.nrRows + 10, prevState.transactions.length)
    }));
  }

  setModalOpen(isOpen) {
    this.setState({modalOpen: isOpen})
  }

  render() {

    const {navigateTo, navigate, error, isLoaded, transactions } = this.state;

    const anyTransactions = transactions.length !== 0;

    if (navigate) {
      return <Navigate to={navigateTo} push={true}/>
    }

    if (error) {
      return <div> Error; {error.message} </div>;
    } else if (!isLoaded) {
      return <div> Loading... </div>
    }

    const TableAndButtons = ({visible}) => {
      if (!visible) {
        return <div/>
      }
      return (
        <div>
          <div class="w-full justify-center">
            <Table
              content={transactions}
              nrRows={this.state.nrRows}
              keyHeader="id"
              clickable={true}
              onClick={(id) => this.handleRowClick(id)}
            />
          </div>

          <div class="py-6 flex">
            <div class="w-1/3"/>
            <div class="w-1/3">
              <div class="flex justify-center">
                <ShowMoreButton onClick={() => this.handleShowMore()} />
              </div>
            </div>
            <div class="w-1/3 h-12 flex justify-end">
              <Button
                text="Add Transaction"
                main={true}
                handleClick={() => this.setModalOpen(true)}
              />
            </div>
          </div>
        </div>
      )
    }

    const MissingAndButton = ({visible}) => {
      if (!visible) {
        return <div/>
      }
      return (
          <div class="flex justify-center">
            <div>
              <h4 class="text-2xl font-semibold text-gray-400">
                You don't have any open transactions
              </h4>
              <div class="flex justify-center py-2">
                <Button
                  text="Add Transaction"
                  main={true}
                  handleClick={() => this.setModalOpen(true)}
                />
              </div>
            </div>
          </div>
      )
    }

    return (
      <div class="w-full">
        <TableAndButtons visible={anyTransactions}/>
        <MissingAndButton visible={!anyTransactions}/>
        <Modal
          open={this.state.modalOpen}
          setOpen={(bool) => this.setModalOpen(bool)}
          loadTransactions={() => this.loadTransactions()}
        />
      </div>
    )

  }
}

export default Transactions;
