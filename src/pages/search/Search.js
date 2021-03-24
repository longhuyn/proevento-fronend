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
            buttonStates: {}
        };
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch() {
        const user = localStorage.getItem("user");
        if (this.state.searchOption == "date") {
            var time = this.state.searchText;
            console.log(moment(time).format('YYYY-MM-DD'));
            return;
            this.setState({searchText: moment(time).format('YYYY-MM-DD')});
        }
        axios.get("http://proevento.tk:3000/search/"+this.state.searchOption+"/"+this.state.searchText, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({searchList: res["data"]});
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
                        onChange={(event) => this.setState({searchOption: event.target.value, searchList: null, searchText: null})}
                        style={{width: "100px"}}
                    >
                        <MenuItem value={"event"}>Event</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                        <MenuItem value={"tags"}>Tags</MenuItem>
                        <MenuItem value={"date"}>Date</MenuItem>
                    </Select>
                    { this.state.searchOption != "date" &&
                        <TextField 
                            className="ml-2 w-25"
                            label="Search" 
                            onChange={(event) => this.setState({searchText: event.target.value})} 
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
                                margin="normal"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={this.state.searchText}
                                onChange={(time) => this.setState({searchText: time})} 
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    }
                    
                    <Button className="ml-2" variant="contained" color="primary" onClick={this.onSearch}>Search</Button>
                </div>
                
                <div> 
                    { this.state.searchOption === "user" && this.state.searchList && this.state.searchList.map((user, i) => (
                        <div key={user["userId"]}>
                            <Card 
                                style={{cursor: "pointer"}}
                                className="mt-2 p-3 bg-light" 
                                onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/profile/" + user["userId"]);
                            }}>
                                <Profile userId={user["userId"]}></Profile>
                            </Card>
                        </div>
                    ))}
                    { this.state.searchOption === "tags" && this.state.searchList && this.state.searchList.map((event, i) => {
                        return (
                            <div key={event["eventId"]} className="mt-4" onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/event/" + event["eventId"]);
                            }}>
                                <Event event={event} ></Event>
                            </div>
                        )
                    })}
                    { this.state.searchOption === "event" && this.state.searchList && this.state.searchList.map((event, i) => {
                        return (
                            <div key={event["eventId"]} className="mt-4" onClick={(e) => {
                                e.preventDefault();
                                this.props.history.push("/home/event/" + event["eventId"]);
                            }}>
                                <Event event={event} ></Event>
                            </div>
                        )
                    })}
                </div>  
            </div>
        )
    }
}
