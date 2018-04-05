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
<<<<<<< HEAD
=======
        <li className="li"><Link to ={'/signout'} className="link">Logg ut</Link></li>
>>>>>>> 0dcdf2fa16e788bf673d8b807eab899e80eedf93
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

   }
   //henter all brukerinfo ved hjelp av id
   componentDidMount() {
     userService.getUsers(this.id).then((result) => {
       console.log(this.id);
       //setter resultate fra spørringen lik this.user slik at vi får all informasjon om brukeren
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
        <div>

        </div>
        <div className="input">
          <h2> {this.user.firstName} {this.user.lastName}</h2>
          <div> Epost: {this.user.email} </div>
          <div> Mobilnummer: {this.user.phone} </div>
          <div> Fødselsdato: Lorem ipsum</div>
          <div> Medlem siden: Lorem ipsum</div>
          <Link to={'/changeUser/' + this.id}>Endre opplysninger</Link>
          <div> Brukernavn: {this.user.userName}</div>
          <div> Passord: ********</div>
          <button> Endre passord </button>
        </div>

        <div>

        </div>
      </div>
    );
  }
  componentDidMount() {
<<<<<<< HEAD
    userService.getUsers(this.id, (result) => {
=======
    userService.getUsers(this.id).then((result) => {
>>>>>>> 0dcdf2fa16e788bf673d8b807eab899e80eedf93
      console.log(result);
      this.user = result;
      console.log(this.user);
      this.forceUpdate();
    }
  );
  }
<<<<<<< HEAD
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


  componentDidMount() {
    userService.getUsers(this.id, (result) => {
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
                                 this.id, (result) => {
        userService.getUsers(this.id, (result) => {
          this.user = result;
          console.log(this.user)
          this.refs.changefirstName.value = this.user.firstName;
          this.refs.changelastName.value = this.user.lastName;
          this.refs.changeaddress.value = this.user.address;
          this.refs.changepostalNumber.value = this.user.postalNumber;
          this.refs.changepoststed.value = this.user.poststed;
          this.refs.changephone.value = this.user.phone;
          this.refs.changeemail.value = this.user.email;
          this.forceUpdate(); // Rerender component with updated data
        });
      });
    };

    this.refs.changepostalNumber.oninput = () => {
      userService.getPoststed(this.refs.changepostalNumber.value, (result) => {
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

=======
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
          this.user = result;
          console.log(this.user)
          this.refs.changefirstName.value = this.user.firstName;
          this.refs.changelastName.value = this.user.lastName;
          this.refs.changeaddress.value = this.user.address;
          this.refs.changepostalNumber.value = this.user.postalNumber;
          this.refs.changepoststed.value = this.user.poststed;
          this.refs.changephone.value = this.user.phone;
          this.refs.changeemail.value = this.user.email;
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

>>>>>>> 0dcdf2fa16e788bf673d8b807eab899e80eedf93
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
<<<<<<< HEAD
      userService.searchList(event.target.value, (result) => {
=======
      userService.searchList(event.target.value).then ((result) => {
>>>>>>> 0dcdf2fa16e788bf673d8b807eab899e80eedf93
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
