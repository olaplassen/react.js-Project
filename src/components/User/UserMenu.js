import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { logout } from '../../logout';

export default class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        //definerer variabel sendt fra ReactDOM
        this.userid = props.userId;
    }
    render() {
      return (
          <div className="menu">
            <ul className="ul">
              <li className="li"><Link to={'/userhome/' + this.userid} className="link">Hjem</Link></li>
              <li className="li"><Link to={'/mypage/' + this.userid} className="link">Min side</Link></li>
              <li className="li"><Link to={'/usersearch'} className="link">Bruker søk</Link></li>
              <li className="li"><Link to={'/arrangementer'} className="link">Arrangement Oversikt</Link></li>
              <li className="li"><Link to={'/#'} onClick={() => logout()} className="link">Logg ut</Link></li>
          </ul>
        </div>
      );
    }
}
