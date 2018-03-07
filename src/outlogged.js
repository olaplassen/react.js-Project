import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';
import { checkLogInUser } from './app';
import { checkLogInAdmin } from './app';


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
        <input className="input" ref="password" placeholder="Type your password"></input><br/><br/>
        <button className="button" ref="loginBtn">Login</button> <br/>
        <Link to='/newPassword'>Forgot password</Link> <br/>
        </form>
      </div>
    );
  }
  componentDidMount() {
    this.refs.loginBtn.onclick = () => {
      userService.loginUser(this.refs.username.value, this.refs.password.value, (result) => {

        console.log(result)

        if (result== undefined) {
          return (<div> Feil passord</div>);
        }
        else {
          let user = {
            userId: result.id

          }
          console.log(user.userId);
           checkLogInUser(user);
        }

      });

      userService.loginAdmin(this.refs.username.value, this.refs.password.value, (result) => {

        

        if (result== undefined) {
          return (<div> Feil passord</div>);
        }
        else {
          let admin = {
            adminId: result.id

          }
          console.log(admin.adminId);
          checkLogInAdmin(admin);
        }
      });
  }
}
}

// LOCALSTORAGE SØK LAGRE LOGGON


export class Registration extends React.Component {
 render() {


   return (
     <div className="menu">
     <form>
     <input className="input" ref="newFname" placeholder="Type your firstname"></input><br/>
     <input className="input" ref="newLname" placeholder="Type your lastname"></input><br/>
     <input className="input" ref="newCity" placeholder="Type your city"></input><br/>
     <input className="input" ref="newAddress" placeholder="Type your adress"></input><br/>
     <input className="input" ref="newPost" placeholder="Type your postalnumber"></input><br/>
     <input className="input" ref="newTlf" placeholder="Type your phonenumber"></input><br/>
     <input className="input" ref="newEmail" placeholder="Type your email"></input><br/>
     <input className="input" ref="newUsername" placeholder="Type your username"></input><br/>
     <input className="input" ref="newPassword" placeholder="Type your password"></input><br/>
     <button className="button" ref="newUserbtn">Submit</button>
     </form>
     </div>
   );
 }
 nextPath(path) {
     this.props.history.push(path);
   }

 componentDidMount() {
 this.refs.newUserbtn.onclick = () => {
   userService.addUser(this.refs.newFname.value, this.refs.newLname.value, this.refs.newCity.value, this.refs.newAddress.value, Number(this.refs.newPost.value),
                       Number(this.refs.newTlf.value), this.refs.newEmail.value, this.refs.newUsername.value, this.refs.newPassword.value, (result) => {
                         this.refs.newFname.value = "";
                         this.refs.newLname.value = "";
                         this.refs.newCity.value = "";
                         this.refs.newAddress.value = "";
                         this.refs.newPost.value = "";
                         this.refs.newTlf.value = "";
                         this.refs.newEmail.value = ""
                         this.refs.newUsername.value = "";
                         this.refs.newPassword.value = "";
                         this.nextPath('/login');

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

  nextPath(path) {
  this.props.history.push(path);
  }

  componentDidMount() {
  this.refs.newPasswordbtn.onclick = () => {
    userService.resetPassword(this.refs.username.value, this.refs.email.value, (result) => {
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
