import React from 'react';
import cf from '../config';
import { Route, NavLink } from "react-router-dom";

export default class Navigation extends React.Component {
    render() {
        return (
            <nav className={this.props.className + "  nav"}>
                <ul className="nav__primary">
                    {cf.nav.map((page, index) => {
                        return (
                            <li className="nav__item" key={index}>
                                <NavLink to={page.url} className="nav__link" activeClassName="nav__link--active" exact>
                                    {page.name}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
                <SecondaryNav />
            </nav>
        );
    };
};
class SecondaryNav extends React.Component {
    render() {
        return (
            <ul className="nav__secondary">
                <li className="nav__item"><a href="/"className="nav__link">Docs</a></li>
                <li className="nav__item"><NavLink to="/settings/" className="nav__link" activeClassName="nav__link--active">Settings</NavLink></li>
                <li className="nav__item"><a href="/logout/" className="nav__link">Sign out</a></li>
            </ul>
        )
    }
}
