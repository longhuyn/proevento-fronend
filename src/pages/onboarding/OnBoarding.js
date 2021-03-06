import "./OnBoarding.css";
import React, { Component } from "react";
import axios from "axios";
import Carousel from 'react-bootstrap/Carousel'
import greenBG from './greenBG.png';
import orangeBG from './orangeBG.png';
import blueBG from './blueBG.png';
import Button from "@material-ui/core/Button";

export default class OnBoarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    render() {
        const user = localStorage.getItem("user");
        if (!user)
            return window.location.href = "/login";

        return(
            <div>
                <Carousel fade>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={greenBG}
                            alt="First slide"
                        />
                        <Carousel.Caption> 
                            <h1>What is ProEvento?</h1>
                            <br></br>
                            <h3 className="left">- ProEvento is a more robust idea on how social media should function</h3>
                            <br></br>
                            <h3 className="left">- ProEvento allows for interactions similar to Facebook/LinkedIn with video call functionality</h3>
                            <br></br>
                            <h3 className="left">- ProEvento is the most interactive social media platform, allowing for normal social media usage alongside
                            live interaction</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={orangeBG}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h1>Why ProEvento?</h1>
                            <br></br>
                            <h3 className="left">- ProEvento links social media with Zoom conferencing</h3>
                            <br></br>
                            <h3 className="left">- ProEvento allows for interaction/broadcasting of live media</h3>
                            <br></br>
                            <h3 className="left">- ProEvento lets users find/display activities of their interest</h3>
                            <br></br>
                            <h3 className="left">- ProEvento allows for the discovery of events that appeal to the user</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={blueBG}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h1>Our Team</h1>
                            <br></br>
                            <h3 className="left">Longhuy Nguyen</h3>
                            <h3 className="left">Alan Nguyen</h3>
                            <h3 className="left">Apurva Memani</h3>
                            <h3 className="left">Vincente Mai</h3>
                            <h3 className="left">Daniel Oh</h3>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => window.location.href = "/home/categories"}
                            >Choose Your Interests</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        )
    }
}