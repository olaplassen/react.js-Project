import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();



export default class UserStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.userid = props.match.params.userid;

    }
    render() {
      console.log("hei")
        return (
            <div className="menu">
              <h2>Statistikk for {this.userid} </h2>
              <table className="table">
                <tbody>
                  <tr><th className="Rolle">Rolle</th><th className="Rolle">Antall</th></tr>

                </tbody>
              </table>
            </div>

        );
    }

    componentDidMount() {
      userService.participatedRoles(this.userid).then((result) => {
        
      })

    }
}
