import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import { Link } from 'react-router-dom';
export default class ConfirmUsers extends React.Component {
	
	constructor() {
		super();
		this.allUnConformed = [];
	}

	render() {
		let signedInUser = userService.getSignedInUser()
		let unConfirmedList = []; // array for å skrive ut alle brukere som ikke er godkjent
		//her pushes alle ikke godkjente brukere inn i arrayen.
		for (let unConfirmed of this.allUnConformed) {
			unConfirmedList.push(<li key={unConfirmed.id}><Link to={'/mypage/' + unConfirmed.id}>{unConfirmed.firstName} {unConfirmed.lastName}</Link> {unConfirmed.phone + " " + unConfirmed.email} <button className="confirmBtn" onClick={() => this.confirmUser(unConfirmed.id)}>Godkjenn</button> <hr /></li>)

		}
		return (

			<div className="menu">
				Ikke godkjente brukere <br />
				{unConfirmedList}
			</div>
		);
	}

	componentDidMount() {
		userService.unConfirmedUsers().then((result) => {
			this.allUnConformed = result;
			this.forceUpdate();
		});
	}

	// funksjon for når godkjenn knappen klikkes
	// henter listen på nytt for å oppdatere listen når en user godkjennes
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