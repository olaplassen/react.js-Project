import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';

import BigCalendar from 'react-big-calendar'
import moment from 'moment';

import { outlogged } from './app';



export class UserMenu extends React.Component {
  //props for å hente verdien fra brukeren som logget inn
  constructor(props) {
    super(props);
    //setter this.id lik verdien som ble sendt fra login.
    this.id = props.userId;

  }
  render() {
    return (
      <div className="menu">
       <ul className="ul">
       {/* sender id'en vidre til linkene */}
        <li className="li"><Link to ={'/userhome/' + this.id} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/mypage/' + this.id} className="link">Min side</Link></li>
        <li className="li"><Link to ={'/usersearch'} className="link">Søk</Link></li>
        <li className="li"><Link to ={'/arrangementer'} className="link">Arrangement</Link></li>
        <li className="li"><Link to ={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>

       </ul>
       </div>

    );
  }
}
// export class SignOut extends React.Component {
//     render() {
//     return null;
//   }
//   componentDidMount() {
//     userService.signOut();
//     outlogged();
//   }
// }

export function logout() {
  userService.signOut();
  outlogged();
  }

export class UserHome extends React.Component {
    constructor(props) {
      super(props);
      this.user = {}
      this.allEvents = [];
      let signedInUser = userService.getSignedInUser();
      console.log(signedInUser)
      //henter id fra usermenyen og matcher den med this.id
      this.id = props.match.params.userId;
    }
    nextPath(path) {
        this.props.history.push(path);
    }


   render() {

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


     )
   };
   //henter all brukerinfo ved hjelp av id
   componentDidMount() {

     userService.getUsers(this.id).then((result) => {
       //setter resultate fra spørringen lik this.user slik at vi får all informasjon om brukeren
       this.user = result;
       console.log(this.user);
       this.forceUpdate();
     });
     userService.getAllArrangement().then((result) => {
       this.allEvents = result;
       console.log(this.allEvents);

       this.forceUpdate();

     });

  }
 }

export class EventInfo extends React.Component {
  constructor(props) {
 super(props);
 this.arrangement = {};

 //henter id fra usermenyen og matcher den med this.id
 this.id = props.match.params.id;
 console.log(this.id)
  }
  render() {
    return(
      <div className="menu">
      <div>
      <h1>{this.arrangement.title} informasjon side.</h1> <br />
      {this.start} <br />
      </div> <br />
      <div>
      Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
      Oppmøte tidspunkt: {this.show}
      </div> <br />
      <div style={{width: 300}}>
      Beskrivelse: <br />
      {this.arrangement.description}
      </div> <br />

      Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}


      </div>

    )
  }
  componentDidMount() {
    userService.getArrangementInfo(this.id).then((result) => {
      this.arrangement = result;
      this.start = this.fixDate(this.arrangement.start);
      this.end = this.fixDate(this.arrangement.end)
      this.show = this.fixDate(this.arrangement.showTime)
      this.forceUpdate();
    })
  }
  fixDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    let mins = date.getMinutes();
    if (mins < 10) {
      mins = '0' + mins;
    }

    let dateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + mins;
    return(dateTime);
  }
}

export class MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.user = {}
    this.id= props.match.params.userId;
    this.state = {
      showchangePassword: false
    }
    this.updateShowState = this.updateShowState.bind(this);
    console.log(props);
  }
  updateShowState() {
    this.setState({ showchangePassword: !this.state.showchangePassword });
  }
  render() {
    return (

      <div>
        <div className="menu">
          <h2> {this.user.firstName} {this.user.lastName}</h2>
          <div> Epost: {this.user.email} </div>
          <div> Mobilnummer: {this.user.phone} </div>
          <div> Fødselsdato: Lorem ipsum</div>
          <div> Medlem siden: Lorem ipsum</div>
          <Link to={'/changeUser/' + this.id}>Endre opplysninger</Link>
          <div> Brukernavn: {this.user.userName}</div>
          <div> Passord: ********</div>


          <button onClick={this.updateShowState}>Klikk her for å endre passord</button>
          { this.state.showchangePassword ?
            <div>
              <input ref="newpassword" type="password" /> <br />
              <input ref="verifypassword" type="password" /> <br />
            </div>
            :
            null
          }
          <button ref="changepasswordbtn">Lagre</button>
        </div>
      </div>
    );
  }
  componentDidMount() {

    userService.getUsers(this.id).then((result) => {

      console.log(result);
      this.user = result;
      console.log(this.user);
      this.forceUpdate();
    });

    this.refs.changepasswordbtn.onclick = () => {

      if (this.refs.newpassword.value == this.refs.verifypassword.value) {
      userService.changePassword(this.refs.newpassword.value, this.id).then((result) => {

        this.refs.newpassword.value = "";
        this.refs.verifypassword.value = "";
         this.forceUpdate(); // Rerender component with updated data
      });
    }
    else {
      this.refs.newpassword.type = "text";
      this.refs.newpassword.value = "Passordene matcher ikke";
    }
   }
 }
}

