import React, { Component } from 'react'
import './App.css';
import Home from './components/Home';
import BingoPage from './components/BingoPage';
import CONFIG from './config';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

class App extends Component{
  constructor(props){
    super(props)
    console.log("in constructor");
    this.state = {
      token:"",
      my_turn:"",
      navigator:"",
      click_enable:false
    }
    this.setState = this.setState.bind(this);
    console.log("out constructor");
  }
  // componentDidMount = async () => {
  //   console.log("in did mount");

  //   console.log(`${CONFIG}/generate_token`);
  //   let data = await fetch(`${CONFIG}/generate_token`);
  //   console.log("fetched");
  //   let parsedData = await data.json()
  //   console.log("from component did mount",parsedData.token);
  //   this.setState(()=>{return {token:parsedData.token}}); 
  //   console.log("out did mount");

  // }
  render(){
    console.log("in render");
    
    return (
      <div>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home generateTokenState={this.setState}/>} />
            <Route path="/BingoPage" element={<BingoPage  click_enable = {this.state.click_enable} my_turn = {this.state.my_turn} token={this.state.token} navigator={this.state.navigator} handleApp = {this.setState}/>} />
          </Routes>
          {/* <Navigate to="/" /> */}
        </Router>
      </div>
    );
  }
}

export default App;
