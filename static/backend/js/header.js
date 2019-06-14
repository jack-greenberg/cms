import React from 'react';
import { Navigation } from './nav.js';

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            siteTitle: this.props.siteTitle,
        }
    }
    static getDerivedStateFromProps(props, currentState) {
        return props;
    }
    render() {
        return (
            <header className="header">
                <a href="/admin" className="header__title">{this.state.siteTitle}</a>
                <Navigation />
            </header>
        )
    }
}
