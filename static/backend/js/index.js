import React from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import { ErrorBoundary } from './errorhandler.js';
import { Home } from './home.js';
import { Pages } from './pages.js'
import { Header } from './header.js';
import { Modules } from './modules.js';
import { Settings } from './settings.js';
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

export const PageContext = React.createContext({});

export const client = axios.create({
    withCredentials: true,
    headers: {'X-CSRF-TOKEN': Cookies.get('csrf_access_token'), 'X-CSRF-REFRESH-TOKEN': Cookies.get('csrf_refresh_token')}
});

client.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    if (error.response.status == 401) {
        axios.post('/api/token-refresh/')
        .then(response => {
            console.log(response);
        });
    } else {
        return Promise.reject(error);
    };
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
        };
    };

    componentDidMount() {
        client.post('/api/get/page-list/')
            .then(function (response) {
                setTimeout(function() {
                    this.setState({
                        pageList: response.data,
                        isLoaded: true,
                    });
                }.bind(this), 500);
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
    };

    render() {
        if (this.state.isLoaded) {
            return (
                <PageContext.Provider value={this.state.pageList}>
                    <BrowserRouter basename="/admin/">
                        <Route exact path="/" render={(props) => <Home {...props} />} />
                        <Route path="/pages/" render={(props) => <Pages {...props} />} />
                        <Route path="/modules/" render={(props) => <Modules {...props} />} />
                        <Route path="/settings/" render={(props) => <Settings {...props} />} />
                    </BrowserRouter>
                </PageContext.Provider>
            );
        } else {
            return (
                <LoadScreen />
            );
        };
    };
};

class LoadScreen extends React.Component {
    constructor(props) {
        super(props);

        this.phraseList = [
            "We're getting your page ready...",
            "Sit tight while we get our stuff together...",
            "Hold on a second while we organize...",
            "One moment while we make our AJAX calls...",
        ];
    }

    render() {
        return (
            <div className="loading-screen">
                <div className="loading-screen__text">
                    {this.phraseList[Math.floor(Math.random() * this.phraseList.length)]}
                </div>
                <Icon.Loader className="loading-screen__icon  animate--rotate" />
            </div>
        )
    }
}

var renderedApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById("root"));
