import React, { Component } from 'react';
import Autocomplete from './Autocomplete';
import Calculation from './Calculation';
import GMap from './Map';
import { Col, Row, ControlLabel, FormGroup, FormControl, Button } from 'react-bootstrap';


class Input extends Component {

  constructor() {
    super();


    this.state= {
      urlData: {},
      inputHandler: {},
      selectedAirport: {},
      locations: {},
      showResults: {},
      singleAirportData: {},
      output: null,
      showCalculation: false,
      showMarkers: false
    };
  }


  //This ensures that the input field values change when you type.
  handleChange(propertyName, event) {
    const inputHandler = this.state.inputHandler;
    inputHandler[propertyName] = event.target.value;
    this.setState({
      inputHandler: inputHandler
    });
  }

  //The autocomplete function is triggered by a KeyUp event on the 'Origin' field. This 
  //function utilizes the Fetch API to call the Air-Port-Codes.com API and its
  //Autocomplete function. Additionally, the data will only get airports
  //located in the United States.
  handleKeyUpOrigin(form) {

    const urlData = this.state.urlData;
    const showResults = this.state.showResults;

    showResults.origin = true;

    let url = 'https://www.air-port-codes.com/api/v1/autocomplete?type=a&term=' + this.state.inputHandler.origin;
    let myHeaders = new Headers({
      'APC-Auth': '773ce2750d'
    });


    let req = new Request(url, {
      headers: myHeaders
    });
    
    fetch(req)
    .then(data => data.json())
    .then(data => {
      data.airports ? data.airports = data.airports.filter(airport => airport.country.name === "United States") : null;
      urlData.origin = data;
      this.setState({
        urlData: urlData,
        showResults: showResults
      });
    });
  }
  
  //Performs the same function as above for the 'Destination' input field.
  handleKeyUpDestination() {

    const urlData = this.state.urlData;
    const showResults = this.state.showResults;

    showResults.destination = true;

    let url = 'https://www.air-port-codes.com/api/v1/autocomplete?type=a&term=' + this.state.inputHandler.destination;
    let myHeaders = new Headers({
      'APC-Auth': '773ce2750d'
    });

    let req = new Request(url, {
      headers: myHeaders
    });
    
    fetch(req)
    .then(data => data.json())
    .then(data => {
      data.airports ? data.airports = data.airports.filter(airport => airport.country.name === "United States") : null;
      urlData.destination = data;
      this.setState({
        urlData: urlData,
        showResults: showResults
      });
    });

  }

  //The user selection from the autocomplete list is recorded
  //and the choice is reflected in the input field, displaying
  //the corresponding IATA code. 
  handleAirportSelect(form, selectAirport) {
    const selectedAirport = this.state.selectedAirport;
    const inputHandler = this.state.inputHandler;
    const showResults = this.state.showResults;
    showResults[form] = false;
    
    selectedAirport[form] = selectAirport;

    let inputSelectedAirport = this.state.selectedAirport[form].iata;
    inputHandler[form] = inputSelectedAirport;
    this.setState({
        selectedAirport: selectedAirport,
        inputHandler: inputHandler,
        showResults: showResults
    });

    this.getAirportCoordinates(form);
  }

  //The autocomplete function through the API does not
  //include lat/lon data. Another fetch request ( to a different
  //URL must be performed to get each destination's coordinates.
  getAirportCoordinates(form) {
    const singleAirportData = this.state.singleAirportData;
    const locations = this.state.locations;


    // const longitude = this.state.locations[form].longitude;
    // const latitude = this.state.locations[form].latitude;

    // locations[form].longitude = this.state.singleAirportData[form].airport.longitude;
    // locations[form].latitude = this.state.singleAirportData[form].airport.latitude;

    let url = 'https://www.air-port-codes.com/api/v1/single?iata=' + this.state.selectedAirport[form].iata;
    let myHeaders = new Headers({
      'APC-Auth': '773ce2750d'
    });


    let req = new Request(url, {
      headers: myHeaders
    });
    
    fetch(req)
    .then(data => data.json())
    .then(data => {
      singleAirportData[form] = data;
      locations[form] = {
        longitude: this.state.singleAirportData[form].airport.longitude,
        latitude: this.state.singleAirportData[form].airport.latitude
      };
      this.setState({
        singleAirportData: singleAirportData,
        locations: locations
      });
    });
  }

