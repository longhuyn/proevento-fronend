import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import "./Reviews.css";
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';

export default class Categories extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            error: "",
            pickedCategory: "",
            availBadges: null,
            profileTags: []
        };
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.onSave = this.onSave.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.loadCategories();
    }

    loadCategories() {
        axios.get(`http://proevento.tk:3000/badges`)
        .then((res) => {
            if (res.status === 200) {
                this.setState({availBadges: res["data"]});
            }
        });
    }

    removeTag(tag) {
        var prevTags = this.state.profileTags;
        prevTags.splice(prevTags.indexOf(tag), 1);
        var prevProfile = prevTags;
        this.setState({profileTags: prevProfile});
    }

    onSave() {
        var options = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                "Content-type": "Application/json",
            },
        };
        const userId = localStorage.getItem("user");
        var currUrl = window.location;
        var result = /[^/]*$/.exec(currUrl)[0];
        console.log("event creator: " + result);
        /*
        axios.post("http://proevento.tk:3000/profile/badge/" + result, {
            badges: this.state.profileTags
        }, options)
        .then(res => {
            if (res.status === 200) {
                window.location.href = "http://proevento.tk/home/profile/" + result;
            }
        })
        */

        axios.get("http://proevento.tk:3000/profile/badge/" + result, options)
            .then((res) => {
                if (res.status === 200) { //what if empty
                    var badgeList = [];
                    if (res["data"].length != 0) {
                        badgeList = res["data"];
                        console.log(badgeList);
                    } 
                    var currBadgeList = this.state.profileTags;
                    var newList = badgeList.concat(currBadgeList);
                    console.log(newList);
                    axios.post("http://proevento.tk:3000/profile/badge/" + result,
                        {
                            badges: newList
                        },
                        options
                    ).then(res => {
                        if (res.status === 200) {
                            window.location.href = "http://proevento.tk/home/profile/" + result;
                        }
                    });
                    
                }
            }
        )

    }

    addTag() {
        const prevProfile = this.state.profileTags;
        if (!prevProfile.includes(this.state.pickedCategory)) {
            prevProfile.push(this.state.pickedCategory);
            this.setState({profileTags: prevProfile});  
        }
    }

    render() {
        return(
            <div>
                <h3 className="text-center">What Badges Would You Like to Give?</h3>
                <Grid>
                    <div>
                        <form noValidate autoComplete="off">
                            <div>
                                <label className="mt-4">Badges:</label>
                                {}
                                <Select
                                    style={{width: "250px"}}
                                    className="ml-2"
                                    value={this.state.pickedCategory}
                                    onChange={(e) => this.setState({pickedCategory: e.target.value})}
                                >
                                    { this.state.availBadges &&
                                    this.state.availBadges.map((category, index) => {
                                        return (
                                            <MenuItem key={index} value={category["name"]}>{category["name"]}</MenuItem>
                                        )
                                    })
                                    }
                                </Select>
                                <IconButton className="mt-2" aria-label="delete" variant="contained" color="primary" onClick={this.addTag}>
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>
                            { this.state.profileTags && this.state.profileTags.map((row, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <Button 
                                            className="ml-1"
                                            variant="contained" 
                                            size="large" 
                                            startIcon={<CloseIcon/>}
                                            onClick={() => this.removeTag(row)}
                                        >
                                            {row}
                                        </Button>
                                    </React.Fragment>
                                )
                                })
                            }
                        </form>
                    </div>
                    <div className="mt-2" >
                        <Button variant="contained" color="info" onClick={this.onSave}>Give Badges</Button>
                    </div>
                </Grid>
            </div>
        )
    }
}