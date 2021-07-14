import React from 'react';

const BaseButton = (props) => {

  var customClasses = "border py-3 px-4 ";

  let { active, classes, activeClasses, handleClick, ...rest } = props

  if (classes) {
    customClasses += classes;
  }

  if (active && activeClasses) {
    customClasses += activeClasses;
  }

  return(
    <button
      className={customClasses}
      onClick={handleClick ? handleClick : () => {}}
      {...rest}
    >
      {props.text}
    </button>
  )
}

export default BaseButton;