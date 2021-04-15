import "./MyProfile.css";
import React, { Component } from "react";
import axios from 'axios';
import Profile from "../../components/profile/Profile";
import PersonalEvents from "../../components/personal_events/PersonalEvents";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

export default class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            profile: null
        };

        this.loadData = this.loadData.bind(this);
        this.onClick = this.onClick.bind(this);
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

    onClick(){
        const userId = localStorage.getItem("user");
        const options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        axios.post("http://proevento.tk:3000/user/delete_user/" + userId,options).then( res=>{
            if (res.status==200) {
                alert("Successfully deleted account");
                localStorage.removeItem('user');
                this.props.history.push("/login");

            }
         });
    
    }

    render() {
        const userId = localStorage.getItem("user");
        return(
            <div>
                { this.state.profile && this.state.user &&
                    <div>
                        <Profile 
                            userId={userId} 
                            user={this.state.user} 
                            profile={this.state.profile} 
                            isMyProfile={true} 
                            profilePage={true}
                            loadData={this.loadData}/>
                        <div className="d-block text-center w-100 mt-2">
                            <Button 
                                className="justify-content-center" 
                                color="secondary" 
                                variant="contained" 
                                onClick={this.onClick}
                            > Deactivate Account</Button>
                        </div>
                        <Divider className="mt-4 mb-4"/>
                        <PersonalEvents userId={userId}/>
                    </div>
                }
            </div>
        );
    };
}
