import React from 'react';
import cf from '../config';
import { Link } from 'react-router-dom';
import Nav from './nav';

export class Header extends React.Component {
    render() {
        return (
            <header className="Header">
                <p className="Header__title  h1"><Link to="/" className="link">{cf.title}</Link></p>
                <Nav className="Header__nav" />
            </header>
        )
    }
}
