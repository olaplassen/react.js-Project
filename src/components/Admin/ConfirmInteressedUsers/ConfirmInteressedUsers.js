import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../../services';
import ArrangementData from '../ArrangementData/ArrangementData';

export default class ConfirmInteressedUsers extends React.Component {
    constructor(props) {
      super(props);
      this.allInteressed = [];
      this.allArrangement = [];
      this.state = {
        currentUserId: null,
        currentArrangementId: null
      }
    }
 
    render() {
      let interessedList = [];
      let arrangementDetails = [];
      for(let interessed of this.allInteressed) {
        interessedList.push(<li key={interessed.firstName}> {interessed.firstname + " " + interessed.lastName + " er interessert i: " + interessed.title} <button type="button" onClick={() => this.confirmInteressed(interessed.arrangementId, interessed.userId)}>Godkjenn</button> </li>)
      }
      for (let arrangement of this.allArrangement) {
         arrangementDetails.push(<ArrangementData key={arrangement.id} data={arrangement} />);
       }
 
      return (
        <div className="menu">
        <div>{arrangementDetails}</div>
 
        </div>
      );
    }
 
    confirmInteressed(arrangementId, userId){
     userService.confirmInteressed(arrangementId, userId).then((result) => {
      this.forceUpdate();
      userService.interessedUsers().then((result) => {
        this.allInteressed = result;
        this.forceUpdate();
      });
    });
    }
 
    componentDidMount(){
      userService.getArrangement().then((result) => {
        this.allArrangement = result;
        this.forceUpdate();
      });
     userService.interessedUsers().then((result) => {
     this.allInteressed = result;
     this.forceUpdate();
     });
     userService.interessedUsers().then((result => {
     let userId = result[0].userId;
     let arrangementId = result[0].arrangementId;
     this.setState({
       currentArrangementId: arrangementId,
       currentUserId: userId
      });
   }));
 }
 }