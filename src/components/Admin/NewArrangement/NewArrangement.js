import React from 'react';
import ReactDOM from 'react-dom';
import VirtualizedSelect from 'react-virtualized-select';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

export default class NewArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allRoles: [],
            roles: [],
            selectedRoles: [],
            selectedSingleValue: null
        }
        this.allMals = [];
        this.lastArr = [];
        this.rolesForArr = [];
        this.allRoles = [];
        this.numberOfRoles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    render() {

        let inc = 0;

        let vaktmalList = [];
        let roleList = [];

        for (let role of this.allRoles) {
            roleList.push(
                <tr key={role.roleid}>
                    <td className="td">{role.roleid}</td>
                    <td className="td">{role.title}</td>
                    <td className="table">{this.numberOfRoles[inc]}</td>
                    <td className="table">
                        <button onClick={() => {
                            this.numberOfRoles[role.roleid - 1]++;
                            this.forceUpdate();
                        }}>+</button></td>
                    <td className="table">
                        <button onClick={() => {
                            if (this.numberOfRoles[role.roleid - 1] > 0) {
                                this.numberOfRoles[role.roleid - 1]--;
                            }
                            this.forceUpdate();
                        }}>-</button></td>
                </tr>
            );

            inc++;
        }

        for (let vaktmal of this.allMals) {
            vaktmalList.push({ value: vaktmal.vaktmalId, label: vaktmal.vaktmalTittel }, );
        }
        const { selectValue } = this.state;

        return (
            <div className="blokk">
              <h2>Lag nytt arrangement</h2>
                <div className="row">
                  <div className="arrform">
                    <form>
                      <table>
                        <tr>
                          <td>Arrangementnavn</td>
                          <td><input className="input" ref="arrName" placeholder="Skriv inn navnet på arrangementet"></input></td>
                        </tr>
                        <tr>
                          <td>Møtelokasjon</td>
                          <td><input className="input" ref="arrMeetingLocation" placeholder="Skriv inn møtelokasjon"></input></td>
                        </tr>
                        <tr>
                          <td>Utstyrsliste</td>
                          <td><input className="input" ref="arrGearList" placeholder="Skriv inn utstyrsliste"></input></td>
                        </tr>
                        <tr>
                          <td>Kontaktperson og tlf</td>
                          <td><input className="input" ref="arrContactPerson" placeholder="Skriv inn ekstern kontaktperson"></input></td>
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
                          <td><input className="input" type='datetime-local' ref="arrShowTime" placeholder="Skriv inn oppmøtetidspunkt(YYYY-MM-DD TT:MM)"></input></td>
                        </tr>
                        <tr>
                          <td>Start tidspunkt</td>
                          <td><input className="input" type='datetime-local' ref="arrStartTime" placeholder="Skriv inn startidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input></td>
                        </tr>
                        <tr>
                          <td>Slutt tidspunkt</td>
                          <td><input className="input" type='datetime-local' ref="arrEndTime" placeholder="Skriv inn sluttidspunkt for arrangementet(YYYY-MM-DD TT:MM)"></input></td>
                        </tr>
                        <tr>
                          <td className="beskrivelse">Beskrivelse av arrangementet</td>
                          <td><textarea className="input" ref="arrDescription" placeholder="Skriv inn nærmere beskrivelse på arrangementet"></textarea></td>
                        </tr>
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

    addRolesforArrWidthMal(result, arrid) {
        for (let role of result) {
            userService.addRolesforArr(arrid, role.roleid, role.vaktmalid).then((result) => {
            });
        }
    }

    addRolesforArrWidthMal(result, arrid) {
        for (let role of result) {
            userService.addRolesforArr(arrid, role.roleid, role.vaktmalid).then((result) => {
            });
        }
    }

    registerArrangement(selectValue, roleListLength) {
        userService.addArrangement(this.refs.arrName.value, this.refs.arrDescription.value, this.refs.arrMeetingLocation.value,
            this.refs.arrContactPerson.value, this.refs.arrShowTime.value, this.refs.arrStartTime.value,
            this.refs.arrEndTime.value, this.refs.arrGearList.value).then((result) => {

                this.refs.arrName.value = "";
                this.refs.arrDescription.value = "";
                this.refs.arrMeetingLocation.value = "";
                this.refs.arrContactPerson.value = "";
                this.refs.arrShowTime.value = "";
                this.refs.arrStartTime.value = "";
                this.refs.arrEndTime.value = "";
                this.refs.arrGearList.value = "";

            });

        userService.getLastArrangement().then((result) => {
            this.lastArr = result;
            if (selectValue != undefined) {
                userService.getRolesForMal(selectValue.value).then((result) => {
                    this.addRolesforArrWidthMal(result, this.lastArr.id);

                });
            }
            else if (selectValue == undefined) {
                for (let i = 1; i < roleListLength; i++) {
                    if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML != 0) {

                        if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML > 1) {
                            for (var y = 0; y < document.getElementById("myTable").rows[i].cells.item(2).innerHTML; y++) {
                                userService.addRolesforArrSingle(this.lastArr.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => {

                                })
                            }
                        }
                        else if (document.getElementById("myTable").rows[i].cells.item(2).innerHTML == 1) {
                            userService.addRolesforArrSingle(this.lastArr.id, document.getElementById("myTable").rows[i].cells.item(0).innerHTML).then((result) => {

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
            this.props.history.push('/eventinfo/' + this.lastArr.id);
        })
    }

    componentDidMount() {

        userService.getVaktmal().then((result) => {
            this.allMals = result;
            this.forceUpdate();
        });

        userService.getRole().then((result) => {
            this.allRoles = result;
            this.forceUpdate();
        });
    }
}
