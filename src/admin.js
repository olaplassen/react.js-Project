import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInAdmin } from './app';

//admin meny
export class AdminMenu extends React.Component {
  render() {
    return (
      <div className="menu">
       <ul className="ul">
        <li className="li"><Link to ={'/hjem'} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/søk'} className="link">Min side</Link></li>
        <li className="li"><Link to ={'/confirmusers'} className="link">Godkjenning</Link></li>
       </ul>
       </div>
    );
  }
 }

 export class AdminHome extends React.Component {
   render() {
     return (
       <div className="menu">
       Admin hjemmeside
       </div>
     )
   }
 }
// komponent for å godkjenne brukere
export class ConfirmUsers extends React.Component {
  constructor() {
    super();
    this.allUnConformed = [];
  }
  render() {
    let unConfirmedList = []; // array for å skrive ut alle brukere som ikke er goskjent
    //her pushes alle ikke godkjente brukere inn i arrayen.
    for(let unConfirmed of this.allUnConformed ) {
      unConfirmedList.push(<li key={unConfirmed.id}>{unConfirmed.firstName + " " + unConfirmed.lastName + " " +  unConfirmed.phone + " " + unConfirmed.email} <button className="confirmBtn" onClick={() => this.confirmUser(unConfirmed.id)}>Godkjenn</button> <hr /></li>)
    }

    return (
      /* skriver ut unConfirmedList på siden */
      <div className="menu">
      <h3> Ikke godkjent brukere: </h3>
      <ul> {unConfirmedList} </ul>
      </div>
    );
  }
  //henter listen fra en sql spørring
  componentDidMount() {
    userService.unConfirmedUsers((result) => {
      this.allUnConformed = result;

      this.forceUpdate();
    });
  }
  // funksjon for når godkjenn knappen klikkes
  // henter listen på nytt for å oppdatere listen når en user godkjennes
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
// 
// export class EventPlanner extends React.component{
//   render() {
//     return(
//       <div className="menu">
//       <h2>Side for oppretting av arrangementer</h2>
//
//       <form>
//         <label htmlFor="name">Navn</label>
//         <input className="input" ref="" placeholder=""></input><br/>
//         <label htmlFor="">Password</label>
//         <input className="input" ref="" placeholder=""></input><br/><br/>
//         <button className="button" ref="">Login</button> <br/>
//
//         </form>
//       </div>
//     )
//   }
// }
