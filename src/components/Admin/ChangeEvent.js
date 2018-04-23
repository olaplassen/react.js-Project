import React from 'react';
import ReactDOM from 'react-dom';
import { userService } from '../../services';
import { evntService} from '../../services';
import createHashHistory from 'history/createHashHistory';

const history: HashHistory = createHashHistory();

export default class ChangeEvent extends React.Component {
    constructor(props) {
        super(props);
        this.evntId = props.match.params.eventId;
        this.evnt = [];
    }
    render() {

        return (
            <div className="blokk">
              <h2> Endre {this.evnt.title} sine opplysninger</h2>
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Tittel</td>
                        <td><input placeholder="Tittel" className="changeinput" type='text' ref='title' /></td>
                      </tr>
                      <tr>
                        <td>Møte lokasjon</td>
                        <td><input placeholder="Møte lokasjon"  className="changeinput" type='text' ref='meetingLocation' /></td>
                      </tr>
                      <tr>
                        <td>Utstyrs Liste</td>
                        <td><input placeholder="Utstyrs Liste"  className="changeinput" type='text' ref='gearList' /></td>
                      </tr>
                      <tr>
                        <td>Kontaktperson</td>
                        <td><input placeholder="Kontaktperson"  className="changeinput" type='text' ref='contactPerson' /></td>
                      </tr>
                      <tr>
                        <td>Oppmøte tidspunkt</td>
                        <td><input placeholder="Oppmøte tidspunkt"  className="changeinput" type='datetime-local' ref='show' /></td>
                      </tr>
                      <tr>
                        <td>Slutt tidspunkt</td>
                        <td><input placeholder="Slutt tidspunkt"  className="changeinput" type='datetime-local' ref='start' /></td>
                      </tr>
                      <tr>
                        <td>Slutt tidspunkt</td>
                        <td><input placeholder="Slutt tidspunkt"  className="changeinput" type='datetime-local' ref='end' /></td>
                      </tr>
                      <tr>
                        <td>Beskrivelse</td>
                        <td><textarea className="changeinput" placeholder="Beskrivelse"  type='text' ref='description' /></td>
                      </tr>
                    </tbody>
                  </table>
                    <button className="button" ref='changeEvntButton'>Lagre</button>
                    <button className="tilbake" className="button" onClick={() => {this.props.history.push('/eventinfo/'+this.evnt.id)}}> Tilbake </button>
                </div>
            </div>
        );
    }
    componentDidMount() {

        evntService.getEvntInfo(this.evntId).then((result) => { // henter event info

            this.evnt = result;
            let showTime = JSON.stringify(this.evnt.showTime) //definerer datoformat for mulighet til å sette value på input
            let startTime = JSON.stringify(this.evnt.start)
            let endTime = JSON.stringify(this.evnt.end)
            this.refs.title.value = this.evnt.title;
            this.refs.meetingLocation.value = this.evnt.meetingLocation;
            this.refs.description.value = this.evnt.description;
            this.refs.contactPerson.value = this.evnt.contactPerson;
            this.refs.gearList.value = this.evnt.gearList;
            this.refs.show.value = JSON.parse(showTime).slice(0,-1);
            this.refs.start.value = JSON.parse(startTime).slice(0,-1);
            this.refs.end.value = JSON.parse(endTime).slice(0,-1);
            this.forceUpdate();

        });

        this.refs.changeEvntButton.onclick = () => { // oppdaterer eventinfo
            evntService.changeEvnt(
                this.refs.title.value,
                this.refs.meetingLocation.value,
                this.refs.description.value,
                this.refs.contactPerson.value,
                this.refs.gearList.value,
                this.refs.show.value,
                this.refs.start.value,
                this.refs.end.value,
                this.evnt.id).then((result) => {

                  this.props.history.push('/eventinfo/' + this.evnt.id);
                });
        };
    }
}
