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
        <li className="li"><Link to ={'/newarrangement'} className="link">Lage nytt arrangement</Link></li>
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
    let unConfirmedList = []; // array for å skrive ut alle brukere som ikke er godkjent
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
    userService.unConfirmedUsers().then((result) => {
      this.allUnConformed = result;
     console.log(result)
      this.forceUpdate();
    });
  }
  // funksjon for når godkjenn knappen klikkes
  // henter listen på nytt for å oppdatere listen når en user godkjennes
  confirmUser(id) {
    this.id = id;
    console.log(this.id);
    userService.confirmUser(this.id).then((result) => {
      console.log( result);
      this.forceUpdate();

      userService.unConfirmedUsers().then((result) => {
        this.allUnConformed = result;
        console.log(this.allUnConformed)
        this.forceUpdate();
      });


    });
  }
}

<<<<<<< HEAD
=======

>>>>>>> 5e7d248212dbd45d69a6fd0f7a30c8b3cc2e5abc
export class NewArrangement extends React.Component {
 render() {

// registrerings skjemaet som skrives ut under registrerings komponenten
   return (
     <div className="menu">
     <form>
     <input className="input" ref="arrName" placeholder="Skriv inn navnet på arrangementet"></input><br/>
     <input className="input" ref="arrDescription" placeholder="Skriv inn nærmere beskrivelse på arrangementet"></input><br/>
     <input className="input" ref="arrMeetingLocation" placeholder="Skriv inn møtelokasjon"></input><br/>
     <input className="input" ref="arrContactPerson" placeholder="Skriv inn ekstern kontaktperson"></input><br/>
     <input className="input" ref="arrShowTime" placeholder="Skriv inn oppmøtetidspunkt(YYYY-MM-DD TT:MM)"></input><br/>
     <input className="input" ref="arrStartTime" placeholder="Skriv inn startidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input><br/>
     <input className="input" ref="arrEndTime" placeholder="Skriv inn sluttidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input><br/>
     <input className="input" ref="arrGearList" placeholder="Skriv inn utstyrsliste"></input><br/>

     <button className="button" ref="newArrButton">Opprett arrangement</button>
     </form>
     </div>
   );
 }

 componentDidMount() {
   this.refs.newArrButton.onclick = () =>{
     userService.addArrangement(this.refs.arrName.value, this.refs.arrDescription.value, this.refs.arrMeetingLocation.value,
                                 this.refs.arrContactPerson.value, this.refs.arrShowTime.value, this.refs.arrStartTime.value,
                                 this.refs.arrEndTime.value, this.refs.arrGearList.value).then((result) => {

                                   this.refs.arrName.value ="";
                                   this.refs.arrDescription.value ="";
                                   this.refs.arrMeetingLocation.value ="";
                                   this.refs.arrContactPerson.value ="";
                                   this.refs.arrShowTime.value ="";
                                   this.refs.arrStartTime.value ="";
                                   this.refs.arrEndTime.value ="";
                                   this.refs.arrGearList.value ="";
                                   this.nextPath('/hjem');
                                 });
   }
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
<<<<<<< HEAD
// }
=======
// }
>>>>>>> 5e7d248212dbd45d69a6fd0f7a30c8b3cc2e5abc
