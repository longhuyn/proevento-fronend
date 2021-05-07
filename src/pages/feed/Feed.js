import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PublicFeed from "./PublicFeed";
import FollowFeed from "./FollowFeed";
import PopularFeed from "./PopularFeed";
import FavoriteFeed from "./FavoriteFeed";

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
                            variant={ (this.state.feedType == "public") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "public"})}>
                            Public Feed
                        </Button>
                        <Button 
                            variant={ (this.state.feedType == "follow") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "follow"})}>
                            Follow Feed
                        </Button>
                        <Button 
                            variant={ (this.state.feedType == "popular") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "popular"})}>
                            Popular Feed
                        </Button>
                        <Button 
                            variant={ (this.state.feedType == "favorite") ? "contained" : "outlined" } 
                            onClick={() => this.setState({feedType: "favorite"})}>
                            Favorite Feed
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="mt-4">
                    { this.state.feedType == "public" && <PublicFeed/>}
                    { this.state.feedType == "follow" && <FollowFeed/>}
                    { this.state.feedType == "popular" && <PopularFeed/>}
                    { this.state.feedType == "favorite" && <FavoriteFeed/>}
                </div>
            </div>
        );
    }
}
