import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { userService } from '../../../services';

export default class SearchUser extends React.Component {
    constructor(props) {
        super(props);
        this.allUsers = [];
        this.state = { value: '' };
        //binder 'this' til handleChange funksjonen
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        let userList = [];
        let signedInUser = userService.getSignedInUser(); // definerer variabel for bruker som er innlogget
        //Liste for bruker søk. Når innlogget bruker er admin vil listen vise mer informasjon
        if (signedInUser.admin == 0) {
            for (let user of this.allUsers) {
                userList.push(<tr key={user.id}><td>{user.firstName} {user.lastName}</td> <td>{user.phone}</td> <td>{user.email}</td></tr>)
            }
        }
        else if (signedInUser.admin = 1) {
            for (let user of this.allUsers) {
                userList.push(<tr key={user.id}><td>{user.id}</td> <td><Link to={'/mypage/' + user.id}>{user.firstName} {user.lastName}</Link></td> <td>{user.address}</td> <td>{user.phone}</td> <td>Epost: {user.email}</td></tr>)
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
      //henter ut bruker listen når man ikke har noen input verdi
        userService.userList().then((result) => {
            this.allUsers = result;
            this.forceUpdate();
        });
    }
    handleChange(event) {
        if (event.target.value != undefined) {
            this.setState({ value: event.target.value.toUpperCase() });
            //henter ut brukere som matcher med søke verdien
            userService.searchList(event.target.value).then((result) => {
                //setter for-løkken som listen kjøres gjennom lik søke resultatet
                this.allUsers = result;
                this.forceUpdate();
            });
        }

    }

}
