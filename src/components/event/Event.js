import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import "./Event.css";
import Moment from 'react-moment';

export default class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
            event: this.props.event,
            eventDate: null
        };
        
    }

    render() {
        const user = localStorage.getItem('user');
        return(
            <Card className="p-3 bg-light" className="mt-4 p-5">
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
                        {/* <i>{this.state.event["date"]}</i> */}
                        <div className="time"><Moment format="YYYY-MM-DD HH:mm">{this.state.event["date"]}</Moment></div>
                        <p className = "description">Description: {this.state.event["description"]}</p>
                        <div><label>Participants: {this.state.event["participants"].length}</label></div>
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
                    </Grid>
                    <Grid item xs className="d-flex justify-content-center align-items-center">
                        {this.state.event["eventImage"] != null &&
                            <img src = {this.state.event["eventImage"]} width="150px"/>
                        }
                    </Grid>
                </Grid>
            </Card>
        )
    }
}