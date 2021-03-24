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
        this.handleSubmit = this.handleSubmit.bind(this);
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
    handleSubmit = (event) => {
        var options = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                "Content-type": "Application/json",
            },
        };
        event.preventDefault();
        if (this.state.send_to && this.state.send_to != "") {
            var split = this.state.send_to.split(",");
            for (var i = 0; i < split.length; i++) {
                axios.get("http://proevento.tk:3000/search/single/" + split[i], options)
                    .then((res) => {
                        if (res.status === 200) {
                            axios.post("http://proevento.tk:3000/notification/event/" + res["data"][0]["userId"],
                                {
                                    eventId: this.state.event['eventId'],
                                    eventName: this.state.event['eventName'],
                                    userId: localStorage.getItem("user")
                                },
                                options
                            );
                        }
                    });
            }
        }
        alert("You have shared this event")
    }
    render() {
        return (
            <div>
                { this.state.doneLoading &&
                    <Event event={this.state.event} doneLoading={this.state.doneLoading}/>
                }
                <form onSubmit={this.handleSubmit} className="form form1 w-100 bg-light">
                <label className="createEvent">
                        Share Event With: (emails
                        separated by commas)
                        <input
                            name="send_to"
                            className="createEventInput"
                            onChange={(e) =>
                                this.setState({ send_to: e.target.value })
                            }
                        />
                    </label>
                <button className="button button1">Submit</button>
                </form>

            </div>
            
        )
    }
}