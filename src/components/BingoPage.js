import { Component } from 'react';
import Bingo from '../components/Bingo';
import Grids from '../components/Grids';
import CONFIG from '../config';

class BingoPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      bingo:{'B':false,'I':false,'N':false,'G':false,'O':false}
    };
    this.setState = this.setState.bind(this);
    // this.sse = this.sse.bind(this)
    // this.sse.onmessage = e => {
    //   console.log(e);
    // }
  }
  // cors_header = () => {
  //   let headers = new Headers();

  //   headers.append('Content-Type', 'application/json');
  //   headers.append('Accept', 'application/json');
  
  //   headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   headers.append('Access-Control-Allow-Credentials', 'true');
  //   headers.append('GET', 'POST', 'OPTIONS');
  //   return headers
  // }
  set_token = async () => {
    let url = `${CONFIG}/set_token?token=${this.props.token}`;
    console.log(url);
    let data = await fetch(url);
    let parsedData = await data.json();
  }
  componentDidMount = async () => {
    console.log("token", this.props);
    if(this.props.token){
      await this.set_token()
    }
    // this.sse.addEventListener("flightStateUpdate",e => {
    //   console.log(e);
    // });
  }
  componentDidUpdate = async (prevProp) => {
    console.log("component did update");
    console.log(prevProp);
    console.log(this.props);
    if(prevProp.token!==this.props.token){
      await this.set_token()
    }
    // this.sse.onmessage = e => {
    //   console.log(e);
    // }
    // let sse = new EventSource(`${CONFIG}/stream`);
    // sse.onmessage = e => {
    //   console.log("message");
    //   console.log(e);
    // }
    // sse.onerror = e => {
    //   console.log("error occured",e);
    //   sse.close()
    // }

  }
  render(){

    return (
      <div>
        <h1>{this.props.token}</h1>
        <Bingo handleBingo = {this.state}/>
        <Grids handleBingo = {this.setState} token={this.props.token}/>
      </div>
    )
  }
}

export default BingoPage;
