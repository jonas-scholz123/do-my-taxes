import React from 'react';
import ApiWrapper from '../components/ApiWrapper'

function PositionCard(props) {
  console.log("POSITION CARD: ", props)
  return (
    <div class="h-24 py-4 px-6 flex">
      <div class="w-2/12">
        <div class="flex justify-center text-5xl items-center h-full font-semibold text-white bg-gray-400 h-16 w-16">
          {props.name ? props.name.substring(0, 1) : ""}
        </div>
      </div>
      <div class="w-8/12 px-4">
        <div class="font-semibold">
          {props.name}
        </div>
        <div class="text-gray-500 flex">
          <p class="uppercase">{props.ticker} </p>
          <p class="px-1"> | </p>
          <p>{props.quantity.toLocaleString()} shares</p>
        </div>
      </div>
      <div class="w-2/12">
        <div class="text-gray-900 flex justify-end">
          £{props.value.toLocaleString()}
        </div>
        <div class={"flex justify-end " + (props.percentIncrease >= 0 ? "text-green-400" : "text-red-400")}>
          {props.percentIncrease}%
        </div>
      </div>
    </div>
  )
}

function PositionCards(props) {

  const data = props.data ? props.data : []

  const cards = data.map(el =>
    <PositionCard
      name={el.name}
      quantity={el.quantity}
      value={el.current_value_gbp}
      ticker={el.ticker}
      percentIncrease={el.percent_change}
    />)

  return (
    <div>
      {cards}
    </div>
  )
}

export default function WrappedPositionCards(props) {
  return <ApiWrapper content={PositionCards} apiUrl="http://localhost:5000/api/portfolio/snapshot/now"/>
}