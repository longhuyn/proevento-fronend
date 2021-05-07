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
        }
        
        this.loadGroupData = this.loadGroupData.bind(this);
        this.loadSuggestions = this.loadSuggestions.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onClickRequest = this.onClickRequest.bind(this);
        this.handleSuggestionClose = this.handleSuggestionClose.bind(this);
        this.handleSearchClose = this.handleSearchClose.bind(this);
        this.onClickVote = this.onClickVote.bind(this);
        this.handleEndDateClose = this.handleEndDateClose.bind(this);

        this.loadGroupData();
        this.loadSuggestions();
    }

    loadGroupData() {
        var userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/group/" + this.state.groupId)
        .then((res) => {
            if (res.status === 200) {
                this.setState({groupData: res["data"]});
                console.log(this.state.groupData);
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
                userId: userId,
                groupId: this.state.groupId
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
                var strii = this.state.dateText;
                console.log(strii);
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
                console.log(voters);
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
        /*
        let participants = [];
        if (this.state.groupData["participants"] != null) {
            participants = this.state.groupData["participants"];
        } 
        */
       // refreshing page makes "participants" null
        let participants = [];
        let owner;
        if (this.state.groupData != null) {
            participants = this.state.groupData["participants"];
            owner = this.state.groupData["owner"];
        }
        //owner = this.state.groupData["owner"];
        if (localStorage.getItem("user") == owner["userId"]) {
            return true;
        }
        for (var i = 0; i < participants.length; i++) {
            if (participants[i]["userId"] == localStorage.getItem("user")) {
                return true;
            }
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

    render() {
        return (
            <div>  
                { this.state.groupData &&
                    <Group data={this.state.groupData} page={true}/>
                }
                {this.state.groupData &&
                    <div className="d-flex justify-content-center">
                        { !this.state.reveal &&
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={this.onClickRequest}
                            >Request to join</Button>
                        }       
                        { this.state.reveal &&
                            <Button 
                                className="ml-2" 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => this.setState({dialogSearchOpen: true})}
                            >Invite user</Button>
                        }
                        <Button 
                            className="ml-2" 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => this.setState({dialogSuggestionOpen: true})}
                        >Add event suggestion</Button>
                        { this.state.reveal &&
                            <Button 
                                className="ml-2" 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => this.setState({dialogSuggestionDateOpen: true})}
                            >Set suggestion date</Button>

                        }
                    </div>
                }  

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
                    <DialogTitle className="text-center">Add event Suggestion</DialogTitle>
                    <DialogContent>
                        <div>
                            <p>Name</p>
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
                        <div className="mt-4">
                            <p>Date</p>
                            <TextField
                                id="datetime-local"
                                type="datetime-local"
                                variant="outlined"
                                type="datetime-local"
                                onChange={(e) => this.setState({ suggestionDate: e.target.value })}
                                InputLabelProps={{shrink: true,}}
                            />
                        </div>
                        <div className="mt-4">
                            <p>Description</p>
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
                            <p>Date</p>
                            <TextField
                                id="datetime-local"
                                type="datetime-local"
                                variant="outlined"
                                type="datetime-local"
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

                { this.state.suggestionList && this.state.suggestionList.length > 0 && this.isMemberOfGroup() &&
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
                        <Button variant="contained" color="primary" className="button button1 ml-2" onClick={this.onClickVote}>Vote</Button>
                    </div>
                }
                
            </div>
        )
    }
}