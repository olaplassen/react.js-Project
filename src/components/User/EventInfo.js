import React from 'react';
import ReactDOM from 'react-dom';
import createHashHistory from 'history/createHashHistory';
import { userService } from '../../services';
import { evntService } from '../../services';
import { mailService } from '../../mailservices';

const history: HashHistory = createHashHistory();

export default class EventInfo extends React.Component {
	constructor(props) {
		super(props);
		this.evnt = {}; // dette arrangementet
    this.allSelectedRoles = []; // alle valgte roller for dette arrangementet
    this.allRoles = []; // alle roller
    this.evntId = props.match.params.id; // Arrangement id
    this.numberOfRoles = []; // ant roller av en rolle
    this.firstNumberOfRoles = [];
    this.secondNumberOfRoles = [];
    this.difference = [];
    this.allUsers = [];
    this.roleKomp = [];
    this.userWithRoles = [];
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
						<td className="td">Tildelt</td>
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
								roleService.getRolewithUserInfo(this.evnt.id).then((result) => {
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
 						<td className="td">{role.firstName} {role.lastName}</td>
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
					<button className="interesseknapp" onClick={() => {
						userService.removeInterested(signedInUser.id, this.evnt.id).then((result) => {
							userService.checkIfInteressed(signedInUser.id, this.evnt.id).then((result) => {
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
						userService.getInteressed(this.evnt.id, signedInUser.id).then((result) => {
							userService.checkIfInteressed(signedInUser.id, this.evnt.id).then((result) => {
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
							<h1>{this.evnt.title} informasjon side.</h1>
							<table>
									<tbody>
									<tr>
										<td>Arrangemetet starter</td>
										<td>{this.start}</td>
									</tr>
									<tr>
										<td>Oppmøte sted</td>
										<td>{this.evnt.meetingLocation}</td>
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
										<td>{this.evnt.contactPerson}</td>
									</tr>
									<tr>
										<td className="beskrivelse">Beskrivelse</td>
										<td className="beskrivelsetekst">{this.evnt.description}</td>
									</tr>
								</tbody>
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
								<tr>
									<th className="th">Rolle</th>
									<th className="th">Tildelt</th>
									<th className="th">Status</th>
								</tr>
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
							<h1>{this.evnt.title} informasjon side.</h1>
							<table>
								<tbody>
									<tr>
										<td>Arrangemetet starter</td>
										<td>{this.start}</td>
									</tr>
									<tr>
										<td>Oppmøte sted</td>
										<td>{this.evnt.meetingLocation}</td>
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
										<td>{this.evnt.contactPerson}</td>
									</tr>
									<tr>
										<td className="beskrivelse">Beskrivelse</td>
										<td className="beskrivelsetekst">{this.evnt.description}</td>
									</tr>
								</tbody>
							</table>
							<button ref="endreInfo" className="button3" onClick={() => {this.props.history.push('/changevent/' + this.evnt.id)}}>Endre Informasjon</button>
						</div>
					<br />

						<div className="column2">
							<h4>Interesserte brukere</h4>
							<table>
								<tbody>
										{interestedUserList}
								</tbody>
							</table>
						</div>
					</div>
					<hr />

					<div className="row">
						<div className="roller">
							<h4>Roller som er lagt til for dette arrangementet</h4>
							<div ref="error"></div>
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
							<button ref="endreRoller" className="button3">Endre Roller</button>
						</div>

						<div className="tildelvakter">
							<h4>Utdelte vakter</h4>
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
							<button ref="tildelRoller" className="button3">Generer vaktlister</button>
						</div>
					</div>
				</div>
			)
		}
	}

	componentDidMount() {

		let signedInUser = userService.getSignedInUser();

		//henter Arrangement info
		evntService.getEvntInfo(this.evntId).then((result) => {
			this.evnt = result;
			//gjør om datoer med tid til leservennlige strings
			this.start = this.evnt.start.toLocaleString().slice(0, -3);
			this.end = this.evnt.end.toLocaleString().slice(0, -3);
			this.show = this.evnt.showTime.toLocaleString().slice(0, -3);
			//henter alle roller valgt for dette arrangementet
			roleService.getRolesForArr(this.evnt.id).then((result) => {
				this.allSelectedRoles = result;
				this.forceUpdate();
				});
				//sjekker om innlogget bruker er interessert i dette arrangementet
				userService.checkIfInteressed(signedInUser.id, this.evnt.id).then((result) => {
					this.userIsInterested = result;
					this.forceUpdate();
				});
			});
			//henter alle roller for dette arrangementet som er fordelt til brukere
			roleService.getRolewithUserInfo(this.evntId).then((result) => {
				this.fordeltVakter = result;
				this.forceUpdate();
			});
			//henter alle rollene for dette arrangementet som ikke har blitt fordelt til bruker
			roleService.getRolesWithNoUser(this.evntId).then((result) => {
				this.roleNoUser = result;
				this.forceUpdate();

			});

		if(signedInUser.admin == 1) {
			//henter alle interesserte for dette arrangementet
			userService.getInteressedUsers(this.evntId).then((result) => {
				this.interestedUsers = result;
				console.log(this.interestedUsers)
				this.forceUpdate();
			});
			//henter alle roller i databasen i stigende id rekkefølge
			roleService.getRoles().then((result) => {
				this.allRoles = result;
				this.forceUpdate();
					for (var i = 1; i < this.allRoles.length +1; i++) {
					//henter ant roller valgt per rolle før endring. 'i' er her id til rollen
					roleService.getRoleCount(this.evnt.id, i).then((result) => {
						//setter to ant roller arrays like hverandre for å sammenligne de etter at ant roller er endret
						console.log(result)
						this.numberOfRoles.push(result);
						this.firstNumberOfRoles.push(result);
						this.secondNumberOfRoles = this.numberOfRoles;


						this.forceUpdate()
					})
				}
			});
			this.refs.endreRoller.onclick = () => {
			//sjekker om ant roller pr rolle har endret seg og pusher differansen inn i en array
			for (var i = 0; i < this.allRoles.length; i++) {
				if (this.secondNumberOfRoles[i] != this.firstNumberOfRoles[i]) {
					this.difference.push(this.secondNumberOfRoles[i] - this.firstNumberOfRoles[i]);

				}
				//ingen differanse
				else if(this.secondNumberOfRoles[i] == this.firstNumberOfRoles[i]) {
					this.difference.push(0);

				}
				}

			if (this.difference == [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]) {
				this.refs.error.textContent = "ingen endring i roller";


			}

			else {
					for (var u = 1; u < this.allRoles.length + 1; u++) {

						if (this.difference[u - 1] > 0) {
							for (var y = 0; y < this.difference[u - 1]; y++) {
								roleService.addRolesforArrSingle(this.evnt.id, u).then((result) => {
									this.difference = []
									roleService.getRolesWithNoUser(this.evnt.id).then((result) => {
										this.roleNoUser = result;
										this.forceUpdate();
									});
									roleService.getRolewithUserInfo(this.evntId).then((result) => {
										this.fordeltVakter = result;
										this.forceUpdate();
									});
									roleService.getRolesForArr(this.evnt.id).then((result) => {
										this.allSelectedRoles = result;
										this.forceUpdate();
									});
								})
							}
						}
						else if(this.difference[u-1] < 0) {
							for (var y = 0; y < -(this.difference[u -1]); y++) {
								roleService.deleteRolesfromArr(this.evnt.id, u).then((result) => {
									this.difference = []
									roleService.getRolesWithNoUser(this.evnt.id).then((result) => {
										this.roleNoUser = result;
										this.forceUpdate();
									});
									roleService.getRolewithUserInfo(this.evntId).then((result) => {
										this.fordeltVakter = result;
										this.forceUpdate();
									});
									roleService.getRolesForArr(this.evnt.id).then((result) => {
										this.allSelectedRoles = result;
										this.forceUpdate();
									});

								});
							}
						}
						this.firstNumberOfRoles = [];
						this.secondNumberOfRoles = [];
						this.numberOfRoles = [];
						roleService.getRoleCount(this.evnt.id, u).then((result) => {
							//setter to ant roller arrays like hverandre for å sammenligne de etter at ant roller er endret
							this.numberOfRoles.push(result);
							this.firstNumberOfRoles.push(result);
							this.secondNumberOfRoles = this.numberOfRoles;
							this.forceUpdate();
						})

					}
				}

			}
			//henter alle brukere i databasen
			userService.getAllUsers().then((result) => {
				this.allUsers = result;
				this.forceUpdate();
				})
				//her tildeles roller automatisk, basert på om de er interesserte, vaktpoeng, passive og om de har kompetanse
				this.refs.tildelRoller.onclick = () => {
					console.log(this.allSelectedRoles)
				//variabel for når vakten blir tildelt bruker
				let tildeltTid = new Date();
				let usedUser = []; //brukere som allerede har blitt valgt i arrangementet
				let usedEventRoles = []; //alle roller i arrangementet som har blitt tildelt roller
					//går gjennom alle valget roller for arrangementet
					for(let eventRolle of this.allSelectedRoles) {
						console.log(eventRolle)
						userService.getUsedUsers(eventRolle.arr_rolleid).then((result) => {
							//sjekker om brukere har blitt valgt for dette arrangementet fra før
							usedUser.push(result)
						});
						userService.getUsedEventRoles(eventRolle.arrid, eventRolle.arr_rolleid).then((result) => {
							usedEventRoles.push(result)
							//sjekker om rollen har blitt tildelt user fra før
						});
						userService.getRoleKomp(eventRolle.roleid, eventRolle.arr_rolleid).then((result) => {
							this.roleKomp= result;
							//henter kompetansen for rollen i for-of loopen
						});
						//kjører gjennom interesserte brukere
						for(let interestedUser of this.interestedUsers) {
							console.log(interestedUser)
							userService.isUserPassive(interestedUser.userId, this.evnt.id).then((result) => {
								this.userPassive = result;
								//sjekker om interesserte bruker er passiv under dette arrangementet
								})
							roleService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, interestedUser.userId, eventRolle.arr_rolleid).then((result) => {
								//henter interesserte brukers kompetanse for denne spesifike rollen, length av denne vil være ant. kurs i denne rollen
								this.userWithRoles = result;

								let exists = usedUser.includes(interestedUser.userId); // variabel for om brukeren har rolle i arrangementet
								let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid); // variabel for om rollen er tildelt bruker

								// console.log(exists)
								// console.log(hasUser)
								// console.log(this.userPassive.length)
								// console.log(this.roleKomp.length)
								// console.log(this.userWithRoles.length)
								if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length && this.userPassive.length == 0) { //bruker har ikke rolle, rollen har ikke bruker, brukeren har riktig kompetanse og brukeren er ikke passiv
									usedUser.push(interestedUser.userId) //legger til bruker slik at den ikke kan bli valgt igjen
									usedEventRoles.push(eventRolle.arr_rolleid);

									roleService.addUserForRole(interestedUser.userId, eventRolle.arr_rolleid, eventRolle.arrid, tildeltTid).then((result) => { //legger til bruker id for denne rollen
										console.log("interesert")
										console.log(interestedUser)
										// let email = interestedUser.email;
										// let subject = "Røde Kors ny vakt"
							      // let textmail = "Du har blitt kalt for vakt til " + this.evnt.title + " den " + this.evnt.start.toLocaleString() + ". Logg inn i systemet for å godkjenn vakten.";
							      // //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
							      // mailService.sendMail(email, subject, textmail);
										userService.userPassive(this.evnt.start, this.evnt.end, interestedUser.userId).then((result) => {
											//legger til passiv periode for brukeren i arrangement perioden, så bruker ikke kan blir valgt til flere arrangementer som foregår likt
											this.forceUpdate();
										})
										userService.addPoints(interestedUser.userId).then((result) =>{
											//legger til vaktpoeng
										})
										//oppdateter utdelte vakter listen
										roleService.getRolesWithNoUser(this.evnt.id).then((result) => {
											this.roleNoUser = result;
											console.log(result)
											this.forceUpdate();
										});
										roleService.getRolewithUserInfo(this.evntId).then((result) => {
											this.fordeltVakter = result;
											this.forceUpdate();
										});
									})
								}
							})
						}
						//når alle kompatible interesserte brukere er valgt, kjøres det gjennom brukere
						for(let user of this.allUsers) {
							userService.isUserPassive(user.id, this.evnt.id).then((result) => {
								this.userPassive = result;
								})
							roleService.getUserRoleKomp(eventRolle.roleid, eventRolle.arrid, user.id, eventRolle.arr_rolleid).then((result) => {
								if(result.length != 0){
									this.userWithRoles = result;
								}
								let exists = usedUser.includes(user.id);
								let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);
								if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length && this.userPassive.length == 0) {

									usedUser.push(user.id)
									usedEventRoles.push(eventRolle.arr_rolleid)

									roleService.addUserForRole(user.id, eventRolle.arr_rolleid, eventRolle.arrid, tildeltTid).then((result) => {
										console.log("user")
										// let email = interestedUser.email;
										// let subject = "Røde Kors ny vakt"
							      // let textmail = "Du har blitt kalt for vakt til " + this.evnt.title + " den " + this.evnt.start.toLocaleString() + ". Logg inn i systemet for å godkjenn vakten.";
							      // //kjører sendMail funksjon fra mailservices.js som sender mail med passord subject til brukerens email.
							      // mailService.sendMail(email, subject, textmail);
										userService.userPassive(this.evnt.start, this.evnt.end, user.id).then((result) => {
											console.log(result)
											this.forceUpdate();
										})
										userService.addPoints(user.id).then((result) =>{
											console.log(result)
										})
										roleService.getRolesWithNoUser(this.evnt.id).then((result) => {
											this.roleNoUser = result;
											this.forceUpdate();
										});
										roleService.getRolewithUserInfo(this.evntId).then((result) => {
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

}
