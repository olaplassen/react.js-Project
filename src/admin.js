import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInAdmin } from './app';
import { logout } from './user';
import { EventInfo } from './user';

import VirtualizedSelect from 'react-virtualized-select';

import BigCalendar from 'react-big-calendar'
import moment from 'moment';
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

//admin meny
export class AdminMenu extends React.Component {
    render() {
        return (
            <div className="menu">
                <ul className="ul">
                    <li className="li"><Link to={'/hjem'} className="link">Hjem</Link></li>
                    <li className="li"><Link to={'/søk'} className="link">Min side</Link></li>
                    <li className="li"><Link to={'/confirmusers'} className="link">Godkjenning</Link></li>
                    <li className="li"><Link to={'/newarrangement'} className="link">Lage nytt arrangement</Link></li>
                    <li className="li"><Link to={'/arrangementer'} className="link">Arrangement</Link></li>
                    <li className="li"><Link to={'/interesserte'} className="link">Interesserte brukere</Link></li>
                    <li className="li"><Link to={'/adminsearch'} className="link">BrukerSøk</Link></li>
                    <li className="li"><Link to={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>
                </ul>
            </div>
        );
    }
}

export class AdminHome extends React.Component {

  constructor(props){
  super(props);
  this.allEvents = [];

  }
   render() {
     console.log(this.allEvents)
     return (
       <div style={{height: 400, width: 600}} className="menu">
           <BigCalendar
             events={this.allEvents}
             showMultiDayTimes
             defaultDate={new Date(2018, 2, 1)}
             selectAble ={true}

             onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}

             />
         </div>

     );
   }

