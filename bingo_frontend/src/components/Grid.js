import React, { Component } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue, update, get} from "firebase/database";
import './Grid.css';
import { FirebaseConfig } from '../config';
import CONFIG from '../config';

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

  // clickButtons = async (event) => {
  //   const db = getDatabase(this.app);
  //   let turn = await get(ref(db,`${this.props.token}/turn`));
  //   console.log(turn);
  //   console.log(this.props.my_turn);
  //   if(turn===this.props.my_turn){
  //     let temp_grid_values = this.props.states.grid_values;
  //     let value = this.props.value;
  //     console.log("inside");
  //     console.log(temp_grid_values[value]);
  //     await fetch(`${CONFIG}/button_clicked?button_number=${temp_grid_values[value][0]}&token=${this.props.token}`)
  //       .then(async response => {
  //         console.log(response);
  //         let turn = await get(ref(db,`${this.props.token}/turn`));
  //         console.log("turn",turn);
  //         console.log(turn);
  //         // this.props.handleApp({my_turn:turn});
  //       })
  //       .catch(error => {console.log("Button click contains error");});
  //   }
  //   else{
  //     console.log("Not my turn");
  //   }
  //   // data.forEach(element => {
  //   //   console.log(element)
  //   // });
  //   // console.log(data.value_);
  //   // get(ref(db,`${this.props.token}`), function(snapshot) {
  //   //   console.log(snapshot.val());
  //   // }, function (error) {
  //   //   console.log("Error: " + error.code);
  //   // });
  // }

  game_win = async () => {
    await fetch(`${CONFIG}/game_win?token=${this.props.token}&player=${this.props.my_turn}`)
      .then(async response => {
        console.log(response);
        console.log("You win");
        // this.props.handleGridState({modal_open:true});

        // let turn = await get(ref(db,`${this.props.token}/turn`));
        // console.log("turn",turn);
        // console.log(turn.val());
        // this.props.handleApp({my_turn:turn.val()});
        
      })
      .catch(error => {console.log("Win response error");});
  }

  clickButton = async (event) => {
    if(!this.props.click_enable)return;
    this.props.handleGridState(()=>{return {click_enable:false}});
    const db = getDatabase(this.app);
    let whole_data = await get(ref(db,`${this.props.token}`));
    whole_data = whole_data.val();
    let num_player = whole_data["player"];
    let turn = whole_data["turn"];



    // console.log(whole_data.key());

    // let num_player = await get(ref(db,`${this.props.token}/player`));
    // console.log("player");
    // console.log(num_player);
    // console.log(num_player.val());
    // console.log(num_player.val().length);
    // return;
    if(num_player.length<=1) return;
    // let turn = await get(ref(db,`${this.props.token}/turn`));
    console.log("after await");
    console.log(turn);
    console.log(this.props.my_turn);
    if(turn!==this.props.my_turn){
      console.log("Not your turn");
      return;
    }
    
    let temp_grid_values = this.props.states.grid_values;
    let value = this.props.value;

    if(temp_grid_values[value][1]){
      this.props.handleGridState(()=>{return {click_enable:true}});
      return;
    }

    temp_grid_values[value][1] = true;

    // let grid_values = {}
    // // this.props.handleGridState(()=>{return{grid_values:temp_grid_values}});
    
    // for(let i=1;i<=25;i++)grid_values[i]=temp_grid_values[i][1];
    // // const db = getDatabase(this.app);
    // // let changing_data = {};
    // // changing_data[temp_grid_values[value][0]]=true;
    // // update(ref(db, `${this.props.token}`), changing_data);
    
    await fetch(`${CONFIG}/button_clicked?button_number=${temp_grid_values[value][0]}&token=${this.props.token}`)
    .then(async response => {
      console.log(response);
      let res = await response.json();
      this.props.handleBingo({current_turn:res.next_turn});
      console.log("responsing", res);
      console.log("responsing", res.next_turn);
      // let turn = await get(ref(db,`${this.props.token}/turn`));
      // console.log("turn",turn);
      // console.log(turn);
      // this.props.handleApp({my_turn:turn});
      
    })
    .catch(error => {console.log("Button click contains error");});
    
    console.log(event.target.firstChild.data);
    
    this.props.checkBingo(temp_grid_values);
    // const db = getDatabase(this.app);
    // let turn = await get(ref(db,`${this.props.token}/turn`));
    // console.log(turn);
    // console.log(this.props.my_turn);
    // if(turn===this.props.my_turn){
    // let temp_grid_values = this.props.states.grid_values;
    // let value = this.props.value;
    console.log("inside");
    console.log(temp_grid_values[value]);
    // }
    // else{
    //   console.log("Not my turn");
    // }
    // this.props.handleGridState({modal_open:true})
    this.props.handleGridState(() => {return {grid_values:temp_grid_values, click_enable:false}});
    
  }

  render() {
    return (
        <div className='grid-div' style={this.props.states.grid_values[this.props.value][1]?{backgroundColor:"#0baff7", boxShadow: "2px 2px 2px 0px #0b97d5"}:{}} key={this.props.value} onClick={this.clickButton}>{this.props.states.grid_values[this.props.value][0]}</div>        
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
