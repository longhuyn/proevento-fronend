import "./App.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";

function App() {
    const history = useHistory();
    const user = localStorage.getItem("user");

    if (!user) {
        history.push("/login");
    }

    return (
        <div className="App">
            <Router history={history}>
                <Switch>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/home">
                        <Home/>
                    </Route>
                    <Route path="/">
                        <Login/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
