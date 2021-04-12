import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PublicFeed from "./PublicFeed";
import FollowFeed from "./FollowFeed";

export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedType: "public",
        };
    }

    render() {
        return (
            <div>
                <div className="d-flex">
                    <ButtonGroup
                        className="justify-content-center w-100"
                        color="primary"
                        aria-label="outlined primary button group"
                    >
                        <Button 
                            variant= { (this.state.feedType == "public") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "public"})}>
                            Public Feed
                        </Button>
                        <Button 
                            variant= { (this.state.feedType == "follow") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "follow"})}>
                            Follow Feed
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="mt-4">
                    { this.state.feedType == "public" && <PublicFeed/>}
                    { this.state.feedType == "follow" && <FollowFeed/>}
                </div>
            </div>
        );
    }
}
