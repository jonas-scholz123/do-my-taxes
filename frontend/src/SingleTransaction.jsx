import { useParams, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { TransactionFormContent } from "./transactions/NewTransactionModal";
import axios from './axiosConfig';
import BaseButton from "./components/BaseButton";
import Card from "./components/Card";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InputField, TextInput, NumberInput, OptionSelect } from './components/FormElements';
import ClipLoader from "react-spinners/ClipLoader";

const SingleTransaction = () => {
  const { transactionId } = useParams()
  const [transaction, setTransaction] = useState({});
  const [goBack, setGoBack] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/transactions/" + transactionId)
      .then(res => res.json())
      .then(
        (result) => {
          setTransaction(result)
          setLoaded(true)
        });
  },

    (error) => {
    }
  )

  if (goBack) {
    return <Navigate to={"/transactions/"} push={true}/>
  }

  if (!loaded) {
      return <ClipLoader loading={!loaded} size={150} />
  }
  return (
    <div class="flex justify-center">
      <div class="flex flex-wrap w-full justify-center">
        <div class="md:w-5/12">
          <Card
            content={<GoBack/>}
            classes="mt-6 mx-3 px-10 text-indigo-800 hover:bg-indigo-800 hover:text-white cursor-pointer"
            handleClick={() => setGoBack(true)}
          />
          <Card content={<SellTransaction transaction={transaction} setGoBack={setGoBack}/>} classes="mt-6 mx-3"/>
          <Card content={<DeleteTransaction setGoBack={setGoBack} id={transaction.id}/>} classes="mt-6 mx-3"/>
        </div>
        <Card content={<EditTransaction transaction={transaction} setGoBack={setGoBack} />} classes="m-6 md:w-5/12"/>
      </div>
    </div>
  )
}

const GoBack = () => {
  return (
    <div class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
      </svg>
      <div class="text-4xl font-bold px-6">
        Back to Transactions
      </div>
    </div>
  )
}

const SellTransaction = ({transaction, setGoBack}) => {

  return (
    <div>
      <Formik
        initialValues={transaction}
        validateOnChange={false}
        enableReinitialize
        validateOnBlur={false}
        validate={values => {
          console.log("validating...", values)
          const errors = {};
          Object.keys(values).forEach((key) => {
            if (!values[key]) {
              errors[key] = "Required";
            }})
            return errors;
          }
        }

        onSubmit={(values, { setSubmitting, setFieldError }) => {
          axios.post('/transactions/edit', values)
          .then(function (response) {
            setGoBack(true)
          })
          .catch(function (error) {
            console.log(error);
          });
        }}
      >
        {({ isSubmitting }) => (
          <div class="flex justify-center">
            <div class="w-10/12">
              <h1 class="text-4xl font-bold pb-3"> Close Transaction </h1>
              <div>
                <Form>
                  <Field as={NumberInput} name="sell_price" title="Price" min="0"
                    classes="w-2/3" step="any" suffix={transaction["investment_currency"]}/>

                  <div class="flex justify-center items-center">
                    <Field as={InputField} name="sell_date" title="Sell Date" type="date" />
                    <div class="w-full pt-3 pl-5">
                      <BaseButton
                        type="submit"
                        classes={`bg-indigo-700 text-white rounded-lg w-full p-6 text-base
                              hover:bg-indigo-800 focus:outline-none focus:ring-2
                              focus:ring-offset-2 focus:ring-indigo-500`}
                        text="Submit"
                      />
                    </div>
                  </div>
                </Form>
              </div>

            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

const DeleteTransaction = ({id, setGoBack}) => {

  const handleClick = () => {
    axios.delete('http://localhost:5000/api/transactions/' + id.toString())
      .then(function (response) {
        setGoBack(true)
      })
      .catch(function (error) {
      }
    )
  }
    

  return (
    <div class="flex justify-center">
      <div class="w-10/12">
        <h1 class="text-4xl font-bold p-4"> Delete Transaction </h1>
        <div class="">
          <button
            class={` bg-red-600 text-white rounded-lg w-full p-3 text-base
                      hover:bg-red-700 focus:outline-none focus:ring-2
                      focus:ring-offset-2 focus:ring-red-500`}
            onClick={() => handleClick()}
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  )
}

const EditTransaction = ({transaction, setGoBack}) => {
  return (
    <div>
      <Formik
        initialValues={transaction}
        validateOnChange={false}
        enableReinitialize
        validateOnBlur={false}
        validate={values => {}}

        onSubmit={(values, { setSubmitting, setFieldError }) => {
          axios.post('/transactions/edit', values)
          .then(function (response) {
            console.log("SENDING: ", values);
            setGoBack(true)
          })
          .catch(function (error) {
            console.log(error);
          });
        }}
      >
        {({ isSubmitting }) => (
          <div class="flex justify-center">
            <div class="w-10/12">
              <h1 class="text-4xl font-bold p-4"> Edit Transaction </h1>
              <div>
                <Form id="new-transaction">
                  <Field
                    as={OptionSelect}
                    name="depot"
                    title="Depot"
                    // TODO: Fetch from api
                    options={["Depot 1", "Depot 2", "Depot 3"]}
                  />
                  <Field as={TextInput} name="name" title="Investment Name" classes="w-full"/>
                  <Field as={TextInput} name="ticker" title="Ticker" classes="w-full"/>
                  <Field
                    as={OptionSelect}
                    name="category"
                    title="Category"
                    // TODO: Fetch from api
                    options={["US Equity", "Bets", "Developed Equity", "Emerging Equity", "UK Equity"]}
                  />

                  <div class="flex justify-between">
                    <Field as={TextInput} name="account_currency" title="Account Currency" classes="w-2/3"/>
                    <Field as={TextInput} name="investment_currency" title="Investment Currency" classes="w-2/3"/>
                  </div>
                  <div class="flex justify-between">
                    <Field as={NumberInput} name="quantity" title="Quantity" min="0" classes="w-2/3" step="any" />
                    <Field as={NumberInput} name="buy_price" title="Price" classes="w-2/3" min="0" step="any" />
                  </div>
                  <div class="flex justify-between items-center">
                    <Field as={InputField} name="buy_date" title="Buy Date" type="date" />

                    <div class="w-full pt-3 pl-10">
                      <BaseButton
                        type="submit"
                        classes={`bg-indigo-700 text-white rounded-lg w-full text-base
                                  hover:bg-indigo-800 focus:outline-none focus:ring-2
                                  focus:ring-offset-2 focus:ring-red-500`}
                        text="Submit"
                      />
                    </div>

                  </div>


                </Form>
              </div>

            </div>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default SingleTransaction;