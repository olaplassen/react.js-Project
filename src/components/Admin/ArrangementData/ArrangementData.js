import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';

export default class ArrangementData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showArrangementData: false,
            activeUser: null,
            interestedUsers: {},
            users: []
        }
        this.updateShowState = this.updateShowState.bind(this);

    }
    updateShowState() {
        this.state.showArrangementData = !this.state.showArrangementData;

        userService.getInteressedUsers(this.props.data.id).then((result) => {
            var users = [];
            result.forEach(function (user) {
                users.push(<li>{user.firstname + " "}<button type="button" onClick="godkjenn">Godkjenn</button></li>);
            });

            this.state.users = users;
            this.forceUpdate();

        });
    }
    render() {
        return (
            <div>
                {this.props.data.title} <button type="button" onClick={this.updateShowState}>Les mer</button><button type="button" onClick={() => this.getInteressed(this.props.data.id, this.state.activeUser)}>Interessert</button>
                {this.state.showArrangementData ?
                    <div>
                        <ul>
                            <li>Id: {this.props.data.id}</li>
                            <li>Navn: {this.props.data.title}</li>
                            <li>Tidspunkt: {this.props.data.end.toString()}</li>
                            <li>Beskrivelse: {this.props.data.description}</li>
                            <li>Utstyrliste: {this.props.data.gearList}</li>

                        </ul>
                        Interesserte brukere: {this.state.users} <br></br>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
    componentDidMount() {
        this.setState({
            activeUser: userService.getSignedInUser()["id"]
        });

    }

    getInteressed(arrangementId, userId) {
        this.state.activeUser = userId;
        userService.getInteressed(arrangementId, userId).then((result) => {
            this.forceUpdate();
        })
    }
}