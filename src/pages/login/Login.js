import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import GoogleLogin from 'react-google-login';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import "./Login.css"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    render() {
        const user = localStorage.getItem("user");
        if (user)
            this.props.history.push("/home");

        const onSuccess = (res) => {
            res = res["profileObj"];
            var options = {
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    "Content-type": "Application/json"
                }
            };
            axios.post(`http://proevento.tk:3000/user/create_user`, {
                email: res["email"],
                fullName: res["givenName"] + " " + res["familyName"],
                profileImage: res["imageUrl"],
                username: res["email"].split(' ')[0]
            }, options)
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem("user", res.data["userId"]);
                    if (res["data"]["first"] == true) {
                        this.props.history.push("/onboarding");
                    } else {
                        this.props.history.push("/home");
                    }
                }
                else {
                    this.setState({error: "Unable to login. Please retry again!"});
                }
            })
        };

        const onFailure = (res) => {
            this.setState({error: "Unable to login. Please retry again!"});
        };

        return (
            <Container className="login-component">
                <h1 className="logo" style={{color: "black"}}>Proevento</h1>
                <Typography component="h1" variant="h5" style={{color:"yellow"}}>
                    Sign in
                </Typography>
                <GoogleLogin className="google-login-button"
                    clientId="547621721213-1u7c05jaaa3k25to2i1qrllplql3utu3.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={"single_host_origin"}
                />
                <p className="error-message">{this.state.error}</p>
            </Container>
        )
    }
}

export default withRouter(Login);