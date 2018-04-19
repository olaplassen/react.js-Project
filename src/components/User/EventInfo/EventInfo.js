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
    this.allUsers = [];
    this.roleKomp = [];
    this.userWithRoles = [];
    this.usedUser = [];
		this.allWatchList=[];
		this.roleNoUser = [];
		this.fordeltVakter = [];
		this.interestedUsers = [];
	}

	render() {
		let signedInUser = userService.getSignedInUser();

		let interestedUserList = [];
		let roleList = [];
		let roleListAdmin = [];
		let roleUserList = [];
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
		for(let roleWithUser of this.fordeltVakter) {
			if (roleWithUser.godkjent == 0) {
				roleUserList.push(
					<tr key={roleWithUser.arr_rolleid}>
						<td className="td">{roleWithUser.title}</td>
						<td className="td">{roleWithUser.tildelt_tid.toLocaleString().slice(0,-3)}</td>
						<td className="td">{roleWithUser.firstName} {roleWithUser.lastName}</td>
						<td className="td">Ikke godjent</td>
					</tr>
					)
				}
				else if(roleWithUser.godkjent == 1) {
					roleUserList.push(
						<tr key={roleWithUser.arr_rolleid}>
							<td className="td">{roleWithUser.title}</td>
							<td className="td">{roleWithUser.tildelt_tid.toLocaleString().slice(0,-3)}</td>
							<td className="td">{roleWithUser.firstName} {roleWithUser.lastName}</td>
							<td className="td">{roleWithUser.godkjent_tid.toLocaleString().slice(0,-3)}</td>
						</tr>
					)
				}
			}

			for(let rolesForArr of this.roleNoUser) {

				roleUserList.push(
					<tr key={rolesForArr.arr_rolleid}>
						<td className="td">{rolesForArr.title}</td>
						<td className="td"></td>
						<td className="td">Ingen valgt</td>
						<td className="td">Ikke godjent</td>
					</tr>
					)
				}

			for(let interestedUser of this.interestedUsers){
				interestedUserList.push(
					<tr key={interestedUser.userId}>
					<td className="td">{interestedUser.firstname} {interestedUser.lastName}</td>
					</tr>
				)
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
					<div className="row">
					<div className="column">
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table>
							<tbody>
								{roleList}
							</tbody>
						</table>
						</div>

						<div className="column">
						<button>godkjenn</button>
						</div>
						</div>
						<div>
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
					<div>
						Oppmøte lokasjon:{this.arrangement.meetingLocation}<br />
						Oppmøte tidspunkt: {this.show} <br />
						Planlagt slutt: {this.end}
					</div> <br />
					<div style={{ width: 300 }}>
						Beskrivelse: <br />
						{this.arrangement.description} <br />
					</div>
						<h4>Roller som kreves for dette arrangementet:</h4> <br />
						<table className="table" id="myTable">
							<tbody>
								<tr> <th className="th">Nr</th> <th className="th">Tittel</th> <th className="th">Antall</th> <th className="th">Legg til</th> <th className="th">Trekk fra</th> </tr>
								{roleListAdmin}
							</tbody>
						</table> <br />
						<button ref="endreRoller" className="button">Endre Roller</button>
						<br />
						<hr />
						<div className="row">
						<div className="column1">
						<h4> Vakter som er utdelt</h4>
            <table className="table">
						<tbody>
						<tr> <th className="th">Rolle</th><th className="th">Sendt ut</th> <th className="th">Deltaker</th><th className="th">Godkjent</th> </tr>
	             {roleUserList}
						</tbody>
						</table> <br />
						</div>
						<div className="column2">
						<h4>Interesserte brukere</h4>
						<table className="table">
							<tbody>
								<tr><th className="th">Intereserte brukere</th> </tr>
								{interestedUserList}
							</tbody>
						</table>
						</div>
						</div>
						<br />
						<br />

			      <button ref="tildelRoller" className="button">Generer vaktlister</button>
						Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}
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

			userService.getRolesForArr(this.arrangement.id).then((result) => {
				this.allSelectedRoles = result;
				console.log(result)
				this.forceUpdate();
				});
			});

			userService.getRolewithUserInfo(this.id).then((result) => {
				this.fordeltVakter = result;
				console.log(result)
				this.forceUpdate();
			});
			userService.getRolesWithNoUser(this.id).then((result) => {
				this.roleNoUser = result;
				console.log(result)

				this.forceUpdate();
			})

		if(signedInUser.admin == 1) {
			userService.getInteressedUsers(this.id).then((result) => {
				this.interestedUsers = result;
				console.log(result)
				this.forceUpdate();
		});
			userService.getAllRoles().then((result) => {
				this.allRoles = result;
					for (var i = 1; i < this.allRoles.length +1; i++) {
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
				else if(this.secondNumberOfRoles[i] == this.firstNumberOfRoles[i]) {
					this.difference.push(0);
				}
			}
			if (this.difference == this.firstNumberOfRoles) {
				this.props.history.push('/eventinfo/' + this.arrangement.id);

			}
			else {
					for (var i = 1; i < this.allRoles.length; i++) {
						if (this.difference[i -1] > 0) {
							for (var y = 0; y < this.difference[i -1]; y++) {
								userService.addRolesforArrSingle(this.arrangement.id, i).then((result) => {
									userService.getRolesWithNoUser(this.arrangement.id).then((result) => {
										this.roleNoUser = result;
										this.forceUpdate();
									});
									userService.getRolewithUserInfo(this.id).then((result) => {
										this.fordeltVakter = result;
										console.log(result)
										this.forceUpdate();
									});
									userService.getRolesForArr(this.arrangement.id).then((result) => {
										this.allSelectedRoles = result;
										this.forceUpdate();
									});
								})
							}
						}
						else if(this.difference[i-1] < 0) {
							for (var y = 0; y < -(this.difference[i -1]); y++) {
								userService.deleteRolesfromArr(this.arrangement.id, i).then((result) => {
									userService.getRolesWithNoUser(this.arrangement.id).then((result) => {
										this.roleNoUser = result;
										this.forceUpdate();
									});
									userService.getRolewithUserInfo(this.id).then((result) => {
										this.fordeltVakter = result;
										console.log(result)
										this.forceUpdate();
									});
									userService.getRolesForArr(this.arrangement.id).then((result) => {
										this.allSelectedRoles = result;
										this.forceUpdate();
									});
								});
							}
						}
					}
					userService.getAllRoles().then((result) => {
						this.allRoles = result;
						for (var i = 1; i < this.allRoles.length +1; i++) {
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
			userService.getAllUsers().then((result) => {
				this.allUsers = result;
				this.forceUpdate();
				})
				this.refs.tildelRoller.onclick = () => {
				let tildeltTid = new Date();
				let usedUser = [];
				let usedEventRoles = [];
					for(let eventRolle of this.allSelectedRoles) {
						userService.getUsedUsers(eventRolle.arr_rolleid).then((result) => {
							usedUser.push(result)
						});
						userService.getUsedEventRoles(eventRolle.arrid, eventRolle.arr_rolleid).then((result) => {
							usedEventRoles.push(result)
						});
						userService.getRoleKomp(eventRolle.roleid, eventRolle.arr_rolleid).then((result) => {
							this.roleKomp= result;
						});
							for(let user of this.allUsers) {
								userService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, user.id, eventRolle.arr_rolleid).then((result) => {
									if(result.length != 0){
										this.userWithRoles = result;
									}
									for (var i = 0; i < this.allSelectedRoles.length; i++) {
										let exists = usedUser.includes(user.id);
										let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);
											if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length) {
												console.log(exists)
												usedUser.push(user.id)
												usedEventRoles.push(eventRolle.arr_rolleid)

												userService.addUserForRole(user.id, eventRolle.arr_rolleid, eventRolle.arrid, tildeltTid).then((result) => {
													userService.getRolesWithNoUser(this.arrangement.id).then((result) => {
														this.roleNoUser = result;
														this.forceUpdate();
													});
													userService.getRolewithUserInfo(this.id).then((result) => {
														this.fordeltVakter = result;
														this.forceUpdate();
													});
													this.forceUpdate();
												})
											}
										}
									})
								}
							}
						}
					}
				}

}
