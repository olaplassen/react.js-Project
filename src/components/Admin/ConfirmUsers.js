import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import { Link } from 'react-router-dom';

export default class ConfirmUsers extends React.Component {

	constructor() {
		super();
		this.allUnConformed = [];
		this.allShiftChange = [];
	}

	render() {
		let signedInUser = userService.getSignedInUser()
		let unConfirmedList = []; // array for å skrive ut alle brukere som ikke er godkjent
		let unConfirmedShift = [];
		let tildelt_tid = new Date()

		for (let unConfirmed of this.allUnConformed) {//her pushes alle ikke godkjente brukere inn i arrayen.
			unConfirmedList.push(<li key={unConfirmed.id}>
				<Link to={'/mypage/' + unConfirmed.id}>{unConfirmed.firstName} {unConfirmed.lastName}</Link><br />
				Tlf: {unConfirmed.phone}<br />
				Epost: {unConfirmed.email} <br />
				<button className="godkjennBtn" onClick={() => this.confirmUser(unConfirmed.id)}>Godkjenn</button>
				<hr /></li>)

		}
		for(let shiftChange of this.allShiftChange) { //VaktBytte liste, skriver ut informasjon om et vaktbytte

			unConfirmedShift.push(
				<tr key={shiftChange.arr_rolleid}>
				<td className="td">{shiftChange.title}</td>
				<td className="td">{shiftChange.oldfirstName}{shiftChange.oldlastName}</td>
				<td className="td">{shiftChange.newfirstName}{shiftChange.newlastName}</td>
				<td className="td"><button onClick={() => {
					userService.godkjennBytte(shiftChange.newUserid, shiftChange.arr_rolleid, tildelt_tid).then((result) => { // godkjenner bytte og oppdaterer brukerid for rollen
						userService.getShiftChangeInfo().then((result) => { //oppdaterer listen
							this.allShiftChange = result;
							this.forceUpdate();
							userService.addPoints(shiftChange.newUserid).then((result) =>{ // gir vaktpoeng til ny bruker
								})
							userService.removePoints(shiftChange.oldUserid).then((result) => { // fjerner vaktpoeng fra gammel bruker
								})
						})
					})
				}}>Godkjenn bytte</button></td>
				</tr>
			)
		}

		return (

			<div className="menu">
				<h2>Deaktiverte/Ikke godkjente brukere</h2>
				{unConfirmedList}

				<h2>Ikke godkjente vaktbytter</h2>
					<table className="table">
						<tbody>
							<tr>
								<th className="th">Arrangement</th>
								<th className="th">Nåværende bruker</th>
								<th className="th">Øsnker bytte med</th>
								<th className="th">Godkjenn</th>
							</tr>
							{unConfirmedShift}
						</tbody>
					</table>
			</div>
		);
	}

	componentDidMount() {

		userService.unConfirmedUsers().then((result) => { // henter deaktiverte/ubekreftede brukere
			this.allUnConformed = result;
			this.forceUpdate();
		});
		userService.getShiftChangeInfo().then((result) => { //henter vaktbyter
			this.allShiftChange = result;
		  this.forceUpdate();
		})
	}

	// funksjon for når godkjenn knappen klikkes
	// henter listen på nytt for å oppdatere listen når en bruker godkjennes
	confirmUser(id) {
		this.id = id;
		userService.confirmUser(this.id).then((result) => {
			this.forceUpdate();

			userService.unConfirmedUsers().then((result) => {
				this.allUnConformed = result;
				this.forceUpdate();
			});
		});
	}
}
