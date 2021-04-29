import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import "./Categories.css";
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
            availCategories: null,
            categories: []
        };
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
        this.onSave = this.onSave.bind(this);
        this.loadCategories = this.loadCategories.bind(this);

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

    removeTag(tag) {
        var prevCategories = this.state.categories;
        prevCategories.splice(prevCategories.indexOf(tag), 1);
        this.setState({categories: prevCategories});
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
        axios.post("http://proevento.tk:3000/profile/tag/" + userId, {
            tags: this.state.categories
        }, options)
        .then(res => {
            if (res.status === 200) {
                window.location.href = "http://proevento.tk/home/feed/";
            }
        })
    }

    addTag() {
        const prevCategories = this.state.categories;
        if (!prevCategories.includes(this.state.pickedCategory)) {
            prevCategories.push(this.state.pickedCategory);
            this.setState({categories: prevCategories});  
        }
    }

    render() {
        return(
            <div>
                <h3 className="text-center">What Are Your Interests?</h3>
                <Grid item xs={12} alignItems="center">
                    <div>
                        <form noValidate autoComplete="off">
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
                                <IconButton className="mt-2" aria-label="delete" variant="contained" color="primary" onClick={this.addTag}>
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>
                            <div style={{marginLeft: "85px"}}>
                                { this.state.categories && this.state.categories.map((row, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <Button 
                                                className="ml-1"
                                                variant="contained" 
                                                size="small" 
                                                startIcon={<CloseIcon/>}
                                                onClick={() => this.removeTag(row)}
                                            >
                                                {row}
                                            </Button>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                            
                        </form>
                    </div>
                    <div className="mt-2" >
                        <Button variant="contained" color="primary" onClick={this.onSave}>Get Started</Button>
                    </div>
                </Grid>
            </div>
        )
    }
}