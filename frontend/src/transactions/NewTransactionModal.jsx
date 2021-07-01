import React from 'react';
import Button from "../components/Button";
import Modal from "../components/Modal";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {InputField, TextInput, NumberInput, OptionSelect} from '../components/FormElements';

const NewTransactionForm = () => (
  <Formik
    initialValues={{
      depot: "Depot 1",
      name: "",
      ticker: "",
      category: "US Equity",
      account_currency: "",
      investment_currency: "",
      quantity: "",
      price: "",
      buy_date: "",
    }}
    validateOnChange={false}
    validate={values => {
      const errors = {};
      Object.keys(values).forEach((key) => {
        if (!values[key]) {
          errors[key] = "Required";
        }
      })
      console.log("ERRORS: ", errors);
      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      console.log("SUBMITTING")
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }}
  >
    {({ isSubmitting }) => (
      <Form id="new-transaction">
        <Field
          as={OptionSelect}
          name="depot"
          title="Depot"
          // TODO: Fetch from api
          options={["Depot 1", "Depot 2", "Depot 3"]}
        />
        <Field as={TextInput} name="name" title="Investment Name" />
        <Field as={TextInput} name="ticker" title="Ticker" />
        <Field
          as={OptionSelect}
          name="category"
          title="Category"
          // TODO: Fetch from api
          options={["US Equity", "Bets", "Developed Equity", "Emerging Equity"]}
        />

        <div class="flex justify-between">
          <Field as={TextInput} name="account_currency" title="Account Currency" />
          <Field as={TextInput} name="investment_currency" title="Investment Currency" />
        </div>
        <div class="flex justify-between">
          <Field as={NumberInput} name="quantity" title="Quantity" min="0" classes="w-2/3" step="any" />
          <Field as={NumberInput} name="price" title="Price" classes="w-2/3" min="0" step="any" />
        </div>
        <Field as={InputField} name="buy_date" title="Buy Date" type="date" />
      </Form>
    )}
  </Formik>
  )

export default function NewTransactionModal(props) {

  const footerContent = (
    <div class="flex">
      <div class="px-2">
        <Button text="Cancel" handleClick={() => props.setOpen(false)} />
      </div>
      <div class="px-2">
        <Button main={true} type="submit" form="new-transaction" text="Add Transaction" handleClick={() => { }} />
      </div>
    </div>
  )

  return (
    <Modal
      title="Add Transaction" 
      mainContent={<NewTransactionForm/>}
      footerContent={footerContent}
      {...props}
    />
  )
}
