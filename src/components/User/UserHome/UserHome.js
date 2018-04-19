import React from 'react';
import ReactDOM from 'react-dom';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class UserHome extends React.Component {
	constructor(props) {
		super(props);
		this.allEvents = [];
		this.kommendeVakter = [];
		this.userId = props.match.params.userId;
		console.log(this.userId)
	}

	render() {
		let kommendeVakterList = [];
		for(let kommendeVakt of this.kommendeVakter) {
			console.log(kommendeVakt)
			if(kommendeVakt.godkjent == 0) {
				kommendeVakterList.push(
					<tr key={kommendeVakt.arr_rolleid}>
					<td className="td">{kommendeVakt.arrTitle}</td>
					<td className="td">{kommendeVakt.start.toLocaleString().slice(0,-3)}</td>
					<td className="td">{kommendeVakt.roleTitle}</td>
					<td className="td">{kommendeVakt.tildelt_tid.toLocaleString().slice(0,-3)}</td>
					<td className="td"><button onClick={() => {
						userService.godkjennVakt(kommendeVakt.arr_rolleid).then((result) => {
							userService.getUserVaktListe(this.userId).then((result) => {
								this.kommendeVakter = result;
								this.forceUpdate();
							})

						})
					}}>Godkjenn</button></td>
					</tr>
				)
			}
			else {
				kommendeVakterList.push(
					<tr key={kommendeVakt.arr_rolleid}>
					<td className="td">{kommendeVakt.arrTitle}</td>
					<td className="td">{kommendeVakt.start.toLocaleString().slice(0,-3)}</td>
					<td className="td">{kommendeVakt.roleTitle}</td>
					<td className="td">{kommendeVakt.tildelt_tid.toLocaleString().slice(0,-3)}</td>
					<td className="td">Godkjent</td>
					</tr>
				)
			}
		}
		return (
			<div className="menu">
				<div className="row">
					<div className="calendercolumn">
							<BigCalendar
							events={this.allEvents}
							showMultiDayTimes
							defaultDate={new Date()}
							selectAble={true}
							onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}
							/>
					</div>
					<div className="column">
					<h4>Kommende vakter</h4>
					<table className="table">
						<tbody>
							<tr> <th className="th">Arrangement</th><th className="th">Arrangement start</th><th className="th">Rolle</th><th className="th">Tildelt tid</th><th className="th">Godkjent</th></tr>
							{kommendeVakterList}
						</tbody>
					</table>

					</div>
				</div>
			</div>
		);
	}
	componentDidMount() {
		userService.getAllArrangement().then((result) => {
			this.allEvents = result;
			this.forceUpdate();
		});
		userService.getUserVaktListe(this.userId).then((result) => {
			this.kommendeVakter = result;
			this.forceUpdate();
		})
	}
}
