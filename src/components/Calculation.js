import React, { Component } from 'react';


class Calculation extends Component {

    

  render() {
    return (
      <div className="Calculation">
        <p>The distance between {this.props.origin} and {this.props.destination} is: <strong>{this.props.distance} nautical miles.</strong></p>
      </div>
    );
  }
}

export default Calculation;
