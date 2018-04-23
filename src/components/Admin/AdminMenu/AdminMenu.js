import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { logout } from '../../../logout';

export default class AdminMenu extends React.Component {
    render() {
        return (
            <div className="menu">
                <ul className="ul">
                    <li><Link to={'/hjem'} className="link">Hjem</Link></li>
                    <li><Link to={'/confirmusers'} className="link">Godkjenning</Link></li>
                    <li><Link to={'/newarrangement'} className="link">Lage nytt arrangement</Link></li>
                    <li><Link to={'/arrangementer'} className="link">Kommende arrangementer</Link></li>
                    <li><Link to={'/adminsearch'} className="link">BrukerSøk</Link></li>
                    <li><Link to={'/statistics'} className="link">Statistikk</Link></li>
                    <li><Link to={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>
                </ul>
            </div>
        );
    }
}
