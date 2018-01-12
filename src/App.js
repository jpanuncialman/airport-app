import React, { Component } from 'react';
import Input from './components/Input';
import './App.css';


      

class App extends Component {

  constructor(){
    super();
    this.state = {};

  }



  render() {
    return (

      <div id="App">
       
        <header className="App-header">
          <h1 className="App-title">Airport App</h1>
        </header>
        
        <div className="App-body">
        <p className="App-intro">
          Calculate the distance between two airports using this app.
        </p>
        <Input />

        </div>
        
      </div>
    );
  }
}

export default App;
