import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import { evntService} from '../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class ChangeShift extends React.Component {
    constructor(props) {
        super(props);
        this.arr_rolleid = props.match.params.arr_rolleid; //unik id for den spesifike rollen som skal byttes
        this.userToChange = []; // brukeren som vakten skal byttes med
        this.arrRolleInfo = []; // info om vakten
        this.roleKomp = []; //kompetanse krav for rollen
        this.userWithRoles = [];
        this.userPassive = [];
    }
    render() {
        return (
          <div className="menu">
            <h4>Skriv inn epost adressen til den du har avtalt å bytte vakt med</h4>
              <input className="input" ref="recieverEmail" />
              <button className="button" ref="byttVakt">Send forespørsel</button>
            <div ref="foresporselSvar"></div>
          </div>
        );
    }
    componentDidMount() {
      userService.getArrRolleInfo(this.arr_rolleid).then((result) => { // henter info om vakten
        this.arrRolleInfo = result;
        roleService.getRoleKomp(this.arrRolleInfo.roleid, this.arrRolleInfo.arr_rolleid).then((result) => { //henter kompetanse krav for rollen
          this.roleKomp= result;
          this.forceUpdate();
        });
      })

      this.refs.byttVakt.onclick = () => {

        userService.getUserByMail(this.refs.recieverEmail.value).then((result) => { //henter bruker informasjon med mail
          this.userToChange = result;
          if (this.userToChange == undefined) {
            this.refs.foresporselSvar.textContent = "Denne emailen finnes ikke, sjekk att du har skrevet riktig";
          }
          else {
            userService.isUserPassive(this.userToChange.id, this.arrRolleInfo.arrid).then((result) => { // sjekker om brukeren er passiv under arrangementet
              this.userPassive = result;

            if (this.userPassive.length != 0) {
              this.refs.foresporselSvar.textContent = "Denne brukeren er opptatt eller deltar allerede på dette arrangementet";
            }
            else {

            roleService.getUserRoleKomp(this.arrRolleInfo.roleid, this.arrRolleInfo.arrid, this.userToChange.id, this.arrRolleInfo.arr_rolleid).then((result) => {
              this.userWithRoles = result; // henter brukerens kurs som inngår i denne rollen
              let tildeltTid = new Date();

              if (this.userWithRoles.length == this.roleKomp.length) { // brukeren har alle kurs i denne rollen
                userService.addShiftChange(this.arrRolleInfo.userid, this.userToChange.id, this.arrRolleInfo.arr_rolleid).then((result) => { //legger til vaktbytte i databasen
                  this.refs.foresporselSvar.textContent = "Forespørsel om bytte er sendt til admin";
                  this.refs.recieverEmail.value = "";
                })
              }
              else {
                this.refs.foresporselSvar.textContent = "Denne brukeren har ikke riktig kompetanse for denne rollen";
              }
            })
            }
          })
          }
        })
      }

    }
}
