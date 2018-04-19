import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import { Link } from 'react-router-dom';

// Then import the virtualized Select HOC
import VirtualizedSelect from 'react-virtualized-select'

export default class MyPage extends React.Component {
    constructor(props) {
        super(props);
        this.user = {}
        this.id = props.match.params.userId;
        this.state = {
            showchangePassword: false,
            showDeactivateText: false
        }
        this.updateShowState = this.updateShowState.bind(this);
        this.allSkills = [];
        this.yourSkills = [];
        this.values = [];
        this.testSkill = [];
    }

    updateShowState() {
        this.setState({ showchangePassword: !this.state.showchangePassword });
        this.setState({ showDeactivateText: !this.state.showDeactivateText });
    }

    changeHandler(selectValue) {

        let ref = 0;
        this.dateRef = {}
        this.inputList = [];
        this.dateInputList = [];
        for (let skill of selectValue) {
            userService.getSkillInfo(skill.value).then((result) => {
                if (result.duration === 0) {
                    this.inputList.push(<tr key={skill.value}><td> {skill.label} </td><td>Dette kurset har ingen utløpsdato</td></tr>);
                }
                else if (result.duration != 0 && this.dateInputList.length > 0) {
                    this.setState(selectValue.splice(-1, 1));
                    alert('Registrer ' + this.selectedSkillWithDate + ' før du legger til flere kurs med utløpsdato.');
                }
                else {
                    ref++;
                    this.dateRef = ref;
                    this.dateInputList.push(<tr key={skill.value} ><td> {skill.label} </td><td>, Legg til utløpsdato:<input ref={(ref) => this.dateRef = ref} type='date' /></td></tr>);
                }
                this.forceUpdate()
            });
        }
    }

