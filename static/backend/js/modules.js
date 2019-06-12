import React from 'react';
import { Header } from './header.js';

export class Modules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: 'test',
        };
    }

    render() {
        return (
            <>
                <h1>MOOOODULES</h1>
                <Header />
            </>
        );
    };
};
