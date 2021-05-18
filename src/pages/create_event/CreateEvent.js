import React, { Component } from "react";
import "./CreateEvent.css";
import axios from "axios";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import 'date-fns';
import moment from "moment";
import 'moment-timezone';

var options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
            "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
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
            selectedDate: "",
            pickedCategory: "",
            availCategories: null,
            categories: [],
            recorded: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRecord = this.handleRecord.bind(this);
        this.onChangeProfileImage = this.onChangeProfileImage.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);

        this.loadCategories();
    }

    loadCategories() {
        axios.get(`http://proevento.tk:3000/category`)
        .then((res) => {
            if (res.status === 200) {
                this.setState({availCategories: res["data"]});
            }
        });
    }

    handleDateChange(date) {
        console.log(date);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user = localStorage.getItem("user");

        axios.post(
            `http://proevento.tk:3000/event/create_event`,
            {
                eventName: this.state.event_name,
                description: this.state.description,
                participants: this.state.send_to.trim().split(","),
                categories: this.state.categories,
                tags: this.state.tags,
                type: this.state.private_event,
                userId: user,
                eventImage: this.state.eventImage,
                date: this.state.date,
                recorded: this.state.recorded
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
                                        userId: user,
                                    },
                                    options);
                            }
                        });
                    }
                    window.location.href = "http://proevento.tk/home/event/" + thisEventId;
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
    handleRecord() {
        this.setState({ recorded: !this.state.recorded });
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

    addCategory() {
        const prevCategories = this.state.categories;
        if (!prevCategories.includes(this.state.pickedCategory)) {
            prevCategories.push(this.state.pickedCategory);
            this.setState({categories: prevCategories});  
        }
    }

    removeCategory(tag) {
        var prevCategories = this.state.categories;
        prevCategories.splice(prevCategories.indexOf(tag), 1);
        this.setState({categories: prevCategories});
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
                        type="datetime-local"
                        onChange={(e) => this.setState({ date: e.target.value })}
                        InputLabelProps={{shrink: true,}}
                    />
                </div>
                <div>
                    <label className="mt-4">Categories:</label>
                    <Select
                        style={{width: "250px"}}
                        className="ml-2"
                        value={this.state.pickedCategory}
                        onChange={(e) => this.setState({pickedCategory: e.target.value})}
                    >
                        { this.state.availCategories &&
                        this.state.availCategories.map((category, index) => {
                            return (
                                <MenuItem key={index} value={category["name"]}>{category["name"]}</MenuItem>
                            )
                        })
                        }
                    </Select>
                    <IconButton className="mt-2" aria-label="delete" variant="contained" color="primary" onClick={this.addCategory}>
                        <AddIcon fontSize="small"/>
                    </IconButton>
                </div>
                <div style={{marginLeft: "85px"}}>
                    { this.state.categories.map((row, i) => {
                        return (
                            <React.Fragment key={i}>
                                <Button 
                                    className="ml-1"
                                    variant="contained" 
                                    size="small" 
                                    startIcon={<CloseIcon/>}
                                    onClick={() => this.removeCategory(row)}
                                >
                                    {row}
                                </Button>
                            </React.Fragment>
                        )
                        })
                    }
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
                        className="d-block text-center mt-4"
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
                        onChange={this.handleRecord}
                    />
                    Request particpants to record event?
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
