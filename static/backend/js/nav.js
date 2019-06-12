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
                        <ul>
                            <PageContext.Consumer>
                                {context => (
                                    <React.Fragment>
                                        {Object.keys(context).map((page, index) => <NavLink to={"/pages" + context[page].path} activeClassName="active" activeStyle={{ fontWeight: 'bold' }} exact>{context[page].name}</NavLink>)}
                                    </React.Fragment>
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
                </ul>
                <PageContext.Consumer>
                    {context => {
                            return <p>{Object.keys(context)}</p>
                        }
                    }
                </PageContext.Consumer>
            </nav>
        )
    }
}
