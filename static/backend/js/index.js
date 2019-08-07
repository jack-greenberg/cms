import styles from '../css/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';

import client from './api';
import LoadingScreen from './loading-screen';
import { ErrorBoundary } from './errorboundary';



class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            data: undefined,
        }
    }
    componentDidMount() {
        client.get('/api/v1/siteData')
        .then(res => {
            console.log(res);
            this.setState({
                data: res.data,
                ready: true,
            })
        })
    };
    render() {
        if (this.state.ready) {
            return (
                <Router />
            );
        } else {
            return <LoadingScreen />;
        };
    };
};

var renderedApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById("root"));
