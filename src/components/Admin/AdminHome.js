import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../Services/UserService';
import { skillService } from '../Services/SkillService';
import { roleService } from '../Services/RoleService';
import { interestService } from '../Services/InterestService';
import { evntService } from '../Services/Evntservice';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class AdminHome extends React.Component {

    constructor(props) {
        super(props);
        this.allEvnts = [];
        this.adminId = props.match.adminId;
      
    }

    render() {
      //her må man innom en annen side for å kunne benytte onSelectEvent

        return (
          <div className="blokk">
            <div className="calendercolumn100">
              <h2>Arrangementskalender</h2>
                <BigCalendar
                    events={this.allEvnts}
                    showMultiDayTimes

                    defaultDate={new Date()}

                    selectAble={true}
                    onSelectEvent={evnt => this.props.history.push('/eventinfo/' + evnt.id)}
                />
            </div>
          </div>

        );
    }

    componentDidMount() {
      evntService.getAllEvnts().then((result) => { //henter alle arrangement for BigCalendar
            this.allEvnts = result;
            console.log(result)
            this.forceUpdate();
        });
    }
}
