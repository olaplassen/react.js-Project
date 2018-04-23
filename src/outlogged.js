import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './components/Services/UserService';
import { skillService } from './components/Services/SkillService';
import { roleService } from './components/Services/RoleService';
import { interestService } from './components/Services/InterestService';
import { evntService } from './components/Services/Evntservice';
import { checkLogInUser } from './app';
import { checkLogInAdmin } from './app';


// class for navigasjons meny
export class StartMenu extends React.Component {
 render() {
   return (
     <div className="menu">
      <ul className="ul">
       <li className="li"><Link to ='/login' className="link">Logg inn</Link></li>
       <li className="li"><Link to ='/registration' className="link">Registrering</Link></li>
      </ul>
      </div>
   );
 }
}
//
export class Login extends React.Component {
  render() {
    return (
      <div>
      <h1 className="h1">Velkommen</h1>
      <img className="img" src={'src/img/rkors.jpg'} />
      <div className="login">
        <input className="loginInput" ref="username" placeholder="Type your username"></input><br/>
        <input className="loginInput" type="password" ref="password" placeholder="Type your password"></input><br/><br/>
        <div ref="error"></div>
        <button className="button" ref="loginBtn">Login</button> <br/>

        <Link to='/newPassword'>Forgot password</Link> <br/>

      </div>
      </div>
    );
  }
  componentDidMount() {


		this.refs.loginBtn.onclick = () => {
			userService.loginUser(this.refs.username.value, this.refs.password.value).then((result) => {
        let variabel = localStorage.getItem('passwordResult'); // Get User-object from browser
        if(!variabel ) return null;
        let correctPassword = JSON.parse(variabel)


        if (result != undefined && result.confirmed == true && correctPassword == true) {
					// når resultatet fra LoginUser er undefined avsluttes funkjsonen
					//slik at loginAdmin kjøres

					if (result.admin == true) {
						let admin = {
							adminId: result.id

						}


						checkLogInAdmin(admin);
					}
					else {
						// oppretter array for user med id slik at verdien kan sendes til den nye
						// reactDOM'en. userId settes lik id fra resultatet fra spørringen i services.
						let user = {
							userId: result.id

						}


						checkLogInUser(user);
					}
				}
				else {
          if (result.godkjent != 1 && correctPassword == true) {
            this.refs.error.textContent= "Din bruker er deaktivert, eller venter på godkjenning";
            localStorage.clear();
          }
          else {
            this.refs.error.textContent = "Feil brukernavn eller passord";
            localStorage.clear();
          }
        }
			})

		}
	}
}
//lager egen class for å validere og skjule passord
export class RegistrationFeltPassword extends React.Component {
	constructor() {
		super();
		this.validerFelt = this.validerFelt.bind(this);
	}

	validerFelt(e) {
		this.props.regexValidering(e.target.value);
	}

	render() {
		return (
			<div>
				<input className={"input " + (this.props.validert ? "gyldig" : "ugyldig")} onChange={this.validerFelt} value={this.props.verdi} placeholder={this.props.felttype} type="password"/>
				<br />
			</div>
		);
	}
}
export class RegistrationFelt extends React.Component {
	constructor() {
		super();
		this.validerFelt = this.validerFelt.bind(this);
	}

	validerFelt(e) {
		this.props.regexValidering(e.target.value);
	}

	render() {
		return (
			<div>
				<input className={"input " + (this.props.validert ? "gyldig" : "ugyldig")} onChange={this.validerFelt} value={this.props.verdi} placeholder={this.props.felttype} />
				<br />
			</div>
		);
	}
}
// class for å validere og registrere potensiell bruker.
export class Registration extends React.Component {

	constructor() {
		super();
		this.state = {
			// setter state for validering av inputs av brukerregistrering.
			firstnameValid: false,
			firstnameVerdi: '',
      lastnameValid: false,
      lastnameVerdi: '',
      addressValid: false,
      addressVerdi: '',
      phonenuberValid: false,
			phonenumberVerdi: '',
      emailaddressValid: false,
      emailaddressVerdi:'',
      usernameValid: false,
      usernameVerdi: '',
      passwordValid: false,
      passwordVerdi: '',
			passwordconfirmValid: false,
			passwordconfirmVerdi:''
		}
// her bindes innholdet som kan brukes senere i classen for validering
		this.validerfornavnFelt = this.validerfornavnFelt.bind(this); // fornavn felt
    this.valideretternavnFelt= this.valideretternavnFelt.bind(this); // etternavn felt
    this.valideraddressFelt= this.valideraddressFelt.bind(this); // addresse felt
    this.validerphonenumberFelt= this.validerphonenumberFelt.bind(this); // Telefonnummer felt
    this.valideremailaddressFelt= this.valideremailaddressFelt.bind(this); // epost felt
    this.validerusernameFelt= this.validerusernameFelt.bind(this); // brukernavn felt
    this.validerpasswordFelt= this.validerpasswordFelt.bind(this); // passord felt
		this.validerpasswordconfirmFelt= this.validerpasswordconfirmFelt.bind(this); // bekrefte passord felt

  }

