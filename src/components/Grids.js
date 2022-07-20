import React, { Component } from 'react'
// import firebase from '../firebase';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, onValue} from "firebase/database";
import Grid from './Grid';
import { FirebaseConfig } from '../config';




export default class Grids extends Component {
  constructor(props){
    super(props);
    // Initialize Firebase
    this.app = initializeApp(FirebaseConfig);
    this.database = getDatabase(this.app);

    let grid_values = {};
    let grid_array = [];
    for(let i=1;i<=25;i++)grid_array.push(i);
    grid_array = this.shuffleArray(grid_array);
    console.log(grid_array);
    for(let i=1; i<=25; i++){
      grid_values[i] = [grid_array[i-1],false];
    }
    this.state={grid_values:grid_values}
    this.setState = this.setState.bind(this);

    console.log("constructor",this.props);
  }
  componentDidMount = () => {
    console.log("did mount");
    console.log(this.props);
    if(this.props.token){
      const db = getDatabase(this.app);
      // set(ref(db, 'users'), {
      //   username: "username",
      //   email: "email",
      //   profile_picture : "imageUrl"
      // });
      const starCountRef = ref(db, this.props.token);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        let grid_values = this.state.grid_values;
        console.log(this.state.grid_values);
        for(let i=1;i<=25;i++){
          grid_values[i][1]=data[grid_values[i][0]];
        }
        console.log(grid_values);
        this.setState(() => {return {grid_values:grid_values}});
        // updateStarCount(postElement, data);
      });
      // let data = this.database.ref('VgXvdpX');
      // this.database.ref("VgXvdpX");
      // console.log("data",this.database);
      // firebase.database().ref(`VgXvdpX/`).on('value', function (snapshot) {
      //   console.log(snapshot.val());
      // });
    }

  }
  // componentDidUpdate = (prevProp) => {
  //   console.log("prev",prevProp.token);
  //   console.log("real",this.props.token);

  //   if(this.props.token!==prevProp.token){
  //   // if(this.props.token){
  //     const db = getDatabase(this.app);
  //     // set(ref(db, 'users'), {
  //     //   username: "username",
  //     //   email: "email",
  //     //   profile_picture : "imageUrl"
  //     // });
  //       const starCountRef = ref(db, this.props.token);
  //       onValue(starCountRef, (snapshot) => {
  //         const data = snapshot.val();
  //         console.log(data);
  //         let grid_values = this.state.grid_values;
  //         console.log(this.state.grid_values);
  //         for(let i=1;i<=25;i++){
  //           grid_values[i][1]=data[grid_values[i][0]];
  //         }
  //         console.log(grid_values);
  //         this.setState(() => {return {grid_values:grid_values}});
  //         // updateStarCount(postElement, data);
  //       });
  //     // let data = this.database.ref('VgXvdpX');
  //     // this.database.ref("VgXvdpX");
  //     // console.log("data",this.database);
  //     // firebase.database().ref(`VgXvdpX/`).on('value', function (snapshot) {
  //     //   console.log(snapshot.val());
  //     // });
  //   }
  // }
  
  // Function to shuffle the array content
  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  render() {
    let grid = []; 
    for (let i = 1; i <= 25; i++) {
      grid.push(<Grid key={i} value={i} token={this.props.token} states = {this.state} handleGridState = {this.setState}  handleBingo = {this.props.handleBingo}/>)  
    }
    return (
        <div className='grid-container'>
            {grid.map((grid_component) => grid_component)}
      </div>
    )
  }
}
