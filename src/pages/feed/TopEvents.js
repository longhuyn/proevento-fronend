import "./PublicFeed.css";
import React, { Component } from "react";
import Event from "../../components/event/Event";
import axios from "axios";

const options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class TopEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            profile: null,
            eventList: null,
        };
        this.loadData = this.loadData.bind(this);
        this.loadData();

        this.loadEvents = this.loadEvents.bind(this);
        this.loadEvents();
    }

    loadData() {
        const options = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                "Content-type": "Application/json",
            },
        };
        const userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/user/" + userId, options)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ user: res["data"] });
                }
            });

        axios.get("http://proevento.tk:3000/profile/" + userId, options)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ profile: res["data"] });
                }
            });
    }

    loadEvents() {
        axios.get("http://proevento.tk:3000/event/topten").then((res) => {
            if (res.status === 200) {
                this.setState({ eventList: res["data"] });
            }
        });
    }

    render() {
        return (
            <div>
                <h3 className="text-center">Top Events</h3>
                {this.state.eventList &&
                    this.state.eventList.map((event, i) => {
                        return (
                            <div key={event["eventId"]} className="mt-4">
                                <Event event={event}></Event>
                            </div>
                        );
                    })}
            </div>
        );
    }
}
