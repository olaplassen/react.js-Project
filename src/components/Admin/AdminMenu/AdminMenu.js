import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { logout } from '../../../logout';

export default class AdminMenu extends React.Component {
    render() {
        return (
            <div className="menu">
                <ul className="ul">
                    <li className="li"><Link to={'/hjem'} className="link">Hjem</Link></li>
                    <li className="li"><Link to={'/søk'} className="link">Min side</Link></li>
                    <li className="li"><Link to={'/confirmusers'} className="link">Godkjenning</Link></li>
                    <li className="li"><Link to={'/newarrangement'} className="link">Lage nytt arrangement</Link></li>
                    <li className="li"><Link to={'/arrangementer'} className="link">Arrangement</Link></li>
                    <li className="li"><Link to={'/interesserte'} className="link">Interesserte brukere</Link></li>
                    <li className="li"><Link to={'/adminsearch'} className="link">BrukerSøk</Link></li>
                    <li className="li"><Link to={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>
                </ul>
            </div>
        );
    }
}