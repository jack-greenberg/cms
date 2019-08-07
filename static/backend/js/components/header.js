import React from 'react';
import cf from '../config';
import { Link } from 'react-router-dom';
import Nav from './nav';

export class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <header className="header">
                <p className="header__title"><Link to="/">{cf.title}</Link></p>
                <Nav className="header__nav" />
            </header>
        )
    }
}
