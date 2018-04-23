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
		this.allEvnts = [];
		this.kommendeVakter = [];
		this.fullforteVakter = [];
		this.userId = props.match.params.userId;
	}
//push
	render() {
		let kommendeVakterList = [];
		let fullforteVakterList = [];
		let thisTime = new Date()

		//Definerer en table row for hver kommende vakt, basert på om brukeren har godkjent vakten eller ikke
		for(let kommendeVakt of this.kommendeVakter) {
			if(kommendeVakt.godkjent == 0) {
				kommendeVakterList.push(
					<tr key={kommendeVakt.arr_rolleid}>
						<td className="td">{kommendeVakt.arrTitle}</td>
						<td className="td">{kommendeVakt.start.toLocaleString().slice(0,-3)}</td>
						<td className="td">{kommendeVakt.roleTitle}</td>
						<td className="td">{kommendeVakt.tildelt_tid.toLocaleString().slice(0,-3)}</td>
						<td className="td"><button onClick={() => {
							//Godkjenner vakten og oppdaterer kommendevakter listen
							userService.godkjennVakt(kommendeVakt.arr_rolleid).then((result) => {
								userService.getComingVaktListe(this.userId).then((result) => {
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
						<td className="td"><button onClick={() => {
							this.props.history.push('/changeshift/' + kommendeVakt.arr_rolleid)

						}}>Bytt Vakt</button></td>
					</tr>
				)
			}
		}
		//Liste for fullførte vakter der arrangament sluttdatoen er før i dag
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
				<div className="row">
					<div className="calendercolumn">
					<h2>Arrangementskalender</h2>
							<BigCalendar
							events={this.allEvnts}
							showMultiDayTimes
							defaultDate={new Date()}
							selectAble={true}
							onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}
							/>
					</div>
					<div className="column3">
						<h4>Kommende vakter</h4>
						<h5>Du må godkjenne vakten før du kan bytte</h5>
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
			);
	}
	componentDidMount() {
		userService.getAllArrangement().then((result) => {
			this.allEvnts = result;
			this.forceUpdate();
		});
		userService.getComingVaktListe(this.userId).then((result) => {
			this.kommendeVakter = result;
			this.forceUpdate();
		})
		userService.getDoneVaktListe(this.userId).then((result) => {
			this.fullforteVakter = result
			this.forceUpdate();
		})
	}
}
