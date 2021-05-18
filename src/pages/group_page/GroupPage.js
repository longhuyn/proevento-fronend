import React from "react";
import Group from "../../components/group/Group";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Profile from "../../components/profile/Profile";
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";


const options = {
    headers: {
        "Access-Control-Allow-Origin" : "*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        "Content-type": "Application/json"
    }
};

export default class GroupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: this.props.match.params.groupId,
            groupData: null,
            reveal: false,
            searchOption: "user",
            searchList: [],
            emptyList: false,
            suggestionList: null,
            userName: null,
            dialogSuggestionOpen: false,
            dialogSearchOpen: false,
            selectedSuggestionId: null,
            dialogSuggestionDateOpen: false,
            pickedCategory: "",
            availCategories: null,
            categories: [],
            availCategories: null,
            recorded: false,
            status: "PENDING"
        }
        
        this.loadGroupData = this.loadGroupData.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.loadSuggestions = this.loadSuggestions.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onClickRequest = this.onClickRequest.bind(this);
        this.handleSuggestionClose = this.handleSuggestionClose.bind(this);
        this.handleSearchClose = this.handleSearchClose.bind(this);
        this.onClickVote = this.onClickVote.bind(this);
        this.handleEndDateClose = this.handleEndDateClose.bind(this);
        this.onChangeProfileImage = this.onChangeProfileImage.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);

        this.loadCategories();
        this.loadGroupData();
        this.loadSuggestions();
    }

    loadGroupData() {
        var userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/group/" + this.state.groupId)
        .then((res) => {
            if (res.status === 200) {
                this.setState({groupData: res["data"]});
                // console.log(groupData);
                if(res["data"]["ownerId"] == localStorage.getItem("user")){
                    this.setState({reveal: true});
                }
            }
        });
        axios.get("http://proevento.tk:3000/user/" + userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({userName: res["data"]["fullName"]});
            }
        });

    }

    loadSuggestions() {
        axios.get("http://proevento.tk:3000/group/suggestion/" + this.state.groupId)
        .then((res) => {
            if (res.status === 200) {
                this.setState({suggestionList: res["data"]});
            }
        });
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
            } 
        });
    }

    onRequest(recipientId){
        const userId = localStorage.getItem('user');
        var gId = this.state.groupId
        axios.post(
            "http://proevento.tk:3000/group/request/" + recipientId,
            {
                owner: true,
                userId: userId,
                groupId: gId
            },
            options
        ).then((res) => {
            if (res.status === 200) {
                alert("Successfully added the suggestion");
            }
        });
    }

    onClickRequest(){
        const userId = localStorage.getItem('user');
        var gId = this.state.groupId
        axios.post(
            "http://proevento.tk:3000/group/request/owner",
            {
                userId: userId,
                groupId: gId
            },
            options
        ).then((res) => {
            if (res.status === 200) {
                alert("Request For User to Owner has Been sent")
            }
        });
    }

    handleSuggestionClose() {
        const userId = localStorage.getItem("user");
        axios.post(
            "http://proevento.tk:3000/group/suggestion/create",
            {
                name: this.state.suggestionName,
                date: this.state.suggestionDate,
                description: this.state.suggestionDescription,
                eventImage: this.state.eventImage,
                userId: userId,
                groupId: this.state.groupId,
                categories: this.state.categories,
                tags: this.state.tags,
                recorded: this.state.recorded,
                status: this.state.status
            }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({dialogSuggestionOpen: false});
                this.loadSuggestions();
            }
        });
    }

    handleSearchClose() {
        this.setState({dialogSearchOpen: false, searchList: []});
    }

    handleEndDateClose() {
        axios.post(
            "http://proevento.tk:3000/group/setDate",
            {
                groupId: this.state.groupId,
                dateText: this.state.dateText
            }
        ).then((res) => {
            if (res.status === 200) {
                this.setState({dialogSuggestionDateOpen: false});
                this.loadGroupData();

                // var strii = this.state.dateText;
                // console.log(strii);
            }
        });
    }

    onClickVote() {
        console.log("suggestion id: " + this.state.selectedSuggestionId);
        let currUser =  localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/group/suggestion/vote/" + this.state.selectedSuggestionId, options)
        .then(res => {
            if (res.status === 200) {
                let voters = res["data"];
                if (voters.includes(currUser)) {
                    alert("You have already voted for this suggestion!");
                } else {
                    axios.post("http://proevento.tk:3000/group/suggestion/vote/" + this.state.selectedSuggestionId, {
                        voterId: localStorage.getItem("user")
                    },  options)
                    .then(res => {
                        if (res.status === 200) {
                            alert("Successfully voted for this suggestion!");
                            window.location.href = "http://proevento.tk/home/group/" + this.state.groupId;
                        }
                    });
                }
            }
        });
    }

    isMemberOfGroup() {
        const userId = localStorage.getItem("user");
        if (!this.state.groupData["participants"])
            return false;
        for (var i = 0; i < this.state.groupData["participants"].length; i++) {
            if (this.state.groupData["participants"][i]["userId"] == userId)
                return true;
        }
        if (this.state.groupData["ownerId"] == userId) {
            return true;
        }
        return false;
    }

    getNumVotes(suggestion) {
        if (suggestion == null) {
            return 0;
        }
        else {
            let count = (suggestion.match(/\d/g) || []).length;
            return count;
        }
    }

    loadCategories() {
        axios.get(`http://proevento.tk:3000/category`)
        .then((res) => {
            console.log(res);
            if (res.status === 200) {
                this.setState({availCategories: res["data"]});
            }
        });
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
            <div>  
                { this.state.groupData &&
                    <Group data={this.state.groupData} page={true}/>
                }
                { this.state.groupData &&
                    <Grid container>
                    <Grid item xs={3}>
                        <img width="150px" className="d-block text-center" style={{margin: "auto"}}/>
                    </Grid>
                    <Grid item item xs={9}>
                        <div>
                            <p className="d-inline float-left" style={{width: "100px"}}>End Date: </p>
                            <div className="d-block" style={{marginLeft: "105px"}}>
                                {this.state.groupData["suggestionDate"] == "" && 
                                    <p>No end date set</p>
                                }
                                {this.state.groupData["suggestionDate"] != "" &&
                                    <p>{this.state.groupData["suggestionDate"]} </p>
                                }
                            </div>
                        </div>
                    </Grid>
                    </Grid>
                }
                <div className="d-flex justify-content-center">
                    { this.state.groupData && !this.isMemberOfGroup() &&
                        <div>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={this.onClickRequest}
                            >Request to join</Button>
                        </div>
                    }
                    { this.state.groupData && !this.state.reveal && this.isMemberOfGroup() &&
                        <div>
                            <Button 
                                className="ml-2" 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => this.setState({dialogSuggestionOpen: true})}
                            >Add event suggestion
                            </Button>
                        </div>
                    }       
                    { this.state.groupData && this.state.reveal &&
                        <Button 
                            className="ml-2" 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => this.setState({dialogSearchOpen: true})}
                        >Invite user</Button>
                    }
                    { this.state.groupData && this.state.reveal &&
                        <Button 
                            className="ml-2" 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => this.setState({dialogSuggestionDateOpen: true})}
                        >Set suggestion date</Button>
                    }  
                </div>
                <Dialog
                    open={this.state.dialogSearchOpen} 
                    onClose={this.handleSearchClose} 
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogTitle className="text-center">Invite user to group</DialogTitle>
                    <DialogContent>
                        <TextField 
                            className="ml-2 w-25"
                            label="Search" 
                            onChange={(event) => this.setState({searchText: event.target.value, emptyList: false})} 
                            value={this.state.newTag}
                        />
                        <Button 
                            className="ml-2" 
                            variant="contained" 
                            color="primary" 
                            onClick={this.onSearch}
                        >Search</Button>
                        { !this.state.emptyList && this.state.searchList && this.state.searchList.map((user, i) => (
                            <div key={user["userId"]}>
                                <Card 
                                    style={{cursor: "pointer"}}
                                    className="mt-2 p-3 bg-light" >
                                    <Profile userId={user["userId"]}></Profile>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={()=>this.onRequest(user["userId"])}>Request User to Join</Button>
                                </Card>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions className="d-flex justify-content-center">
                        <Button onClick={this.handleSearchClose} color="primary">
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog 
                    open={this.state.dialogSuggestionOpen} 
                    onClose={() => this.setState({dialogSuggestionOpen: false})} 
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogContent>
                        <h1 className="text-center">Add Suggested Event</h1>
                        <div>
                            <p>Event Name:</p>
                            <TextField 
                                id="outlined-basic" 
                                variant="outlined" 
                                size="small" fullWidth
                                onChange={(e) =>
                                    this.setState({ suggestionName: e.target.value })
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
                                    this.setState({ suggestionDescription: e.target.value })
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
                                onChange={(e) => this.setState({ suggestionDate: e.target.value })}
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
                            <Checkbox
                                checked={this.state.recorded}
                                color="primary"
                                onClick={() => {
                                    var temp = this.state.recorded;
                                    this.setState({recorded: !temp});
                                }}
                            />
                            Request particpants to record event?
                        </div>
                    </DialogContent>
                    <DialogActions className="d-flex justify-content-center">
                        <Button onClick={() => this.setState({dialogSuggestionOpen: false})} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSuggestionClose} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Dialog 
                    open={this.state.dialogSuggestionDateOpen} 
                    onClose={() => this.setState({dialogSuggestionDateOpen: false})} 
                    fullWidth={true}
                    maxWidth="md"
                >
                    <DialogTitle className="text-center">Set end date for event suggestions</DialogTitle>
                    <DialogContent>
                        <div className="mt-4">
                            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                id="date-picker-inline"
                                label="Date picker inline"
                                onChange={(time) => this.setState({dateText: time})} 
                                />
                            </MuiPickersUtilsProvider> */}
                            <TextField
                                id="date"
                                // type="datetime-local"
                                // format = "MM/dd/yyyy"
                                label = "End Date"
                                // variant="outlined"
                                type="date"
                                onChange={(e) => this.setState({ dateText: e.target.value })}
                                InputLabelProps={{shrink: true,}}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className="d-flex justify-content-center">
                    <Button onClick={this.handleEndDateClose} color="primary">
                            Set Date
                        </Button>
                    </DialogActions>
                </Dialog>

                { this.state.suggestionList && this.state.groupData && this.state.suggestionList.length > 0 && this.isMemberOfGroup() &&
                    <div className="mt-4">
                        <h5 className="text-center">Vote Suggestion</h5>
                        { this.state.suggestionList.map((suggestion, i) => {
                            return (
                                <Card key={i} className="bg-light p-3 mt-2">
                                    <Checkbox 
                                        color="primary"
                                        onClick={(e) => this.setState({selectedSuggestionId: suggestion["id"]})}
                                        checked={this.state.selectedSuggestionId == suggestion["id"]}
                                    />
                                    <p>Name: {suggestion["name"]}</p>
                                    <p>Date: {moment(suggestion["date"]).format('YYYY-MM-DD')}</p>
                                    <p>Description: {suggestion["description"]}</p>
                                    <p>Votes: {this.getNumVotes(suggestion["voters"])}</p>
                                    <div className="d-flex align-items-center">
                                        <p className="m-0">User:</p>
                                        <Avatar
                                            className="float-left ml-2"
                                            src={suggestion["user"]["profileImage"]}
                                        />
                                        <p className="ml-2 m-0">{suggestion["user"]["fullName"]}</p>
                                    </div>
                                </Card>
                            )
                        })}
                        <Button variant="contained" color="primary" className="button button1 ml-2 mt-2" onClick={this.onClickVote}>Vote</Button>
                    </div>
                } 
            </div>
        )
    }
}