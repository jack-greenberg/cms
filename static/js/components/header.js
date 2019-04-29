import React from 'react';
import ReactDOM from 'react-dom';

export class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <h1>{this.props.pageTitle}</h1>
                <p>{this.props.author}</p>
            </header>
        )
    }
}
