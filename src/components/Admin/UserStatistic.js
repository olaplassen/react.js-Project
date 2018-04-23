import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../Services/UserService';
import { skillService } from '../Services/SkillService';
import { roleService } from '../Services/RoleService';
import { interestService } from '../Services/InterestService';
import { evntService } from '../Services/Evntservice';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

export default class UserStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.userid = props.match.params.userid;
        this.antRoleUser = []; //antall deltatt som rolle
        this.user = [];//denne brukeren
        this.roleHours = [];//variabel for ant roller og timer

    }
    render() {
      let roleCountList = [];
      let roleHourList = [];

      for (let oneRole of this.antRoleUser) { //liste over roller og hvor mange ganger bruker har deltatt som den rollen
        roleCountList.push(
          <tr key={oneRole.roleid}>
          <td className="td">{oneRole.title}</td>
          <td className="td">{oneRole.deltattRolle}</td>
          </tr>
        )
      }
      if (this.roleHours != undefined) { //liste over ant vakter og ant timer på vakt i gitt periode
        roleHourList.push(
          <tr key={this.roleHours.timer}>
          <td className="td">{this.roleHours.antVakter}</td>
          <td className="td">{this.roleHours.timer}</td>
          </tr>
        )
      }

        return (
            <div className="menu">
              <h2>Statistikk for {this.user.firstName} {this.user.lastName} </h2>
              <div className="row">
                <div className="column3">
                  <h4>Generell statistikk</h4>
                    <input type="datetime-local" ref="startDate" style={{width:49 + '%'}}/>
                    <input type="datetime-local" ref="endDate" style={{width:48 + '%'}}/> <br />
                    <button ref="checkInfo" className="statistikkBtn">Sjekk Statistikk</button>
                <div ref="error"></div>

              <table className="table100">
                <tbody>
                  <tr>
                    <th className="th">Antall vakter denne perioden</th>
                    <th className="th">Ant timer på vakt denne perioden</th>
                  </tr>
                  {roleHourList}
                </tbody>
              </table>

              </div>
                <div className="column3">
                  <h4>Rolle Statistikk</h4>
                  <table className="table100">
                    <tbody>
                      <tr>
                        <th className="th">Rolle</th>
                        <th className="th">Antall ganger deltatt som</th>
                      </tr>
                      {roleCountList}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

        );
    }
    componentDidMount() {

      userService.getUsers(this.userid).then((result) => {
        this.user = result;
        this.forceUpdate();
      })
      userService.participatedRoles(this.userid).then((result) => {//antall ganger deltatt som rolle
        this.antRoleUser = result;
        this.forceUpdate();
      })
      this.refs.checkInfo.onclick = () => {
        if (this.refs.startDate.value != 0 && this.refs.endDate.value != 0 && this.refs.startDate.value < this.refs.endDate.value) {
          userService.getUserShiftInfoBetween(this.userid, this.refs.startDate.value, this.refs.endDate.value).then((result) => {//henter ant vakter og ant timer mellom input verdiene
            this.roleHours = result;
            this.forceUpdate();
          })
        }
        else {
          this.refs.error.textContent = "Ikke gyldige datoer"
        }
      }

    }
}
