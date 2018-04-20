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
		this.fullforteVakter = [];
		this.userId = props.match.params.userId;
	}
//push
	render() {
		let kommendeVakterList = [];
		let fullforteVakterList = [];
		let thisTime = new Date()
		for(let kommendeVakt of this.kommendeVakter) {
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
			else if(kommendeVakt.godkjent == 1) {
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
		for (let fullfort of this.fullforteVakter) {
				fullforteVakterList.push(
					<tr key={fullfort.arr_rolleid}>
						<td className="td">{fullfort.arrTitle}</td>
						<td className="td">{fullfort.start.toLocaleString().slice(0,-3)}</td>
						<td className="td">{fullfort.roleTitle}</td>
						<td className="td">{fullfort.tildelt_tid.toLocaleString().slice(0,-3)}</td>
						<td className="td">Godkjent</td>
					</tr>
				)
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
					<div className="column3">
					<h4>Kommende vakter</h4>
					<table className="table">
						<tbody>
							<tr><th className="th">Arrangement</th><th className="th">Arrangement start</th><th className="th">Rolle</th><th className="th">Tildelt tid</th><th className="th">Godkjent</th></tr>
							{kommendeVakterList}
						</tbody>
					</table>
					<h4>Fullførte vakter</h4>
					<table className="table">
						<tbody>
							<tr><th className="th">Arrangement</th><th className="th">Arrangement start</th><th className="th">Rolle</th><th className="th">Tildelt tid</th><th className="th">Godkjent</th></tr>
							{fullforteVakterList}
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
		userService.getComingVaktListe(this.userId).then((result) => {
			this.kommendeVakter = result;
			console.log(result)
			this.forceUpdate();
		})
		userService.getDoneVaktListe(this.userId).then((result) => {
			this.fullforteVakter = result;
			console.log(result)
			this.forceUpdate();
		})


	}
}
