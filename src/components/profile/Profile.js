import "./Profile.css";
import React from "react";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import EditProfile from "../../components/profile/EditProfile";
import PersonalEvents from "../../components/personal_events/PersonalEvents";
import ViewFollow from "../../components/profile/ViewFollow";
import Event from "../../components/event/Event";
import axios from 'axios';

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

        if (this.props.match && this.props.match.params && this.props.match.params.userId) {
            this.setState({userId: this.props.match.params.user});
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
        axios.get("http://proevento.tk:3000/user/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({user: res["data"]});
            }
        });

        axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({profile: res["data"]});
                this.setState({followersNum: this.state.profile["followers"].length});
                this.setState({followingNum: this.state.profile["following"].length});
                if (this.state.profile["followers"].includes(localStorage.getItem("user"))) {
                    this.setState({followStatus: "UNFOLLOW"});
                } 
            }
        });
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
                            this.setState({followingNum: this.state.profile["following"].length});
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
                    <Grid container>
                        <Grid item xs={3}>
                            { this.state.user &&
                                <img width="150px" className="d-block text-center" src={this.state.user["profileImage"]} style={{margin: "auto"}}/>
                            }
                            { this.props.isMyProfile === false && localStorage.getItem("user") != this.state.userId &&
                                <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickFollow}>{this.state.followStatus}</Button></div>
                            }
                            { localStorage.getItem("user") == this.state.userId &&
                                <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickEdit}>Edit Profile</Button></div>
                            }
                        </Grid>
                        <Grid item item xs={9}>
                            <div>
                                { this.state.user && 
                                    <h1>{this.state.user["fullName"]}</h1>
                                }
                                <div className="d-flex">
                                    <Button onClick={this.onClickViewFollowers} >{this.state.followersNum} Followers </Button>
                                    <Button style={{marginLeft: "10px"}} onClick={this.onClickViewFollowing}>{this.state.followingNum} Following </Button>
                                </div>
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
