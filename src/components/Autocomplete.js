import React, { Component } from 'react';



class Autocomplete extends Component {
  constructor() {
    super();
    

    this.state = {
      selectedItem: '',
      selectedAirport: ''
    };

  }

  componentWillReceiveProps(data) {
      this.setState({
        data
      })
  }


  airportClick(airport) {
    this.props.airportSelect(this.state.selectedAirport);
    this.setState({
        selectedAirport: airport
    });
  }    

    

  render() {
    if (!this.props.airportList) return null;
    return (
      <div className="Autocomplete">
        <ul>
          {
            this.props.airportList.map((airport) => 
                <li onClick={this.props.airportSelect.bind(this, airport)}>{airport.city}, {airport.country.name} - {airport.name} ({airport.iata})</li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default Autocomplete;
