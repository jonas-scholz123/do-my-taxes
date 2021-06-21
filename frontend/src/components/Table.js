import React from 'react';

class Table extends React.Component {
  render() {

    const headerElements = this.props.headers.map(
      (element) => <TableHeaderElement text={element}/>
    )

    let rows = this.props.content.map(
      (rowContent) => <TableRow elements={rowContent} />
    )
    
    if (this.props.nrRows) {
      rows = rows.slice(0, this.props.nrRows)
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
}

function TableRow(props) {
  const elements = props.elements.map((element) => 
    {return <TableRowElement text={element}/>}
  )
  return (
    <tr> {elements} </tr>
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
  return (
      <td class="px-3 py-4 whitespace-nowrap">{props.text}</td>
  )
}

export default Table;