export class ChangeUser extends React.Component {
    constructor(props) {
    super(props);
    this.user = {};
    this.id = props.match.params.userId;
    }
    render() {

      return (
        <div className="menu">
          <div>
            Fornavn: <input className="input" type='text' ref='changefirstName' /><br/>
            Etternavn: <input className="input" type='text' ref='changelastName' /><br/>
            Adresse: <input className="input" type='text' ref='changeaddress' /><br/>
            Postnummer: <input className="input" type='number' ref='changepostalNumber' /><br/>
            Poststed: <input className="input" type='text' ref='changepoststed' /><br/>
            Telefon: <input className="input" type='number' ref='changephone' /><br/>
            Mail: <input className="input" type='text' ref='changeemail' /><br/>
            <button ref='changeUserButton'>Lagre</button>
          </div>
        </div>
      );
    }

    nextPath(path) {
        this.props.history.push(path);
      }
  componentDidMount() {

    userService.getUsers(this.id).then((result) => {

      this.user = result;
      this.refs.changefirstName.value = this.user.firstName;
      this.refs.changelastName.value = this.user.lastName;
      this.refs.changeaddress.value = this.user.address;
      this.refs.changepostalNumber.value = this.user.postnr;
      this.refs.changepoststed.value = this.user.poststed;

      this.refs.changephone.value = this.user.phone;
      this.refs.changeemail.value = this.user.email;
      this.forceUpdate();
    });

    this.refs.changeUserButton.onclick = () => {
      userService.changeUser(this.refs.changefirstName.value,
                                 this.refs.changelastName.value,
                                 this.refs.changeaddress.value,
                                 this.refs.changepostalNumber.value,
                                 this.refs.changepoststed.value,
                                 this.refs.changephone.value,
                                 this.refs.changeemail.value,

                                 this.id).then((result) => {
        userService.getUsers(this.id).then((result) => {
          this.props.history.push('/mypage/' + this.id)
          this.forceUpdate(); // Rerender component with updated data
        });
      });
    };

    this.refs.changepostalNumber.oninput = () => {

      userService.getPoststed(this.refs.changepostalNumber.value).then((result) => {

        if(this.refs.changepostalNumber.value < 1) {
          this.refs.changepoststed.value = "";
        }
        else {
        for(let place of result) {
            this.refs.changepoststed.value = place.poststed;
            console.log(place.poststed)

        }
      }
      });
    }
  }
}

export class SearchUser extends React.Component {
    constructor(props) {
      super(props);
      this.allUsers = [];

      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
    }
    render() {
      let userList = [];

      for(let user of this.allUsers) {
        userList.push(<li key={user.id}>{user.firstName}</li>)
      }

      return (
        <div className="menu">
         <input type="text" value={this.state.value} onChange={this.handleChange} />

        <ul> {userList} </ul>
        </div>
      )
    }

    handleChange(event) {
      if (event.target.value != undefined ) {
      this.setState({value: event.target.value.toUpperCase()});
      console.log(event.target.value);

      userService.searchList(event.target.value).then ((result) => {

        console.log(result);
        this.allUsers = result;
        this.forceUpdate();
        });
      }

    }
    componentDidMount() {
        userService.userList((result) => {
          console.log(result);
          this.allUsers = result;
          this.forceUpdate();
        });

    }
  }
