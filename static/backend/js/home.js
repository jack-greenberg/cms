import React from 'react';

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: 'test',
        };
    }

    render() {
        return (
            <h1>Home</h1>
        );
    };
};
