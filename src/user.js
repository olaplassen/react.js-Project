import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';



export class UserMenu extends React.Component {
//props for å hente verdien fra brukeren som logget inn
constructor(props) {
super(props);

//setter this.id lik verdien som ble sendt fra login.
this.id = props.userId;
console.log(this.id);
}
  render() {
    return (
      <div className="menu">
       <ul className="ul">
       {/* sender id'en vidre til linkene */}
        <li className="li"><Link to ={'/userhome/' + this.id} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/mypage/' + this.id} className="link">Min side</Link></li>
        <li className="li"><Link to ={'/usersearch'} className="link">Søk</Link></li>
       </ul>
       </div>

    );
  }
 }
 export class UserHome extends React.Component {
    constructor(props) {
   super(props);

   this.user = {};
   //henter id fra usermenyen og matcher den med this.id
   this.id = props.match.params.userId;
   console.log(this.id)
   }

   render() {

     return (

       <div>

       <h1>Velkommen {this.user.firstName}</h1>
       </div>
     );
  
