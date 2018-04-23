import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import { Link } from 'react-router-dom';

export default class Arrangement extends React.Component {
    constructor() {
        super();
        this.allEvnts = [];

    }
    render() {

      let evntList = [];

      for (let evnt of this.allEvnts) {
            evntList.push(
            <tr key={evnt.id}>
              <td className="td">{evnt.title}</td>
              <td className="td">{evnt.start.toLocaleString()}</td>
              <td className="td">{evnt.end.toLocaleString()}</td>
              <td className="td"><button onClick={() => {
                this.props.history.push('/eventinfo/' + evnt.id);
              this.forceUpdate();
            }}>Les mer</button></td>
            </tr>
          );
      }
        return (
            <div className="menu">
            <h3>Oversikt over kommende arrangementer, klikk for mer informasjon og mulighet til å melde deg interessert</h3>
              <table className="table100">
              <tbody>
                <tr>
                  <th className="th">Tittel</th>
                  <th className="th">Start dato</th>
                  <th className="th">Slutt dato</th>
                  <th className="th">Klikk</th>
                </tr>
                {evntList}
                </tbody>
              </table>
            </div>
        );
    }
    componentDidMount() {
      let signedInUser = userService.getSignedInUser();
        userService.getComingEvnts().then((result) => {
            this.allEvnts = result;
            this.forceUpdate();
      });
    }
}
