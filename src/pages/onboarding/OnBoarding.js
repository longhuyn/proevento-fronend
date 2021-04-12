import "./OnBoarding.css";
import React, { Component } from "react";
import axios from "axios";
import Carousel from 'react-bootstrap/Carousel'
import greenBG from './greenBG.png';
import orangeBG from './orangeBG.png';
import blueBG from './blueBG.png';

export default class OnBoarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    render() {
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
                            <h1>WE HAVE BIG</h1>
                            <p>balls?.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={orangeBG}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h1>WE ARE</h1>
                            <h2> ...idk</h2>
                            <p>uwuwuwuwu owaowaowa DEEZ NUTS.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={blueBG}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>copypastacentral</h3>
                            <p>Rawr X3 *nuzzles* How are you? *pounces on you* you're so warm o3o</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        )
    }
}