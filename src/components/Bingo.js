import React, { Component } from 'react'
import './Bingo.css';


export default class Bingo extends Component {
  constructor(props){
    super(props);
    console.log("constructor");
  }
  render() {
    // console.log(this.props.handleBingo.bingo);
    let bingo_div = [];
    ['B','I','N','G','O'].map((ele) => {
      bingo_div.push(
        <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.bingo[ele]?"red":""}} key={ele}>{ele}</div>
      );
      return bingo_div;
    });
    return (
      <div className='bingo-container'>
        {bingo_div}
        {/* <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.B?"red":""}} key={"B"}>B</div>
        <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.I?"red":""}} key={"I"}>I</div>
        <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.N?"red":""}} key={"N"}>N</div>
        <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.G?"red":""}} key={"G"}>G</div>
        <div className='bingo-div' style={{backgroundColor:this.props.handleBingo.O?"red":""}} key={"O"}>O</div> */}
      </div>
    )
  }
}
