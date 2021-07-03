import React from 'react';

const BaseButton = (props) => {
  var classes = "border py-3 px-4 ";

  if (props.classes) {
    classes += props.classes;
  }

  if (props.active && props.activeClasses) {
    classes += props.activeClasses;
  }

  let handleClick = () => {};
  if (props.handleClick) {
    handleClick = () => props.handleClick()
  }

  return(
    <button
      class={classes}
      onClick={handleClick}
      {...props}
    >
      {props.text}
    </button>
  )
}

export default BaseButton;