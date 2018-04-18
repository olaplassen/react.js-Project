import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();
import { userService } from './services';

import BigCalendar from 'react-big-calendar'
import moment from 'moment';

import { outlogged } from './app';


// Then import the virtualized Select HOC
import VirtualizedSelect from 'react-virtualized-select'
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


export class UserMenu extends React.Component {
  //props for å hente verdien fra brukeren som logget inn
  constructor(props) {
    super(props);
    //setter this.id lik verdien som ble sendt fra login.
    this.id = props.userId;

  }
  render() {
    return (
      <div className="menu">
       <ul className="ul">
       {/* sender id'en vidre til linkene */}
        <li className="li"><Link to ={'/userhome/' + this.id} className="link">Hjem</Link></li>
        <li className="li"><Link to ={'/mypage/' + this.id} className="link">Min side</Link></li>
        <li className="li"><Link to ={'/usersearch'} className="link">Søk</Link></li>
        <li className="li"><Link to ={'/arrangementer'} className="link">Arrangement</Link></li>
        <li className="li"><Link to ={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>

       </ul>
       </div>

    );
  }
}

export function logout() {
  userService.signOut();
  outlogged();
  }

export class UserHome extends React.Component {
    constructor(props) {
      super(props);
      this.allEvents = [];
      //henter id fra usermenyen og matcher den med this.id

    }


     render() {
       console.log(this.allEvents[6])
       return (
         <div style={{height: 400, width: 600}} className="menu">
             <BigCalendar
               events={this.allEvents}
               showMultiDayTimes
               defaultDate={new Date(2018, 2, 1)}
               selectAble ={true}

               onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}

               />
           </div>

       );
     }
   //henter all brukerinfo ved hjelp av id
   componentDidMount() {
     userService.getAllArrangement().then((result) => {
       this.allEvents = result;

       this.forceUpdate();
     });
  }
 }

export class EventInfo extends React.Component {
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
    this.eventRoller = [];
    this.allUsers = [];
    this.roleKomp = [];
    this.userWithRoles = [];
    this.selectedUser = [];
    this.usedUser = [];
    }
  render() {
    let signedInUser = userService.getSignedInUser();

     let roleList = [];
     let roleListAdmin = [];
     let inc = 0;

     for (let role of this.allSelectedRoles) {
       roleList.push(<tr key={role.arr_rolleid} ><td> { role.title } </td></tr>);
    }

    for (let role of this.allRoles) {
         roleListAdmin.push(
           <tr key={role.roleid}>
           <td className="td">{role.roleid}</td>
           <td className="td">{role.title}</td>
           <td className="table">{this.numberOfRoles[inc]}</td>
           <td className="table">
           <button onClick={() => {
           this.secondNumberOfRoles[role.roleid-1]++;
           this.forceUpdate();
            }}>+</button></td>
            <td className="table">
            <button onClick={() => {
              if(this.secondNumberOfRoles[role.roleid-1] > 0){
                this.secondNumberOfRoles[role.roleid-1]--;
              }
              this.forceUpdate();
            }}>-</button></td>
            </tr>
          );
          inc++;
       }
       // console.log(this.firstNumberOfRoles)
       // console.log(this.secondNumberOfRoles)

    if (signedInUser.admin == 0) {

    return(
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
      <div style={{width: 300}}>
      Beskrivelse: <br />
      {this.arrangement.description} <br />
      </div>
      <div>
      <h4>Roller som kreves for dette arrangementet:</h4> <br />
      <table>
            <tbody>
          {roleList}
        </tbody>
      </table>
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
      <div style={{width: 300}}>
      Beskrivelse: <br />
      {this.arrangement.description} <br />
      </div>
      <div>
      <h4>Roller som kreves for dette arrangementet:</h4> <br />
      <table className="table" id="myTable">
            <tbody>
            <tr> <th className="th">Nr</th> <th className="th">Tittel</th> <th className="th">Antall</th> <th className="th">Legg til</th> <th className="th">Trekk fra</th> </tr>
              {roleListAdmin}
              </tbody>
      </table> <br />
      <button ref="endreRoller" className="button">Endre Roller</button>

      <br />
      <button ref="tildelRoller" className="button">Tilde vakter</button>
      Har du spørsmål vedrørende dette arrangementet kontakt {this.arrangement.contactPerson}


      </div>

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
      if(signedInUser.admin == 1) {
        userService.getEventRolleinfo(this.arrangement.id).then((result) => {
          this.eventRoller = result;
          this.forceUpdate();
        });
      }
      userService.getRolesForArr(this.arrangement.id).then((result) => {
        this.allSelectedRoles = result;

        this.forceUpdate();
      });
    });
    if(signedInUser.admin == 1) {
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
                })
              }
            }
            else if(this.difference[i-1] < 0) {

              for (var y = 0; y < -(this.difference[i -1]); y++) {
                userService.deleteRolesfromArr(this.arrangement.id, i).then((result) => {
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

                    // console.log(usedUser)
                    // console.log(usedEventRoles)
                    for (var i = 0; i < this.allSelectedRoles.length; i++) {
                      let exists = usedUser.includes(user.id);
                      let hasUser = usedEventRoles.includes(eventRolle.arr_rolleid);


                        if (exists == false && hasUser == false && this.roleKomp.length == this.userWithRoles.length) {
                          console.log(exists)
                          usedUser.push(user.id)
                          usedEventRoles.push(eventRolle.arr_rolleid)

                          userService.addUserForRole(user.id, eventRolle.arr_rolleid, eventRolle.arrid).then((result) => {
                            console.log(result)
                          })
                        }
                        else {
                          console.log("nei")
                        }
                      }
                    })
                  }
                }
              }
            }
          }
}

