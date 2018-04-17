import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
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
            <div style={{ height: 400, width: 600 }} className="menu">
                <BigCalendar
                    events={this.allEvents}
                    showMultiDayTimes
                    defaultDate={new Date(2018, 2, 1)}
                    selectAble={true}
                    onSelectEvent={event => this.props.history.push('/eventinfo/' + event.id)}
                />
            </div>

        );
    }

    componentDidMount() {
        userService.getAllArrangement().then((result) => {
            this.allEvents = result;
            this.forceUpdate();
        });
    }
}