   componentDidMount(){
     userService.getAllArrangement().then((result) => {
       this.allEvents = result;
       this.forceUpdate();

     });
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

    }
    updateShowState() {
        this.setState({ showArrangementData: !this.state.showArrangementData });
    }
    render() {

        return (
            <div>
                {this.props.data.title} <button type="button" onClick={this.updateShowState}>Les mer</button><button type="button" onClick={() => this.getInteressed(this.props.data.id, this.state.activeUser)}>Interessert</button>
                {this.state.showArrangementData ?
                    <div>
                        <ul>
                            <li>Id: {this.props.data.id}</li>
                            <li>Navn: {this.props.data.title}</li>
                            <li>Tidspunkt: {this.props.data.end.toString()}</li>
                            <li>Beskrivelse: {this.props.data.description}</li>
                            <li>Utstyrliste: {this.props.data.gearList}</li>
                        </ul>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
    componentDidMount() {
        this.setState({
            activeUser: userService.getSignedInUser()["id"]
        });

    }


    getInteressed(arrangementId, userId) {
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
   }

   render() {
     let interessedList = [];

     for(let interessed of this.allInteressed) {
       interessedList.push(<li key={interessed.firstName}> {interessed.firstname + " " + interessed.lastName + " er interessert i: " + interessed.title} <button type="button" onClick={() => this.confirmInteressed(interessed.arrangementId, interessed.userId)}>Godkjenn</button> </li>)
     }
     return (
       <div className="menu">
       <h3> Interesserte brukere: </h3>
       <ul> {interessedList} </ul>
       </div>
     );
   }

   confirmInteressed(arrangementId, userId){
    userService.confirmInteressed(arrangementId, userId).then((result) => {
     this.forceUpdate();
     userService.interessedUsers().then((result) => {
       this.allInteressed = result;
       this.forceUpdate();
     });
   });
   }

   componentDidMount(){
    userService.interessedUsers().then((result) => {
    this.allInteressed = result;
    this.forceUpdate();
    });
    userService.interessedUsers().then((result => {
    let userId = result[0].userId;
    let arrangementId = result[0].arrangementId;
    this.setState({
      currentArrangementId: arrangementId,
      currentUserId: userId
     });
  }));
}
}
// komponent for å godkjenne brukere
export class ConfirmUsers extends React.Component {
  constructor() {
    super();
    this.allUnConformed = [];
  }
  render() {
    let signedInUser = userService.getSignedInUser()
    console.log(signedInUser.admin)
    let unConfirmedList = []; // array for å skrive ut alle brukere som ikke er godkjent
    //her pushes alle ikke godkjente brukere inn i arrayen.
    for(let unConfirmed of this.allUnConformed ) {
      unConfirmedList.push(<li key={unConfirmed.id}><Link to={'/mypage/' + unConfirmed.id }>{unConfirmed.firstName} {unConfirmed.lastName}</Link> {unConfirmed.phone + " " + unConfirmed.email} <button className="confirmBtn" onClick={() => this.confirmUser(unConfirmed.id)}>Godkjenn</button> <hr /></li>)

    }
        return (

            <div className="menu">
            Ikke godkjente brukere <br />
                {unConfirmedList}
            </div>
        );
    }
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
  constructor(props){
    super(props);
    this.state = {
            allRoles: [],
            roles: [],
            selectedRoles: [],
            selectedSingleValue: null
        }
    this.allMals = [];
    this.lastArr = [];
    this.rolesForArr = [];
    this.allRoles = [];
    this.numberOfRoles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // this.getSelectedValue = this.getSelectedValue.bind(this);
  }
  render() {

    let inc = 0;

    let vaktmalList = [];
    let roleList = [];

    for (let role of this.allRoles) {
         roleList.push(
           <tr key={role.roleid}>
           <td className="td">{role.roleid}</td>
           <td className="td">{role.title}</td>
           <td className="table">{this.numberOfRoles[inc]}</td>
           <td className="table">
           <button onClick={() => {
           this.numberOfRoles[role.roleid-1]++;
           this.forceUpdate();
            }}>+</button></td>
            <td className="table">
            <button onClick={() => {
              if(this.numberOfRoles[role.roleid-1] > 0){
                this.numberOfRoles[role.roleid-1]--;
              }
              this.forceUpdate();
            }}>-</button></td>
            </tr>
          );
<<<<<<< HEAD
<<<<<<< HEAD
          // temp++;
=======
          temp++;
>>>>>>> 91e7fef1363ea1e190b8c356aebe9b2e55072d08
=======
          inc++;
>>>>>>> 2e29547a908fa04692de3d5d0ced8a7567d7b771
       }

    for (let vaktmal of this.allMals) {
         vaktmalList.push({ value: vaktmal.vaktmalId, label: vaktmal.vaktmalTittel},);
       }
    const {selectValue } = this.state;

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
     Sett Vaktlistemal for arrangementet <br />
     <VirtualizedSelect
       autoFocus
       clearable={true}
       removeSelected={false}
       multi={false}
       options={vaktmalList}
       onChange={(selectValue) => this.setState({ selectValue })}
       value={selectValue}
     />
       <table className="table" id="myTable">
             <tbody>
             <tr> <th className="th">Nr</th> <th className="th">Tittel</th> <th className="th">Antall</th> <th className="th">Legg til</th> <th className="th">Trekk fra</th> </tr>
               {roleList}
             </tbody>
       </table>

     <input className="input" ref="arrGearList" placeholder="Skriv inn utstyrsliste"></input><br/>

     <button className="button" ref="newArrButton" onClick={() => this.registerArrangement(selectValue, roleList.length)}>Opprett arrangement</button>
     </form>
     </div>
   );

 }

<<<<<<< HEAD
<<<<<<< HEAD
=======
}
=======

>>>>>>> 2e29547a908fa04692de3d5d0ced8a7567d7b771
   // getSelectedValue(value) {
   //      let key = 0;
   //      console.log(value)
   //      var selectedSingleValue = document.getElementById("selected-role").value;
   //      this.state.selectedRoles.push(<li key={key++}>{selectedSingleValue}</li>);
   //      // document.getElementById("selected-role").selectedIndex = 0;
   //      console.log(this.state.roles)
   //      this.forceUpdate();
   //  }

    addRolesforArrWidthMal(result, arrid) {
      for (let role of result) {
      userService.addRolesforArr(arrid, role.roleid, role.vaktmalid).then((result) => {
      });
    }
    }
>>>>>>> 91e7fef1363ea1e190b8c356aebe9b2e55072d08

   // getSelectedValue(value) {
   //      let key = 0;
   //      console.log(value)
   //      var selectedSingleValue = document.getElementById("selected-role").value;
   //      this.state.selectedRoles.push(<li key={key++}>{selectedSingleValue}</li>);
   //      // document.getElementById("selected-role").selectedIndex = 0;
   //      console.log(this.state.roles)
   //      this.forceUpdate();
   //  }

    addRolesforArrWidthMal(result, arrid) {
      for (let role of result) {
      userService.addRolesforArr(arrid, role.roleid, role.vaktmalid).then((result) => {
      });
    }
    }

<<<<<<< HEAD

=======
>>>>>>> 91e7fef1363ea1e190b8c356aebe9b2e55072d08
 registerArrangement(selectValue, roleListLength) {
   console.log(roleListLength)
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

                               });

    userService.getLastArrangement().then((result) => {
      this.lastArr = result;
      if(selectValue != undefined) {
      userService.getRolesForMal(selectValue.value).then((result) => {
          console.log(result)
          this.addRolesforArrWidthMal(result, this.lastArr.id);

        });
      }
      else if(selectValue == undefined) {
        for (let i = 1; i < roleListLength; i++) {
          if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML != 0) {

            if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML > 1) {
              for (var y = 0; y < document.getElementById("myTable").rows[i].cells.item(2).innerHTML; y++) {
                userService.addRolesforArrSingle(this.lastArr.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => {

                })
              }
            }
            else if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML == 1) {
              userService.addRolesforArrSingle(this.lastArr.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => {

              })
            }
          }
          else {
            console.log("Ingen av denne typen ble valgt");

          }
        }
      }
      else {
        console.log("ingenting skjedde")
      }
      this.props.history.push('/eventinfo/' + this.lastArr.id);
    })
 }


 componentDidMount() {

  userService.getVaktmal().then((result) => {
    this.allMals = result;
    console.log(result)
    this.forceUpdate();
  });

  userService.getRole().then((result) => {
      this.allRoles = result;
      this.forceUpdate();
            // this.setState({
            //     allRoles: result
            // });
        });
      }
}
