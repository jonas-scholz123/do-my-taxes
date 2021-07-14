import React from 'react';

export default function HighlightedTitle(props) {

    const extraClasses = props.classes ? props.classes : ""
    const classes = "text-3xl rounded-lg text-black font-bold px-2 py-1 " + extraClasses
  
    return (
      <div className="p-5">
        <p className={classes}>
          {props.text}
        </p>
      </div>
    )
  }