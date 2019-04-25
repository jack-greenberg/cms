import React from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleData: {},
            isLoaded: false,
            error: null
        };
    };

    componentDidMount() {
        axios.post('/module-list', {
            test: "hello"
        })
        .then(function(response) {
            console.log(response["data"]);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    render() {


        return (
            <h1>Home</h1>
        );
    };
};
