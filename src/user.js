import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';

import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))



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

        <li className="li"><Link to ={'/signout'} className="link">Logg ut</Link></li>

        <li className="li"><Link to ={'/arrangementer'} className="link">Arrangement</Link></li>

       </ul>
       </div>

    );
  }
 }

  export class SignOut extends React.Component<{}> {
  render() {
    return (

<div>

<p>Date: <input type="text" id="datepicker"></input></p>


</div>

    )
  }

}

 export class UserHome extends React.Component {
    constructor(props) {
   super(props);

   this.allEvents = [];

   //henter id fra usermenyen og matcher den med this.id
   this.id = props.match.params.userId;
   console.log(this.id)
    }
    nextPath(path) {
        this.props.history.push(path);
      }


   render() {

     return (


       <div style={{height: 400}}>
           <BigCalendar
             events={this.allEvents}
             showMultiDayTimes
             defaultDate={new Date(2018, 2, 1)}
             selectAble ={true}

             onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)
       }

             />
         </div>


     );

   }
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
      <div>
      {this.arrangement.title}
      
      </div>
    )
  }
  componentDidMount() {
    userService.getArrangementInfo(this.id).then((result) => {
      this.arrangement = result;

      this.forceUpdate();
    })
  }
}

export class MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.userId,
      user: {}
    }
  }

  render() {

    return (

      <div>
        <div>

        </div>
        <div className="input">
          <h2> {this.state.user.firstName} {this.state.user.lastName}</h2>
          <div> Epost: {this.state.user.email} </div>
          <div> Mobilnummer: {this.state.user.phone} </div>
          <div> Fødselsdato: Lorem ipsum</div>
          <div> Medlem siden: Lorem ipsum</div>
          <Link to={'/changeUser/' + this.state.id}>Endre opplysninger</Link>
          <div> Brukernavn: {this.state.user.userName}</div>
          <div> Passord: ********</div>
          <input ref="newpassword" type="password" /> <br />
          <input ref="verifypassword" type="password" /> <br />
          <button ref="changepasswordbtn"> Endre passord </button>

        </div>

        <div>

        </div>
      </div>
    );
  }
  componentDidMount() {

    userService.getUsers(this.id).then((result) => {

      console.log(result);
      this.state.user = result;
      console.log(this.state.user);
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
