import React from 'react';
import { Redirect } from 'react-router';
import {withRouter} from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import "./Home.css";
import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import CreateEvent from "../create_event/CreateEvent";
import MyProfile from "../my_profile/MyProfile";
import Search from "../search/Search"
import EventPage from "../event/EventPage";
import PublicFeed from "../feed/PublicFeed";
import Feed from "../feed/Feed";
import FollowFeed from "../feed/FollowFeed";
import ViewProfile from "../viewprofile/ViewProfile";
import Notification from "../notification/Notification";
import Chat from "../chat/Chat";
import OnBoarding from "../onboarding/OnBoarding";

const homeHistory = createBrowserHistory();

function Home(props) {
    
    function logOut() {
        localStorage.removeItem('user');
        props.history.push("/login");
    }

    const { path, url } = useRouteMatch();
    const user = localStorage.getItem('user');
    if (!user) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="h-100">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="logo" as={Link} to={"/home/feed"}  style={{marginLeft: "100px", fontSize: "15pt"}}>Proevento</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{marginLeft: "100px"}}/>
                <Navbar.Collapse id="responsive-navbar-nav"  style={{marginRight: "100px"}}>
                    <Nav className="mr-auto">
                        <Nav.Link className="text-white" as={Link} to={"/home/search"}>Search</Nav.Link>
                        <Nav.Link className="text-white" as={Link} to={"/home/create_event"}>Create New Event</Nav.Link>
                        <Nav.Link className="text-white" as={Link} to={"/home/onboarding"}>OnBoarding</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link className="text-white" as={Link} to={"/home/notification"}>Notifications</Nav.Link>
                        <Nav.Link className="text-white" as={Link} to={"/home/chat"}>Chat</Nav.Link>
                        <Nav.Link className="text-white" as={Link} to={"/home/my_profile"}>My Profile</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => logOut()}>Log out</Nav.Link>
                        {/* <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="main-content" style={{height: "85%"}}>
                <Switch>
                    <Route path={"/home/feed"} component={Feed}></Route>
                    <Route path={"/home/search"} component={Search} history={props.history}></Route>
                    <Route path={"/home/create_event"} component={CreateEvent}></Route>
                    <Route path={"/home/my_profile"} component={MyProfile} ></Route>
                    <Route path={"/home/event/:eventId"} component={EventPage}></Route>
                    <Route path={"/home/profile/:userId"} component={ViewProfile}></Route>
                    <Route path={"/home/notification"} component={Notification}></Route>
                    <Route path={"/home/chat"} component={Chat}></Route>
                    <Route path={"/home/onboarding"} component={OnBoarding}></Route>
                    <Route exact path={"/home"}>
                        <Redirect to={"/home/feed"} />;
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default withRouter(Home);