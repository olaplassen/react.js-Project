import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import ArrangementData from '../ArrangementData/ArrangementData';

export default class Arrangement extends React.Component {
    constructor() {
        super();
        this.allArrangement = [];
    }
    render() {
        let arrangementDetails = [];
        for (let arrangement of this.allArrangement) {
            arrangementDetails.push(<ArrangementData data={arrangement} />);
        }

        return (
            <div className="menu">
                {arrangementDetails}
            </div>
        );
    }
    componentDidMount() {
        userService.getArrangement().then((result) => {
            this.allArrangement = result;
            this.forceUpdate();
        });
    }
}