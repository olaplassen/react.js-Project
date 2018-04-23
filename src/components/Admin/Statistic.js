import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import createHashHistory from 'history/createHashHistory';
import { Link } from 'react-router-dom';
const history: HashHistory = createHashHistory();


export default class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.userShiftInfo = []; //Vakt statistikk
        this.state = { value: '' }; //søk verdi
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
      let statisticList = [];

      for(let userInfo of this.userShiftInfo){
        statisticList.push(
          <tr key={userInfo.id}>
          <td className="td">{userInfo.id}</td>
          <td className="td"><Link to={'/userStatistic/' + userInfo.id}>{userInfo.firstName} {userInfo.lastName}</Link></td>
          <td className="td">{userInfo.vaktpoeng}</td>
          <td className="td">{userInfo.roleCount}</td>
          </tr>
        )
      }
        return (
            <div className="menu">
            <h2>Statistikk om brukeres deltagelse på arrangementer for Røde Kors</h2>
            <div>
                <input type="text" className="input" placeholder="Søk etter navn her" value={this.state.value} onChange={this.handleChange} />
                <table className="table100">
                    <tbody>
                        <tr>
                          <th className="th">Medlemsnummer</th>
                          <th className="th">Navn</th>
                          <th className="th">Vaktpoeng</th>
                          <th className="th">Antall Vakter siste 2 mnd</th>
                        </tr>
                        {statisticList}
                    </tbody>
                </table>
            </div>
            </div>
        );
    }

    componentDidMount() {
      userService.shiftInfo2mnd().then((result) => { //henter informasjon om alle brukere sin vakt statistikk de siste 2 mnd
        this.userShiftInfo = result;
        this.forceUpdate();
      })
    }
    handleChange(event) { //søkefunksjon
        if (event.target.value != undefined) {
            this.setState({ value: event.target.value.toUpperCase() });//setter state til input value
            userService.shiftInfo2mndSearch(event.target.value).then((result) => { //henter vakt statistikk for brukere som matcher søke verdi
                this.userShiftInfo = result;
                this.forceUpdate();
            });
        }

    }
}