    render() {
        let signedInUser = userService.getSignedInUser();

        let skillList = [];
        let yourSkillList = [];

        for (let yourskill of this.yourSkills) {
            if (yourskill.validTo != null) {
                yourSkillList.push(
                    <tr key={yourskill.skillid}>
                        <td className="td">{yourskill.title}</td>
                        <td className="table">{yourskill.validTo.toDateString()}</td>
                        <td className="table">
                            <button onClick={() => {
                                userService.deleteSkill(this.user.id, yourskill.skillid).then((result) => {
                                    userService.getYourSkills(this.user.id).then((result) => {

                                        this.yourSkills = result;
                                        this.forceUpdate();
                                    });
                                })
                            }}>Slett</button></td>
                    </tr>
                );
            }
            else {
                yourSkillList.push(
                    <tr key={yourskill.skillid}>
                        <td className="td">{yourskill.title}</td>
                        <td className="table">Ingen utløpsdato</td>
                        <td className="table">
                            <button onClick={() => {
                                userService.deleteSkill(this.user.id, yourskill.skillid).then((result) => {
                                    userService.getYourSkills(this.user.id).then((result) => {

                                        this.yourSkills = result;
                                        this.forceUpdate();
                                    });
                                })
                            }}>Slett</button></td>
                    </tr>
                );
            }
        }

        for (let skill of this.allSkills) {
            userService.checkUserSkill(this.user.id, skill.skillid).then((result) => {
                if (result == undefined) {
                    skillList.push({ value: skill.skillid, label: skill.title }, );
                }
            });
        }

        const { selectValue } = this.state;

        if (signedInUser.admin == 0) {
            return (
                <div>
                    <div className="menu">
                        <h2> {this.user.firstName} {this.user.lastName}</h2>
                        <div> Epost: {this.user.email} </div>
                        <div> Mobilnummer: {this.user.phone} </div>
                        <div> Adresse: {this.user.address} </div>
                        <Link to={'/changeUser/' + this.user.id}>Endre opplysninger</Link>
                        <div> Brukernavn: {this.user.userName}</div>
                        <div> Passord: ********</div>

                        <button onClick={this.updateShowState}>Klikk her for å endre passord</button>
                        {this.state.showchangePassword ?
                            <div>
                                <input ref="newpassword" type="password" /> <br />
                                <input ref="verifypassword" type="password" /> <br />
                            </div>
                            :
                            null
                        }
                        <button ref="changepasswordbtn">Lagre</button>
                    </div>

                    <div className="menu">
                        <h1> Mine Kompetanser og kurs </h1> <br />
                        <h3> Legg til dine kurs </h3> <br />
                        OBSOBS du kan ikke legge til flere enn et kurs med utløpsdato om gangen. <br />

                        <VirtualizedSelect
                            autoFocus
                            clearable={true}
                            removeSelected={true}
                            multi={true}
                            options={skillList}
                            onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler(selectValue))}
                            value={selectValue}
                        />
                        <table>
                            <tbody>
                                {this.inputList}
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                                {this.dateInputList}
                            </tbody>
                        </table>
                        <button ref="addSkill" onClick={() => this.registerSkills(selectValue)}>Registrer</button>

                        <h2>Dine Kurs</h2> <br />

                        <table className="table" id="myTable">
                            <tbody>
                                <tr> <th className="th">Tittel</th> <th className="th">Utløpsdato</th> <th className="th">Fjern Kurs</th> </tr>
                                {yourSkillList}
                            </tbody>
                        </table> <br />
                    </div>
                </div>
            );
        }
        else if (signedInUser.admin == 1) {
            return (
                <div>
                    <div className="menu">
                        <button ref="deaktiverUser" onClick={this.updateShowState} className="button">Deaktiver</button>
                        {this.state.showDeactivateText ?
                            <div>
                                <h2>{this.user.firstName} {this.user.lastName} er deaktiver.</h2>
                            </div>
                            :
                            null
                        }
                        <h2>Dette er personalia siden for {this.user.firstName} {this.user.lastName}</h2>
                        <div> Epost: {this.user.email} </div>
                        <div> Mobilnummer: {this.user.phone} </div>
                        <div> Adresse: {this.user.address} </div>

                        <Link to={'/changeUser/' + this.user.id}>Endre opplysninger</Link>
                        <div> Brukernavn: {this.user.userName}</div>
                        <div> Passord: ********</div>


                        <button onClick={this.updateShowState}>Klikk her for å endre passord</button>
                        {this.state.showchangePassword ?
                            <div>
                                <input ref="newpassword" type="password" /> <br />
                                <input ref="verifypassword" type="password" /> <br />
                            </div>
                            :
                            null
                        }
                        <button ref="changepasswordbtn">Lagre</button>
                    </div>

                    <div className="menu">
                        <h1> Oversikt over kurs og kompetanser for {this.user.firstName} {this.user.lastName} </h1> <br />
                        <h3> Legg til kurs </h3> <br />
                        OBSOBS du kan ikke legge til flere en et kurs med utløpsdato om gangen. <br />

                        <VirtualizedSelect
                            autoFocus
                            clearable={true}
                            removeSelected={true}
                            multi={true}
                            options={skillList}
                            onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler(selectValue))}
                            value={selectValue}
                        />
                        <table>
                            <tbody>
                                {this.inputList}
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                                {this.dateInputList}
                            </tbody>
                        </table>
                        <button ref="addSkill" onClick={() => this.registerSkills(selectValue)}>Registrer</button>

                        <h2>Deres Kurs</h2> <br />

                        <table className="table" id="myTable">
                            <tbody>
                                <tr> <th className="th">Tittel</th> <th className="th">Utløpsdato</th> <th className="th">Fjern Kurs</th> </tr>
                                {yourSkillList}
                            </tbody>
                        </table> <br />
                    </div>
                </div>
            )
        }
    }
    registerSkills(selectValue) {
        this.inputList = [];
        this.dateInputList = [];

        for (let skill of selectValue) {
            userService.getAllSkills(skill.value).then((result) => {
                this.testSkill = result;

                if (this.dateRef.value != undefined && this.testSkill.duration != 0) {
                    userService.addSkillswithDate(skill.value, this.user.id, this.dateRef.value).then((result) => {

                        userService.getYourSkills(this.user.id).then((result) => {
                            this.setState({ selectValue: null })
                            this.yourSkills = result;
                            this.forceUpdate();
                        });
                    });
                }

                else {
                    userService.addSkills(skill.value, this.user.id).then((result) => {
                        userService.getYourSkills(this.user.id).then((result) => {
                            this.setState({ selectValue: null })
                            this.yourSkills = result;
                            this.forceUpdate();
                        });
                    });
                }
            });
        }
    }

    componentDidMount() {
        let signedInUser = userService.getSignedInUser();

        userService.getUsers(this.id).then((result) => {
            this.user = result;

            this.forceUpdate();
        });

        userService.getAllSkills().then((result) => {
            this.allSkills = result;
            this.forceUpdate();
            userService.getYourSkills(this.user.id).then((result) => {

                this.yourSkills = result;
                this.forceUpdate();
            });
        });

        this.refs.changepasswordbtn.onclick = () => {

            if (this.refs.newpassword.value == this.refs.verifypassword.value) {
                userService.changePassword(this.refs.newpassword.value, this.user.id).then((result) => {

                    this.refs.newpassword.value = "";
                    this.refs.verifypassword.value = "";
                    this.forceUpdate();
                });
            }
            else {
                this.refs.newpassword.type = "text";
                this.refs.newpassword.value = "Passordene matcher ikke";
            }
        }
        if (signedInUser.admin == 1) {
            this.refs.deaktiverUser.onclick = () => {
                userService.deactivateUser(this.id).then((result) => {
                    this.forceUpdate();
                })
            }
        }
    }
}