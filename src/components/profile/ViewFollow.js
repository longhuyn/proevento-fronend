import React from "react";
import "./Profile.css"
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            profile: this.props.profile,
            isViewFollower: this.props.isViewFollower,
            followers: this.props.followers,
            following: this.props.following,
            followListData: this.props.followListData
        }
        this.onBack = this.onBack.bind(this);
        console.log(this.props.history);
    }


    onBack() {
        this.props.doneViewFollow();
    }


    render() {
        let followList = [];
        let followerNum = 0, followingNum = 0;
        this.state.followers ? followerNum = this.state.followers.length : followerNum = 0;
        this.state.following ? followingNum = this.state.following.length : followingNum = 0;

        let flag = this.state.isViewFollower;
        if (flag && this.state.followers) {
            followList = this.state.followers;
        } 

        if (!flag && this.state.following) {
            followList = this.state.following;
        }


        var filteredFollowList = this.state.followListData.filter(function(x) { return x !== undefined; });
        console.log(this.state.followListData);
        //this.state.followListData.shift();

        return (
            <div> 
                <Grid container>
                    <Grid item xs={3}>
                        <img width="150px" className="d-block text-center" src={this.props.user["profileImage"]} style={{margin: "auto"}}/>
                        { this.props.isMyProfile == true &&
                            <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickEdit}>Edit Profile</Button></div>
                        }
                    </Grid>
                    <Grid item xs>
                        <div>
                            { 
                                this.state.user && 
                                <h1>{this.state.user["fullName"]}</h1>
                            }
                            { 
                                this.state.user && 
                                <h5>Email: {this.state.user["email"]}</h5>
                            }
                            <div className="d-flex">
                                <Button onClick={this.onClickViewFollowers}>{followerNum} Followers </Button>
                                <Button style={{marginLeft: "10px"}} onClick={this.onClickViewFollowing}>{followingNum} Following </Button>
                            </div>
                             
                                {filteredFollowList.map((follower, i) => {
                                    return (
                                        <div key={i}>
                                        <ul>
                                        <Card 
                                            style={{cursor: "pointer"}}
                                            className="mt-2 p-3 bg-light" 
                                            onClick={(e) => {
                                            window.location.href = "http://proevento.tk/home/profile/" + follower["userId"];
                                        }}>
                                            <Avatar className="avatar float-left" src={follower["profileImage"]} />
                                            <p style={{marginRight: "50px"}} key="{follower}" className="d-inline ml-2">{follower["fullName"]}</p>
                                        </Card>
                                        </ul>
                                        </div>
                                    )
                                })
                                }
                            
                        </div>
                        <div className="mt-2" >
                            <Button className="ml-2" variant="contained" color="secondary" onClick={this.onBack}>Back</Button>
                        </div>
                    </Grid>
                </Grid>               
            </div>
        );
    }
}