  //Checks to see if both fields are filled, then runs the calculateDistance() function.
  handleSubmit() {

    if ((!this.state.selectedAirport.origin) || (!this.state.selectedAirport.destination)) { 
      alert('Please fill out both fields.');
    } else {
      this.calculateDistance();
    }
    this.setState({
      showMarkers: true
    });
  }

  //Resets states to default after the Reset button is pressed.
  handleReset() {


    this.setState({
      urlData: {},
      inputHandler: {},
      selectedAirport: {},
      locations: {},
      showResults: {},
      singleAirportData: {},
      output: null,
      showCalculation: false,
      showMarkers: false
    });
  }

  //Utilizes a formula for calculating distance in nautical miles
  //from https://www.geodatasource.com/developers/javascript.
  calculateDistance() {
    let originLon = this.state.locations.origin.longitude;
    let originLat = this.state.locations.origin.latitude;
    let destinationLon = this.state.locations.destination.longitude;
    let destinationLat = this.state.locations.destination.latitude;
    let output;

    let radlat1 = Math.PI * originLat/180;
    let radlat2 = Math.PI * destinationLat/180;
    let theta = originLon-destinationLon;
    let radtheta = Math.PI * theta/180;
    output = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    output = Math.acos(output);
    output = output * 180/Math.PI;

    //Multiply by 0.8684 for Nautical Miles
    output = Math.round(output * 60 * 1.1515 * 0.8684);


    this.setState({
      output: output,
      showCalculation: true
    });
  }



  render() {

    return (
      <div className="Input">
      <div className="input-fields">
      <Row className="input-row">
      <Col md={6} lg={6} >
        <FormGroup className="airport-input" >

          
          <div>
            <ControlLabel>From</ControlLabel><br />

           <FormControl 
              type="text" 
              ref="origin" 
              value={this.state.inputHandler.origin}
              onChange={this.handleChange.bind(this, 'origin')} 
              onKeyUp={this.handleKeyUpOrigin.bind(this)} 
            />
            {this.state.showResults.origin ? 
              <Autocomplete 
                airportList= {
                  this.state && this.state.urlData.origin ?
                      this.state.urlData.origin.airports : null
                }
                airportSelect={this.handleAirportSelect.bind(this, 'origin')}
              /> : null}
          </div>
          </FormGroup>
          </Col>

        <Col md={6} lg={6}  >
          <FormGroup className="airport-input" >
           <div>
            <ControlLabel>To</ControlLabel><br />

            <FormControl 
                type="text" 
                ref="destination" 
                value={this.state.inputHandler.destination} 
                onChange={this.handleChange.bind(this, 'destination')} 
                onKeyUp={this.handleKeyUpDestination.bind(this)} 
            />
            {this.state.showResults.destination ? 
              <Autocomplete 
                airportList={
                  this.state && this.state.urlData.destination ?
                      this.state.urlData.destination.airports : null
                }
                airportSelect={this.handleAirportSelect.bind(this, 'destination')}
                
              /> : null}
          </div>
          </FormGroup>
          </Col>
        </Row>
        <Row className="button-row">
        <Col md={6}>
          <div className="button-container">
          <Button type="submit" value="Submit" onClick={
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleSubmit();
            }
          }>
          Submit
          </Button>
          </div>
        </Col>

         <Col md={6}>
          <div className="button-container">
          <Button type="reset" value="Reset" onClick={
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleReset();
            }
          }>
          Reset
          </Button>
           </div>
          </Col>
        </Row>
        </div>

        

        {this.state.showCalculation ? 
          <Calculation 
            distance={
              this.state.output
            } 
            
            origin={
              this.state && this.state.singleAirportData.origin ?
              this.state.singleAirportData.origin.airport.name : null
            }
            destination={
              this.state && this.state.singleAirportData.destination ?
              this.state.singleAirportData.destination.airport.name : null
            }
          /> : null}

        <GMap 
            setMarker={this.state.showMarkers}
            originLoc={
              {
                lat: this.state && this.state.locations.origin ? this.state.locations.origin.latitude : null,
                lon: this.state && this.state.locations.origin ? this.state.locations.origin.longitude : null
              } 
            }
            destinationLoc={
              {
                lat: this.state && this.state.locations.destination ? this.state.locations.destination.latitude : null,
                lon: this.state && this.state.locations.destination ? this.state.locations.destination.longitude : null
              }
            }

        />
      </div>
    );
  }
}

export default Input;
