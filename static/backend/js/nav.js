import React from 'react';
import { PageContext } from './index.js';
import * as Icon from 'react-feather';
import { Route, NavLink } from "react-router-dom";
import { client } from './index.js';

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.triggerNavigation = this.triggerNavigation.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            isOpen: false,
        }
    }
    triggerNavigation() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
        $('body').toggleClass("show-navigation");
    };
    componentDidMount() {
        if (this.state.isOpen) {
            $('body').toggleClass("show-navigation");
        }
    }
    logout() {
        client.post('/logout/')
        .then(response => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error(error.response);
        })
    }
    render() {
        return (
            <>
                <div className="nav-trigger-container">
                    <button className="btn  btn--icon  btn--nav-trigger" onClick={this.triggerNavigation}>
                        <span className="screen-reader-text">Open navigation menu.</span>
                        {!this.state.isOpen ? <Icon.Menu className="icon" /> : <Icon.X className="icon" />}
                    </button>
                </div>
                <nav className="navigation">
                    <ul>
                        <li>
                            <NavLink to="/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Home</NavLink>
                        </li>
                        <li>
                            Pages
                            <ul>
                                <PageContext.Consumer>
                                    {context => (
                                        <>
                                            {context.map((page, index) => <NavLink to={"/pages/" + page.toLowerCase().replace(/ /, "_")} activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact key={index}>{page}</NavLink>)}
                                        </>
                                    )}
                                </PageContext.Consumer>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/modules/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Modules</NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings/" activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>Settings</NavLink>
                        </li>
                        <li>
                            <a href="/" className="btn  btn--green">Visit Site</a>
                        </li>
                        <li>
                            <button onClick={this.logout} className="btn  btn--green">Logout</button>
                        </li>
                    </ul>
                </nav>
            </>
        )
    }
}
