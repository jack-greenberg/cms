import styles from '../css/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';

import client from './api';
import LoadingScreen from './loading-screen';
import { ErrorBoundary } from './errorboundary';

export const AppContext = React.createContext({});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //! This can be removed because of the comment below
            ready: true,
            data: siteData,
        }
    }
    componentDidMount() {
        // var siteData = document.getElementById("siteData").value
        console.log(siteData) //! This is set in admin.j2, in the script with `const siteData = {{ siteData|tojson }}`
        // if (window.location.pathname !== '/admin/login/') {
        //     client.get('/api/v1/siteData')
        //     .then(res => {
        //         console.log(res);
        //         this.setState({
        //             data: res.data,
        //             ready: true,
        //         })
        //     })    
        // } else {
        //     this.setState({
        //         ready: true,
        //     })
        // }
    };
    render() {
        if (this.state.ready) {
            return (
                <AppContext.Provider value={this.state.data}>
                    <Router />
                </AppContext.Provider>
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
