import React from "react";
import Grid from "@material-ui/core/Grid"

export default class Group extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: 0,
            groupData: null
        }
        this.loadGroupData = this.loadGroupData.bind(this);

        if (this.props.match && this.props.match.params && this.props.match.params.groupId) {
            this.setState({groupId: this.props.match.params.groupId});
        }

        this.loadGroupData();
    }

    loadGroupData() {

    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={3}>
                        { this.state.groupData &&
                            <img width="150px" className="d-block text-center" src={this.state.groupData["image"]} style={{margin: "auto"}}/>
                        }
                        { this.props.isMyProfile === false && localStorage.getItem("user") != this.state.userId &&
                            <div className="d-flex justify-content-center mt-2"><Button variant="contained" color="primary" onClick={this.onClickFollow}>{this.state.followStatus}</Button></div>
                        }
                    </Grid>
                    <Grid item item xs={9}>
                        <div>
                            { this.state.user && 
                                <h1>{this.state.user["fullName"]}</h1>
                            }
                            { this.state.user && 
                                <h5>Email: {this.state.user["email"]}</h5>
                            }
                            <div className="d-flex">
                                <Button onClick={this.onClickViewFollowers} >{this.state.followersNum} Followers </Button>
                                <Button style={{marginLeft: "10px"}} onClick={this.onClickViewFollowing}>{this.state.followingNum} Following </Button>
                            </div>
                            <div>
                                <label>Tags: </label>
                                { this.state.profile && this.state.profile["tags"].length == 0 &&
                                    <span className="ml-1">empty</span>
                                }
                                { this.state.profile && this.state.profile["tags"] && 
                                    this.state.profile["tags"].map((row, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <span className="badge badge-secondary d-inline ml-1">{row}</span>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}