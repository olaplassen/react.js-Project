import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();



export default class UserStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.userid = props.match.params.userid;
        this.antRoleUser = [];
        this.user = [];

    }
    render() {
      let roleCountList = [];

      for (let oneRole of this.antRoleUser) {
        roleCountList.push(
          <tr key={oneRole.roleid}>
          <td className="td">{oneRole.title}</td>
          <td className="td">{oneRole.deltattRolle}</td>
          </tr>
        )
      }

        return (
            <div className="menu">
              <h2>Statistikk for {this.user.firstName}{this.user.lastName} </h2>
              <div className="row">
              <div className="column3">
              <h4>Generell statistikk</h4>
              <input type="datetime-local" ref="" /> <input type="datetime-local" />
              </div>
              <div className="column3">
              <h4>Rolle Statistikk</h4>
              <table className="table">
                <tbody>
                  <tr><th className="th">Rolle</th><th className="th">Antall</th></tr>
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
      userService.participatedRoles(this.userid).then((result) => {
        this.antRoleUser = result;
        console.log(result)
        this.forceUpdate();
      })

    }
}
