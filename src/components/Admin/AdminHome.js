import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import createHashHistory from 'history/createHashHistory';
const history: HashHistory = createHashHistory();

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default class AdminHome extends React.Component {

    constructor(props) {
        super(props);
        this.allEvents = [];
    }

    render() {
        return (
          <div className="blokk">
            <div className="calendercolumn100">
              <h2>Arrangementskalender</h2>
                <BigCalendar
                    events={this.allEvents}
                    showMultiDayTimes

                    defaultDate={new Date()}

                    selectAble={true}
                    onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}
                />
            </div>
          </div>

        );
    }

    componentDidMount() {
        userService.getAllArrangement().then((result) => { //henter alle arrangement for BigCalendar
            this.allEvents = result;
            this.forceUpdate();
        });
    }
}
