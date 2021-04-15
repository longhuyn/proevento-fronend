import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from '@material-ui/core/styles';

export default class Group extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            groupId: 0,
            data: this.props.data,
            page: this.props.page
        }

        // this.onClickRequest = this.onClickRequest.bind(this);

        // this.onClickRequest();
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={3}>
                        <img width="150px" className="d-block text-center" src={this.state.data["logo"]} style={{margin: "auto"}}/>
                        { this.props.page && 
                            <div className="d-flex justify-content-center mt-4">
                                {/* <Button
                                    variant="contained" 
                                    color="primary" 
                                    onClick={this.onClickRequest}
                                >
                                    Request to join
                                </Button> */}
                            </div>
                        }
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
                                        {this.state.data["participants"].map((row, index) => {
                                            console.log(this.state.page);
                                            return (
                                                <div key={index}>
                                                    <Avatar
                                                        className="float-left avatar mr-2"
                                                        src={row["profileImage"]}
                                                    />
                                                    <p>{row["fullName"]}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}