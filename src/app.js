import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { UserService } from './services';
import Registration from './registration.js'

class Menu extends React.Component {
  render() {

    return (
      <div>
        Login: <br/>
        <input ref="username" placeholder="Type your username"></input><br/>
        <input ref="passworde" placeholder="Type your password"></input><br/>
        <Link to='/'>Forgot password</Link> <br/>
        <Link to='/registration'>Registration</Link>

      </div>
    );
  }


}
// componentDidMount() {
//
//   userService.getUsers((result) => {
//     this
//   })
// }


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
        <Route exact path='/registration' component={Registration}/>
        <Route exact path='/' />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
