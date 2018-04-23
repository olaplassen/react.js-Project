import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import { evntService} from '../../services';
import { skillService} from '../../services';
import { interestService } from '../../services';
import { Link } from 'react-router-dom';

import VirtualizedSelect from 'react-virtualized-select'

export default class MyPage extends React.Component {
    constructor(props) {
        super(props);
        this.user = {}
        this.userId = props.match.params.userId; // henter userId fra UserMenu
        this.state = {

            showDeactivateText: false
        }
        this.updateShowState = this.updateShowState.bind(this);
        this.allSkills = [];
        this.yourSkills = [];
        this.values = [];
        this.testSkill = [];
        this.passiveUser=[];
    }
    //funksjon for vise de state som er satt til false
    updateShowState() {

        this.setState({ showDeactivateText: !this.state.showDeactivateText });
    }
    //funksjon for håndtere endringer i VirtualizedSelect dropdown menyen
    changeHandler(selectValue) {
        let ref = 0; // variabler for å definere ref
        this.dateRef = {} // variabler for å definere ref for hver inputList når du registrerer kurs
        this.inputList = []; //liste for kurs om ikke trenger utløpsdato
        this.dateInputList = []; //liste for å legge til utløpsdato
        for (let skill of selectValue) {
            //henter informasjon om valgte kurs
            skillService.getSkillInfo(skill.value).then((result) => {
                //valgt kurs har ingen utløpsdato
                if (result.duration === 0) {
                    this.inputList.push(<tr key={skill.value}><td>{skill.label}</td><td>Dette kurset har ingen utløpsdato</td></tr>);
                }
                //valgt kurs har utløpsdato, men du har allerede lagt til et kurs med utløpsdato
                else if (result.duration != 0 && this.dateInputList.length > 0) {
                    this.setState(selectValue.splice(-1, 1));
                    this.refs.error.textContent ='Registrer denne rollen før du legger til flere kurs med utløpsdato.';
                }
                //valgt kurs har utløpsdato, skriver ut input med mulighet for å legge til dato med entydig ref
                else {
                    ref++;
                    this.dateRef = ref;
                    this.dateInputList.push(
                      <tr key={skill.value}>
                      <td>{skill.label}</td>
                      <td>, Legg til utløpsdato:<input ref={(ref) => this.dateRef = ref} type='date' />
                      </td>
                      </tr>);
                }
                this.forceUpdate()
            });
        }
    }

