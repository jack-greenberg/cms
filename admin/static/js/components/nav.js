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
                <button className="Button  Button--icon  Nav-trigger" onClick={this.toggleNav}><Icon.Menu className="Icon--large" /></button>
                {this.state.open && <button onClick={this.toggleNav} className="outside-click"> </button>}
                <nav className={this.props.className + "  Nav" + (this.state.open ? "  Nav--open" : "")}>
                    <ul className="Nav__primary">
                        {cf.nav.map((page, index) => {
                            return (
                                <li className="Nav__item  f-2" key={index}>
                                    <NavLink to={page.url} className="Nav__item__link  link  dim" activeClassName="blue" exact>
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
            <ul className="Nav__secondary">
                <li className="Nav__item"><a href="/"className="Nav__item__link  link  dim">Docs</a></li>
                <li className="Nav__item"><NavLink to="/settings/" className="Nav__item__link  link  dim" activeClassName="blue">Settings</NavLink></li>
                <li className="Nav__item"><a href="/logout/" className="Nav__item__link  link  dim">Sign out</a></li>
            </ul>
        )
    }
}
