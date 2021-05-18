
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
                console.log(res["data"]);
                this.setState({searchList: res["data"]});
                res["data"].map((noti, i) => {
                    axios.get("http://proevento.tk:3000/search/singleid/" + noti.userId, options)
                    .then(res => {
                        if (res.status === 200) {
                            var tempList = this.state.currUserName;
                            //console.log("name" + noti.userId);
                            // console.log("name" + noti.userId);
                            // console.log(tempList);
                            //console.log(res["data"]);
                            if (res["data"][0]) {
                                tempList.push(res["data"][0]);
                            }
                            this.setState({currUserName: tempList});
                        }
                    });
                })
            }
        });
    }

    onClickFollow(userId, followId, notificationId, index) {
        axios.post("http://proevento.tk:3000/profile/follow/" + followId, {
            followerId: userId
        },  options)
        .then(res => {
            if (res.status === 200) {
                alert("You accepted their follow request");
                this.onClickRequestDeny(notificationId, index);
            }
        });
    }
        
    onClickRequest(userId, gId, notiId, index) {
        axios.post(
            "http://proevento.tk:3000/group/add/" + userId,
            {
                groupId: gId
            },
            options
        ).then((res) => {
            if (res.status === 200) {
                alert("User accepted to the requested Group");
                //this.onClickRequestDeny(notiId, index);
                axios.post(
                    "http://proevento.tk:3000/notification/delete/" + notiId, options
                ).then((res) => {
                    if (res.status === 200) {
                        console.log("Deleted Notification");
                    } else {
                        console.log("Did not Delete Notification");
                    }
                    const list = this.state.searchList;
                    list.splice(index, 1);
                    this.setState({searchList: list});
                });
                console.log("WORKING SEND");
                window.location.href = "http://proevento.tk/home/group/" + gId;
            } else {
                console.log("BORKED");
            }
        });
    }

    onClickRequestDeny(notiId, index){
        axios.post(
            "http://proevento.tk:3000/notification/delete/" + notiId, options
        ).then((res) => {
            if (res.status === 200) {
                console.log("Deleted Notification");
            } else {
                console.log("Did not Delete Notification");
            }
            const list = this.state.searchList;
            list.splice(index, 1);
            this.setState({searchList: list});
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
                    this.state.searchList && this.state.searchList.map((noti, i) => {
                        let userName = noti.userName
                        let eventName = noti.eventName
                        let date = noti.date
                        let type = noti.type
                        let groupName = noti.groupName
                        console.log(type)
                        return(
                            <div key={noti["notificationId"]} className="mt-2">
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
                                    >
                                    <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                    <p>{userName} has requested to follow you</p>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={()=>this.onClickFollow(noti.userId, noti.recipientId, noti.notificationId, i)}>Accept</Button>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={() =>this.onClickRequestDeny(noti.notificationId, i)}>Refuse</Button>
                                    </Card>
                                }
                                 {type == "RECORD" &&
                                    <Card 
                                        className="p-3 bg-light"
                                    >
                                    <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                    <p>  google drive recording has been uploaded for {eventName}</p>
                                    <label>Recording link: 
                                        <Button onClick={(e) => window.location.href = noti.uploadLink } color="primary" target="_blank">
                                        Click here
                                        </Button>
                                    </label>
                                    </Card>
                                }
                                {type == "RequestGroupOwner" &&
                                    <Card 
                                        className="p-3 bg-light"
                                        onClick={(e) => {
                                            //window.location.href = "http://proevento.tk/home/group/" + noti.groupId;
                                        }} 
                                    >
                                        <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                    <p>{userName} has requested to join {groupName}</p>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={()=>this.onClickRequest(noti.userId, noti.groupId, noti.notificationId, i)}>Accept</Button>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={() =>this.onClickRequestDeny(noti.notificationId, i)}>Refuse</Button>
                                    </Card>
                                }
                                {type == "JoinGroupRequest" &&
                                    <Card 
                                        className="p-3 bg-light"
                                >
                                    <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                                    <p>{userName} has invited you to join {groupName}</p>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={() =>this.onClickRequest(localStorage.getItem("user"), noti.groupId, noti.notificationId, i)}>Accept</Button>
                                    <Button className="ml-2" variant="contained" color="primary" onClick={() =>this.onClickRequestDeny(noti.notificationId, i)}>Refuse</Button>
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
