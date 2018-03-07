import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';



export class UserMenu extends React.Component {
constructor(props) {
super(props);


this.id = props.userId;
console.log(this.id);
}
  render() {
    return (
      <div className="menu">
       <ul className="ul">
        <li className="li"><Link to ={'/userhome/' + this.id} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/mypage/' + this.id} className="link">Min side</Link></li>
       </ul>
       </div>

    );
  }
 }
 export class UserHome extends React.Component {
    constructor(props) {
   super(props);

   this.user = {};
   this.id = props.match.params.userId;
   console.log(this.id)
   }

   render() {

     return (

       <div>

       <h1>Velkommen {this.user.firstName}</h1>
       </div>
     );
   }
   componentDidMount() {
     userService.getUsers(this.id, (result) => {
       console.log(result);
       this.user = result;
       console.log(this.user);
       this.forceUpdate();
     }
   );
   }
 }

export class MyPage extends React.Component {
   constructor(props) {
  super(props);

  this.user = {};
  this.id = props.match.params.userId;
  console.log(this.id)
  }

  render() {

    return (

      <div>

      <h1>Test</h1>
      </div>
    );
  }
}
