import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import { ul } from './styles';
import { li } from './styles';
import { link } from './styles';

console.log(link)

class Menu extends React.Component {
 render() {

   return (
      <ul style={ul}>
       <li style={li}><Link to ='/login' style={link}>Login</Link></li>
       <li style={li}><Link to ='/registration' style={link}>Registration</Link></li>
      </ul>
   );
 }
}
class Login extends React.Component {
  render() {
    return (
      <div>
        <input ref="username" placeholder="Type your username"></input><br/>
        <input ref="password" placeholder="Type your password"></input><br/><br/>
        <button ref="loginBtn">Login</button> <br/>
        <Link to='/newPassword'>Forgot password</Link> <br/>
      </div>
    );
  }
  componentDidMount() {
    this.refs.loginBtn.onclick = () => {
      userService.loginUser(this.refs.username.value, this.refs.password.value, (result) => {

      });
    }
  }
}
class Registration extends React.Component {
 render() {
   return (
     <div>

     <input ref="newFname" placeholder="Type your firstname"></input><br/>
     <input ref="newLname" placeholder="Type your lastname"></input><br/>
     <input ref="newCity" placeholder="Type your city"></input><br/>
     <input ref="newAddress" placeholder="Type your adress"></input><br/>
     <input ref="newPost" placeholder="Type your postalnumber"></input><br/>
     <input ref="newTlf" placeholder="Type your phonenumber"></input><br/>
     <input ref="newEmail" placeholder="Type your email"></input><br/>
     <input ref="newUsername" placeholder="Type your username"></input><br/>
     <input ref="newPassword" placeholder="Type your password"></input><br/>
     <button ref="newUserbtn">Submit</button>
     </div>
   );
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

                       });
                    }
                  }
                }

class NewPassword extends React.Component {
  render() {
    return (
      <div>
      <input ref="username" placeholder="Type your username"></input><br/>
      <input ref="email" placeholder="Type your email"></input><br/>
      <button ref="newPasswordbtn">Request</button>
      </div>
    );
  }
  componentDidMount() {
  this.refs.newPasswordbtn.onclick = () => {
    userService.resetPassword(this.refs.username.value, this.refs.email.value, (result) => {

    });
    }
  }
}




// The Route-elements define the different pages of the application
// through a path and which component should be used for the path.
// The path can include a variable, for instance
// path='/customer/:customerId' component={CustomerDetails}
// means that the path /customer/5 will show the CustomerDetails
// with props.match.params.customerId set to 5.
ReactDOM.render((
  <HashRouter>
    <div>
      <Menu />
      <Switch>
        <Route exact path='/registration' component={Registration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/newPassword' component={NewPassword} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
