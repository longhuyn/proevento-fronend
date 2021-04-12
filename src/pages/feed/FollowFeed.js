import "./PublicFeed.css";
import React, { Component } from "react";
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Event from "../../components/event/Event";


const options = {
  headers: {
      "Access-Control-Allow-Origin" : "*",
      'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      "Content-type": "Application/json"
  }
};

export default class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      profile: null,
      following: [],
      eventList: []
    };
    this.loadData = this.loadData.bind(this);
    this.loadData();

    this.loadEvents = this.loadEvents.bind(this);
    this.loadEvents();
    /*
    this.loadFollowingList = this.loadFollowingList.bind(this);
    this.loadFollowingList();
    */
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
        if (res.status === 200) {
            this.setState({profile: res["data"]});
            this.setState({following: res["data"]["following"]})
        }
    });
  }

  // loadEvents() {
  //   const userId = localStorage.getItem('user');
  //   axios.get("http://proevento.tk:3000/event/user/" + userId, options)
  //   .then(res => {
  //       if (res.status === 200) {
  //           this.setState({eventList: res["data"]});
  //           console.log(this.state.eventList);
  //       }
  //   });
  // }

  loadEvents() {
    axios.get("http://proevento.tk:3000/event/all")
    .then(res => {
        if (res.status === 200) {
            //this.setState({eventList: res["data"]});
            var eventList = res["data"];
            var followList = this.state.following;
            var results = [];
            for (var i = 0; i < eventList.length; i++) {
                for (var j = 0; j < followList.length; j++) {
                    if (eventList[i]["userId"] == parseInt(followList[j])) {
                        results.push(eventList[i]);
                    }
                }
            }
            this.setState({eventList: results});
        }
    });
  }

  render() {
    return(
      <div>
        <h3 className="text-center">Follow Feed</h3>
        {
          this.state.eventList && this.state.eventList.map((event, i) => {
            return (
              <div className="mt-4" key={i}>
                <Event event={event}/>
              </div>
            )
          })
        }
      </div>
    ) 
  }
}
