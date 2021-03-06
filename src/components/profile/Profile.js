import "./Profile.css";
import React from "react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import EditProfile from "../../components/profile/EditProfile";
import PersonalEvents from "../../components/personal_events/PersonalEvents";
import ViewFollow from "../../components/profile/ViewFollow";
import Event from "../../components/event/Event";
import axios from 'axios';
import Moment from 'react-moment';
import moment from "moment";
import 'moment-timezone';

const options = {
    headers: {
        "Access-Control-Allow-Origin" : "*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        "Content-type": "Application/json"
    }
};

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            isEdit: false,
            isViewFollowers: false,
            isViewFollowing: false,
            followListData: [],
            eventList: null,
            user: null,
            profile: null,
            followersNum: 0,
            followingNum: 0,
            hostedNum: 0,
            upcomingNum: 0,
            entertainingNum: 0,
            onTimeNum: 0,
            informativeNum: 0,
            lifeChangingNum: 0,
            trashNum: 0,
            amazingNum: 0,
            mustWatchNum: 0,
            visionaryNum: 0,
            wasteOfTimeNum: 0,
            lovelyNum: 0,
            followStatus: "FOLLOW"
        };
        this.onClickEdit = this.onClickEdit.bind(this);
        this.doneEditing = this.doneEditing.bind(this);
        this.onClickViewFollowers = this.onClickViewFollowers.bind(this);
        this.onClickViewFollowing = this.onClickViewFollowing.bind(this);
        this.onView = this.onView.bind(this);
        this.onClickFollow = this.onClickFollow.bind(this);
        this.doneViewFollow = this.doneViewFollow.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onClickRequest = this.onClickRequest.bind(this);

        if (this.props.match && this.props.match.params && this.props.match.params.userId) {
            this.setState({userId: this.props.match.params.userId});
        }
            
        this.loadData();
    }

    loadData() {
        const options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        axios.post("http://proevento.tk:3000/profile/checkFollow/" + localStorage.getItem("user"),{
            idToCheck: this.state.userId
        }, options )
        .then(res=>{
            console.log(res["data"]);
            if (res["data"]==="true"){
                this.setState({followStatus: "UNFOLLOW"});
            }
            else{
                this.setState({followStatus: "FOLLOW"});
            }
        });
        axios.get("http://proevento.tk:3000/user/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({user: res["data"]});
            }
        });
        axios.get()

        axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({profile: res["data"]});
                if (this.state.profile == null) {

                }
                else {
                    this.setState({followersNum: this.state.profile["followers"].length});
                    this.setState({followingNum: this.state.profile["following"].length});
                }
            }
        });
        //api.add_resource(GetUserEventsAPI, '/event/user/<userId>')
        axios.get("http://proevento.tk:3000/event/user/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                //const eventList = res["data"];
                let numHosted = 0;
                let numUpcoming = 0;
                res["data"].map((row, i) => {
                   let curDate = moment();
                   let date = moment(row["date"]).valueOf();
                   if (curDate > date) {
                       numHosted++;
                   }
                   else {
                       numUpcoming++;
                   }
                   //console.log("date: " + date + " " + curDate);
                });
                this.setState({hostedNum: numHosted});
                this.setState({upcomingNum: numUpcoming});
            }
        });

        axios.get("http://proevento.tk:3000/profile/badge/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                //const eventList = res["data"];
                let entertainingNum = 0;
                let onTimeNum = 0;
                let informativeNum = 0;
                let lifeChangingNum = 0;
                let trashNum = 0;
                let amazingNum = 0;
                let mustWatchNum = 0;
                let visionaryNum = 0;
                let wasteOfTimeNum = 0;
                let lovelyNum = 0;
                res["data"].map((row, i) => {
                    let curDate = moment();
                    let date = moment(row["date"]).valueOf();
                    if (row == "Informative") {
                        informativeNum++;
                    }
                    else if (row == "On Time") {
                        onTimeNum++;
                    }
                    else if (row == "Entertaining") {
                        entertainingNum++;
                    }
                    else if (row == "Life Changing") {
                        lifeChangingNum++;
                    }
                    else if (row == "Trash") {
                        trashNum++;
                    }
                    else if (row == "Amazing") {
                        amazingNum++;
                    }
                    else if (row == "Must Watch") {
                        mustWatchNum++;
                    }
                    else if (row == "Visionary") {
                        visionaryNum++;
                    }
                    else if (row == "Waste of Time") {
                        wasteOfTimeNum++;
                    }
                    else if (row == "Lovely") {
                        lovelyNum++;
                    }
                   //console.log("date: " + date + " " + curDate);
                });
                this.setState({informativeNum: informativeNum});
                this.setState({onTimeNum: onTimeNum});
                this.setState({entertainingNum: entertainingNum});
                this.setState({lifeChangingNum: lifeChangingNum});
                this.setState({trashNum: trashNum});
                this.setState({amazingNum: amazingNum});
                this.setState({mustWatchNum:  mustWatchNum});
                this.setState({visionaryNum: visionaryNum});
                this.setState({wasteOfTimeNum: wasteOfTimeNum});
                this.setState({lovelyNum: lovelyNum});
            }
        });
    }
    onClickRequest(){
        if(this.state.followStatus === "FOLLOW") {
            console.log("Doing FOllow");
            axios.post("http://proevento.tk:3000/notification/follow/" + this.state.userId, {
                userId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if(res.status===200){
                    alert("You have requested to follow the user");
                }
            });
        }
        else{
            console.log("Unfollowing person");
            axios.put("http://proevento.tk:3000/profile/follow/" + this.state.userId, {
                followerId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if (res.status === 200) {
                    axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({profile: res["data"]});
                            this.setState({followersNum: this.state.profile["followers"].length});
                            this.setState({followingNum: this.state.profile["following"].length});
                        }
                    this.setState({followStatus: "FOLLOW"});
                    });
                }
            });
        }

        
    }
    onClickFollow() {
        if(this.state.followStatus == "FOLLOW") {
            axios.post("http://proevento.tk:3000/profile/follow/" + this.state.userId, {
                followerId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if (res.status === 200) {
                    axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({profile: res["data"]});
                            this.setState({followersNum: this.state.profile["followers"].length});
                            this.setState({ followingNum: this.state.profile["following"].length });
                            axios.post("http://proevento.tk:3000/notification/" + this.state.userId, {
                                userId: localStorage.getItem("user")
                            }, options)
                            .then(res => {
                                if (res.status === 200) {
                                    alert("You have followed this user");
                                    console.log(res.status)
                                }
                            });
                        }
                    this.setState({followStatus: "UNFOLLOW"});
                    });
                }
            });
        } else {
            axios.put("http://proevento.tk:3000/profile/follow/" + this.state.userId, {
                followerId: localStorage.getItem("user")
            },  options)
            .then(res => {
                if (res.status === 200) {
                    axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({profile: res["data"]});
                            this.setState({followersNum: this.state.profile["followers"].length});
                            this.setState({followingNum: this.state.profile["following"].length});
                        }
                    this.setState({followStatus: "FOLLOW"});
                    });
                }
            });
        }
    }

    onClickEdit() {
        this.setState({isEdit: true});
    }

    onClickViewFollowers() {
        this.setState({isViewFollowers: true});
        for(var i=0; i<this.state.profile["followers"].length; i++) {
            this.onView(this.state.profile["followers"][i]);
        }
    }

    onClickViewFollowing() {
        this.setState({isViewFollowing: true});
        let following;
        if (this.state.profile["following"]) {
            following = this.state.profile["following"]; // i changed it so that the api returns json instead of string
        }
        
        for(var i=0; i<following.length; i++) {
            this.onView(following[i]);
        }
    }

    doneEditing() {
        this.setState({isEdit: false});
        this.loadData();
    }

    doneViewFollow() {
        this.setState({isViewFollowers: false, isViewFollowing: false, followListData: []});
    }

    onView(userId) {
        axios.get("http://proevento.tk:3000/user/" + userId, options)
        .then(res => {
            if (res.status === 200) {
                var currUser = res["data"];
                var tempList = this.state.followListData;
                tempList.push(currUser);
                this.setState({followListData: tempList});
            }
        });
    }



    render() {
        if (!this.state.isEdit && !this.state.isViewFollowers && !this.state.isViewFollowing) {
            return (
                <div> 
                    <div class="location">
                        { this.state.informativeNum != 0 &&
                            <label class="badges">{this.state.informativeNum}x Informative &nbsp; &nbsp; </label>
                        }
                        { this.state.entertainingNum != 0 &&
                            <label class="badges">{this.state.entertainingNum}x Entertaining &nbsp; &nbsp; </label>
                        }
                        { this.state.onTimeNum != 0 &&
                            <label class="badges">{this.state.onTimeNum}x On Time &nbsp; &nbsp; </label>
                        }
                        { this.state.lifeChangingNum != 0 &&
                            <label class="badges">{this.state.lifeChangingNum}x Life Changing &nbsp; &nbsp; </label>
                        }
                        { this.state.trashNum != 0 &&
                            <label class="badges">{this.state.trashNum}x Trash &nbsp; &nbsp; </label>
                        }
                        { this.state.amazingNum != 0 &&
                            <label class="badges">{this.state.amazingNum}x Amazing &nbsp; &nbsp; </label>
                        }
                        { this.state.mustWatchNum != 0 &&
                            <label class="badges">{this.state.mustWatchNum}x Must Watch &nbsp; &nbsp; </label>
                        }
                        { this.state.visionaryNum != 0 &&
                            <label class="badges">{this.state.visionaryNum}x Visionary &nbsp; &nbsp; </label>
                        }
                        { this.state.wasteOfTimeNum != 0 &&
                            <label class="badges">{this.state.wasteOfTimeNum}x Waste of Time &nbsp; &nbsp; </label>
                        }
                        { this.state.lovelyNum != 0 &&
                            <label class="badges">{this.state.lovelyNum}x Lovely &nbsp; &nbsp; </label>
                        }
                    </div>
                    <Grid container>
                        <Grid item xs={3}>
                            { this.state.user &&
                                <img width="150px" className="d-block text-center" src={this.state.user["profileImage"]} style={{margin: "auto"}}/>
                            }
                            { this.props.isMyProfile === false && localStorage.getItem("user") != this.state.userId &&
                                <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickRequest}>{this.state.followStatus}</Button></div>
                            }
                            { this.props.profilePage && localStorage.getItem("user") == this.state.userId &&
                                <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickEdit}>Edit Profile</Button></div>
                            }
                        </Grid>
                        <Grid item item xs={9}>
                            <div>
                                { this.state.user && 
                                    <h1>{this.state.user["fullName"]}</h1>
                                }
                                { this.state.user && 
                                    <h5>Email: {this.state.user["email"]}</h5>
                                }
                                <div className="d-flex">
                                    <Button onClick={this.onClickViewFollowers} >{this.state.followersNum} Followers </Button>
                                    <Button style={{marginLeft: "10px"}} onClick={this.onClickViewFollowing}>{this.state.followingNum} Following </Button>
                                </div>
                                <div>
                                    { this.state.profile && (this.state.profile["bio"] == null || this.state.profile["bio"] == "") &&
                                        <label>Bio: empty</label>
                                    }
                                    { this.state.profile && this.state.profile["bio"] && 
                                        <label>Bio: {this.state.profile["bio"]}</label>
                                    }
                                </div>
                                <div></div>
                                <div>
                                    <label>Tags: </label>
                                    { this.state.profile && this.state.profile["tags"].length == 0 &&
                                        <span className="ml-1">empty</span>
                                    }
                                    { this.state.profile && this.state.profile["tags"] && 
                                        this.state.profile["tags"].map((row, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                    <span className="badge badge-secondary d-inline ml-1">{row}</span>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    <label>Number of Hosted Events: {this.state.hostedNum} </label>
                                </div>
                                <div>
                                   <label>Upcoming Events: {this.state.upcomingNum} </label>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            );
        }
        else if (this.state.isEdit) {
            return (
                <EditProfile user={this.state.user} profile={this.state.profile} doneEditing={this.doneEditing}/>
            );
        }
        else if (this.state.isViewFollowers) {
            return (
                <ViewFollow user={this.state.user} profile={this.state.profile} isViewFollower={true} followers={this.state.profile["followers"]} following={this.state.profile["following"]} followListData={this.state.followListData} doneViewFollow={this.doneViewFollow}/>
            );
        }
        else if (this.state.isViewFollowing) {
            return (
                <ViewFollow user={this.state.user} profile={this.state.profile} isViewFollower={false} followers={this.state.profile["followers"]} following={this.state.profile["following"]} followListData={this.state.followListData} doneViewFollow={this.doneViewFollow}/>
            );
        }
        else return <div></div>;
    }
}
