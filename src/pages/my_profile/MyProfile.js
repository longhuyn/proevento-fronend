import "./MyProfile.css";
import React, { Component } from "react";
import axios from 'axios';
import Profile from "../../components/profile/Profile";
import PersonalEvents from "../../components/personal_events/PersonalEvents";
import Divider from "@material-ui/core/Divider";

export default class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            profile: null
        };

        this.loadData = this.loadData.bind(this);
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
        const userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/user/" + userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({user: res["data"]});
            }
        });

        axios.get("http://proevento.tk:3000/profile/" + userId, options)
        .then(res => {
            console.log(res["data"]);
            if (res.status === 200) {
                this.setState({profile: res["data"]});
            }
        });
    }

    render() {
        const userId = localStorage.getItem("user");
        return(
            <div>
                { this.state.profile && this.state.user &&
                    <div>
                        <Profile userId={userId} user={this.state.user} profile={this.state.profile} isMyProfile={true} loadData={this.loadData}/>
                        <Divider className="mt-4 mb-4"/>
                        <PersonalEvents userId={userId}/>
                    </div>
                }
            </div>
        );
    };
}
