import React from 'react';

function Table (props) {
  if (!props.content[0]) {
    return (
      <div>
      </div>
    )
  }

  const headerElements = Object.keys(props.content[0])
    .map(el => <TableHeaderElement text={el.replaceAll("_", " ")} key={el}/>)

  let rows = props.content.map(
    (record) =>
      <TableRow
        record={record}
        id={record[props.keyHeader]}
        key={record[props.keyHeader].toString()}
        onClick={props.onClick ? (id) => props.onClick(id) : undefined}
        {...props}
      />
  )

  if (props.nrRows) {
    rows = rows.slice(0, props.nrRows)
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {headerElements}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow(props) {
  const elements = Object.entries(props.record).map(item =>
    <TableRowElement text={item[1]} key={item[0]}/>
  )

  const classes = props.clickable ? "hover:bg-gray-100 cursor-pointer" : ""
  return (
    <tr className={classes} key={props.id} onClick={props.clickable ? () => props.onClick(props.id) : undefined}>{elements}</tr>
  )
}

function TableHeaderElement(props) {
  return (
    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {props.text}
    </th>
  )
}

function TableRowElement(props) {
  var formattedText = props.text

  const filters = [
    {
      condition: (text) => !isNaN(text),
      change: (text) => text.toLocaleString()
    }
  ]

  filters.forEach(filter => {
    if (filter.condition(props.text)) {
      formattedText = filter.change(formattedText)
    }
  })

  return (
      <td className="px-3 py-4 whitespace-nowrap">{formattedText}</td>
  )
}

export default Table;