import React from 'react';
import withApiWrapper from '../components/ApiWrapper';

function PositionCard(props) {
  return (
    <div className="h-24 py-4 px-6 flex hover:bg-gray-100 cursor-pointer group">
      <div className="w-2/12">
        <div
          className="flex justify-center text-5xl items-center h-full 
                     font-bold text-white bg-gray-300 h-16 w-16 group-hover:bg-indigo-300">
          {props.name ? props.name.substring(0, 1) : ""}
        </div>
      </div>
      <div className="w-8/12 px-4">
        <div className="font-semibold">
          {props.name}
        </div>
        <div className="text-gray-500 flex">
          <p className="uppercase">{props.ticker} </p>
          <p className="px-1"> | </p>
          <p>{props.quantity.toLocaleString()} shares</p>
        </div>
      </div>
      <div className="w-2/12">
        <div className="text-gray-900 flex justify-end">
          £{props.value.toLocaleString()}
        </div>
        <div className={"flex justify-end " + (props.percentIncrease >= 0 ? "text-green-400" : "text-red-400")}>
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
      key={el.ticker}
      name={el.name}
      quantity={el.quantity}
      value={el.current_value_gbp}
      ticker={el.ticker}
      percentIncrease={el.percent_change}
    />)

  return (
    <div className="grid grid-cols-1 divide-y">
      <h1 className="text-3xl font-bold p-4"> Open Positions</h1>
      {cards}
    </div>
  )
}

/*export default function WrappedPositionCards(props) {
  return <ApiWrapper content={PositionCards} apiUrl="http://localhost:5000/api/portfolio/snapshot/now"/>
}*/

export default withApiWrapper(PositionCards, "http://localhost:5000/api/portfolio/snapshot/now")