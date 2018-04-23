import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import { skillService } from './services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

//henter classene for utlogget funksjonalitet
import { StartMenu } from './outlogged'
import { Login } from './outlogged';
import { Registration } from './outlogged';
import { NewPassword } from './outlogged';
import { NewPasswordSendt } from './outlogged';

//henter classene for bruker funksjonalitet
import UserMenu from './components/User/UserMenu';
import UserHome from './components/User/UserHome';
import MyPage from './components/User/MyPage';
import ChangeUser from './components/User/ChangeUser';
import SearchUser from './components/User/SearchUser';
import EventInfo from './components/User/EventInfo';
import ChangeShift from './components/User/ChangeShift';

//henter classene for admin funksjonalitet
import AdminMenu from './components/Admin/AdminMenu';
import ConfirmUsers from './components/Admin/ConfirmUsers';
import AdminHome from './components/Admin/AdminHome';
import NewArrangement from './components/Admin/NewArrangement';
import Arrangement from './components/Admin/Arrangement';
import Statistics from './components/Admin/Statistic';
import UserStatistics from './components/Admin/UserStatistic';
import ChangeEvent from './components/Admin/ChangeEvent';

function checkSkillValid() { // sjekker om kursene sin utløpsdato er før dagens dato, deretter sletter de
  skillService.checkSkillValid();
}


//funksjon som kjøres når programmet startes/refreshes for å sjekke om det er lagret en bruker i localStorage (kjøres nederst i app)
export function outlogged(){
  let signedInUser = userService.getSignedInUser();
  //når bruker ikke er admin, kjøres user ReactDOM
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
//ReactDOM når signedInUser er user
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
      <Route exact path='/arrangementer' component={Arrangement} />
      <Route exact path='/eventinfo/:id' component={EventInfo} />
      <Route exact path='/changeshift/:arr_rolleid' component={ChangeShift} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};
//ReactDOM når signedInUser er admin
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
         <Route exact path='/adminsearch' component={SearchUser} />
         <Route exact path='/mypage/:userId' component={MyPage} />
         <Route exact path='/changeUser/:userId' component={ChangeUser} />
         <Route exact path='/eventinfo/:id' component={EventInfo} />
         <Route exact path='/statistics' component={Statistics} />
         <Route exact path='/userStatistic/:userid' component={UserStatistics} />
         <Route exact path='/changevent/:eventId' component={ChangeEvent} />


      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
};

checkSkillValid()
outlogged();
