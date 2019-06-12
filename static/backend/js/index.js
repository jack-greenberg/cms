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

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
        };
    };

    componentDidMount() {
        setTimeout(function() {
            console.log("C");
            this.setState({
                isLoaded: true,
            });
        }.bind(this), 2000);
    };

    render() {
        if (this.state.isLoaded) {
            return (
                <BrowserRouter basename="/admin/">
                    <Route exact path="/" component={Home} />
                    <Route path="/pages/" component={Pages} />
                    <Route path="/modules/" component={Modules} />
                    <Route path="/settings/" component={Settings} />
                </BrowserRouter>
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
                <box-icon name='loader-alt' animation='spin'></box-icon>
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
