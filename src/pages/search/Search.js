import "./Search.css";
import React from "react";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
import Profile from "../../components/profile/Profile";
import Event from "../../components/event/Event";
import DateFnsUtils from '@date-io/date-fns';
import Group from "../../components/group/Group";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';

var options = {
    headers: {
        "Access-Control-Allow-Origin" : "*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        "Content-type": "Application/json"
    }
};

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchOption: "event",
            searchText: "",
            searchList: [],
            buttonStates: {},
            emptyList: false,
            category: "education"
        };
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch() {
        const user = localStorage.getItem("user");
        var searchQuery = this.state.searchText;
        if (this.state.searchOption == "date") {
            searchQuery = moment(this.state.searchText).format('YYYY-MM-DD');
        }
        axios.get("http://proevento.tk:3000/search/" + this.state.searchOption+ "/" + searchQuery, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({searchList: res["data"]});
                if (this.state.searchList.length == 0) {
                    this.setState({emptyList: true});
                } else {
                    this.setState({emptyList: false});
                }
                console.log(this.state.searchList);
            } 
        });

    }


    render() {
        return (
            <div>
                <h3 className="text-center">Search</h3>
                <div className="text-center">
                    <Select
                        className="mt-3"
                        value={this.state.searchOption}
                        labelId="Search Option"
                        onChange={(event) => this.setState({searchOption: event.target.value, searchList: null, searchText: null, emptyList: false})}
                        style={{width: "200px"}}
                    >
                        <MenuItem value={"event"}>Event</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                        <MenuItem value={"eventCategory"}>Event Category</MenuItem>
                        <MenuItem value={"tags"}>Event Tag</MenuItem>
                        <MenuItem value={"date"}>Date</MenuItem>
                        <MenuItem value={"groupName"}>Group Name</MenuItem>
                        <MenuItem value={"groupCategory"}>Group Category</MenuItem>
                    </Select>
                    { this.state.searchOption != "date" && this.state.searchOption != "groupCategory" && this.state.searchOption != "eventCategory" &&
                        <TextField 
                            className="ml-2 w-25"
                            label="Search" 
                            onChange={(event) => this.setState({searchText: event.target.value, emptyList: false})} 
                            value={this.state.newTag}
                        />
                    }
                    { this.state.searchOption == "date" &&
                        <div className="ml-2 d-inline">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={this.state.searchText}
                                onChange={(time) => this.setState({searchText: time, emptyList: false})} 
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    }
                    { (this.state.searchOption == "groupCategory" || this.state.searchOption == "eventCategory") &&
                        <Select
                            className="mt-3"
                            value={this.state.searchText}
                            labelId="Category Options"
                            onChange={(event) => this.setState({searchList: null, searchText: event.target.value, emptyList: false})}
                            style={{width: "200px"}}
                        >
                            <MenuItem value={"education"}>Education</MenuItem>
                            <MenuItem value={"sports"}>Sports</MenuItem>
                            <MenuItem value={"music"}>Music</MenuItem>
                            <MenuItem value={"stonks"}>Stonks</MenuItem>
                            <MenuItem value={"memes"}>Memes</MenuItem>
                            <MenuItem value={"religion"}>Religion</MenuItem>                             
                            <MenuItem value={"coding"}>Coding</MenuItem>
                            <MenuItem value={"FUCLA"}>FUCLA</MenuItem>
                            <MenuItem value={"fitness"}>Fitness</MenuItem>
                            <MenuItem value={"animals"}>Animals</MenuItem>
                            <MenuItem value={"hobbies"}>Hobbies</MenuItem>
                            <MenuItem value={"politics"}>Politics</MenuItem> 
                            <MenuItem value={"instagram"}>Instagram</MenuItem>
                            <MenuItem value={"technology"}>Technology</MenuItem>
                            <MenuItem value={"gaming"}>Gaming</MenuItem>
                            <MenuItem value={"food"}>Food</MenuItem>
                            <MenuItem value={"environment"}>Environment</MenuItem>
                            <MenuItem value={"relationships"}>Relationships</MenuItem>
                            <MenuItem value={"anime"}>Anime</MenuItem>                             
                        </Select>

                    }
                    <Button className="ml-2" variant="contained" color="primary" onClick={this.onSearch}>Search</Button>
                </div>
                
                <div> 
                    { this.state.searchOption === "user" && this.state.searchList && this.state.searchList.map((user, i) => (
                        <div key={user["userId"]}>
                            <Card 
                                style={{cursor: "pointer"}}
                                className="mt-4 p-3 bg-light" 
                                onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/profile/" + user["userId"]);
                            }}>
                                <Profile userId={user["userId"]}></Profile>
                            </Card>
                        </div>
                    ))}
                    { (this.state.searchOption === "tags" || this.state.searchOption === "event" 
                    || this.state.searchOption === "date" || this.state.searchOption === "eventCategory" || this.state.searchOption == "description") &&
                        this.state.searchList && this.state.searchList.map((event, i) => {
                        return (
                            <div key={event["eventId"]} className="mt-4" onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/event/" + event["eventId"]);
                            }}>
                                <Event event={event} ></Event>
                            </div>
                        )
                    })}
                    {/* { this.state.searchOption === "date" && this.state.searchList && this.state.searchList.map((event, i) => {
                        return (
                            <div key={event["eventId"]} className="mt-4" onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/event/" + event["eventId"]);
                            }}>
                                <Event event={event} ></Event>
                            </div>
                        )
                    })} */}
                    { (this.state.searchOption === "groupName" || this.state.searchOption === "groupCategory")  && this.state.searchList && this.state.searchList.map((group, i) => {
                        return (
                            <Card key={group["groupId"]} className="mt-4 bg-light p-4" onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/group/" + group["groupId"]);
                            }}>
                                <Group data={group} page={false}/>
                            </Card>
                        )
                    })}
                    { (this.state.searchList == null || this.state.searchList.length == 0) && this.state.emptyList && 
                    (this.state.searchOption === "tags" || this.state.searchOption === "event" || this.state.searchOption === "date") &&
                        alert("No event was found")
                    }
                    { (this.state.searchList == null || this.state.searchList.length == 0) && this.state.emptyList &&
                    this.state.searchOption === "user" &&
                        alert("No user was found")
                    }
                    { (this.state.searchList == null || this.state.searchList.length == 0) && this.state.emptyList && 
                    (this.state.searchOption === "groupName" || this.state.searchOption === "groupCategory")&&
                        alert("No group was found")
                    }
                                
                </div>  
            </div>
        )
    }
}
