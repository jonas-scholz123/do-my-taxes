import React from 'react';

function Table (props) {
  if (!props.content[0]) {
    return (
      <div>
      </div>
    )
  }

  const headerElements = Object.keys(props.content[0])
    .map(el => <TableHeaderElement text={el.replaceAll("_", " ")} />)

  let rows = props.content.map(
    (record) =>
      <TableRow
        elements={Object.values(record)}
        id={record[props.keyHeader]}
        onClick={props.onClick ? (id) => props.onClick(id) : undefined}
        {...props}
      />
  )

  if (props.nrRows) {
    rows = rows.slice(0, props.nrRows)
  }

  return (
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  {headerElements}
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
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
  const elements = props.elements.map((element) => 
    <TableRowElement text={element}/>
  )

  const classes = props.clickable ? "hover:bg-gray-100 cursor-pointer" : ""
  return (
    <tr class={classes} key={props.id} onClick={props.clickable ? () => props.onClick(props.id) : undefined}> {elements} </tr>
  )
}

function TableHeaderElement(props) {
  return (
    <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
      <td class="px-3 py-4 whitespace-nowrap">{formattedText}</td>
  )
}

export default Table;