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
              apiURL="http://localhost:5000/api/transactions/open"
            />
          </div>
          <div class="flex justify-between items-center block">
            <HighlightedTitle text="Closed Transactions" classes="bg-red-200"/>
          </div>
          <div class="flex justify-center">
            <ClosedTransactionsTable
              apiURL="http://localhost:5000/api/transactions/closed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

class OpenTransactionsTable extends React.Component {

  constructor(props) {
    // props: apiURL
    super(props);

    this.state = {
      modalOpen: false,
      reload: false,
      nrReloads: 0
    };
  }

  setModalOpen(isOpen) {
    this.setState({modalOpen: isOpen})
  }

  reload() {
    this.setState((state) => ({nrReloads: state.nrReloads + 1}))
    console.log(this.state.nrReloads)
  }

  render() {

    const AddTransactionButton = ({setModalOpen}) => {
      return(
        <div class="w-1/3 h-12 flex justify-end">
          <Button
            text="Add Transaction"
            main={true}
            handleClick={() => setModalOpen(true)}
          />
        </div>
      )
    }

    const MissingAndButton = ({setModalOpen}) => {
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
                handleClick={() => setModalOpen(true)}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div class="w-full">
          {/*We pass the key to reload the child component so that it fetches from api */}
        <TransactionTable
          apiURL={this.props.apiURL}
          bottomRightContent={<AddTransactionButton setModalOpen={(bool) => this.setModalOpen(bool)}/>}
          NoTransactionContent={<MissingAndButton setModalOpen={(bool) => this.setModalOpen(bool)}/>}
          key={this.state.nrReloads}
        />

        <Modal
          open={this.state.modalOpen}
          setOpen={(bool) => this.setModalOpen(bool)}
          loadTransactions={() => this.reload()}
        />
      </div>
    )
  }
}

const ClosedTransactionsTable = (props) => {

    const NoTransactionText = () => {
      return (
        <div class="flex justify-center">
          <div>
            <h4 class="text-2xl font-semibold text-gray-400 pb-6">
              You don't have any closed transactions
            </h4>
          </div>
        </div>
      )
    }

  return (
    <TransactionTable
      NoTransactionContent={<NoTransactionText />}
      {...props}
      refresh={true}
    />
  )
}

class TransactionTable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      navigate: false,
      navigateTo: null,
      isLoaded: false,
      nrRows: 0,
      hideShowMore: false,
      error: null
    }
  }

  handleRowClick(id) {
    this.setState({
      navigate: true,
      navigateTo: id.toString()
    })
  }

  loadTransactions(apiURL) {

    const initialNrRows = 5;

    fetch(apiURL)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          transactions: result,
          nrRows: Math.min(initialNrRows, result.length),
          hideShowMore: result.length <= initialNrRows
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
    const rowIncrement = 10;

    this.setState(prevState => ({
        nrRows: Math.min(prevState.nrRows + rowIncrement, prevState.transactions.length),
        hideShowMore: (prevState.nrRows + rowIncrement) >= prevState.transactions.length
    }));
  }

  componentDidMount() {
    this.loadTransactions(this.props.apiURL)
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

    if (this.state.error) {
      return <div> Error; {this.state.error.message} </div>;
    }

    if (!this.state.isLoaded) {
      return (
        <div>
          <ClipLoader loading={!this.state.isLoaded} size={150} />
        </div>
      )
    }
    return (
      <div class="w-full">
        <TableAndButtons visible={anyTransactions} />
        {anyTransactions ? null : this.props.NoTransactionContent}
      </div>
    )
  }

}


export default Transactions;
