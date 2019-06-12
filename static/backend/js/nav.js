import React from 'react';
import { PageContext } from './index.js';
import { Route, NavLink } from "react-router-dom";

export class Navigation extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Home</NavLink>
                    </li>
                    <li>
                        Pages

                        <NavLink to="/pages/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Pages</NavLink>
                    </li>
                    <li>
                        <NavLink to="/modules/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Modules</NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Settings</NavLink>
                    </li>
                </ul>
                <PageContext.Consumer>{context => <p>{context}</p>}</PageContext.Consumer>
            </nav>
        )
    }
}
