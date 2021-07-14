import React from 'react';
import Button from "./components/Button";
import Modal from "./transactions/NewTransactionModal";
import Header from "./components/Header";
import HighlightedTitle from "./components/HighlightedTitle";
import TransactionTable from './transactions/TransactionTable';
import withApiWrapper from './components/ApiWrapper';

function Transactions() {
  return (
    <div>
      <Header active="Transactions"/>
      <div className="flex justify-center">
        <div className="w-10/12">
          <p className="text-5xl font-bold p-6">Your Transactions</p>
          <div className="flex justify-between items-center">
            <HighlightedTitle text="Open Transactions" classes="bg-green-200"/>
          </div>
          <div className="flex justify-center block">
            <OpenTransactionsTable
              apiURL="http://localhost:5000/api/transactions/open"
            />
          </div>
          <div className="flex justify-between items-center block">
            <HighlightedTitle text="Closed Transactions" classes="bg-red-200"/>
          </div>
          <div className="flex justify-center">
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
    /* We pass this as the key prop to the transaciton table.
       By changing it, we force the child component to refresh.
    */
    
    this.setState((state) => ({nrReloads: state.nrReloads + 1}))
  }

  render() {

    const AddTransactionButton = ({setModalOpen}) => {
      return(
        <div className="w-1/3 h-12 flex justify-end">
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
        <div className="flex justify-center">
          <div>
            <h4 className="text-2xl font-semibold text-gray-400">
              You don't have any open transactions
            </h4>
            <div className="flex justify-center py-2">
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

    const WrappedTransactionTable = withApiWrapper(TransactionTable, this.props.apiURL)

    return (
      <div className="w-full">
          {/*We pass the key to reload the child component so that it fetches from api */}
        <WrappedTransactionTable
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
        <div className="flex justify-center">
          <div>
            <h4 className="text-2xl font-semibold text-gray-400 pb-6">
              You don't have any closed transactions
            </h4>
          </div>
        </div>
      )
    }

  const WrappedTransactionTable = withApiWrapper(TransactionTable, props.apiURL)

  return (
    <WrappedTransactionTable
      NoTransactionContent={<NoTransactionText />}
      {...props}
      refresh={true}
    />
  )
}



export default Transactions;
