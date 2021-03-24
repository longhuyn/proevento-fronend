import React from "react";
import "./Profile.css"
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            profile: this.props.profile,
            newTag: ""
        }
        this.onChangeProfileImage = this.onChangeProfileImage.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.addTag = this.addTag.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    removeTag(tag) {
        var prevProfile = this.state.profile;
        var prevTags = prevProfile["tags"];
        prevTags.splice(prevTags.indexOf(tag), 1);
        prevProfile["tags"] = prevTags;
        this.setState({profile: prevProfile});
    }

    onChangeProfileImage(event) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('upload_preset', 'xos7yjgl');
        axios.post('https://api.cloudinary.com/v1_1/dpdpavftr/image/upload', formData)
        .then(res => {
            if (res.status === 200) {
                var prevUser = this.state.user;
                prevUser["profileImage"] = res["data"]["url"];
                this.setState({user: prevUser});
            }
        })
    }

    addTag() {
        const prevProfile = this.state.profile;
        if (!prevProfile["tags"])
            prevProfile["tags"] = [];
        prevProfile["tags"].push(this.state.newTag.toLowerCase());
        this.setState({newTag: ""}); 
    }

    onNameChange(event) {
        const prevUser = this.state.user;
        prevUser["fullName"] = event.target.value;
        this.setState({user: prevUser});
    }

    onSave() {
        const options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        const userId = localStorage.getItem("user");
        console.log(userId);
        axios.put("http://proevento.tk:3000/user/" + userId, {
            fullName: this.state.user["fullName"],
            profileImage: this.state.user["profileImage"]
        }, options)
        .then(res => {
            if (res.status === 200) {
                axios.post("http://proevento.tk:3000/profile/tag/" + userId, {
                    tags: this.state.profile["tags"]
                }, options)
                .then(res => {
                    if (res.status === 200)
                        this.props.doneEditing();
                })
            }
        });
    }

    onCancel() {
        this.props.doneEditing();
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={3}>
                        <img width="150px" className="d-block text-center" src={this.state.user["profileImage"]} style={{margin: "auto"}}/>
                        <div className="d-flex justify-content-center mt-2">
                            <input className="d-none" accept="image/*" id="icon-button-file" type="file" onChange={this.onChangeProfileImage}/>
                            <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            </label>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <form noValidate autoComplete="off">
                            <TextField fullWidth className="d-block" id="fullName" label="Full Name" value={this.state.user["fullName"]} onChange={this.onNameChange}/>
                            <div>
                                <TextField 
                                    id="addTag" 
                                    label="Add Tag" 
                                    onChange={(event) => this.setState({newTag: event.target.value})} 
                                    value={this.state.newTag}
                                />
                                <IconButton className="mt-2" aria-label="delete" variant="contained" color="primary" onClick={this.addTag}>
                                    <AddIcon fontSize="small"/>
                                </IconButton>
                            </div>
                            <label className="mt-4">Tags:</label>
                            {
                                !this.state.profile["tags"] &&
                                <span className="ml-2">empty</span>
                            }
                            { this.state.profile["tags"] && this.state.profile["tags"].map((row, i) => {
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
                                })
                            }
                        </form>
                        <div className="mt-2" >
                            <Button variant="contained" color="primary" onClick={this.onSave}>Save</Button>
                            <Button className="ml-2" variant="contained" color="secondary" onClick={this.onCancel}>Cancel</Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );    
    }
}