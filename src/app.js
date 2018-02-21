import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { UserService } from './services';

class Menu extends React.Component {
  render() {
    return (
      <div>
        Menu: <Link to='/'>Customers</Link>
      </div>
    );
  }
}

// mooooorn fgsdfsdf
// class Login extends React.Component {
//   constructor() {
//     super();
//
//
//   }
//   render() {
//
//   }
//
//   return (
//     <div>
//       Login:
//
//
//       <div>
//         Username <input type='text' ref='newName' />
//         Password: <input type='text' ref='newCity' />
//         <button onClick={() => {
//           console.log("click");
//
//         }}>Add</button>
//       </div>
//     </div>
//   );
//
//  }



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
        <Route exact path='/'/>
        <Route exact path='/' />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
