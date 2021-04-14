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
                            <h3>copypastacentral</h3>
                            <p>Rawr x3 nuzzles how are you pounces on you you're so warm o3o notices you have a bulge o: someone's happy ;) nuzzles your necky wecky~ murr~ hehehe rubbies your bulgy wolgy you're so big :oooo rubbies more on your bulgy wolgy it doesn't stop growing ·///· kisses you and lickies your necky daddy likies (; nuzzles wuzzles I hope daddy really likes $: wiggles butt and squirms I want to see your big daddy meat~ wiggles butt I have a little itch o3o wags tail can you please get my itch~ puts paws on your chest nyea~ its a seven inch itch rubs your chest can you help me pwease squirms pwetty pwease sad face I need to be punished runs paws down your chest and bites lip like I need to be punished really good~ paws on your bulge as I lick my lips I'm getting thirsty. I can go for some milk unbuttons your pants as my eyes glow you smell so musky :v licks shaft mmmm~</p>
                            <p>I sexually Identify as an Attack Helicopter. Ever since I was a boy I dreamed of soaring over the oilfields dropping hot sticky loads on disgusting foreigners. People say to me that a person being a helicopter is Impossible and I'm fucking retarded but I don't care, I'm beautiful. I'm having a plastic surgeon install rotary blades, 30 mm cannons and AMG-114 Hellfire missiles on my body. From now on I want you guys to call me "Apache" and respect my right to kill from above and kill needlessly. If you can't accept me you're a heliphobe and need to check your vehicle privilege. Thank you for being so understanding.</p>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => window.location.href = "/home/feed"}
                            >Go To Home</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        )
    }
}