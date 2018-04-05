import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInUser } from './app';
import { checkLogInAdmin } from './app';

// class for navigasjons meny
export class StartMenu extends React.Component {
 render() {

   return (
     <div className="menu">
      <ul className="ul">
       <li className="li"><Link to ='/login' className="link">Logg inn</Link></li>
       <li className="li"><Link to ='/registration' className="link">Registrering</Link></li>
      </ul>
      </div>

   );
 }
}
//
export class Login extends React.Component {
  render() {
    return (

      <div className="menu">
      <h1 className="h1">Velkommen</h1>
      <img className="img" src={'src/img/rkors.jpg'} />
      <form>
        <label htmlFor="username">Username</label>
        <input className="input" ref="username" placeholder="Type your username"></input><br/>
        <label htmlFor="password">Password</label>
        <input className="input" type="password" ref="password" placeholder="Type your password"></input><br/><br/>
        <button className="button" ref="loginBtn">Login</button> <br/>
        <Link to='/newPassword'>Forgot password</Link> <br/>
        </form>
      </div>
    );
  }
  componentDidMount() {
    //
    this.refs.loginBtn.onclick = () => {
      userService.loginUser(this.refs.username.value, this.refs.password.value).then((result) => {

        console.log(result)
        if (result != undefined && result.confirmed == true) {
    // når resultatet fra LoginUser er undefined avsluttes funkjsonen
    //slik at loginAdmin kjøres
        if (result.admin == true) {
          let admin = {
            adminId: result.id

          }
          console.log(admin.adminId);
          checkLogInAdmin(admin);
        }
        else  {
          // oppretter array for user med id slik at verdien kan sendes til den nye
          // reactDOM'en. userId settes lik id fra resultatet fra spørringen i services.
          let user = {
            userId: result.id

          }
          console.log(user.userId);
           checkLogInUser(user);
        }
      }
      else {
<<<<<<< HEAD
=======

>>>>>>> 5e7d248212dbd45d69a6fd0f7a30c8b3cc2e5abc
        alert("Feil passord/brukernavn, eller så er din bruker ikke godkjent")
      }

      });

  }
}
}


export class Registration extends React.Component {
 render() {

// registrerings skjemaet som skrives ut under registrerings komponenten
   return (
     <div className="menu">
     <form>
     <input className="input" ref="newFname" placeholder="Type your firstname"></input><br/>
     <input className="input" ref="newLname" placeholder="Type your lastname"></input><br/>
     <input className="input" ref="newAddress" placeholder="Type your adress"></input><br/>
     <input className="input" ref="newPostnr" placeholder="Type your postalnumber"></input><br/>
     <input className="input" ref="newPoststed" placeholder="Type your postalplace"></input><br/>
     <input className="input" ref="newTlf" placeholder="Type your phonenumber"></input><br/>
     <input className="input" ref="newEmail" placeholder="Type your email"></input><br/>
     <input className="input" ref="newUsername" placeholder="Type your username"></input><br/>
     <input type="password" className="input" ref="newPassword" placeholder="Type your password"></input><br/>
     <button className="button" ref="newUserbtn">Submit</button>
     </form>
     </div>
   );
 }
 //funksjon for oprette path historie for å sende bruker til ny side
 nextPath(path) {
     this.props.history.push(path);
   }
//rendrer på nytt og lagrer dataen bruker har ført inn i databasen
 componentDidMount() {
 this.refs.newUserbtn.onclick = () => {
   userService.addUser(this.refs.newFname.value, this.refs.newLname.value, this.refs.newAddress.value, Number(this.refs.newPostnr.value), this.refs.newPoststed.value,
<<<<<<< HEAD
=======

>>>>>>> 5e7d248212dbd45d69a6fd0f7a30c8b3cc2e5abc
                       Number(this.refs.newTlf.value), this.refs.newEmail.value, this.refs.newUsername.value, this.refs.newPassword.value).then((result) => {

                         this.refs.newFname.value = "";
                         this.refs.newLname.value = "";
                         this.refs.newAddress.value = "";
                         this.refs.newTlf.value = "";
                         this.refs.newEmail.value = ""
                         this.refs.newUsername.value = "";
                         this.refs.newPassword.value = "";
                         this.nextPath('/login'); // sender user til login page etter registrering

                       });
                     }
    this.refs.newPostnr.oninput = () => {
<<<<<<< HEAD
=======

>>>>>>> 5e7d248212dbd45d69a6fd0f7a30c8b3cc2e5abc
      userService.getPoststed(this.refs.newPostnr.value).then((result) => {
        if(this.refs.newPostnr.value.length < 1) {
          this.refs.newPoststed.value = "";
        }
        else {
        for(let place of result) {
            this.refs.newPoststed.value = place.poststed;
            console.log(place.poststed)

        }
      }
      });
    }
  }
}

export class NewPassword extends React.Component {
  render() {
    return (
      <div className="menu">
      <h3>Reset password</h3>
      <input className="input" ref="username" placeholder="Type your username"></input><br/>
      <input className="input" ref="email" placeholder="Type your email"></input><br/>
      <button className="button" ref="newPasswordbtn">Request</button>
      </div>
    );
  }
//sender bruker til ny komponent etter at brukeren har spurt etter nytt passord
  nextPath(path) {
  this.props.history.push(path);
  }

  componentDidMount() {
  this.refs.newPasswordbtn.onclick = () => {
    userService.resetPassword(this.refs.username.value, this.refs.email.value).then((result) => {
      //når username og email matcher med en user i databsen og resultatet ikke er null
      // sendes bruker til ny komponent
      if(result != null) {
      this.nextPath('/passwordsendt')
    }
    });
    }
  }
}

export class NewPasswordSendt extends React.Component {
  render() {
    return (
      <div className="menu">
      Ditt nye passord har nå blitt sendt til din email adresse. <br/>
      <Link to="/login">Tilbake til login</Link>
      </div>
    )
  }
}
