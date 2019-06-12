import React from 'react';
import { Header } from './header.js';

export class Pages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: 'test',
        };
    }

    render() {
        return (
            <>
                <h1>PAAAAGES</h1>
                <Header />
            </>
        );
    };
};
