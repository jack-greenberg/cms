import React from 'react';
import { Route, Link } from "react-router-dom";

export class Navigation extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/pages">Pages</Link>
                    </li>
                    <li>
                        <Link to="/modules">Modules</Link>
                    </li>
                    <li>
                        <Link to="">Images</Link>
                    </li>
                    <li>
                        <Link to="">Styles</Link>
                    </li>
                    <li>
                        <Link to="">Settings</Link>
                    </li>
                </ul>
            </nav>
        )
    }
}
