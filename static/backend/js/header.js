import React from 'react';
import { BackendDataContext } from './index.js';
import { pad } from './posts.js';

export class Header extends React.Component {
    /*
        header for each page of admin

            props: siteTitle (title of the site from the db)

        includes <h1 /> of breadcrumbs, mostly for structure hierarchy
    */
    constructor(props) {
        super(props);

        this.state = {
            siteTitle: this.props.siteTitle,
            // isPostDraft: this.props.isPostDraft, // comes from singlepost.js and informs breadcrumbs prefix `d-` for post drafts
        }
    }
    static getDerivedStateFromProps(props, currentState) {
        return props;
    }
    render() {
        // let breadcrumbArray = window.location.pathname.slice(1, -1).split("/");
        //
        // for (let i = 0; i < breadcrumbArray.length; i++) {
        //     // Capitalize
        //     breadcrumbArray[i] = breadcrumbArray[i].charAt(0).toUpperCase() + breadcrumbArray[i].slice(1);
        //
        //     if (i == breadcrumbArray.length - 1) {
        //         // make the last one bold
        //         breadcrumbArray[i] = <span className={this.state.isPostDraft ? "breadcrumbs__last" : "breadcrumbs__last  draft-prefix"} key={i}>{pad(breadcrumbArray[i], 4)}</span>
        //     } else {
        //         breadcrumbArray[i] = <span key={i}>{breadcrumbArray[i]} > </span>
        //     }
        // }

        // Renders the title of the site from the BackendDataContext Provider
        return (
            <BackendDataContext.Consumer>
                {context => (
                    <header className="header">
                        <a href="/admin" className="header__title">{context.general.data['site-title']}</a>
                        {/*<p className="breadcrumbs">{breadcrumbArray}</p>*/}
                    </header>
                )}
            </BackendDataContext.Consumer>
        )
    }
}
