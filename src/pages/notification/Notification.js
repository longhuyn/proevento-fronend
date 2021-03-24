
import React from "react";
import axios from "axios";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Moment from "react-moment";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchList: null,
            eventList: {},
            currUserName: null
        };
        var options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        const user = localStorage.getItem("user");
        axios.get("http://proevento.tk:3000/notification/event/"+user, options)
        .then(res => {
            if (res.status === 200) {
                this.setState({searchList: res["data"]});
            }
        });
    }

    getName(userId) {
        var options = {
            headers: {
                "Access-Control-Allow-Origin" : "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                "Content-type": "Application/json"
            }
        };
        axios.get("http://proevento.tk:3000/search/singleid/" + userId, options)
        .then(res => {
            if (res.status === 200) {
               this.setState({currUserName: res["data"].fullName});
               console.log("data: ");
               console.log(res["data"].fullName);
            }
        });
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
                        let link = noti.joinurl
                        let description = noti.description
                        let date = noti.date
                        let name = noti.eventName
                        return(
                            <Card className="p-3 bg-light">
                              <h4 className ="text-left" style={{cursor: "pointer"}}
                            onClick={(e) => {
                                window.location.href = "http://proevento.tk/home/event/" + noti.eventId;
                            }} >{name}</h4> 
                              <Moment className="text-left" format="YYYY-MM-DD HH:mm">{date}</Moment>
                              <p>Description: {this.state.currUserName}{description}</p>
                              <div><label>Zoom link: 
                                  <Button href={link} color="primary" target="_blank">
                                      Click here
                                  </Button>
                              </label></div>
                            </Card>
                          )
                    })
                }
            </div>
        )
    }
}
