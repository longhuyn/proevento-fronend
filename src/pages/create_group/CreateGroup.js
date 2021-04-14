import React, { Component } from "react";
import axios from "axios";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

var options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
            "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: "",
            description: "",
            participants: "",
            logoImage: "",
            categories: [],
            availCategories: null,
            pickedCategory: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeLogoImage = this.onChangeLogoImage.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
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

    handleSubmit = (event) => {
        event.preventDefault();
        const user = localStorage.getItem("user");
        var participants = this.state.participants.split(",");
        for (var i = 0; i < participants.length; i++)
            participants[i] = participants[i].trim();

        axios.post(
            `http://proevento.tk:3000/group/create_group/` + user,
            {
                name: this.state.groupName,
                description: this.state.description,
                participants: participants,
                categories: this.state.categories,
                logo: this.state.logoImage
            },
            options
        )
        .then((res) => {
            console.log(res["data"]);
            if (res.status === 200) {
                window.location.href = "http://proevento.tk/home/group/" + res["data"]["groupId"];
            }
        });  
    };

    handleAddCategory() {
        const categories = this.state.categories;
        if (!categories.includes(this.state.pickedCategory)) {
            categories.push(this.state.pickedCategory);
            this.setState({categories: categories});
        }
    }

    removeCategory(name) {
        const categories = this.state.categories;
        categories.splice(categories.indexOf(name), 1);
        this.setState({categories: categories});
    }

    onChangeLogoImage(event) {
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
                    this.setState({ logoImage: res["data"]["url"] });
                }
            });
    }

    render() {
        return (
            <Card className="d-flex flex-column p-4 bg-light">
                <h1 className="text-center">Create Group</h1>
                <div>
                    <p>Group Name:</p>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        size="small" fullWidth
                        onChange={(e) =>
                            this.setState({ groupName: e.target.value })
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
                    <p className="d-inline">Categories:</p>
                    <div className="d-inline ml-2">
                        <Select
                            style={{width: "170px"}}
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
                        <IconButton 
                            className="mt-2" 
                            aria-label="delete" 
                            variant="contained" 
                            color="primary" 
                            onClick={this.handleAddCategory}>
                            <AddIcon fontSize="small"/>
                        </IconButton>
                    </div>
                    
                    <div className="mt-2" style={{marginLeft: "90px"}}>
                        { this.state.categories.map((category, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Button 
                                        className="ml-1"
                                        variant="contained" 
                                        size="small" 
                                        startIcon={<CloseIcon/>}
                                        onClick={() => this.removeCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className="mt-2">
                    <p>Participants (specified emails separated by comma):</p>
                    <TextField 
                        id="outlined-basic" 
                        variant="outlined" 
                        size="small" fullWidth
                        onChange={(e) =>
                            this.setState({ participants: e.target.value })
                        }
                    />
                </div>
                <div>
                    <img
                        width="150px"
                        className="d-block text-center mt-4"
                        src={this.state.logoImage}
                        style={{ margin: "auto" }}
                    />
                    <div className="d-flex justify-content-center mt-2">
                        <input
                            className="d-none"
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            onChange={this.onChangeLogoImage}
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

                <Button className="mt-3" variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
            </Card>
        );
    }
}
