import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from "axios";
import moment from "moment";

export default class ProfileCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventList: []
        };

        this.loadEvents = this.loadEvents.bind(this);
        this.loadEvents();
    }

    loadEvents() {
        const userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/event/user/" + userId)
        .then(res => {
            if (res.status === 200) {
                var temp = [];
                for(var i = 0; i<res["data"].length; i++) {
                    temp.push({title: res["data"][i]["eventName"], date: moment(res["data"][i]["date"]).format('YYYY-MM-DD')});
                }
                this.setState({eventList: temp});
            }
        });
    }

    render() {
        return (
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={this.state.eventList}
            />
        )
    }
}