import React from "react";
import Group from "../../components/group/Group";
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Profile from "../../components/profile/Profile";
import Button from '@material-ui/core/Button';
import moment from 'moment';

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
            userName: null
        }
        
        this.loadGroupData = this.loadGroupData.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onClickRequest = this.onClickRequest.bind(this);
        this.loadGroupData();
        
    }

    loadGroupData() {
        var userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/group/" + this.state.groupId)
        .then((res) => {
            if (res.status === 200) {
                this.setState({groupData: res["data"]});
                console.log(res["data"]["ownerId"]);
                console.log(localStorage.getItem("user"));
                if(res["data"]["ownerId"] == localStorage.getItem("user")){
                    this.setState({reveal: true});
                   
                    console.log(this.state.reveal);
                }
            }
        });
        axios.get("http://proevento.tk:3000/user/" + userId, options)
        .then(res => {
            if (res.status === 200) {
                console.log(res["data"]);
                console.log(res["data"]["fullName"])
                this.setState({userName: res["data"]["fullName"]});
            }
        }) 
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
                alert("Request For User to Join has Been sent")
                console.log("WORKING SEND");
            } else {
                console.log("BORKED");
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
                console.log("WORKING SEND");
            } else {
                console.log("BORKED");
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.groupData && !this.state.reveal &&
                    <Button className="float-right" variant="contained" color="primary" onClick={this.onClickRequest}>Request to join</Button>
                }    
                { this.state.groupData &&
                    <Group data={this.state.groupData} page={true}/>
                }
                {this.state.reveal &&
                 <TextField 
                    className="ml-2 w-25"
                    label="Search" 
                    onChange={(event) => this.setState({searchText: event.target.value, emptyList: false})} 
                    value={this.state.newTag}
                />
                }
                {this.state.reveal &&
                    <Button className="ml-2" variant="contained" color="primary" onClick={this.onSearch}>Search</Button>
                }
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
            </div>
        )
    }
}