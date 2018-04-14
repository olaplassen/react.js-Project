import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();


//henter classene fra outlogged.js
import { StartMenu } from './outlogged'
import { Login } from './outlogged';
import { Registration } from './outlogged';
import { NewPassword } from './outlogged';
import { NewPasswordSendt } from './outlogged';



//henter classene fra users.js
import {UserMenu} from './user';
import {UserHome} from './user';
import {MyPage} from './user';
import {ChangeUser} from './user';
import {SearchUser} from './user';
import {EventInfo} from './user';
import {SignOut} from './user';


//henter classene fra admin.js
import {AdminMenu} from './admin';
import {ConfirmUsers} from './admin';
import {AdminHome} from './admin';
import {NewArrangement} from './admin';
import {Arrangement} from './admin';
import {ConfirmInteressedUsers} from './admin';





export function outlogged(){
  let signedInUser = userService.getSignedInUser();
  if (signedInUser != undefined && signedInUser.admin == false) {
    let user = {
      userId: signedInUser.id
    }
    checkLogInUser(user)
  }
  else if (signedInUser != undefined && signedInUser.admin == true) {
    let admin = {
      adminId: signedInUser.id
    }
    checkLogInAdmin(admin)
  }
  else {
ReactDOM.render((

  <HashRouter>
    <div>

      {/* Definerer hvilken komponent som alltid skal vises! */}
      <StartMenu  />
      <Switch>
        {/* Routes som definerer hvilken komponent som bruker skal sendes */}
        {/* til når bestemte paths blir referert til */}
        <Route exact path='/registration' component={Registration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/newPassword' component={NewPassword} />
        <Route exact path='/passwordsendt' component={NewPasswordSendt} />
        <Login /> {/* Definerer hvilken komponent som skal vises på 1. render */}
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
}
}
//ny ReactDOM som kjøres når user logger inn.
 export function checkLogInUser(user) {
  ReactDOM.render((
  <HashRouter>
    <div>

      <UserMenu userId={user.userId} />
      <Switch>
      <Route exact path='/userhome/:userId' component={UserHome} />
      <Route exact path='/changeUser/:userId' component={ChangeUser} />
      <Route exact path='/mypage/:userId' component={MyPage} />
      <Route exact path='/usersearch' component={SearchUser} />
      <Route exact path='/signout' component={SignOut} />
      <Route exact path='/arrangementer' component={Arrangement} />
      <Route exact path='/eventInfo/:id' component={EventInfo} />
      <UserHome userId={user.userId} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
//ny ReactDOM som kjøres når user admin inn.
export function checkLogInAdmin(admin) {
  ReactDOM.render((
  <HashRouter>
    <div>
      <AdminMenu />
      <Switch>

          <Route exact path='/hjem' component={AdminHome} />
         <Route exact path='/confirmusers' component={ConfirmUsers} />
         <Route exact path='/newarrangement' component={NewArrangement} />
         <Route exact path='/arrangementer' component={Arrangement} />
         <Route exact path='/interesserte' component={ConfirmInteressedUsers} />
         <Route exact path='/adminsearch' component={SearchUser} />

      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
outlogged();
