import React from 'react';
import {Link} from "react-router-dom";

class Header extends React.Component {
  render() {

    const activePage = this.props.active;
    const inactiveClass = `p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200
                            hover:text-gray-700 transition-colors duration-300`

    const activeClass = `p-2 lg:px-4 md:mx-2 text-gray-600 rounded border-2 border-indigo-700 hover:bg-gray-200 `

    const pages = ["Portfolio", "Transactions"];

    const pageButtons = pages.map(
      //page => <a href="#" class= {page === active_page ? active_class : inactive_class}> {page} </a>
      page => <Link to={"/" + page.toLowerCase()} class={page === activePage ? activeClass : inactiveClass}> {page} </Link>
    );


    return (
      <nav class="flex h-20 w-full bg-white items-center shadow">
        <div class="container w-11/12 px-4 mx-auto md:flex md:items-center">
            <p class="text-5xl text-indigo-700 font-bold tracking-tighter">Taxify</p>
          <div class="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0" id="navbar-collapse">
            {pageButtons}
          </div>
        </div>
      </nav>
    )
  }
}

export default Header;