import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { logout } from '../../../logout';

export default class UserMenu extends React.Component {
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
                    <li className="li"><Link to={'/userhome/' + this.id} className="link">Hjem</Link></li>
                    <li className="li"><Link to={'/mypage/' + this.id} className="link">Min side</Link></li>
                    <li className="li"><Link to={'/usersearch'} className="link">Søk</Link></li>
                    <li className="li"><Link to={'/arrangementer'} className="link">Arrangement</Link></li>
                    <li className="li"><Link to={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>

                </ul>
            </div>
        );
    }
}