export class MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.user = {}
    this.id= props.match.params.userId;
    this.state = {
      showchangePassword: false,
      showDeactivateText: false
    }
    this.updateShowState = this.updateShowState.bind(this);
    console.log(props);

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

          this.inputList.push(<tr key={skill.value}><td> { skill.label } </td><td>Dette kurset har ingen utløpsdato</td></tr>);

        }
        else if (result.duration != 0 && this.dateInputList.length > 0) {
                  this.setState( selectValue.splice(-1,1));
                  alert('Registrer ' + this.selectedSkillWithDate + ' før du legger til flere kurs med utløpsdato.');
                }

        else {
          ref ++;
          this.dateRef = ref;
          this.dateInputList.push(<tr key={ skill.value} ><td> { skill.label } </td><td>, Legg til utløpsdato:<input ref={(ref) => this.dateRef = ref} type='date' /></td></tr>);

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
      if(yourskill.validTo != null) {
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
          skillList.push({ value: skill.skillid, label: skill.title},);
        }
      });
    }
    const {selectValue } = this.state;
    if(signedInUser.admin == 0) {

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
          { this.state.showchangePassword ?
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
        onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler( selectValue ))}

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
          { this.state.showDeactivateText ?
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
            { this.state.showchangePassword ?
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
            onChange={(selectValue) => this.setState({ selectValue }, this.changeHandler( selectValue ))}

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


      if(this.dateRef.value != undefined && this.testSkill.duration != 0) {
      userService.addSkillswithDate(skill.value, this.user.id, this.dateRef.value).then((result) => {

        userService.getYourSkills(this.user.id).then((result) => {
          this.setState({selectValue:null})
          this.yourSkills = result;
          this.forceUpdate();
        });
      });
    }

    else {
      userService.addSkills(skill.value, this.user.id).then((result) => {
        userService.getYourSkills(this.user.id).then((result) => {
          this.setState({selectValue:null})
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
      console.log(result)

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
         this.forceUpdate(); // Rerender component with updated data
       });
     }
    else {
      this.refs.newpassword.type = "text";
      this.refs.newpassword.value = "Passordene matcher ikke";
      }
    }
    if(signedInUser.admin == 1) {
      this.refs.deaktiverUser.onclick = () =>  {
    userService.deactivateUser(this.id).then((result) => {
      this.forceUpdate();
      })
      }
    }
  }
}

export class ChangeUser extends React.Component {
    constructor(props) {
    super(props);
    this.user = {};
    this.id = props.match.params.userId;
    }
    render() {

      return (
        <div className="menu">
          <div>
            Fornavn: <input className="input" type='text' ref='changefirstName' /><br/>
            Etternavn: <input className="input" type='text' ref='changelastName' /><br/>
            Adresse: <input className="input" type='text' ref='changeaddress' /><br/>
            Postnummer: <input className="input" type='number' ref='changepostalNumber' /><br/>
            Poststed: <input className="input" type='text' ref='changepoststed' /><br/>
            Telefon: <input className="input" type='number' ref='changephone' /><br/>
            Mail: <input className="input" type='text' ref='changeemail' /><br/>
            <button ref='changeUserButton'>Lagre</button>
          </div>
        </div>
      );
    }

    nextPath(path) {
        this.props.history.push(path);
      }
  componentDidMount() {

    userService.getUsers(this.id).then((result) => {

      this.user = result;
      this.refs.changefirstName.value = this.user.firstName;
      this.refs.changelastName.value = this.user.lastName;
      this.refs.changeaddress.value = this.user.address;
      this.refs.changepostalNumber.value = this.user.postnr;
      this.refs.changepoststed.value = this.user.poststed;

      this.refs.changephone.value = this.user.phone;
      this.refs.changeemail.value = this.user.email;
      this.forceUpdate();
    });

    this.refs.changeUserButton.onclick = () => {
      userService.changeUser(this.refs.changefirstName.value,
                                 this.refs.changelastName.value,
                                 this.refs.changeaddress.value,
                                 this.refs.changepostalNumber.value,
                                 this.refs.changepoststed.value,
                                 this.refs.changephone.value,
                                 this.refs.changeemail.value,

                                 this.id).then((result) => {
        userService.getUsers(this.id).then((result) => {
          this.props.history.push('/mypage/' + this.id)
          this.forceUpdate(); // Rerender component with updated data
        });
      });
    };

    this.refs.changepostalNumber.oninput = () => {

      userService.getPoststed(this.refs.changepostalNumber.value).then((result) => {

        if(this.refs.changepostalNumber.value < 1) {
          this.refs.changepoststed.value = "";
        }
        else {
        for(let place of result) {
            this.refs.changepoststed.value = place.poststed;
            console.log(place.poststed)

        }
      }
      });
    }
  }
}

export class SearchUser extends React.Component {
    constructor(props) {
      super(props);
      this.allUsers = [];

      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
    }
    render() {

      let userList = [];
      let signedInUser = userService.getSignedInUser();

      console.log(signedInUser.admin)
      if(signedInUser.admin == 0) {
      for(let user of this.allUsers) {
        userList.push(<tr key={user.id}><td>{user.firstName} {user.lastName}</td> <td>{user.phone}</td> <td>{user.email}</td></tr>)

        }
      }
      else if(signedInUser.admin = 1) {
        for(let user of this.allUsers) {
          userList.push(<tr key={user.id}><td>{user.id}</td> <td><Link to={'/mypage/' + user.id }>{user.firstName} {user.lastName}</Link></td> <td>{user.address}</td> <td>{user.phone}</td> <td>Epost: {user.email}</td></tr>)

          }
      }
      if (signedInUser.admin == 1) {
      return (



        <div className="menu">
        Søk på navn for å få frem tlf og epost. Klikk på navnet for å komme inn på info side og endre personalia<br />
         <input type="text" value={this.state.value} onChange={this.handleChange} />

         <table>
               <tbody>
                <tr><th>Medlemsnummer</th><th>Navn</th><th>Adresse</th><th>Telfon</th><th>Email</th></tr>
                 {userList}
               </tbody>
         </table>
        </div>
        )
        }
        else {
          return (
          <div className="menu">
          Søk på navn for å få frem tlf og epost. <br />
           <input type="text" value={this.state.value} onChange={this.handleChange} />

           <table>
                 <tbody>
                  <tr><th>Navn</th><th>Telfon</th><th>Email</th></tr>
                   {userList}
                 </tbody>
           </table>
          </div>

      )
    }
    }
    componentDidMount() {
      userService.userList().then((result) => {

        this.allUsers = result;
        this.forceUpdate();
      });
    }
    handleChange(event) {
      if (event.target.value != undefined ) {
      this.setState({value: event.target.value.toUpperCase()});
      console.log(event.target.value);

      userService.searchList(event.target.value).then ((result) => {


        this.allUsers = result;
        this.forceUpdate();
        });
      }

    }

  }
