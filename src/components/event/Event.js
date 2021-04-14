import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import "./Event.css";
import Moment from 'react-moment';
import axios from "axios";

var options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
            "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
            event: this.props.event,
            eventDate: null,
            send_to: ""
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.send_to && this.state.send_to != "") {
            var split = this.state.send_to.trim().split(",");
            for (var i = 0; i < split.length; i++) {
                axios.get("http://proevento.tk:3000/search/single/" + split[i], options)
                    .then((res) => {
                        if (res.status === 200 && res["data"].length != 0) {
                            axios.post("http://proevento.tk:3000/notification/event/" + res["data"][0]["userId"],
                                {
                                    eventId: this.props.event['eventId'],
                                    eventName: this.props.event['eventName'],
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
        const user = localStorage.getItem('user');
        return(
            <Card className="mt-4 p-5 bg-light">
                <Grid container>
                    <Grid item xs={9}>
                        <Avatar className="avatar float-left" style={{cursor: "pointer"}}
                            onClick={(e) => {
                                window.location.href = "http://proevento.tk/home/profile/" + this.state.event["owner"]["userId"];
                            }} 
                            src={this.state.event["owner"]["profileImage"]} />
                        <h6 className="d-inline ml-2 align-items-center" style={{cursor: "pointer"}}
                            onClick={(e) => {window.location.href = "http://proevento.tk/home/profile/" + this.state.event["owner"]["userId"];
                                }}>{this.state.event["owner"]["fullName"]}</h6>
                        <h4 className="title" style={{cursor: "pointer"}}
                            onClick={(e) => {
                                window.location.href = "http://proevento.tk/home/event/" + this.state.event["eventId"];
                            }} >Event: {this.state.event["eventName"]}</h4>
                        <div className="time"><Moment format="YYYY-MM-DD HH:mm">{this.state.event["date"]}</Moment></div>
                        <p className = "description">Description: {this.state.event["description"]}</p>
                        {/* <div><label>Participants: {this.state.event["participants"].length}</label></div> */}
                        <div className = "tagList">
                            <label>Tags: </label>
                            {
                                this.state.event["tags"].map((row, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <span className="badge badge-secondary d-inline ml-1">{row}</span>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                        <div><label>Zoom link: 
                            <Button href={this.state.event["zoomLink"]} color="primary" target="_blank">
                                Click here
                            </Button>
                        </label></div>
                        <div>
                            <label>Type: 
                                { this.state.event["type"] == 0 && " Public"}
                                { this.state.event["type"] == 1 && " Private"}
                            </label>
                        </div>
                        { this.props.isEventPage &&
                            <div onSubmit={this.handleSubmit}>
                                <label>
                                    <p>Share Event With: (emails
                                    separated by commas)</p>
                                    <TextField 
                                        id="outlined-basic" 
                                        variant="outlined" 
                                        size="small" fullWidth
                                        onChange={(e) =>
                                            this.setState({ send_to: e.target.value })
                                        }
                                    />
                                </label>
                                <Button variant="contained" color="primary" className="button button1 ml-3" onClick={this.handleSubmit}>Submit</Button>
                            </div>
                        }
                        
                    </Grid>
                    <Grid item xs className="d-flex justify-content-center align-items-center">
                        {this.state.event["eventImage"] != null &&
                            <img src = {this.state.event["eventImage"]} width="250px"/>
                        }
                    </Grid>
                </Grid>
            </Card>
        )
    }
}