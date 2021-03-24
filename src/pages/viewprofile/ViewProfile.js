import "./ViewProfile.css";
import React, { Component } from "react";
import axios from 'axios';
import Profile from "../../components/profile/Profile";
import PersonalEvents from "../../components/personal_events/PersonalEvents";
import Divider from "@material-ui/core/Divider";

export default class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.match.params.userId,
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
        axios.get("http://proevento.tk:3000/user/" + this.state.userId, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({user: res["data"]});
            }
        });

        axios.get("http://proevento.tk:3000/profile/" + this.state.userId, options)
        .then(res => {
            console.log(res["data"]);
            if (res.status === 200) {
                this.setState({profile: res["data"]});
            }
        });
    }

    render() {
        return(
            <div>
                { this.state.profile && this.state.user &&
                    <div>
                        <Profile userId={this.state.userId} isMyProfile={false}/>
                        <Divider className="mt-4 mb-4"/>
                        <PersonalEvents className="mt-2" userId={this.state.userId}/>
                    </div>
                }
            </div>
        );
    };
}
