import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';
import { mailService } from '../../../mailservices';

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
		this.roleNoUser = [];
		this.fordeltVakter = [];
		this.interestedUsers = [];
		this.userIsInterested = [];
		this.state = {
      activeUser: null,
	   	users: [],
			interessedUser: [],
			showInterestedText: false

		}
	}


	render() {
		let signedInUser = userService.getSignedInUser();

		let roleListUser = [];
		let roleListAdmin = [];
		let roleUserList = [];
		let interestedUserList = [];
		let isInterestedList = [];
		let inc = 0;



		for (let role of this.fordeltVakter) {

			if (role.godkjent == 0 && role.userid != signedInUser.id) {
				 roleListUser.push(
					<tr key={role.arr_rolleid}>
						<td className="td">{role.title}</td>
						<td className="td">Ikke godjent</td>
					</tr>
					)
				}
				else if (role.godkjent == 0 && role.userid == signedInUser.id) {
					roleListUser.push(
 					<tr key={role.arr_rolleid}>
 						<td className="td">{role.title}</td>
 						<td className="td">{role.tildelt_tid.toLocaleString()}</td>
						<td className="td"><button onClick={() => {
							userService.godkjennVakt(role.arr_rolleid).then((result) => {
								userService.getRolewithUserInfo(this.arrangement.id).then((result) => {
									this.fordeltVakter = result;
									this.forceUpdate();
								});
							})
						}}>Godkjenn</button></td>
 					</tr>
 					)
				}
				else if (role.godkjent == 1 && role.userid != signedInUser.id) {
					roleListUser.push(
 					<tr key={role.arr_rolleid}>
 						<td className="td">{role.title}</td>
 						<td className="td">{role.firstName}{role.lastName}</td>
						<td className="td">Godkjent</td>
 					</tr>
 					)
				}
				else{
					roleListUser.push(
					<tr key={role.arr_rolleid}>
						<td className="td">{role.title}</td>
						<td className="td">Din vakt</td>
						<td className="td">Godkjent</td>
					</tr>
				)
				}
		}
		for (let roleNoUser of this.roleNoUser) {
				roleListUser.push(
				<tr key={roleNoUser.arr_rolleid}>
					<td className="td">{roleNoUser.title}</td>
					<td className="td">Ikke tildelt</td>
					<td className="td">Ikke Godkjent</td>
				</tr>
				)
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
					<td>{interestedUser.firstname} {interestedUser.lastName}</td>
					</tr>
				)
			}

				if (this.userIsInterested.length != 0) {
					isInterestedList.push(<div key={signedInUser.id}>
					<button classname="interesseknapp" onClick={() => {
						userService.removeInterested(signedInUser.id, this.arrangement.id).then((result) => {
							userService.checkIfInteressed(signedInUser.id, this.arrangement.id).then((result) => {
								this.userIsInterested = result;
								this.forceUpdate();
							});
						})
					}}>Fjern interesse</button>
						<div>
							Du har meldt interessert for dette arrangementet.
						</div>
					</div>
				)
				}
				else if(this.userIsInterested.length == 0) {
					isInterestedList.push(<div key={signedInUser.id}>
					<button className="interesseknapp" onClick={() => {
						userService.getInteressed(this.arrangement.id, signedInUser.id).then((result) => {
							userService.checkIfInteressed(signedInUser.id, this.arrangement.id).then((result) => {
								this.userIsInterested = result;
								this.forceUpdate();
							});
						})
					}}>Meld interesse</button> <br />
						<div>
							Du har ikke meldt interesse for dette arrangementet.
						</div>
					</div>
				)
				}
		if (signedInUser.admin == 0) {

			return (
				<div className="blokk">

					<div className="row">
						<div className="beskrivelsetabell">
							<h1>{this.arrangement.title} informasjon side.</h1>
							<table>
								<tr>
									<td>Arrangemetet starter</td>
									<td>{this.start}</td>
								</tr>
								<tr>
									<td>Oppmøte sted</td>
									<td>{this.arrangement.meetingLocation}</td>
								</tr>
								<tr>
									<td>Oppmøte tidspunktn</td>
									<td>{this.show}</td>
								</tr>
								<tr>
									<td>Planlagt slutt</td>
									<td>{this.end}</td>
								</tr>
								<tr>
									<td>Kontaktperson</td>
									<td>{this.arrangement.contactPerson}</td>
								</tr>
								<tr>
									<td className="beskrivelse">Beskrivelse</td>
									<td className="beskrivelsetekst">{this.arrangement.description}</td>
								</tr>
							</table>
						</div>
						<div  className="interesse">
							{isInterestedList}
						</div>
					</div>
					<hr />

					<div>
						<h4>Roller som kreves for dette arrangementet:</h4>
						<table className="table">
							<tbody>
								{roleListUser}
							</tbody>
						</table>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="blokk">
					<div className="row">
						<div className="beskrivelsetabell">
							<h1>{this.arrangement.title} informasjon side.</h1>
							<table>
								<tr>
									<td>Arrangemetet starter</td>
									<td>{this.start}</td>
								</tr>
								<tr>
									<td>Oppmøte sted</td>
									<td>{this.arrangement.meetingLocation}</td>
								</tr>
								<tr>
									<td>Oppmøte tidspunktn</td>
									<td>{this.show}</td>
								</tr>
								<tr>
									<td>Planlagt slutt</td>
									<td>{this.end}</td>
								</tr>
								<tr>
									<td>Kontaktperson</td>
									<td>{this.arrangement.contactPerson}</td>
								</tr>
								<tr>
									<td className="beskrivelse">Beskrivelse</td>
									<td className="beskrivelsetekst">{this.arrangement.description}</td>
								</tr>
							</table>
						</div>
					<br />

						<div className="column2">
							<h4>Interesserte brukere</h4>
							<table>
									{interestedUserList}
							</table>
						</div>
					</div>
					<hr />

					<div className="row">
						<div className="roller">
							<h4>Roller som kreves for dette arrangementet</h4>
								<table className="tabellroller" id="myTable">
									<tbody>
										<tr>
											<th className="th">Nr</th>
											<th className="th">Tittel</th>
											<th className="th">Antall</th>
											<th className="th">Legg til</th>
											<th className="th">Trekk fra</th>
										</tr>
										{roleListAdmin}
									</tbody>
								</table>
							<button ref="endreRoller" className="button">Endre Roller</button>
						</div>

						<div className="tildelvakter">
							<h4> Vakter som er utdelt</h4>
            	<table className="tabellvakter">
								<tbody>
									<tr>
										<th className="th">Rolle</th>
										<th className="th">Sendt ut</th>
										<th className="th">Deltaker</th>
										<th className="th">Godkjent</th>
									</tr>
	           			{roleUserList}
								</tbody>
							</table>
							<button ref="tildelRoller" className="button">Generer vaktlister</button>
						</div>
					</div>
				</div>
			)
		}
	}

	componentDidMount() {

		let signedInUser = userService.getSignedInUser();
		this.setState({
				activeUser: userService.getSignedInUser()["id"],
        interessedUser: userService.checkIfInteressed()

		});

		userService.getArrangementInfo(this.id).then((result) => {
			this.arrangement = result;
			this.start = this.arrangement.start.toLocaleString().slice(0, -3);
			this.end = this.arrangement.end.toLocaleString().slice(0, -3);
			this.show = this.arrangement.showTime.toLocaleString().slice(0, -3);
			userService.getRolesForArr(this.arrangement.id).then((result) => {
				this.allSelectedRoles = result;
				this.forceUpdate();
				});
				userService.checkIfInteressed(signedInUser.id, this.arrangement.id).then((result) => {
					this.userIsInterested = result;
					this.forceUpdate();
				});
			});
			userService.getRolewithUserInfo(this.id).then((result) => {
				this.fordeltVakter = result;
				this.forceUpdate();
			});
			userService.getRolesWithNoUser(this.id).then((result) => {
				this.roleNoUser = result;
				this.forceUpdate();

			});

			userService.getRolesForArr(this.arrangement.id).then((result) => {
				this.allSelectedRoles = result;
});
		if(signedInUser.admin == 1) {
			userService.getInteressedUsers(this.id).then((result) => {
				this.interestedUsers = result;
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
			});
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
						let u = 0;
						for(let interestedUser of this.interestedUsers) {
							userService.isUserPassive(interestedUser.userId, this.arrangement.id).then((result) => {
								this.userPassive = result;
								})
							userService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, interestedUser.userId, eventRolle.arr_rolleid).then((result) => {
								if(result.length != 0){
									this.userWithRoles = result;
								}
								let exists = usedUser.includes(interestedUser.userId);
								let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);
								if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length && this.userPassive.length == 0) {
									usedUser.push(interestedUser.userId)
									usedEventRoles.push(eventRolle.arr_rolleid)

									userService.addUserForRole(interestedUser.userId, eventRolle.arr_rolleid, eventRolle.arrid, tildeltTid).then((result) => {
										console.log("interesert")
										// let email = interestedUser.email;
										// let subject = "Røde Kors ny vakt"
							      // let textmail = "Du har blitt kalt for vakt til " + this.arrangement.title + " den " + this.arrangement.start.toLocaleString() + ". Logg inn i systemet for å godkjenn vakten.";
							      // //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
							      // mailService.sendMail(email, subject, textmail);
										userService.userPassive(this.arrangement.start, this.arrangement.end, interestedUser.userId).then((result) => {
											console.log(result)
											this.forceUpdate();
										})
										userService.addPoints(interesteduser.userId).then((result) =>{
											console.log(result)
										})
										userService.getRolesWithNoUser(this.arrangement.id).then((result) => {
											this.roleNoUser = result;
											this.forceUpdate();
										});
										userService.getRolewithUserInfo(this.id).then((result) => {
											this.fordeltVakter = result;
											this.forceUpdate();
										});
									})
								}
							})
						}
						for(let user of this.allUsers) {
							userService.isUserPassive(user.id, this.arrangement.id).then((result) => {
								this.userPassive = result;
								})
							userService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, user.id, eventRolle.arr_rolleid).then((result) => {
								if(result.length != 0){
									this.userWithRoles = result;
								}
								let exists = usedUser.includes(user.id);
								let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);
								if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length && this.userPassive.length == 0) {

									usedUser.push(user.id)
									usedEventRoles.push(eventRolle.arr_rolleid)

									userService.addUserForRole(user.id, eventRolle.arr_rolleid, eventRolle.arrid, tildeltTid).then((result) => {
										console.log("user")
										// let email = interestedUser.email;
										// let subject = "Røde Kors ny vakt"
							      // let textmail = "Du har blitt kalt for vakt til " + this.arrangement.title + " den " + this.arrangement.start.toLocaleString() + ". Logg inn i systemet for å godkjenn vakten.";
							      // //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
							      // mailService.sendMail(email, subject, textmail);
										userService.userPassive(this.arrangement.start, this.arrangement.end, user.id).then((result) => {
											console.log(result)
											this.forceUpdate();
										})
										userService.addPoints(user.id).then((result) =>{
											console.log(result)
										})
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
							})
						}
					}
				}
			}
		};
	getInteressed(arrangementId, userId) {
		this.setState({ showInterestedText: !this.state.showInterestedText });;
    userService.checkIfInteressed(this.state.activeUser, this.arrangement.id).then((result) => {
			this.state.interessedUser = result;
			this.forceUpdate();
				if(this.state.interessedUser == 0){
					this.state.activeUser = userId;
		       	userService.getInteressed(arrangementId, userId).then((result) => {
		          this.forceUpdate();
		       	})
					}
				else {
					alert("du er allerede registrert som interessert")
				}
			})
		};
}
