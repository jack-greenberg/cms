import React from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';
import { ErrorBoundary } from './errorhandler.js';
import { Home } from './home.js';
import { Pages } from './pages.js';
import { Posts } from './posts.js';
import { Header } from './header.js';
import { Settings } from './settings.js';
import { SinglePost } from './singlepost.js';
import { SinglePage } from './singlepage.js';
import { NoMatch } from './nomatch.js';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

export const PageContext = React.createContext({}); // Context for page data (includes list of pages for nav)
export const BackendDataContext = React.createContext({}); // Context for data about the backend, like site title, author, etc. Also user settings and preferences

// axios client that sends access token in the header
export const client = axios.create({
    withCredentials: true,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});

/*
    This chunk defines the token refresh mechanism. Taken from (https://www.techynovice.com/setting-up-JWT-token-refresh-mechanism-with-axios/)
*/
var isAlreadyFetchingAccessToken = false;
var subscribers = [];

async function resetTokenAndReattemptRequest(error) {
    try {
        const { response: errorResponse } = error; // get the config that was denied because of an invalid token
        const resetToken = localStorage.getItem('refresh_token')
        if (!resetToken) {
            // if no reset token is found, reject
            return Promise.reject(error);
        }
        // new Promise to retry the original request from the list of subscribers
        const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token; // set the new access token as a header to the response that was denied
                resolve(client(errorResponse.config)); // try the api call again
            });
        });

        if (!isAlreadyFetchingAccessToken) {
            // If not already getting a new token, get a new one (await the response before continuing)
            isAlreadyFetchingAccessToken = true;
            const response = await axios({ // use global client to not send access token header, only reset token
                method: 'post',
                url: '/api/token-refresh/',
                headers: {
                    Authorization: 'Bearer ' + resetToken
                }
            });

            if (!response.data) {
                // If there is an error, send a reject
                return Promise.reject(error);
            }

            const newToken = response.data['access_token'];
            localStorage.setItem('access_token', newToken); // store the new token
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
        }
        return retryOriginalRequest;
    } catch(err) {
        console.log(err);
    }
}
function onAccessTokenFetched(access_token) {
    // Process the list of subscribers once the access token has been refreshed
    subscribers.forEach(callback => callback(access_token));
    subscribers = [];
}
function addSubscriber(callback) {
    // Add a subscriber to the list while the access token is being refreshed
    subscribers.push(callback);
}

client.interceptors.response.use(function(response) {
    // Intercept the response. If there is no error, just return the normal response
    return response;
}, function(error) {
    // if there is an error, and it was a 401 (access denied)
    if (error.response.status == 401) {
        return resetTokenAndReattemptRequest(error); // retry the request (accepts the error config)
    };
    return Promise.reject(error); // If it wasn't a 401, it is uncaught and a reject is thrown
});

class App extends React.Component {
    /*
        Root <App /> component
        Gets backendData, and renders the react-router
    */
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            backendData: {},
        };
    };

    componentDidMount() {
        client.get('/api/v1/siteData/')
            .then(function (response) {
                if (response.status < 400) {
                    this.setState({
                        backendData: response.data,
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
            // Load the react router with contexts.
            return (
                <BackendDataContext.Provider value={this.state.backendData}>
                    <PageContext.Provider value={this.state.pageList}>
                        <BrowserRouter basename="/admin/">
                            <Switch>
                                <Route exact path="/" render={(props) => <Home {...props} />} />
                                <Route exact path="/pages/" render={(props) => <Pages {...props} />} />
                                <Route path="/pages/:page/" render={(props) => <SinglePage {...props} />} />
                                <Route exact path="/posts/" render={(props) => <Posts {...props} />} />
                                <Route path="/posts/:postid/" render={(props) => <SinglePost {...props} />} />
                                <Route path="/settings/" render={(props) => <Settings {...props} />} />
                                <Route component={NoMatch} /> {/* 404 */}
                            </Switch>
                        </BrowserRouter>
                    </PageContext.Provider>
                </BackendDataContext.Provider>
            );
        } else {
            // If the API call for backend data isn't complete yet, a loading screen is shown
            return (
                <LoadScreen />
            );
        };
    };
};

class LoadScreen extends React.Component {
    // Loading screen with a set of friendly phrases
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
