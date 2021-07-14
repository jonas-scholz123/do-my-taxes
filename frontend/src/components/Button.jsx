import React from 'react';

function Button (props) {
    if (props.main) {
      return (
          <button
            className="bg-indigo-700 border border-indigo-500 hover:bg-indigo-500 text-white py-2 px-4 rounded-md"
            onClick={props.handleClick !== null ? () => props.handleClick() : () => {}}
            {...props}
          >
            {props.text}
            
          </button>
      );
    }

    return (
        <button
          className="bg-gray-300 border border-gray-700 text-gray-700 py-2 px-4 rounded-md"
          onClick={() => props.handleClick()}>{props.text}</button>
    );
  }

export default Button;