import React from 'react';

class Button extends React.Component {

  render() {
    var classes = "border py-2 px-4 ";

    if (this.props.classes) {
      classes += this.props.classes;
    }
    
    if (this.props.active && this.props.activeClasses) {
      classes += this.props.activeClasses;
    }

      return (
          <button
            class={classes}
            onClick={() => this.props.handleClick()}>{this.props.text}</button>
      );
    }
  }

export default Button;