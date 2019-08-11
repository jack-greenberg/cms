import React from 'react';
import cf from '../config';
import { NavLink } from "react-router-dom";
import * as Icon from 'react-feather';

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.toggleNav = this.toggleNav.bind(this);

        this.state = {
            open: false,
        };
    };
    toggleNav() {
        this.setState({
            open: !this.state.open,
        });
    };
    render() {
        return (
            <>
                <button className="Button  Button--icon" onClick={this.toggleNav}><Icon.Menu /></button>
                {this.state.open && <button onClick={this.toggleNav} className="outside-click"> </button>}
                <nav className={this.props.className + "  nav" + (this.state.open ? "  nav--open" : "")}>
                    <ul className="nav__primary">
                        {cf.nav.map((page, index) => {
                            return (
                                <li className="nav__item" key={index}>
                                    <NavLink to={page.url} className="nav__item__link" activeClassName="nav__item__link--active" exact>
                                        {page.name}
                                    </NavLink>
                                </li>
                            )
                        })}
                    </ul>
                    <SecondaryNav />
                </nav>
            </>
        );
    };
};
class SecondaryNav extends React.Component {
    render() {
        return (
            <ul className="nav__secondary">
                <li className="nav__item"><a href="/"className="nav__item__link">Docs</a></li>
                <li className="nav__item"><NavLink to="/settings/" className="nav__item__link" activeClassName="nav__link--active">Settings</NavLink></li>
                <li className="nav__item"><a href="/logout/" className="nav__item__link">Sign out</a></li>
            </ul>
        )
    }
}
