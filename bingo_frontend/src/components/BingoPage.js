import { Component } from 'react';
import Bingo from '../components/Bingo';
import Grids from '../components/Grids';
import CONFIG from '../config';
import "./BingoPage.css";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

class BingoPage extends Component {
  constructor(props){
    super(props);
    console.log("Constructor BingoPage");
    this.state = {
      bingo:{'B':false,'I':false,'N':false,'G':false,'O':false},
      current_turn:0,
      copied: false
    };
    this.setState = this.setState.bind(this);
    console.log("Constructor out BingoPage");
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
    // let data = await fetch(url);
    await fetch(url);
    // let parsedData = await data.json();
  }
  componentDidMount = async () => {
    console.log("token", this.props);
    if(!this.props.token) window.location = "/";
    if(this.props.token && this.props.my_turn===0){
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
    if(prevProp.token!==this.props.token && this.props.my_turn===0){
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

  copy_content = () => {
    console.log("copy content", this.props.token);
    navigator.clipboard.writeText(this.props.token);
    this.setState({copied:true});
    setTimeout(()=>this.setState({copied:false}),2000);
  }

  render(){
    return (
      <div className='home'>
        <div className='bingo_navbar'>
          <div className='navbar_content'>Token {this.props.token} <ContentCopyIcon className='copy_content' onClick={this.copy_content}/></div>
          {this.state.copied?
            <Stack sx={{ width: 'auto' }} spacing={2} m={2} style={{zIndex:1, position:'absolute'}}>
              <Alert severity="success">Token Copied</Alert>
            </Stack>
            :
            <></>
          }
          <div className='navbar_content'>Me {this.props.my_turn}</div>
          <div className='navbar_content'>Current {this.state.current_turn}</div>
        </div>
        <Bingo handleBingo = {this.state}/>
        <Grids click_enable = {this.props.click_enable} handleBingo = {this.setState} token={this.props.token} navigator={this.props.navigator} my_turn={this.props.my_turn} handleApp = {this.props.handleApp}/>
      </div>
    )
  }
}

export default BingoPage;
