import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './errorhandler.js';
import { Home } from './home.js';
import { BrowserRouter, Route, Link } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Home />
        );
    };
};

var renderedApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById("root"));
