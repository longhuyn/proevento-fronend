import React, { Component } from "react";
import "./CreateEvent.css";
import axios from "axios";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import 'date-fns';

export default class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeProfileImage = this.onChangeProfileImage.bind(this);
        this.state = {
            event_name: "",
            description: "",
            send_to: "",
            private_event: false,
            isOpened: false,
            tags: "",
            eventId: null,
            eventImage: "",
            date: "", 
            selectedDate: ""
        };
    }

    handleDateChange(date) {
        console.log(date);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var options = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                "Content-type": "Application/json",
            },
        };
        const user = localStorage.getItem("user");

        axios.post(
            `http://proevento.tk:3000/event/create_event`,
            {
                eventName: this.state.event_name,
                description: this.state.description,
                participants: this.state.send_to.trim().split(","),
                tags: this.state.tags.trim().split(","),
                type: this.state.private_event,
                userId: user,
                eventImage: this.state.eventImage,
                date: this.state.date
            },
            options
        )
        .then((res) => {
            if (res.status === 200) {
                var thisEventId = res["data"]["eventId"];
                if (this.state.send_to && this.state.send_to != "") {
                    var split = this.state.send_to.trim().split(",");
                    console.log(split);
                    for (var i = 0; i < split.length; i++) {
                        axios.get("http://proevento.tk:3000/search/single/" + split[i], options)
                        .then((res) => {
                            if (res.status === 200) {
                                axios.post("http://proevento.tk:3000/notification/event/" + res["data"][0]["userId"],
                                    {
                                        eventId: thisEventId,
                                        eventName: this.state.event_name,
                                        userId: user
                                    },
                                    options
                                )
                                .then((res) => {
                                    console.log(res);
                                    window.location.href = "http://proevento.tk/home/event/" + thisEventId;
                                });
                            }
                        });
                    }
                }
                else {
                    window.location.href = "http://proevento.tk/home/event/" + thisEventId;
                }
            }
        });

        // axios.get("http://proevento.tk:3000/search/single_event/" + this.state.event_name, options)
        // .then((res) => {
        //     if (res.status === 200) {
        //         console.log(res["data"]["eventId"]);
        //         this.setState({ eventId: res["data"]["eventId"] });
        //     }
        // });
        
        
    };
    handleChange() {
        this.setState({ private_event: !this.state.private_event });
        this.setState({ isOpened: !this.state.isOpened });
    }

    onChangeProfileImage(event) {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("upload_preset", "xos7yjgl");
        axios
            .post(
                "https://api.cloudinary.com/v1_1/dpdpavftr/image/upload",
                formData
            )
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ eventImage: res["data"]["url"] });
                }
            });
    }
    render() {
        return (
            <Card className="d-flex flex-column p-4 bg-light">
                <h1 className="text-center">Create Event</h1>
                <div>
                    <p>Event Name:</p>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        size="small" fullWidth
                        onChange={(e) =>
                            this.setState({ event_name: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="mt-3">
                    <p>Description:</p>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        size="small" fullWidth
                        onChange={(e) =>
                            this.setState({ description: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="mt-3">
                    <p>Date of event:</p> 
                    <TextField
                        id="datetime-local"
                        type="datetime-local"
                        variant="outlined"
                        onChange={(e) =>
                            this.setState({ date: e.target.value })
                        }
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </div>
                <div className="mt-3">
                    <p>Tags: (separated by commas)</p>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        size="small" fullWidth
                        onChange={(e) =>
                            this.setState({ tags: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <img
                        width="150px"
                        className="d-block text-center"
                        src={this.state.eventImage}
                        style={{ margin: "auto" }}
                    />
                    <div className="d-flex justify-content-center mt-2">
                        <input
                            className="d-none"
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            onChange={this.onChangeProfileImage}
                        />
                        <label htmlFor="icon-button-file">
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </div>
                </div>
                <div>
                    <input
                        name="private_event"
                        type="checkbox"
                        onChange={this.handleChange}
                    />
                    This is a private event, leave unchecked for public
                </div>
                {this.state.isOpened && (
                    <div>
                        <p>private event for? (specified emails separated by comma)</p>
                        <TextField 
                            id="outlined-basic" 
                            variant="outlined" 
                            size="small" fullWidth
                            onChange={(e) =>
                                this.setState({ send_to: e.target.value })
                            }
                        />
                    </div>
                )}

                <Button className="mt-3" variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
            </Card>
        );
    }
}
