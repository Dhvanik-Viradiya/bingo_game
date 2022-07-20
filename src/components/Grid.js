import React, { Component } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue, update} from "firebase/database";
import './Grid.css';
import { FirebaseConfig } from '../config';

export default class Grid extends Component {

  constructor(props){
    super(props);
    // Initialize Firebase
    this.app = initializeApp(FirebaseConfig);
    this.database = getDatabase(this.app);
  }

  // componentDidMount = () => {
  //   const db = getDatabase(this.app);
  //   // set(ref(db, 'users'), {
  //   //   username: "username",
  //   //   email: "email",
  //   //   profile_picture : "imageUrl"
  //   // });

  //   const starCountRef = await ref(db, this.props.token);
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     console.log(data);
  //     let grid_values = {};
  //     for(let i=1;i<=25;i++){
  //       grid_values[i]=data[i];
  //     }
  //     console.log(grid_values);
  //     this.setState(() => {return {grid_values:grid_values}});
  //     // updateStarCount(postElement, data);
  //   });
  // }

  clickButton = (event) => {
    let temp_grid_values = this.props.states.grid_values;
    let value = this.props.value;

    if(temp_grid_values[value][1]) return;
    temp_grid_values[value][1] = true;

    let grid_values = {}
    this.props.handleGridState(()=>{return{grid_values:temp_grid_values}});
    
    for(let i=1;i<=25;i++)grid_values[i]=temp_grid_values[i][1];
    const db = getDatabase(this.app);
    let changing_data = {};
    changing_data[temp_grid_values[value][0]]=true;
    update(ref(db, `${this.props.token}`), changing_data);
    
    console.log(event.target.firstChild.data);
    
    let bingo = ['B','I','N','G','O'];
    let bingo_dict = {'B':false,'I':false,'N':false,'G':false,'O':false}
    let bingoCount = 0;
    
    for(let i=0;i<5;i++){
      let check = 0;
      for(let j=0;j<5;j++){
        if(temp_grid_values[j*5+i+1][1])check++;
      }
      if(check===5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }

    for(let i=0;i<5;i++){
      let check = 0;
      for(let j=0;j<5;j++){
        if(temp_grid_values[j+i*5+1][1])check++;
      }
      if(check===5){
        if(bingoCount<5){
          bingo_dict[bingo[bingoCount]]=true;
          bingoCount++;
        }
      }
    }

    let count = -5;
    let check = 0;
    for(let i=0;i<5;i++){
      count+=6;
      if(temp_grid_values[count][1])check++;
    }
    if(check===5){
      if(bingoCount<5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }

    count = 1;
    check = 0;
    for(let i=0;i<5;i++){
      count+=4;
      if(temp_grid_values[count][1])check++;
    }
    if(check===5){
      if(bingoCount<5){
        bingo_dict[bingo[bingoCount]]=true;
        bingoCount++;
      }
    }

    this.props.handleBingo(() =>{return {bingo:bingo_dict}});

    
    
  }

  render() {
    return (
        <div className='grid-div' style={{backgroundColor:this.props.states.grid_values[this.props.value][1]?"red":""}} key={this.props.value} onClick={this.clickButton}>{this.props.states.grid_values[this.props.value][0]}</div>        
    )
  }
  // }
  
  // componentDidMount(){
  //   console.log(this.gridItems)
  // }
  // clickHandler(event){
  //   console.log(event.target.data)
  // }

  // render(){
  //   let gridItems=[1,2,3,4,5].map(i =>{ 
  //     let row=([1,2,3,4,5]).map(j=>
  //       <div key={i+","+j} value={i+","+j} onClick={this.clickHandler} style={{border:'solid 1px black',display: 'inline-block', backgroundColor:'green', height:'2rem' ,width:'2rem'}}>{i},{j}</div>
  //     );
  //     return <div>{row}<br/></div>}
  //   );
  //   // return <div>{gridItems}</div>
  //   const temp=<h1>Hi</h1>
  //   return <div>{gridItems}</div>
  // }
}
