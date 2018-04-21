import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class ChangeShift extends React.Component {
    constructor(props) {
        super(props);
        this.arr_rolleid = props.match.params.arr_rolleid;
        this.userToChange = [];
        this.arrRolleInfo = [];
        this.roleKomp = [];
        this.userWithRoles = [];
        this.userPassive = [];
    }
    render() {


        return (
          <div className="menu">
          <h4>Skriv inn epost adressen til den du har avtalt å bytte vakt med</h4> <br />
          <input className="input" ref="recieverEmail" />
          <button className="button" ref="byttVakt">Send forespørsel</button>
          <div ref="foresporselSvar">
          </div>
          </div>
        );
    }
    componentDidMount() {
      userService.getArrRolleInfo(this.arr_rolleid).then((result) => {
        this.arrRolleInfo = result;
        console.log(result)
        userService.getRoleKomp(this.arrRolleInfo.roleid, this.arrRolleInfo.arr_rolleid).then((result) => {
          this.roleKomp= result;
          console.log(this.roleKomp)
          this.forceUpdate();
        });
      })

      this.refs.byttVakt.onclick = () => {
        userService.getUserByMail(this.refs.recieverEmail.value).then((result) => {
          this.userToChange = result;
          console.log(this.userToChange)
          if (this.userToChange == undefined) {
            this.refs.foresporselSvar.textContent = "Denne emailen finnes ikke, sjekk att du har skrevet riktig";
          }
          else {
            userService.isUserPassive(this.userToChange.id, this.arrRolleInfo.arrid).then((result) => {
              this.userPassive = result;

            if (this.userPassive.length != 0) {
              this.refs.foresporselSvar.textContent = "Denne brukeren er opptatt eller deltar allerede på dette arrangementet";
            }
            else {

            userService.getUserRoleKomp(this.arrRolleInfo.roleid, this.arrRolleInfo.arrid, this.userToChange.id, this.arrRolleInfo.arr_rolleid).then((result) => {
              this.userWithRoles = result;
              let tildeltTid = new Date();

              if (this.userWithRoles.length == this.roleKomp.length) {
                userService.addShiftChange(this.arrRolleInfo.userid, this.userToChange.id, this.arrRolleInfo.arr_rolleid).then((result) => {
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