    render() {
        let signedInUser = userService.getSignedInUser();
        let skillList = [];
        let yourSkillList = [];
        let passiveList = [];

        //liste over alle passive meldinger
        for (let passive of this.passiveUser){
          passiveList.push(
            <tr key={passive.userPassive_id}>
              <td>Du er passiv fra {passive.passive_start.toDateString()} t</td>
              <td>il {passive.passive_slutt.toDateString()}</td>
            </tr>)
        }
        //Liste over dine registrerte kurs
        for (let yourskill of this.yourSkills) {
          //kurs med utløpsdato
            if (yourskill.validTo != null) {
                yourSkillList.push(
                    <tr key={yourskill.skillid}>
                        <td className="td">{yourskill.title}</td>
                        <td className="table">{yourskill.validTo.toDateString()}</td>
                        <td className="table">
                            <button onClick={() => {
                              //sletter valgt kurs og oppdaterer brukers kurs liste
                                skillService.deleteSkill(this.user.id, yourskill.skillid).then((result) => {
                                    skillService.getYourSkills(this.user.id).then((result) => {
                                        this.yourSkills = result;
                                        this.forceUpdate();
                                    });
                                })
                            }}>Slett</button></td>
                    </tr>
                );
            }
            //kurs uten utløpsdato
            else {
                yourSkillList.push(
                    <tr key={yourskill.skillid}>
                        <td className="td">{yourskill.title}</td>
                        <td className="table">Ingen utløpsdato</td>
                        <td className="table">
                            <button onClick={() => {
                                skillService.deleteSkill(this.user.id, yourskill.skillid).then((result) => {
                                    skillService.getYourSkills(this.user.id).then((result) => {
                                        this.yourSkills = result;
                                        this.forceUpdate();
                                    });
                                })
                            }}>Slett</button></td>
                    </tr>
                );
            }
        }
        //liste over alle kurs bruker ikke har for virtualized-select dropdown meny
        for (let skill of this.allSkills) {
            userService.checkUserSkill(this.user.id, skill.skillid).then((result) => {
                if (result == undefined) {
                    skillList.push({ value: skill.skillid, label: skill.title }, );
                }
            });
        }
        //variabel for valgt kurs i VirtualizedSelect
        const { selectValue } = this.state;
        //return for user
        if (signedInUser.admin == 0) {
            return (
                <div>
                  <div className="row">
                    <div className="info">
                      <h2> {this.user.firstName} {this.user.lastName}</h2>
                      <table className="tableinfo">
                        <tbody>
                          <tr>
                            <td>Brukernavn</td>
                            <td>{this.user.userName}</td>
                          </tr>
                          <tr>
                            <td>Medlemsnummer</td>
                            <td>{this.user.id}</td>
                          </tr>
                          <tr>
                            <td>Epost</td>
                            <td>{this.user.email}</td>
                          </tr>
                          <tr>
                            <td>Mobilnummer</td>
                            <td>{this.user.phone}</td>
                          </tr>
                          <tr>
                            <td>Adresse</td>
                            <td>{this.user.address} </td>
                          </tr>
                          <tr>
                            <td>Poststed</td>
                            <td>{this.user.poststed}</td>
                          </tr>
                          <tr>
                            <td>Postnr</td>
                            <td>{this.user.postnr}</td>
                          </tr>
                          </tbody>
                        </table>
                    <div>
                        <Link to={'/changeUser/' + this.user.id}>Endre opplysninger</Link>
                      </div>
                      <div>


                            <div>
                            Endre passord<br></br>
                                <input ref="newpassword" type="password" /> <br />
                                <input ref="verifypassword" type="password" /> <br />
                                <button ref="changepassword" onClick={() => this.newPassword()}>Lagre</button>
                                <div ref="error2"></div>
                            </div>



                      </div>
                    </div>

                    <div className="passiv">
                        <h4> Hvis du mot formodning vil melde deg passiv i en periode kan du legge inn start og sluttdato her: </h4>
                          <p> Startdato for passivmelding </p>  <input type='datetime-local' ref="startPassiveTime"></input><br />
                          <p> Sluttdato for passivmelding </p>  <input type='datetime-local' ref="endPassiveTime"></input><br />
                          <button className="button1" ref="newpassivebutton" onClick={() => this.registerUserPassive()}>Melde passiv</button>
                          <div ref="error"></div>
                          <table>
                            <tbody>
                              {passiveList}
                            </tbody>
                          </table>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="kompetanse">
                          <div className="kurs">
                              <h3> Dine Kompetanser og kurs</h3>
                            <table className="table" id="myTable">
                                <tbody>
                                    <tr>
                                      <th className="th">Tittel</th>
                                      <th className="th">Utløpsdato</th>
                                      <th className="th">Fjern Kurs</th>
                                    </tr>
                                    {yourSkillList}
                                </tbody>
                            </table>
                          </div>
                        </div>

                          <div className="addkurs">
                            <h3> Legg til dine kurs </h3>
                              <div>
                                OBSOBS!  Du kan ikke legge til flere enn et kurs med utløpsdato om gangen.
                                <div ref="error"></div>
                              </div>

                            <VirtualizedSelect
                                className="roller"
                                clearable={true}
                                removeSelected={true}
                                multi={true}
                                options={skillList}
                                onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler(selectValue))}
                                value={selectValue}
                            />
                            <div>
                              <table>
                                <tbody>
                                  {this.inputList}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <table>
                                <tbody>
                                  {this.dateInputList}
                                </tbody>
                              </table>
                            </div>
                            <button ref="addSkill" onClick={() => this.registerSkills(selectValue)}>Registrer</button>
                          </div>
                      </div>
                </div>
            );
        }
        else if (signedInUser.admin == 1) {
            return (
                <div>
                <div className="row">
                  <div className="info">
                      <h2> {this.user.firstName} {this.user.lastName}</h2>
                        <table className="tableinfo">
                          <tbody>
                            <tr>
                              <td>Brukernavn</td>
                              <td>{this.user.userName}</td>
                            </tr>
                            <tr>
                              <td>Medlemsnummer</td>
                              <td>{this.user.id}</td>
                            </tr>
                            <tr>
                              <td>Epost</td>
                              <td>{this.user.email}</td>
                            </tr>
                            <tr>
                              <td>Mobilnummer</td>
                              <td>{this.user.phone}</td>
                            </tr>
                            <tr>
                              <td>Adresse</td>
                              <td>{this.user.address} </td>
                            </tr>
                            <tr>
                              <td>Poststed</td>
                              <td>{this.user.poststed}</td>
                            </tr>
                            <tr>
                              <td>Postnr</td>
                              <td>{this.user.postnr}</td>
                            </tr>
                          </tbody>
                        </table>
                    <div>
                      <Link to={'/changeUser/' + this.user.id}>Endre opplysninger</Link>
                    </div>



                  </div>
                  <div className="deaktiver">
                    <button ref="deaktiverUser" onClick={this.updateShowState} className="button">Deaktiver brukeren</button>
                    {this.state.showDeactivateText ?
                        <div>
                            <h2>{this.user.firstName} {this.user.lastName} er deaktiver.</h2>
                        </div>
                        :
                        null
                    }
                  </div>
              </div>

              <hr></hr>
              <div className="row">
                  <div className="kompetanse">
                        <div className="kurs">
                            <h2> Kompetanse og kurs til {this.user.firstName} {this.user.lastName}</h2>
                          <table className="table" id="myTable">
                              <tbody>
                                  <tr>
                                    <th className="th">Tittel</th>
                                    <th className="th">Utløpsdato</th>
                                    <th className="th">Fjern Kurs</th>
                                  </tr>
                                  {yourSkillList}
                              </tbody>
                          </table>
                        </div>
                      </div>

                        <div className="addkurs">
                          <h3> Legg til kurs på {this.user.firstName} {this.user.lastName} </h3>
                            <div>
                              OBSOBS du kan ikke legge til flere enn et kurs med utløpsdato om gangen.
                            </div>

                          <VirtualizedSelect
                              className="roller"
                              clearable={true}
                              removeSelected={true}
                              multi={true}
                              options={skillList}
                              onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler(selectValue))}
                              value={selectValue}
                          />
                          <div>
                            <table>
                              <tbody>
                                {this.inputList}
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <table>
                              <tbody>
                                {this.dateInputList}
                              </tbody>
                            </table>
                          </div>
                          <button ref="addSkill" onClick={() => this.registerSkills(selectValue)}>Registrer</button>
                        </div>
                    </div>

                </div>
            )
        }
    }
    //registrere passiv-meldinger
    registerUserPassive(){
      //sjekker at slutt dato er senere en start dato og at de er definert
      if (this.refs.startPassiveTime.value != undefined && this.refs.endPassiveTime.value != undefined && this.refs.startPassiveTime.value <this.refs.endPassiveTime.value) {
        userService.userPassive(this.refs.startPassiveTime.value,this.refs.endPassiveTime.value, this.user.id).then((result) => {
          this.refs.startPassiveTime.value = "";
          this.refs.endPassiveTime.value = "";
          userService.getUserPassive(this.user.id).then((result) => {
           this.passiveUser = result;
           this.forceUpdate();
          })
        })
      }
      else {
        this.refs.error.textContent = "Din passiv melding er ikke gyldig, prøv på nytt"
      }
    }
    //legge til kurs for bruker. Henter valgt kurs fra VirtualizedSelect
    registerSkills(selectValue) {
        this.inputList = [];
        this.dateInputList = [];
        //for løkke for å hente informasjon om alle kurs bruker har valgt å legge til
        for (let skill of selectValue) {
            skillService.getAllSkills(skill.value).then((result) => {
                this.testSkill = result;
                //legger til kurs med utløpsdato når utløpsdato er definert og valgt kurs har utløpsdato
                if (this.dateRef.value != undefined && this.testSkill.duration != 0) {
                    skillService.addSkillswithDate(skill.value, this.user.id, this.dateRef.value).then((result) => {
                        //oppdaterer brukers kurs liste
                      skillService.getYourSkills(this.user.id).then((result) => {
                          //setter VirtualizedSelect sin verdi til null
                          this.setState({ selectValue: null })
                          this.yourSkills = result;
                          this.forceUpdate();
                        });
                    });
                  }
                //legger til kurs uten utløpsdato
                else {
                    skillService.addSkills(skill.value, this.user.id).then((result) => {
                        skillService.getYourSkills(this.user.id).then((result) => {
                            this.setState({ selectValue: null })
                            this.yourSkills = result;
                            this.forceUpdate();
                        });
                    });
                }
            });
        }
    }
    newPassword(){

               if (this.refs.newpassword.value == this.refs.verifypassword.value) {
                    console.log("passer")
                      userService.changePassword(this.refs.newpassword.value, this.user.id).then((result) => {
                          this.refs.newpassword.value = "";
                          this.refs.verifypassword.value = "";

                          this.forceUpdate();
                      });
                  }
                  else {
                    console.log("passer ikke")
                      this.refs.error2.textContent = "Passordene matcher ikke";
                      this.forceUpdate();


      }
    }
    componentDidMount() {
        let signedInUser = userService.getSignedInUser();
        //henter bruker informasjon og passiv meldinger
        userService.getUsers(this.userId).then((result) => {
          this.user = result;
            userService.getUserPassive(this.user.id).then((result) => {
             this.passiveUser = result;
             this.forceUpdate();
            })
        });
        //henter alle kurs og alle registrerte kurs fra databasen
        skillService.getAllSkills().then((result) => {
            this.allSkills = result;
            skillService.getYourSkills(this.user.id).then((result) => {
              this.yourSkills = result;
              this.forceUpdate();
            });
        });



        if (signedInUser.admin == 1) {
          //deaktiverknapp for admin
            this.refs.deaktiverUser.onclick = () => {
              //Setter godkjent på brukeren til 0 i databasen
                userService.deactivateUser(this.userId).then((result) => {
                    this.forceUpdate();
                })
            }
        }
    }
}
