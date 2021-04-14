
import React from "react";
import axios from "axios";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Moment from "react-moment";

var options = {
    headers: {
        "Access-Control-Allow-Origin" : "*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        "Content-type": "Application/json"
    }
};

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchList: null,
            eventList: {},
            currUserName: []
        };
        
        const user = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/notification/"+user, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({searchList: res["data"]});
                res["data"].map((noti, i) => {
                    axios.get("http://proevento.tk:3000/search/singleid/" + noti.userId, options)
                    .then(res => {
                        if (res.status === 200) {
                            var tempList = this.state.currUserName;
                            tempList.push(res["data"][0].fullName);
                            this.setState({currUserName: tempList});
                        }
                    });
                })
            }
        });
    }

    getName() {
        var options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        this.state.searchList.map((noti, i) => {
            axios.get("http://proevento.tk:3000/search/singleid/" + noti.userId, options)
            .then(res => {
                if (res.status === 200) {
                    var tempList = this.state.currUserName;
                    this.setState({currUserName: tempList.push(res["data"][0].fullName)});
                }
            });
        })
    }

    render() {
        return (
            <div>
                <h3 className="text-center">Notification</h3>
                {
                    this.state.searchList && this.state.searchList.length === 0 &&
                    <p className="text-center">You don't have any notifications</p>
                }
                {
                    this.state.searchList && this.state.searchList.map((noti, i = 0) => {
                        let userName = noti.userName
                        let eventName = noti.eventName
                        let date = noti.date
                        let type = noti.type
                        return(
                            <div key={noti["notificationId"]}>
                                {type == "EVENT" &&
                                    <Card 
                                        className="p-3 bg-light"
                                        onClick={(e) => {
                                            window.location.href = "http://proevento.tk/home/event/" + noti.eventId;
                                        }} 
                                    >
                                        <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                        <p>You have been invited to {eventName}</p>
                                    </Card>
                                }
                                {type == "CANCEL" &&
                                    <Card 
                                        className="p-3 bg-light"
                                    >
                                        <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                        <p>{eventName} has been cancelled</p>
                                    </Card>
                                }
                                {type == "FOLLOW" &&
                                    <Card 
                                        className="p-3 bg-light"
                                        onClick={(e) => {
                                            window.location.href = "http://proevento.tk/home/profile/" + noti.userId;
                                        }} 
                                    >
                                        <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                        <p>{userName} has followed you</p>
                                    </Card>
                                }
                            </div>
                          )
                    })
                }
            </div>
        )
    }
}
