import React from "react";
import axios from "axios";
import "./EventPage.css";
import Event from "../../components/event/Event";

export default class EventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.match.params.eventId,
            doneLoading: false,
            event: {},
            send_to: ""
        };
        
        const options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        axios.get("http://proevento.tk:3000/event/" + this.state.eventId, options)
        .then(res => {
            if (res.status == 200) {
                this.setState({event: res["data"], doneLoading: true});
            }
        });
    }
    
    render() {
        return (
            <div>
                { this.state.doneLoading &&
                    <Event event={this.state.event} doneLoading={this.state.doneLoading} isEventPage={true}/>
                }

            </div>
            
        )
    }
}