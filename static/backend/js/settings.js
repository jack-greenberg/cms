import React from 'react';
import { Header } from './header.js';

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: 'test',
        };
    }

    render() {
        return (
            <>
                <h1>SEEEETINGS</h1>
                <Header />
            </>
        );
    };
};
