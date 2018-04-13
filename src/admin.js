import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInAdmin } from './app';
import { logout } from './user';

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
        <li className="li"><Link to ={'/arrangementer'} className="link">Arrangement</Link></li>
        <li className="li"><Link to ={'/interesserte'} className="link">Interesserte brukere</Link></li>
        <li className="li"><Link to ={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>
       </ul>
       </div>
    );
  }
 }

export class AdminHome extends React.Component {
  constructor(props){
  super(props);

  this.arrangement = {};
  this.id = props.match.params.arrangementId

}
   render() {

     return (
       <div className="menu">
       <h2> {this.arrangement.description}</h2>
       </div>

     );
   }
   componentDidMount(){

  userService.getArrangement().then((result) => {
   this.arrangement = result;
   this.forceUpdate();
   console.log(this.arrangement)

}
);
 }
   }


export class ArrangementData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showArrangementData: false,
      activeUser: null
    }
    this.updateShowState = this.updateShowState.bind(this);
    console.log(this.state.activeUser);
  }
  updateShowState() {
    this.setState({ showArrangementData: !this.state.showArrangementData });
  }
  render() {

    return(
      <div>
    {this.props.data.title} <button type="button" onClick={this.updateShowState}>Les mer</button><button type="button" onClick={() => this.getInteressed(this.props.data.id, this.state.activeUser)}>Interessert</button>
      { this.state.showArrangementData ?
        <div>
          <ul>
            <li>Id: { this.props.data.id }</li>
            <li>Navn: { this.props.data.title }</li>
            <li>Tidspunkt: { this.props.data.end.toString() }</li>
            <li>Beskrivelse: { this.props.data.description }</li>
            <li>Utstyrliste: { this.props.data.gearList }</li>
          </ul>
        </div>
        :
        null
      }
      </div>
    );
  }
  componentDidMount(){
    this.setState({
      activeUser: userService.getSignedInUser()["id"]
    });

  }


  getInteressed(arrangementId, userId){
    this.state.activeUser = userId;
    console.log(this.state.activeUser)
    userService.getInteressed(arrangementId, userId).then((result) => {

      this.forceUpdate();
    })
  }
}

 export class Arrangement extends React.Component {
   constructor(){
     super();
     this.allArrangement = [];

   }
   render() {
    let arrangementDetails = [];

    for (let arrangement of this.allArrangement) {
       arrangementDetails.push(<ArrangementData key={arrangement.id} data={arrangement} />);
     }

      return (

        <div className ="menu">
          {arrangementDetails}
        </div>
      );
   }
componentDidMount(){
  userService.getArrangement().then((result) => {
    this.allArrangement = result;
    this.forceUpdate();

  });
  userService.interessedUsers().then((result) => {
    this.allInteressed = result;
    console.log(result)
    this.forceUpdate();
  });
}

}

 export class ConfirmInteressedUsers extends React.Component {
   constructor(props) {
     super(props);
     this.allInteressed = [];
     console.log(props)
     this.state = {
       currentUserId: null,
       currentArrangementId: null
     }
console.log(this.state.currentUserId)
console.log(this.state.currentArrangementId)
   }

   render() {
     let interessedList = [];

     for(let interessed of this.allInteressed) {
       interessedList.push(<li key={interessed.firstName}> {interessed.firstname + " " + interessed.lastName + " er interessert i: " + interessed.title} <button type="button" onClick={() => this.confirmInteressed(this.state.currentUserId, this.state.currentArrangementId)}>Godkjenn</button> </li>)
     }
return (
  <div className="menu">
  <h3> Interesserte brukere: </h3>
  <ul> {interessedList} </ul>
  </div>
);
   }

   confirmInteressed(arrangementId, userId){
       userService.getInteressedUsers().arrangementId,
       userService.getInteressedUsers().userId
       this.state.currentArrangementId = arrangementId;
       this.state.currentUserId = userId;
       console.log(this.state.currentArrangementId)
       console.log(this.state.currentUserId)

       userService.confirmInteressed(arrangementId, userId).then((result) => {

       this.forceUpdate();
     })
   }

componentDidMount(){
    userService.interessedUsers().then((result) => {
    this.allInteressed = result;
    console.log(result)
    this.forceUpdate();
  });
  this.setState({
    currentArrangementId: userService.getInteressedUsers().arrangementId,
    currentUserId: userService.getInteressedUsers().userId

  });
 userService.getInteressedUsers().then((result) => {

   this.forceUpdate();
 });

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
     Oppmøte tidspunkt: <input type='datetime-local' ref="arrShowTime" placeholder="Skriv inn oppmøtetidspunkt(YYYY-MM-DD TT:MM)"></input><br/>
     Start tidspunkt: <input type='datetime-local' ref="arrStartTime" placeholder="Skriv inn startidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input><br/>
     Slutt tidspunkt: <input type='datetime-local' ref="arrEndTime" placeholder="Skriv inn sluttidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input><br/>
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
