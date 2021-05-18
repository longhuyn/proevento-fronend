import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import "./Event.css";
import Moment from 'react-moment';
import axios from "axios";
import moment from "moment";
import 'moment-timezone';
import HeartCheckbox from 'react-heart-checkbox';
import Heart from "react-animated-heart";

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
            send_to: "",
            recording: "",
            favoriteNum: 0,
            favoriteStatus: false
        };
        this.onCancelEvent = this.onCancelEvent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRecord = this.handleRecord.bind(this);
        this.onFavorite = this.onFavorite.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadData(); 
    }

    loadData = (event)=> {
        axios.patch("http://proevento.tk:3000/event/favorite/" + this.props.event['eventId'], {
                favoriterId: localStorage.getItem("user")
            },  options)
        .then(res=>{
            if (res["data"]==="true"){
                this.setState({favoriteStatus: true});
            }
            else{
                this.setState({favoriteStatus: false});
            }
        });
        axios.get("http://proevento.tk:3000/event/" + this.props.event['eventId'], options)
        .then(res => {
            if (res.status === 200) {
                this.setState({event: res["data"]});
                this.setState({favoriteNum: this.state.event["favorites"].length});
            }
        });
    }

    handleRecord = (event)=> {
        event.preventDefault();
        console.log("Made it");
        if(this.state.recording && this.state.recording != ""){
            console.log(this.props.event["participants"]);
            console.log("In If statement");
            axios.post("http://proevento.tk:3000/event/recording/"+ this.props.event['eventId'],{
                uploadLink: this.state.recording,
                participants: this.props.event["participants"],
                eventName: this.props.event['eventName'],
                userId: localStorage.getItem("user"),
                eventId: this.props.event['eventId']
            }, options).then((res)=> {
                if (res.status === 200){
                    alert("Successfully uploaded link");
                }
            });
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.send_to && this.state.send_to != "") {
            var split = this.state.send_to.trim().split(",");
            for (var i = 0; i < split.length; i++) {
                axios.get("http://proevento.tk:3000/search/single/" + split[i], options)
                    .then((res) => {
                        
                        if (res.status === 200 && res["data"].length != 0) {
                            console.log(res["data"]);
                            axios.post("http://proevento.tk:3000/notification/eventemp/" + res["data"][0]["userId"],
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

    handleReview = (event) => {
        event.preventDefault();
        axios.get("http://proevento.tk:3000/event/review/" + this.props.event['eventId'], options)
            .then((res) => {
                const currUser = localStorage.getItem("user");
                console.log("currUser: " + currUser);

                const eventCreator = this.props.event['userId'];
                if (res.status === 200) { //what if empty
                    var reviewList = [];
                    if (res["data"].length != 0) {
                        reviewList = res["data"];
                        console.log(reviewList);
                    }
                    if (reviewList.indexOf(currUser) > -1) {
                        alert("You have already reviewed this user for this event")
                    }
                    else {
                        reviewList.push(currUser);
                        console.log(reviewList);
                        axios.post("http://proevento.tk:3000/event/review/" + this.props.event['eventId'],
                            {
                                reviews: reviewList
                            },
                            options
                        ).then(res => {
                            if (res.status === 200) {
                                window.location.href = "http://proevento.tk/home/reviews/" + eventCreator;
                            }
                        });
                    }
                }
            })
    }

    onCancelEvent = (event) => {
        event.preventDefault();
        axios.post("http://proevento.tk:3000/notification/cancel/" +this.props.event['eventId'], options).then(
            res=> {
                if(res.status===200){
                    alert("You have canceled event");
                    window.location.href = "http://proevento.tk/home/";
                    
                }
            }
        )
    }

    onFavorite = (event) => {
        event.preventDefault();
        if(this.state.favoriteStatus == false) {
            axios.post("http://proevento.tk:3000/event/favorite/" + this.props.event['eventId'], {
                favoriterId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if (res.status === 200) {
                    axios.get("http://proevento.tk:3000/event/" + this.props.event['eventId'], options)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({event: res["data"]});
                            this.setState({favoriteNum: this.state.event["favorites"].length});
                        }
                    this.setState({followStatus: true});
                    this.loadData();
                    });
                }
            });
        } else {
            axios.put("http://proevento.tk:3000/event/favorite/" + this.props.event['eventId'], {
                favoriterId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if (res.status === 200) {
                    axios.get("http://proevento.tk:3000/event/" + this.props.event['eventId'], options)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({event: res["data"]});
                            this.setState({favoriteNum: this.state.event["favorites"].length});
                        }
                    this.setState({followStatus: false});
                    this.loadData();
                    });
                }
            });
        }
    }

    render() {
        const user = localStorage.getItem('user');
        return(
            <Card className="mt-4 p-5 bg-light">
                <div>
                    <div className="favoriteButton">
                        <div className="buttonWrapper">
                            <Heart
                                isClick={this.state.favoriteStatus}
                                onClick={this.onFavorite}
                                style={{height: "20px", width: "20px"}}
                            >
                            </Heart>
                            <div className="favorite">{this.state.favoriteNum + " Favorites"}</div>
                        </div>
                    </div>
                </div>
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
                            <label>Categories: </label>
                            {
                                this.state.event["categories"].map((row, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <span className="badge badge-secondary d-inline ml-1">{row}</span>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                        <div className = "tagList">
                            <label>Tags: </label>
                            {
                                this.state.event["tags"].map((row, i) => {
                                   console.log(row);
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

                                { ((moment(this.state.event["date"]).valueOf() < moment()) && (moment() - (moment(this.state.event["date"]).valueOf()) <= 3600000)) 
                                    && localStorage.getItem("user") != this.state.event["userId"] &&
                                 <Button variant="contained" color="primary" className="button button1 ml-3" onClick={this.handleReview}>Give Badges</Button>
                                }
                            </div>
                        }
                    </Grid>
                    <Grid item xs className="d-flex justify-content-center align-items-center">
                        {this.state.event["eventImage"] != null &&
                            <img src = {this.state.event["eventImage"]} width="250px"/>
                        }
                    </Grid>
                    <div>
                        {
                            this.props.isEventPage && this.state.event["recorded"] &&
                            <div onSubmit = {this.handleRecord}>
                                <label>
                                    <div className="mt-3">
                                        <Checkbox checked={true} disabled={true}/>
                                        <p className="d-inline">This Event will be Recorded</p>
                                    </div>
                                    
                                    <p>If you wish to record, manually record on zoom and upload the file to google drive, share all and upload link here:</p>
                                    <TextField 
                                        id="outlined-basic" 
                                        variant="outlined" 
                                        size="small" fullWidth
                                        onChange={(e) =>
                                            this.setState({ recording: e.target.value })
                                        }
                                    />
                                </label>

                                <Button variant="contained" color="primary" className="button button1 ml-3" onClick={this.handleRecord}>Submit</Button>
                            </div>
                        }
                    </div>
                    <div>
                        { this.state.event["Record"] &&
                        
                            <label>Recording link: 
                                <Button href={this.state.event["Record"]} color="primary" target="_blank">
                                    Click here
                                </Button>
                            </label>
                        }
                    </div> 
                </Grid>
                { this.props.isEventPage && this.state.event["userId"] == user &&
                    <Button
                        className="mt-2"
                        variant="contained"
                        color="secondary"
                        onClick={this.onCancelEvent}>
                        Cancel Event
                    </Button>
                }
            </Card>
        )
    }
}