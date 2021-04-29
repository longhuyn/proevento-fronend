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
      eventList: [],
      userGroupList: [],
      profileTags: []
      };
    this.loadData = this.loadData.bind(this);
    this.loadData();

    // this.loadGroupUsers = this.loadGroupUsers.bind(this);
    // this.loadGroupUsers();

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
  }
  

  // loadGroupUsers() {
  //   const userId = localStorage.getItem('user');
  //   axios.get("http://proevento.tk:3000/chat/group_chat/" + userId, options)
  //   .then(res => {
  //       if (res.status === 200) {
  //           var groups = res["data"];
  //           var groupUsers = [];
  //           for (var i = 0; i < groups.length; i++) {
  //             for (var j = 0; j < groups[i]["participants"].length; j++) {
  //               if (!groupUsers.includes(groups[i]["participants"][j]) || groups[i]["participants"][j] == userId) {
  //                 console.log("Added user");
  //                 groupUsers.push(groups[i]["participants"][j]);
  //               }
  //             }
  //           }
  //           console.log("user Ct: " + groupUsers.length);
  //           this.setState({userGroupList: groupUsers});
  //       }
  //   });
  // }

  loadEvents() {
    const userId = localStorage.getItem('user');
    axios.get("http://proevento.tk:3000/profile/" + userId, options)
      .then(res => {
        if (res.status === 200) {
          this.setState({profile: res["data"]});
          this.setState({profileTags: res["data"]["tags"]})
          this.setState({following: res["data"]["following"]});
          var listTags = this.state.profileTags;
          // var tagEventList = [];
          // for (var i = 0; i < listTags.length; i++) {
          //   var tagTxt = listTags[i];
          //   console.log(listTags[i]);
          //   console.log("string:" + tagTxt);
          //   axios.get("http://proevento.tk:3000/search/tags/" + tagTxt, options)
          //   .then(res => {
          //     if(res.status === 200) {
          //       console.log("Results" + res["data"].length);
          //       console.log("hei");
          //       for(var h = 0; h < res["data"].length; h++) {
          //         console.log("h" + res["data"][h]);
          //         console.log(res["data"][h]);
          //         tagEventList.push(res["data"][h]);
          //       } 
          //     }
          //   });
          // }
          //this.setState({tagEvents: tagEventList});
          axios.get("http://proevento.tk:3000/chat/group_chat/" + userId, options)
          .then(res => {
            if (res.status === 200) {
              var groups = res["data"];
              var groupUsers = [];
              console.log(groups);
              for (var i = 0; i < groups.length; i++) {
                if (!groupUsers.includes(groups[i]["ownerId"])  && groups[i]["ownerId"] != userId) {
                  //console.log("add owner");
                  groupUsers.push(groups[i]["ownerId"]);
                }
                for (var j = 0; j < groups[i]["participants"].length; j++) {
                  if (!groupUsers.includes(groups[i]["participants"][j]["userId"]) && groups[i]["participants"][j]["userId"] != userId) {
                    groupUsers.push(groups[i]["participants"][j]["userId"]);
                    //console.log("Add user");
                  }
                }
              }
            }
            // console.log("user Ct: " + groupUsers.length);
            // for (var i =0; i < groupUsers.length; i++) {
            //   console.log("user: " + groupUsers[i]);
            // }
            this.setState({userGroupList: groupUsers});
            axios.get("http://proevento.tk:3000/event/all")
            .then(res => {
              if (res.status === 200) {
                //this.setState({eventList: res["data"]});
                var eventList = res["data"];
                var followList = this.state.following;
                var groupList = this.state.userGroupList;
                //var tagList = this.state.tagEvents;
                console.log(eventList);

                var results = [];
                for (var i = 0; i < eventList.length; i++) {
                    for (var j = 0; j < followList.length; j++) {
                        if (eventList[i]["userId"] == parseInt(followList[j]) && !results.includes(eventList[i])) {
                            //console.log("test" + eventList[i]["userId"]);
                            results.push(eventList[i]);
                        }
                    }
                }
                for (var i = 0; i < eventList.length; i++) {
                  for (var j = 0; j < groupList.length; j++) {
                    if (eventList[i]["userId"] == parseInt(groupList[j]) && !results.includes(eventList[i])) {
                      results.push(eventList[i]);
                      console.log(eventList[i]);
                      console.log(results.length);
                    }
                  } 
                }
                for (var i = 0; i < eventList.length; i++) {
                  for (var j = 0; j < listTags.length; j++) {
                    for (var k = 0; k < eventList[i]["categories"].length; k ++) {
                      console.log("here~~~~!!");
                      console.log(eventList[i]["categories"][k]);
                      if (eventList[i]["userId"] != userId && !results.includes(eventList[i]) && eventList[i]["categories"][k] == listTags[j]){
                        console.log("here!!!!");
                        console.log(eventList[i]);
                        results.push(eventList[i]);
                      }
                    }
                  }
                  // if(tagList[i]["userId"] != userId && !results.includes(tagList[i])) {
                  //   results.push(tagList[i]);
                  //   console.log(tagList[i]);
                  //   console.log(results.length);
                  // }
                }
                console.log(results);
                this.setState({eventList: results});
              }
            });
          });
        }
    });
    // axios.get("http://proevento.tk:3000/chat/group_chat/" + userId, options)
    // .then(res => {
    //   if (res.status === 200) {
    //     var groups = res["data"];
    //     var groupUsers = [];
    //     for (var i = 0; i < groups.length; i++) {
    //       if (!groupUsers.includes(groups[i]["ownerId"])  && groups[i]["ownerId"] != userId) {
    //         //console.log("add owner");
    //         groupUsers.push(groups[i]["ownerId"]);
    //       }
    //       for (var j = 0; j < groups[i]["participants"].length; j++) {
    //         if (!groupUsers.includes(groups[i]["participants"][j]["userId"]) && groups[i]["participants"][j]["userId"] != userId) {
    //           groupUsers.push(groups[i]["participants"][j]["userId"]);
    //           //console.log("Add user");
    //         }
    //       }
    //     }
    //   }
    //   // console.log("user Ct: " + groupUsers.length);
    //   // for (var i =0; i < groupUsers.length; i++) {
    //   //   console.log("user: " + groupUsers[i]);
    //   // }
    //   this.setState({userGroupList: groupUsers});
    //   axios.get("http://proevento.tk:3000/event/all")
    //   .then(res => {
    //     if (res.status === 200) {
    //       //this.setState({eventList: res["data"]});
    //       var eventList = res["data"];
    //       var followList = this.state.following;
    //       var groupList = this.state.userGroupList;
    //       var tagList = this.state.profileTags;
    //       var results = [];
    //       for (var i = 0; i < eventList.length; i++) {
    //           for (var j = 0; j < followList.length; j++) {
    //               if (eventList[i]["userId"] == parseInt(followList[j]) && !results.includes(eventList[i])) {
    //                   //console.log("test" + eventList[i]["userId"]);
    //                   results.push(eventList[i]);
    //               }
    //           }
    //       }
    //       for (var i = 0; i < eventList.length; i++) {
    //         for (var j = 0; j < groupList.length; j++) {
    //           if (eventList[i]["userId"] == parseInt(groupList[j]) && !results.includes(eventList[i])) {
    //             results.push(eventList[i]);
    //           }
    //         } 
    //       }
    //       console.log("taglength" + tagList.length);
    //       this.setState({eventList: results});
    //     }
    //   });
    // });
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
