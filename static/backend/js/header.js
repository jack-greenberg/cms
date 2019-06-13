import React from 'react';
import { Navigation } from './nav.js';

export class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <a href="/admin" className="header__title">My Cool Site</a>
                <Navigation />
            </header>
        )
    }
}
