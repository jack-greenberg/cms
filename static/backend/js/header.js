import React from 'react';
import { Navigation } from './nav.js';

export class Header extends React.Component {
    render() {
        return (
            <header>
                <a href="/admin">My Cool Site</a>
                <Navigation />
                <a href="/">Visit Site</a>
            </header>
        )
    }
}
