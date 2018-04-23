import React from 'react';
import ReactDOM from 'react-dom';
import VirtualizedSelect from 'react-virtualized-select';
import { userService } from '../../services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

export class RegistrationFeltArrangementTime extends React.Component {
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
				<input className={"input " + (this.props.validert ? "gyldig" : "ugyldig")} onChange={this.validerFelt} value={this.props.verdi} placeholder={this.props.felttype} type='datetime-local'/>

				<br />
			</div>

		);
	}
}

export class RegistrationFeltArrangement extends React.Component {
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
				<input className={"input " + (this.props.validert ? "gyldig" : "ugyldig")} onChange={this.validerFelt} value={this.props.verdi} placeholder={this.props.felttype}/>

				<br />
			</div>

		);
	}
}

export default class NewArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allRoles: [],
            roles: [],
            selectedRoles: [],
            selectedSingleValue: null,
            arrnameValid: false,
      			arrnameVerdi: '',
            meetinglocationValid: false,
      			meetinglocationVerdi: '',
            gearlistValid: false,
            gearlistVerdi: '',
            contactpersonValid: false,
            contactpersonVerdi: '',
            descriptionValid: false,
            descriptionVerdi: '',
            showtimeValid: false,
            showtimeVerdi:'',
            starttimeValid: false,
            starttimeVerdi:'',
            endtimeValid: false,
            endtimeVerdi:'',

        }
        // bruker .bind(this) for å få med innholdet videre
        this.validerarrnameFelt = this.validerarrnameFelt.bind(this);
        this.validermeetinglocationFelt = this.validermeetinglocationFelt.bind(this);
        this.validergearlistFelt = this.validergearlistFelt.bind(this);
        this.validercontactpersonFelt = this.validercontactpersonFelt.bind(this);
        this.validershowtimeFelt = this.validershowtimeFelt.bind(this);
        this.validerstarttimeFelt = this.validerstarttimeFelt.bind(this);
        this.validerendtimeFelt = this.validerendtimeFelt.bind(this);


        this.allMals = []; // alle vaktmaler
        this.addedEvnt = []; // eventet som blir opprettet
        this.rolesForArr = []; // roller for arangementet
        this.allRoles = []; //alle roller i databasen
        this.numberOfRoles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // ant roller
    }
    render() {

        let inc = 0; // variabel for definere hvile rolle per table row

        let vaktmalList = [];
        let roleList = [];

        for (let role of this.allRoles) {
            roleList.push(
                <tr key={role.roleid}>
                    <td className="td">{role.roleid}</td>
                    <td className="td">{role.title}</td>
                    <td className="table">{this.numberOfRoles[inc]}</td>
                    <td className="table">
                        <button onClick={() => { // legger til rolle i array
                            this.numberOfRoles[role.roleid - 1]++;
                            this.forceUpdate();
                        }}>+</button></td>
                    <td className="table">
                        <button onClick={() => { // fjerner rolle i array
                            if (this.numberOfRoles[role.roleid - 1] > 0) {
                                this.numberOfRoles[role.roleid - 1]--;
                            }
                            this.forceUpdate();
                        }}>-</button></td>
                </tr>
            );

            inc++;
        }

        for (let vaktmal of this.allMals) { // liste over alle malier brukt i VirtualizedSelect
            vaktmalList.push({ value: vaktmal.vaktmalId, label: vaktmal.vaktmalTittel }, );
        }
        const { selectValue } = this.state; // valgt vaktmal

        return (
            <div className="blokk">
              <h2>Lag nytt arrangement</h2>
              <h4>Bruk vaktmal for å velge roller, eller egendefiner med tabellen til høyre</h4>
                <div className="row">
                  <div className="arrform">
                    <form>
                      <table>
                        <tbody>
                          <tr>
                            <td>Tittel</td>
                            <td><RegistrationFeltArrangement validert={this.state.arrnameValid} verdi={this.state.arrnameVerdi} regexValidering={this.validerarrnameFelt} felttype="Skriv inn navn på arrangement" /></td>
 <div className="errormessage" ref="errorarrname"></div>
                           </tr>

                          <tr>
                            <td>Møte lokasjon</td>
                            <td><RegistrationFeltArrangement validert={this.state.meetinglocationValid} verdi={this.state.meetinglocationVerdi} regexValidering={this.validermeetinglocationFelt} felttype="Skriv inn navn på møteplass" /></td>
                          </tr>
                          <div className="errormessage" ref="errormeetinglocation"></div>
                          <tr>
                            <td>Utstyrsliste</td>
                            <td><RegistrationFeltArrangement validert={this.state.gearlistValid} verdi={this.state.gearlistVerdi} regexValidering={this.validergearlistFelt} felttype="Skriv inn utstyrsliste" /></td>
                            </tr>
                          <div className="errormessage" ref="errorgearlist"></div>
                          <tr>
                            <td>Kontaktperson og tlf</td>
                            <td><RegistrationFeltArrangement validert={this.state.contactpersonValid} verdi={this.state.contactpersonVerdi} regexValidering={this.validercontactpersonFelt} felttype="Skriv inn ekstern kontaktperson" /></td>
                             <div className="errormessage" ref="errorcontactperson"></div>
                          </tr>
                          <tr>
                            <td>Vaktlistemal </td>
                            <td><VirtualizedSelect
                                clearable={true}
                                removeSelected={false}
                                multi={false}
                                options={vaktmalList}
                                onChange={(selectValue) => this.setState({ selectValue })}
                                value={selectValue}
                                placeholder="Velg vaktmal, eller egendefiner roller i tabellen" /></td>
                          </tr>
                          <tr>
                            <td>Oppmøte tidspunkt</td>
                            <td><RegistrationFeltArrangementTime validert={this.state.showtimeValid} verdi={this.state.showtimeVerdi} regexValidering={this.validershowtimeFelt} felttype="Skriv inn utstyrsliste" /></td>

                          </tr>
                          <div className="errormessage" ref="errorshowtime"></div>
                          <tr>
                            <td>Start tidspunkt</td>
                            <td><RegistrationFeltArrangementTime validert={this.state.starttimeValid} verdi={this.state.starttimeVerdi} regexValidering={this.validerstarttimeFelt} felttype="Skriv inn utstyrsliste" /></td>
                            <div className="errormessage" ref="errorstarttime"></div>
                          </tr>
                          <tr>
                            <td>Slutt tidspunkt</td>
                            <td><RegistrationFeltArrangementTime validert={this.state.endtimeValid} verdi={this.state.endtimeVerdi} regexValidering={this.validerendtimeFelt} felttype="Skriv inn utstyrsliste" /></td>
                            <div className="errormessage" ref="errorendtime"></div>
                          </tr>
                          <tr>
                            <td>Beskrivelse</td>
                            <td><textarea className="input" ref="arrDescription" placeholder="Skriv inn nærmere beskrivelse på arrangementet"></textarea></td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  </div>

                  <div className="arrtabell">

                      <table className="table" id="myTable">
                          <tbody>
                              <tr>
                                <th className="th">Nr</th>
                                <th className="th">Tittel</th>
                                <th className="th">Antall</th>
                                <th className="th">Legg til</th>
                                <th className="th">Trekk fra</th>
                              </tr>
                              {roleList}
                          </tbody>
                      </table>

                  </div>

                </div>
                <button className="button3" ref="newArrButton" onClick={() =>
                  this.registerArrangement(selectValue, roleList.length)}>Opprett arrangement
                </button>
            </div>
        );
    }
    // funksjoner som validerer input i newArrangement
    validerarrnameFelt(arrnameVerdi) {
  		// etter var regex så defineres hva som skal være tillatt i inputboksen
  		var regex = /^[a-zæøå ]{2,}$/i;
  		var arrnameValid = regex.test(arrnameVerdi);
  		this.setState({arrnameValid, arrnameVerdi});
  		}
    validermeetinglocationFelt(meetinglocationVerdi) {
    		// etter var regex så defineres hva som skal være tillatt i inputboksen
    		var regex = /^[a-zæøå ]{2,}$/i;
    		var meetinglocationValid = regex.test(meetinglocationVerdi);
    		this.setState({meetinglocationValid, meetinglocationVerdi});
    		}
    validergearlistFelt(gearlistVerdi) {
      		// etter var regex så defineres hva som skal være tillatt i inputboksen
      		var regex = /^[a-zæøå ]{2,}$/i;
      		var gearlistValid = regex.test(gearlistVerdi);
      		this.setState({gearlistValid, gearlistVerdi});
      		}
    validercontactpersonFelt(contactpersonVerdi) {
            		// etter var regex så defineres hva som skal være tillatt i inputboksen
            		var regex = /^[a-zæøå 0-9]{2,}$/i;
            		var contactpersonValid = regex.test(contactpersonVerdi);
            		this.setState({contactpersonValid, contactpersonVerdi});
            		}
    validershowtimeFelt(showtimeVerdi) {
                        		// etter var regex så defineres hva som skal være tillatt i inputboksen
                        		var regex = (/^(\d{4})\-(\d{2})\-(\d{2})[T](\d{2}):(\d{2})$/);
                        		var showtimeValid = regex.test(showtimeVerdi);
                            this.setState({showtimeValid, showtimeVerdi});
                        		}

   validerstarttimeFelt(starttimeVerdi) {
          // etter var regex så defineres hva som skal være tillatt i inputboksen
        var regex = (/^(\d{4})\-(\d{2})\-(\d{2})[T](\d{2}):(\d{2})$/);
        var starttimeValid = regex.test(starttimeVerdi);
        this.setState({starttimeValid, starttimeVerdi});
      }

    validerendtimeFelt(endtimeVerdi) {
               // etter var regex så defineres hva som skal være tillatt i inputboksen
             var regex = (/^(\d{4})\-(\d{2})\-(\d{2})[T](\d{2}):(\d{2})$/);
             var endtimeValid = regex.test(endtimeVerdi);
              this.setState({endtimeValid, endtimeVerdi});
                                                    }
    addRolesforArrWidthMal(result, evntId) { //legger til alle roller i arrangementet fra vaktmalen
        for (let role of result) {
            userService.addRolesforArr(evntId, role.roleid, role.vaktmalid).then((result) => {
            });
        }
    }

    registerArrangement(selectValue, roleListLength) { // legger til arrangementet i databasen

      this.refs.errorarrname.textContent = "";
      this.refs.errormeetinglocation.textContent = "";
      this.refs.errorcontactperson.textContent= "";
      this.refs.errorgearlist.textContent = "";
      this.refs.errorshowtime.textContent="";
      this.refs.errorstarttime.textContent="";
      this.refs.errorendtime.textContent="";

      if(this.state.arrnameValid == false) {
        this.refs.errorarrname.textContent="Arrangementnavn kan bare inneholde bokstaver og må fylles ut"
        return false;
      }
      else if (this.state.contactpersonValid == false ){
        this.refs.errorcontactperson.textContent="Møtelokasjon kan bare inneholde bokstaver og må fylles ut"
        return false;
      }
      else if (this.state.contactpersonValid == false) {
        this.refs.errorcontactperson.textContent="Kontaktperson og mobilnummer kan bare inneholde tall og bokstaver og må fylles ut"
        return false;
      }
      else if (this.state.gearlistValid == false){
        this.refs.errorgearlist.textContent="Utstyrsliste kan bare inneholde tall og bokstaver og må fylles ut"
        return false;
      }
      else if (this.state.showtimeVerdi == false){
        this.refs.errorshowtime.textContent="Tid og dato for oppmøtetidspunkt må fylles ut"
        return false;
      }
      else if (this.state.starttimeVerdi == false){
        this.refs.errorstarttime.textContent="Tid og dato for oppmøtetidspunkt må fylles ut"
        return false;
      }
      else if (this.state.endtimeVerdi == false){
        this.refs.errorendtime.textContent="Tid og dato for oppmøtetidspunkt må fylles ut"
        return false;
      }



      else {


        userService.addArrangement(this.state.arrnameVerdi, this.refs.arrDescription.value, this.state.meetinglocationVerdi,
            this.state.contactpersonVerdi, this.state.showtimeVerdi, this.state.starttimeVerdi,
            this.state.endtimeVerdi, this.state.gearlistVerdi).then((result) => {

                this.state.arrnameVerdi = "";
                this.refs.arrDescription.value = "";
                this.state.meetinglocationVerdi = "";
                this.state.contactpersonVerdi= "";
                this.state.showtimeVerdi = "";
                this.state.starttimeVerdi = "";
                this.state.endtimeVerdi = "";
                this.state.gearlistVerdi = "";

            })
          };

        userService.getLastArrangement().then((result) => { //henter arrangementet som ble opprettet
            this.addedEvnt = result;
            if (selectValue != undefined) { //vaktmal er valgt
                userService.getRolesForMal(selectValue.value).then((result) => {
                    this.addRolesforArrWidthMal(result, this.addedEvnt.id); //legger til roller for arrangementet med vaktmal

                });
            }
            else if (selectValue == undefined) { //vaktmal er ikke valgt, benytter tabellen for å legge til roller
                for (let i = 1; i < roleListLength; i++) {
                    if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML != 0) {//når antall kolonnen i tabellen ikke er 0

                        if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML > 1) {//antall kolonnen er større en 1
                            for (var y = 1; y < document.getElementById("myTable").rows[i].cells.item(2).innerHTML; y++) { //ant ganger denne rollen skal legges til
                                userService.addRolesforArrSingle(this.addedEvnt.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => { //legger til rollen i arrangementet

                                })
                            }
                        }
                        else if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML == 1) {//rollen skal legges til 1 gang
                            userService.addRolesforArrSingle(this.addedEvnt.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => {

                            })
                        }
                    }
                    else {
                        console.log("Ingen av denne typen ble valgt");

                    }
                }
            }
            else {
                console.log("ingenting skjedde")
            }
            this.props.history.push('/eventinfo/' + this.addedEvnt.id);
        })
    }

    componentDidMount() {

        userService.getVaktmal().then((result) => { //henter alle vaktmaler
            this.allMals = result;
            this.forceUpdate();
        });

        userService.getRole().then((result) => {//henter alle roller
            this.allRoles = result;
            this.forceUpdate();
        });
    }
}