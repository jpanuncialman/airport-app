import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";


//React-google-maps requires an HOC to render GOogle Map.
//Markers for the origin and destination, as well as a line
//connecting the two points are included. These do not appear
//until both data sets are collected and the Submit button
//is clicked.
const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={4}
    defaultCenter={{ lat: 38.420376, lng: -99.807588 }}

  >	
  {props.setMarker && <Marker position={{ lat: props.originLat, lng: props.originLon }} /> }
  {props.setMarker && <Marker position={{ lat: props.destinationLat, lng: props.destinationLon }} /> }

  {props.setMarker && <Polyline path={[{ lat: props.originLat, lng: props.originLon }, { lat: props.destinationLat, lng: props.destinationLon }]} />}

  </GoogleMap>
));




class GMap extends Component {

  constructor(props){
    super(props);

    this.state = {
    	originLat: this.props.originLoc.lat,
    	originLon: this.props.originLoc.lon,
    	destinationLat: this.props.destinationLoc.lat,
    	destinationLon: this.props.destinationLoc.lon
    };

  }

  //Ensures state transition can occur with the prop change from Input component.
  componentWillReceiveProps(nextProps) {
    this.setState({
      originLat: nextProps.originLoc.lat,
      originLon: nextProps.originLoc.lon,
      destinationLat: nextProps.destinationLoc.lat,
      destinationLon: nextProps.destinationLoc.lon
    });
  }


  render() {
    return (

      <div className="Map">
        <MyMapComponent

          originLat={parseFloat(this.state.originLat)}
          originLon={parseFloat(this.state.originLon)}
          destinationLat={parseFloat(this.state.destinationLat)}
          destinationLon={parseFloat(this.state.destinationLon)}

		  setMarker={this.props.setMarker}

		  //Required props
		  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
		  loadingElement={<div style={{ height: `100%` }} />}
		  containerElement={<div style={{ height: `400px` }} />}
		  mapElement={<div style={{ height: `100%` }} />}
		/>
		
      </div>
    );
  }
}

export default GMap;