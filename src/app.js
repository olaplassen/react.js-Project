import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';

// import { ul } from './styles';
// import { li } from './styles';
// import { link } from './styles';



class Menu extends React.Component {
 render() {

   return (
     <div className="menu">
      <ul className="ul">
      <li className="ul">
       <li className="li"><Link to ='/login' className="link">Logg inn</Link></li>
       <li className="li"><Link to ='/registration' className="link">Registrering</Link></li>
      </ul>
      </div>
      <div className="">
      Velkommen til
      </div>
   );
 }
}
class Login extends React.Component {
  render() {
    return (

      <div className="menu">
      <form action="/action_page.php">
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


        console.log(result);
        if (result== undefined) {
          alert("feil passord")
        }
        else {
          let user = {
            userId: result.id

          }
          console.log(user.userId);
           checkLogIn(user);
        }

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

class Home extends React.Component {
  render() {
    return (
       <ul style={ul}>
        <li style={li}><Link to ='/home' style={link}>Home</Link></li>
        <li style={li}><Link to ='/mypage'style={link}>Mypage</Link></li>
       </ul>
    );
  }
 }

class MyPage extends React.Component {
  constructor(props) {
  super(props);

  this.user = {};
  this.id = props.match.params.userId
  console.log(this.id);

  }

  render() {
    return (

      <div>


      </div>
    );
  }
  // componentDidMount() {
  //   userService.getUsers(this.id, (result) => {
  //     // this.user = result;
  //     this.firstName = result.firstName.value;
  //
  //
  //     this.forceUpdate();
  //     console.log(this.user);
  //
  //   })
  // }
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

function checkLogIn(user) {
  ReactDOM.render((
  <HashRouter>
    <div>
      <Home />
      <Switch>
        // <Route exact path='/' component={Home} />
         // <Route exact path='/arrangement' component={Login} />
           <Route exact path='/mypage/:userId' component={MyPage} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
