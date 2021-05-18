import "./PublicFeed.css";
import React, { Component } from "react";
import Event from "../../components/event/Event";
import axios from "axios";
import Card from '@material-ui/core/Card';
import Profile from "../../components/profile/Profile";

const options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchList: null,
        };
        this.loadData = this.loadData.bind(this);
        this.loadData();
    }

    loadData() {
        const userId = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/search/user/topTen/", options)
            .then((res) => {
                if (res.status === 200) {
                    //this.setState({ searchList: res["data"] });
                    let currList = res["data"];
                    let newList = currList.sort(function(a,b) {
                        console.log(a.followers.length);
                        return (b.followers).length - (a.followers).length; 
                    });
                    let finalList = [];
                    for (var i=0; i<10; i++) {
                        if (newList[i])
                            finalList.push(newList[i]);
                    }
                    console.log(finalList);
                    this.setState({searchList: finalList});
                }
            });
    }

    countFollowers(suggestion) {
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
                <h3 className="text-center">Top 10 Voices</h3>
                { this.state.searchList && this.state.searchList.map((user, i) => (
                        <div key={user["userId"]}>
                            <Card 
                                style={{cursor: "pointer"}}
                                className="mt-4 p-3 bg-light" 
                                onClick={(e) => {
                                e.preventDefault();
                                //this.props.history.push("/home/profile/" + user["userId"]);
                                window.location.href = "http://proevento.tk/home/profile/" + user["userId"];
                            }}>
                                <Profile userId={user["userId"]}></Profile>
                            </Card>
                        </div>
                    ))}
            </div>
        );
    }
}
