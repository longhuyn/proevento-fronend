import React from "react";
import axios from "axios";
import Event from "../../components/event/Event";

const options = {
    headers: {
        "Access-Control-Allow-Origin" : "*",
        'Access-Control-Allow-Methods' : 'GET',
        "Content-type": "Application/json"
    }
};

export default class PersonalEvents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventList: null,
            userId: this.props.userId
        }

        this.loadEvents = this.loadEvents.bind(this);
        this.loadEvents();
    }

    loadEvents() {
        const userId = this.state.userId;
        axios.get("http://proevento.tk:3000/event/user/" + userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({eventList: res["data"]});
            }
        });
    }

    render() {
        return (
            <div>
                <h3 className="text-center">List of hosted events:</h3>
                { this.state.eventList && 
                    this.state.eventList.map((row, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className="mt-4">
                                    <Event event={row}/>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        )
    }
}