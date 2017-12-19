import React, { Component } from 'react';
import Hosts from './Hosts';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={ logo } className="App-logo" alt="logo" />
            <h1 className="App-title">Live from New York!</h1>
          </header>
          <div className="content-holder">
            <Hosts />
          </div>
        </div>
    );
  }
}

export default App;
