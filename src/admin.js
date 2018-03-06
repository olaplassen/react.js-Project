import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInAdmin } from './app';


export class AdminMenu extends React.Component {
  render() {
    return (
      <div className="menu">
       <ul className="ul">
        <li className="li"><Link to ={'/confirmUsers'} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/søk'} className="link">Min side</Link></li>
        <li className="li"><Link to ={'/confirmusers'} className="link">Godkjenning</Link></li>
       </ul>
       </div>
    );
  }
 }

export class ConfirmUsers extends React.Component {
  constructor() {
    super();
    this.allUnConformed = [];
  }
  render() {
    let unConfirmedList = [];
    for(let unConfirmed of this.allUnConformed ) {
      unConfirmedList.push(<li key={unConfirmed.id}>{unConfirmed.firstName}<button onClick={() => this.confirmUser(unConfirmed.id)}>Godkjenn</button></li>)
    }
    return (
      <div className="menu">
      Ikke godkjent:
      <ul>{unConfirmedList}</ul>
      </div>
    );
  }
  componentDidMount() {
    userService.unConfirmedUsers((result) => {
      this.allUnConformed = result;
      console.log(this.allUnConformed)
      this.forceUpdate();
    });
  }
  confirmUser(id) {
    this.id = id;
    console.log(this.id);
    userService.confirmUser(this.id, (result) => {
      console.log(result);
      this.forceUpdate();

      userService.unConfirmedUsers((result) => {
        this.allUnConformed = result;
        console.log(this.allUnConformed)
        this.forceUpdate();
      });


    });
  }
}
