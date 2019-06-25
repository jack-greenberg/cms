import React from 'react';
import { BackendDataContext } from './index.js';

export class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            siteTitle: this.props.siteTitle,
        }
    }
    static getDerivedStateFromProps(props, currentState) {
        return props;
    }
    render() {
        return (
            <BackendDataContext.Consumer>
                {context => (
                    <header className="header">
                        <a href="/admin" className="header__title">{context.general.data['site-title']}</a>
                    </header>
                )}
            </BackendDataContext.Consumer>
        )
    }
}
