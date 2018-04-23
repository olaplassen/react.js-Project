import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class ChangeUser extends React.Component {
    constructor(props) {
        super(props);
        this.user = {};
        this.userId = props.match.params.userId;
    }
    render() {

        return (
            <div className="changeinfo">
              <h2> Endre dine opplysninger</h2>
                <div>
                  <table>
                  <tbody>
                      <tr>
                        <td>Fornavn</td>
                        <td><input placeholder="Fornavn" className="changeinput" type='text' ref='changefirstName' /></td>
                      </tr>
                      <tr>
                        <td>Etternavn</td>
                        <td><input placeholder="Etternavn"  className="changeinput" type='text' ref='changelastName' /></td>
                      </tr>
                      <tr>
                        <td>Epost</td>
                        <td><input placeholder="Epost"  className="changeinput" type='text' ref='changeemail' /></td>
                      </tr>
                      <tr>
                        <td>Mobilnumer</td>
                        <td><input placeholder="Mobilnummer"  className="changeinput" type='number' ref='changephone' /></td>
                      </tr>
                      <tr>
                        <td>Adresse</td>
                        <td><input placeholder="Adresse"  className="changeinput" type='text' ref='changeaddress' /></td>
                      </tr>
                      <tr>
                        <td>Postnummer</td>
                        <td><input placeholder="Postnummer"  className="changeinput" type='number' ref='changepostalNumber' /></td>
                      </tr>
                      <tr>
                        <td>Poststed</td>
                        <td><input placeholder="Poststed"  className="changeinput" type='text' ref='changepoststed' /></td>
                      </tr>
                    </tbody>
                  </table>
                  <button ref='changeUserButton'>Lagre</button>
                </div>
            </div>
        );
    }


    componentDidMount() {
      //henter bruker informasjon
        userService.getUsers(this.userId).then((result) => {
            this.user = result;
            //setter inputbokser lik brukerinformasjon
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
            //oppdaterer bruker med inført informasjon
            userService.changeUser(this.refs.changefirstName.value,
                this.refs.changelastName.value,
                this.refs.changeaddress.value,
                this.refs.changepostalNumber.value,
                this.refs.changepoststed.value,
                this.refs.changephone.value,
                this.refs.changeemail.value,
                this.userId).then((result) => {
                  this.props.history.push('/mypage/' + this.userId)
                  this.forceUpdate();
                });
        };

        this.refs.changepostalNumber.oninput = () => {
          //får poststed automatisk ved innføring av postnr
            userService.getPoststed(this.refs.changepostalNumber.value).then((result) => {
                if (this.refs.changepostalNumber.value < 1) {
                    this.refs.changepoststed.value = "";
                }
                else {
                    for (let place of result) {
                        this.refs.changepoststed.value = place.poststed;
                    }
                }
            });
        }
    }
}
