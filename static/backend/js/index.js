import React from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import { ErrorBoundary } from './errorhandler.js';
import { Home } from './home.js';
import { Pages } from './pages.js';
import { Posts } from './posts.js';
import { Header } from './header.js';
import { Settings } from './settings.js';
import { NoMatch } from './nomatch.js';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

export const PageContext = React.createContext({});

export const client = axios.create({
    withCredentials: true,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});

var isAlreadyFetchingAccessToken = false;
var subscribers = [];

async function resetTokenAndReattemptRequest(error) {
    try {
        const { response: errorResponse } = error;
        const resetToken = localStorage.getItem('refresh_token')
        if (!resetToken) {
            return Promise.reject(error);
        }
        const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
                resolve(client(errorResponse.config));
            });
        });
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            const response = await axios({ // use global client to not send access token header, only reset token
                method: 'post',
                url: '/api/token-refresh/',
                headers: {
                    Authorization: 'Bearer ' + resetToken
                }
            });

            if (!response.data) {
                return Promise.reject(error);
            }
            const newToken = response.data['access_token'];
            localStorage.setItem('access_token', newToken)
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
        }
        return retryOriginalRequest;
    } catch(err) {
        console.log(err);
    }
}

function onAccessTokenFetched(access_token) {
    subscribers.forEach(callback => callback(access_token));
    subscribers = [];
}

function addSubscriber(callback) {
    subscribers.push(callback);
}

client.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    if (error.response.status == 401) {
        return resetTokenAndReattemptRequest(error);
    };
    return Promise.reject(error);
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
                if (response.status == 200) {
                    this.setState({
                        pageList: response.data,
                        isLoaded: true,
                    })
                } else {
                    throw new Error("Invalid token");
                };
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
                        <Switch>
                            <Route exact path="/" render={(props) => <Home {...props} />} />
                            <Route path="/pages/" render={(props) => <Pages {...props} />} />
                            <Route path="/posts/" render={(props) => <Posts {...props} />} />
                            <Route path="/settings/" render={(props) => <Settings {...props} />} />
                            <Route component={NoMatch} /> {/* 404 */}
                        </Switch>
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
