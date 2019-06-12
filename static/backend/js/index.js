import React from 'react';
import ReactDOM from 'react-dom';
import 'boxicons';
import { ErrorBoundary } from './errorhandler.js';
import { Home } from './home.js';
import { Pages } from './pages.js'
import { Header } from './header.js';
import { Modules } from './modules.js';
import { Settings } from './settings.js';
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from 'axios';

export const PageContext = React.createContext({})

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // self
            isLoaded: false,
            // data

        };
    };

    componentDidMount() {
        axios.post('/api/page-data/')
            .then(function (response) {
                setTimeout(function() {
                    this.setState({
                        pageData: response.data,
                        isLoaded: true,
                    });
                }.bind(this), 500);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    };

    render() {
        if (this.state.isLoaded) {
            return (
                <PageContext.Provider value={this.state.pageData}>
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
                <Loader />
            );
        };
    };
};

class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    We're getting your page ready...
                </div>
                <box-icon name='loader' animation='spin'></box-icon>
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
