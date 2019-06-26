import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { Route, NavLink } from "react-router-dom";
import { ToggleSwitch } from './components.js';
import { client } from './index.js';
import ReactTooltip from 'react-tooltip';

export class Pages extends React.Component {
    /*
        List of pages
        path: /admin/pages/

    */
    constructor(props) {
        super(props);

        this.state = {
            pageData: undefined,
        };
    };
    componentDidMount() {
        // get the data about the pages
        client.post('/api/get/page-data/')
            .then(function(response) {
                this.setState({
                    pageData: response.data,
                });
                console.log(response.data);
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        if (this.state.pageData) {
            return (
                <>
                    <Navigation />
                    <div className="main-wrapper">
                        <Header />
                        <main className="main">
                            <Toolbar />
                            <PageList pageData={this.state.pageData} />
                        </main>
                        <Footer />
                    </div>
                </>
            );
        } else {
            // return <LoadingScreen />
            return null;
        };
    };
};
class PageList extends React.Component {
    // The table structure for the list of pages
    constructor(props) {
        super(props);
        this.state = {
            pageData: this.props.pageData,
        }
    }
    render() {
        return (
            <section className="table-wrapper">
                <div role="table" className="page-list">
                    <div role="row"  className="page-list__head">
                        <div role="cell"></div>
                        <div role="cell">Page Name</div>
                        <div role="cell">Status</div>
                        <div role="cell">Last Edited</div>
                    </div>
                    <div role="rowgroup" className="page-list__body">
                        {this.state.pageData.map((page, index) => {
                            return (
                                <PageListItem data={page} key={index} />
                            );
                        })}
                    </div>
                </div>
            </section>
        )
    }
}
class PageListItem extends React.Component {
    // The individual page listing
    constructor(props) {
        super(props);

        this.checkPage = this.checkPage.bind(this);

        this.state = {
            checked: false,
            status: this.props.data['live'] ? true : false,
            pageName: this.props.data['name'],
            lastUpdated: new Date(this.props.data['lastUpdated']['$date']).toLocaleDateString(),
        }
    }
    checkPage() {
        this.setState({
            checked: !this.state.checked,
        });
    }
    render() {
        return (
            <div role="row" className={!this.state.checked ? "page" : "page  page--checked"}>
                <div role="cell" className="page__checkbox"><input type="checkbox" onClick={this.checkPage}/></div>
                <div role="cell" className="page__name"><NavLink to={'/pages/' + this.state.pageName.toLowerCase() + '/'} exact>{this.state.pageName}</NavLink></div>
                <div role="cell" className="page__status">
                    {this.state.status ?
                        <ToggleSwitch isChecked={true} forId={"page-" + this.state.pageName} />
                    :
                        <ToggleSwitch isChecked={false} forId={"page-" + this.state.pageName} />
                    }
                </div>
                <div role="cell" className="page__last-edited">{this.state.lastUpdated}</div>
            </div>
        )
    }
}

class Toolbar extends React.Component {
    // Toolbar to edit the checked pages and filter
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="toolbar">
                <button className="btn  btn--icon" data-tip data-for="checkAll">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z"/></svg>
                </button>
                <ReactTooltip id="checkAll" effect="solid">
                    <span>Select All</span>
                </ReactTooltip>
                <button className="btn  btn--icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M15,2H9C7.897,2,7,2.897,7,4v2H3v2h2v12c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-4V4C17,2.897,16.103,2,15,2z M9,4h6v2H9V4z M17,20H7V8h1h8h1V20z"/>
                    </svg>
                </button>
                <button className="btn  btn--icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M11 10L9 10 9 13 6 13 6 15 9 15 9 18 11 18 11 15 14 15 14 13 11 13z"/>
                        <path d="M4,22h12c1.103,0,2-0.897,2-2V8c0-1.103-0.897-2-2-2H4C2.897,6,2,6.897,2,8v12C2,21.103,2.897,22,4,22z M4,8h12l0.002,12H4 V8z"/>
                        <path d="M20,2H8v2h12v12h2V4C22,2.897,21.103,2,20,2z"/>
                    </svg>
                </button>
                <div className="filter-wrapper">
                    <label htmlFor="filter" className="filter__label">
                        <svg className="filter__label__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"/>
                            <path d="M11.412,8.586C11.791,8.966,12,9.468,12,10h2c0-1.065-0.416-2.069-1.174-2.828c-1.514-1.512-4.139-1.512-5.652,0 l1.412,1.416C9.346,7.83,10.656,7.832,11.412,8.586z"/>
                        </svg>
                    </label>
                    <input type="text" className="filter" id="filter" placeholder="Filter"/>
                </div>
            </div>
        )
    }
}
