import styles from '../css/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';

import client from './api';
import { ErrorBoundary } from './errorboundary';

export const AppContext = React.createContext({});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: siteData, //! This is set in admin.j2, in the script with `const siteData = {{ siteData|tojson }}`
        }
    }
    // componentDidMount() {
    //     // var siteData = document.getElementById("siteData").value
    //     console.log(siteData) 
    //     // if (window.location.pathname !== '/admin/login/') {
    //     //     client.get('/api/v1/siteData')
    //     //     .then(res => {
    //     //         console.log(res);
    //     //         this.setState({
    //     //             data: res.data,
    //     //             ready: true,
    //     //         })
    //     //     })    
    //     // } else {
    //     //     this.setState({
    //     //         ready: true,
    //     //     })
    //     // }
    // };
    render() {
        return (
            <AppContext.Provider value={this.state.data}>
                <Router />
            </AppContext.Provider>
        );
    };
};

var renderedApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById("root"));
