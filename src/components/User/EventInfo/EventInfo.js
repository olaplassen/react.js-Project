import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class EventInfo extends React.Component {
	constructor(props) {
		super(props);
		this.arrangement = {};
		this.allSelectedRoles = [];
		this.allRoles = [];
		this.id = props.match.params.id;
		this.numberOfRoles = [];
		this.firstNumberOfRoles = [];
		this.secondNumberOfRoles = [];
		this.difference = [];
		this.eventRoller = [];
		this.state = {

			interestedUsers: {},
			users: []
		}
	}

	render() {
		let signedInUser = userService.getSignedInUser();

		let roleList = [];
		let roleListAdmin = [];
		let inc = 0;

		for (let role of this.allSelectedRoles) {
			roleList.push(<tr key={role.arr_rolleid} ><td> {role.title} </td></tr>);
		}

		for (let role of this.allRoles) {
			roleListAdmin.push(
				<tr key={role.roleid}>
					<td className="td">{role.roleid}</td>
					<td className="td">{role.title}</td>
					<td className="table">{this.numberOfRoles[inc]}</td>
					<td className="table">
						<button onClick={() => {
							this.secondNumberOfRoles[role.roleid - 1]++;
							this.forceUpdate();
						}}>+</button></td>
					<td className="table">
						<button onClick={() => {
							if (this.secondNumberOfRoles[role.roleid - 1] > 0) {
								this.secondNumberOfRoles[role.roleid - 1]--;
							}
							this.forceUpdate();
						}}>-</button></td>
				</tr>
			);
			inc++;
		}

		if (signedInUser.admin == 0) {

			return (
				<div className="menu">
					<div>
						<h1>{this.arrangement.title} informasjon side.</h1> <br />
						{this.start}
					</div> <br />
					<div>
						Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
						Oppmøte tidspunkt: {this.show} <br />
						Planlagt slutt: {this.end}
					</div> <br />
					<div style={{ width: 300 }}>
						Beskrivelse: <br />
						{this.arrangement.description} <br />
					</div>
					<div>
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table>
							<tbody>
								{roleList}
							</tbody>
						</table>
						<br />
						Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="menu">
					<div>
						<h1>{this.arrangement.title} informasjon side.</h1> <br />
						{this.start}
					</div> <br />

					<div>Interesserte brukere: {this.state.users} <br></br><button type="button" onClick={() => this.getInteressedUsers(this.arrangement.id)}>Vi interesserte</button> </div>
					<div>
						Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
						Oppmøte tidspunkt: {this.show} <br />
						Planlagt slutt: {this.end}
					</div> <br />
					<div style={{ width: 300 }}>
						Beskrivelse: <br />
						{this.arrangement.description} <br />
					</div>
					<div>
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table className="table" id="myTable">
							<tbody>
								<tr> <th className="th">Nr</th> <th className="th">Tittel</th> <th className="th">Antall</th> <th className="th">Legg til</th> <th className="th">Trekk fra</th> </tr>
								{roleListAdmin}
							</tbody>
						</table> <br />
						<button ref="endreRoller" className="button">Endre Roller</button>
						<br />
						Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}
					</div>
				</div>
			)
		}
	}

	componentDidMount() {

		let signedInUser = userService.getSignedInUser();
		userService.getArrangementInfo(this.id).then((result) => {
			this.arrangement = result;
			this.start = this.arrangement.start.toLocaleString().slice(0, -3);
			this.end = this.arrangement.end.toLocaleString().slice(0, -3);
			this.show = this.arrangement.showTime.toLocaleString().slice(0, -3);
			if (signedInUser.admin == 1) {
				userService.getEventRolleinfo(this.arrangement.id).then((result) => {
					this.eventRoller = result;
					this.forceUpdate();
				});
			}
			userService.getRolesForArr(this.arrangement.id).then((result) => {
				this.allSelectedRoles = result;
				this.forceUpdate();
			});
		});
		if (signedInUser.admin == 1) {
			userService.getAllRoles().then((result) => {
				this.allRoles = result;
				for (var i = 1; i < this.allRoles.length + 1; i++) {

					userService.getRoleCount(this.arrangement.id, i).then((result) => {
						this.numberOfRoles.push(result);
						this.firstNumberOfRoles.push(result);
						this.secondNumberOfRoles = this.numberOfRoles;
						this.forceUpdate()
					})
				}
			})

			this.refs.endreRoller.onclick = () => {

				for (var i = 0; i < this.allRoles.length; i++) {
					if (this.secondNumberOfRoles[i] != this.firstNumberOfRoles[i]) {
						this.difference.push(this.secondNumberOfRoles[i] - this.firstNumberOfRoles[i]);
					}
					else if (this.secondNumberOfRoles[i] == this.firstNumberOfRoles[i]) {
						this.difference.push(0);
					}
				}
				if (this.difference == this.firstNumberOfRoles) {
					this.props.history.push('/eventinfo/' + this.arrangement.id);

				}
				else {

					for (var i = 1; i < this.allRoles.length; i++) {
						if (this.difference[i - 1] > 0) {

							for (var y = 0; y < this.difference[i - 1]; y++) {
								userService.addRolesforArrSingle(this.arrangement.id, i).then((result) => {
								})
							}
						}
						else if (this.difference[i - 1] < 0) {

							for (var y = 0; y < -(this.difference[i - 1]); y++) {
								userService.deleteRolesfromArr(this.arrangement.id, i).then((result) => {
								});
							}
						}
					}
					userService.getAllRoles().then((result) => {
						this.allRoles = result;
						for (var i = 1; i < this.allRoles.length + 1; i++) {

							userService.getRoleCount(this.arrangement.id, i).then((result) => {
								this.numberOfRoles.push(result);
								this.firstNumberOfRoles.push(result);
								this.secondNumberOfRoles = this.numberOfRoles;
								this.forceUpdate()
							})
						}
					})
				}
			}
		}
	}

	getInteressedUsers() {
		userService.getInteressedUsers(this.arrangement.id).then((result) => {
			var users = [];
			result.forEach(function (user) {
				users.push(<li>{user.firstname + " "}<button type="button" onClick="godkjenn">Godkjenn</button></li>);
			});
			this.state.users = users;
			this.forceUpdate();
		})
	}

	// fixDate(date) {
	//   let day = date.getDate();
	//   let month = date.getMonth() + 1;
	//   let year = date.getFullYear();
	//   let hours = date.getHours();
	//   if (hours < 10) {
	//     hours = '0' + hours;
	//   }
	//   let mins = date.getMinutes();
	//   if (mins < 10) {
	//     mins = '0' + mins;
	//   }
	//
	//   let dateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + mins;
	//   return(dateTime);
	// }
}