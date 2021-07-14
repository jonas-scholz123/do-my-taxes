import React from 'react';

function Button (props) {

  const {main, text, handleClick, ...rest} = props

  if (main) {
    return (
      <button
        className="bg-indigo-700 border border-indigo-500 hover:bg-indigo-500 text-white py-2 px-4 rounded-md"
        onClick={handleClick !== null ? () => handleClick() : () => { }}
        {...rest}
      >
        {text}

      </button>
    );
  }

  return (
    <button
      className="bg-gray-300 border border-gray-700 text-gray-700 py-2 px-4 rounded-md"
      onClick={() => handleClick()}>{props.text}</button>
  );
}

export default Button;