	render() {

		// registrerings skjemaet som skrives ut under registrerings komponenten.
		return (
			<div className="blokk">
      <h2>Fyll inn nødvendig informasjon</h2>
      <h4>Boksene blir grønne når riktig informasjon er fyllt inn</h4>
				<form>
          <table>
            <tbody>
              <tr>
                <td>Fornavn</td>
                <td><RegistrationFelt validert={this.state.firstnameValid} verdi={this.state.firstnameVerdi} regexValidering={this.validerfornavnFelt} felttype="Fornavn" /></td>
                <td className="errormessage" ref="errorfirstname"></td>
              </tr>
              <tr>
                <td>Etternavn</td>
                <td><RegistrationFelt validert={this.state.lastnameValid} verdi={this.state.lastnameVerdi} regexValidering={this.valideretternavnFelt} felttype="Etternavn" /></td>
                <td className="errormessage" ref="errorlastname"></td>
              </tr>
              <tr>
                <td>Adresse</td>
                <td><RegistrationFelt validert={this.state.addressValid} verdi={this.state.addressVerdi} regexValidering={this.valideraddressFelt} felttype="Addresse" /></td>
                <td className="errormessage" ref="erroraddress"></td>
              </tr>
              <tr>
                <td>Postnummer</td>
                <td><input className="input" ref="newPostnr" placeholder="Postnummer"></input></td>
              </tr>
              <tr>
                <td>Poststed</td>
                <td><input className="input" ref="newPoststed" placeholder="Poststed"></input></td>
              </tr>
              <tr>
                <td>Telefonnummer</td>
                <td><RegistrationFelt validert={this.state.phonenumberValid}  verdi={this.state.phonenumberVerdi} regexValidering={this.validerphonenumberFelt} felttype="Telefonnummer" /></td>
                <td className="errormessage" ref="errorphonenumber"></td>
              </tr>
              <tr>
                <td>Epost</td>
                <td><RegistrationFelt validert={this.state.emailaddressValid}  verdi={this.state.emailaddressVerdi} regexValidering={this.valideremailaddressFelt} felttype="Epostadresse" /></td>
                <td className="errormessage" ref="erroremailaddress"></td>
              </tr>
              <tr>
                <td>Brukernavn</td>
                <td><RegistrationFelt validert={this.state.usernameValid}  verdi={this.state.usernameVerdi} regexValidering={this.validerusernameFelt} felttype="Brukernavn" /></td>
                <td className="errormessage" ref="errorusername"></td>
              </tr>
              <tr>
                <td>Passord</td>
                <td><RegistrationFeltPassword validert={this.state.passwordValid}  verdi={this.state.passwordVerdi} regexValidering={this.validerpasswordFelt} felttype="Passord" /></td>
                <td className="errormessage" ref="errorpassword"></td>
              </tr>
              <tr>
                <td>Bekreft passord</td>
                <td><RegistrationFeltPassword validert={this.state.passwordconfirmValid}  verdi={this.state.passwordconfirmVerdi} regexValidering={this.validerpasswordconfirmFelt} felttype="Bekrefte passord" /></td>
                <td ></td>
              </tr>
            </tbody>
          </table>
				<button className="button" ref="newUserbtn">Submit</button>
				</form>
			</div>
		);
	}
//validering av fornavnsfeltet
	validerfornavnFelt(firstnameVerdi) {
		// etter "var regex" så defineres det hva som skal være tillatt i inputboksen
		var regex = /^[a-zæøå ]{2,}$/i;
		var firstnameValid = regex.test(firstnameVerdi);
		this.setState({firstnameValid, firstnameVerdi});
		}
//validering av etternavnsfeltet
  valideretternavnFelt(lastnameVerdi) {
		var regex = /^[a-zæøå ]{2,}$/i;
		var lastnameValid = regex.test(lastnameVerdi);
    this.setState({lastnameValid, lastnameVerdi});
	}
	//validering av addressefeltet
  valideraddressFelt(addressVerdi) {
		var regex = /^[a-zæøå 0-9]{2,}$/i;
		var addressValid = regex.test(addressVerdi);
    this.setState({addressValid, addressVerdi});
	}
//validering av telefonnummerfeltet
  validerphonenumberFelt(phonenumberVerdi) {
    var regex = /^[0-9]{8,8}$/i;
    var phonenumberValid = regex.test(phonenumberVerdi);
    this.setState({phonenumberValid, phonenumberVerdi});
  }
//validering av epostaddressefeltet
  valideremailaddressFelt(emailaddressVerdi) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailaddressValid = regex.test(emailaddressVerdi);
    this.setState({emailaddressValid, emailaddressVerdi});
  }
	//validering av brukernavnfeltet
  validerusernameFelt(usernameVerdi) {
    var regex = /^[a-zæøå 0-9]{2,}$/i;
    var usernameValid = regex.test(usernameVerdi);
    this.setState({usernameValid, usernameVerdi});
  }
	//validering av passordfeltet
  validerpasswordFelt(passwordVerdi) {
    var regex = /^[a-zæøå 0-9]{6,}$/i;
    var passwordValid = regex.test(passwordVerdi);
    this.setState({passwordValid, passwordVerdi});
  }
	//validering av bekreft passordfeltet
	validerpasswordconfirmFelt(passwordconfirmVerdi) {
    var passwordconfirmValid = /^[a-zæøå 0-9]{6,}$/i;
		var passwordconfirmValid = passwordconfirmVerdi;
    this.setState({passwordconfirmValid, passwordconfirmVerdi});
  }



	//funksjon for oprette path historie for å sende bruker til ny side
	nextPath(path) {
		this.props.history.push(path);
	}


	//rendrer på nytt og lagrer dataen brukeren har ført inn i databasen
	componentDidMount() {


		this.refs.newUserbtn.onclick = () => {
			// resetter input når man trykker onclick
			this.refs.errorfirstname.textContent="";
 		 this.refs.errorlastname.textContent="";
		 this.refs.erroraddress.textContent="";
		 this.refs.errorphonenumber.textContent="";
		 this.refs.erroremailaddress.textContent="";
		 this.refs.errorusername.textContent="";
		 this.refs.errorpassword.textContent="";
		 this.refs.errorpasswordconfirm.textContent="";
// validering av inputs
			if(this.state.firstnameValid == false){//fornavn
this.refs.errorfirstname.textContent="Fornavnet kan bare inneholde bokstaver og må fylles ut"

			}
		else	if(this.state.lastnameValid == false){//etternavn

				this.refs.errorlastname.textContent="Etternavnet kan bare inneholde bokstaver og må fylles ut"
			}
		else	if(this.state.addressValid == false){//addresse

				this.refs.erroraddress.textContent="Adressa kan bare inneholde bokstaver og tall og må fylles ut"
			}
		else	if(this.state.phonenumberValid == false){//Telefonnummer

		this.refs.errorphonenumber.textContent="Telefonummeret kan bare inneholde 8 tall og må fylles ut"
			}
		else	if(this.state.emailaddressValid == false){//epostaddresse

			this.refs.erroremailaddress.textContent="Epostadressa er ikke gyldig og må fylles ut"
			}
		else	if(this.state.usernameValid == false){// brukernavn

				this.refs.errorusername.textContent="Brukernavnet kan bare inneholde bokstaver og tall og må fylles ut"
			}
		else	if(this.state.passwordValid == false){//passord

				this.refs.errorpassword.textContent="Passordet må inneholde minst seks tegn og må fylles ut"
			}
			else if(this.state.passwordVerdi != this.state.passwordconfirmVerdi) {//bekreftpassord
				this.refs.errorpasswordconfirm.textContent="Passordene matcher ikke"
			}
			else {
				//legges inn hvis alle inputs er true
			userService.addUser(this.state.firstnameVerdi, this.state.lastnameVerdi, this.state.addressVerdi, Number(this.refs.newPostnr.value), this.refs.newPoststed.value,
				this.state.phonenumberVerdi, this.state.emailaddressVerdi, this.state.usernameVerdi, this.state.passwordVerdi).then((result) => {

					this.state.firstnameVerdi = "";
					this.state.lastnameVerdi = "";
					this.state.addressVerdi= "";
          this.state.phonenumberVerdi = "";
					this.state.emailaddressVerdi = ""
					this.state.usernameVerdi= "";
					this.state.passwordVerdi = "";
					this.nextPath('/login'); // sender user til login page etter registrering

				});
			}
		}
		// henter postestedet fra databasen når brukeren skriver inn postnummer
	this.refs.newPostnr.oninput = () => {

			userService.getPoststed(this.refs.newPostnr.value).then((result) => {
				if (this.refs.newPostnr.value.length < 1) {
					this.refs.newPoststed.value = "";
				}
				else {
					for (let place of result) {
						  this.refs.newPoststed.value = place.poststed;


					}
				}
			});
		}
	}
}
// Class for å sende nytt passord til brukeren via mail
export class NewPassword extends React.Component {
	render() {
		return (
			<div className="menu">
				<h3>Reset password</h3>
				<input className="input" ref="username" placeholder="Type your username"></input><br />
				<input className="input" ref="email" placeholder="Type your email"></input><br />
				<button className="button" ref="newPasswordbtn">Request</button>
			</div>
		);
	}
	//sender bruker til ny komponent etter at brukeren har spurt etter nytt passord
	nextPath(path) {
		this.props.history.push(path);
	}

	componentDidMount() {
		this.refs.newPasswordbtn.onclick = () => {
			userService.resetPassword(this.refs.username.value, this.refs.email.value).then((result) => {
				//når username og email matcher med en user i databsen og resultatet ikke er null
				// sendes bruker til ny komponent
				if (result != null) {
					this.nextPath('/passwordsendt')
				}
			});
		}
	}
}

export class NewPasswordSendt extends React.Component {
	render() {
		return (
			<div className="menu">
				Ditt nye passord har nå blitt sendt til din email adresse. <br />
				<Link to="/login">Tilbake til login</Link>
			</div>
		)
	}
}
