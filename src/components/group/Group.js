import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";

export default class Group extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            groupId: 0,
            data: this.props.data,
            page: this.props.page,
            members: null
        }

        this.loadMemberStats = this.loadMemberStats.bind(this);
        this.loadMemberStats();
    }

    loadMemberStats() {
        axios.get("http://proevento.tk:3000/group/stats/" + this.state.data["groupId"])
        .then((res) => {
            if (res.status === 200) {
                this.setState({members: res["data"]});
                console.log(this.state.members);
            }
            // console.log(this.state.data);
        });
    }

    findMemberStats(userId) {
        if (this.state.members == null){
            return 0;
        }
        var i = 0;
        for (i = 0; i < this.state.members.length; i++){
            if (this.state.members[i]["user"]["userId"] == userId) {
                return this.state.members[i]["value"];
            }
        }
        return 0;
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={3}>
                        <img width="150px" className="d-block text-center" src={this.state.data["logo"]} style={{margin: "auto"}}/>
                    </Grid>
                    <Grid item item xs={9}>
                        <div>
                            <h1>{this.state.data["name"]}</h1>
                            <div className="d-flex align-items-center">
                                <Avatar
                                    className="float-left ml-2"
                                    src={this.state.data["owner"]["profileImage"]}
                                />
                                <p className="ml-2 m-0">{this.state.data["owner"]["fullName"]} (owner)</p>
                            </div>
                            <div className="mt-2">
                                <label>Description: {this.state.data["description"]}</label>
                            </div>
                            <div className="mt-2">
                                <label style={{width: "100px"}}>Categories: </label>
                                { this.state.data["categories"].length == 0 &&
                                    <span className="ml-1">empty</span>
                                }
                                { this.state.data["categories"].map((row, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <span className="badge badge-secondary d-inline ml-1">{row}</span>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                            { this.state.page &&
                                <div>
                                    <p className="d-inline float-left" style={{width: "100px"}}>Members: </p>
                                    <div className="d-block" style={{marginLeft: "105px"}}>
                                        { this.state.data["participants"].length == 0 &&
                                            <p>No members</p>
                                        }
                                        { this.state.data["participants"].length > 0 &&
                                        this.state.data["participants"].map((row, index) => {
                                            return (
                                                <div key={index}>
                                                    <Avatar
                                                        className="float-left avatar mr-2"
                                                        src={row["profileImage"]}
                                                    />
                                                    <p>{row["fullName"]} <span className="badge badge-secondary d-inline ml-1">{this.findMemberStats(row["userId"])}</span></p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }
                            {/* <div>
                                <p className="d-inline float-left" style={{width: "100px"}}>End Date: </p>
                                <div className="d-block" style={{marginLeft: "105px"}}>
                                    {this.state.data["suggestionDate"].length == 0 && 
                                        <p>No end date set</p>
                                    }
                                    {this.state.data["suggestionDate"].length > 0 &&
                                        <p>{this.state.data["suggestionDate"]} </p>
                                    }
                                </div>
                            </div> */}
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}