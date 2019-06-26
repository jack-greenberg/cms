import React from 'react';
import { PageContext } from './index.js';
import { Route, NavLink } from "react-router-dom";
import { client } from './index.js';

export class Navigation extends React.Component {
    /*
        <Navigation /> component
    */
    constructor(props) {
        super(props);
        this.triggerNavigation = this.triggerNavigation.bind(this);
        this.logout = this.logout.bind(this);
        this.hideNav = this.hideNav.bind(this);

        this.state = {
            isOpen: false,
        }
    }
    triggerNavigation() {
        // Trigger opening the nav menu (for mobile only)
        this.setState({
            isOpen: !this.state.isOpen,
        });
        $('body').toggleClass("show-navigation");
    };
    hideNav() {
        $('body').removeClass('show-navigation');
    }
    // componentDidMount() {
    //     this.setState({
    //         isOpen: false,
    //     })
    // }
    logout() {
        // button to log out the user by calling /logout/ in the backend and redirecting the user to the home page
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
                    <button className={!this.state.isOpen ? "btn  btn--icon  btn--nav-trigger" : "btn  btn--icon  btn--icon--red  btn--nav-trigger"} onClick={this.triggerNavigation}>
                        <span className="screen-reader-text">Open navigation menu.</span>
                        {!this.state.isOpen ?
                            <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"/>
                            </svg>
                        :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ff6768" strokeWidth="2" stroke="white" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" stroke="none"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        }
                    </button>
                </div>
                <div className="navigation-wrapper">
                    <nav className="navigation">
                        <ul className="main-navigation">
                            <li>
                                <NavLink to="/" className="navlink" activeClassName="active" exact onClick={this.hideNav}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M3,13h1v2v5c0,1.103,0.897,2,2,2h3h6h3c1.103,0,2-0.897,2-2v-5v-2h1c0.404,0,0.77-0.244,0.924-0.617 c0.155-0.374,0.069-0.804-0.217-1.09l-9-9c-0.391-0.391-1.023-0.391-1.414,0l-9,9c-0.286,0.286-0.372,0.716-0.217,1.09 C2.23,12.756,2.596,13,3,13z M10,20v-5h4v5H10z M12,4.414l6,6V15l0,0l0.001,5H16v-5c0-1.103-0.897-2-2-2h-4c-1.103,0-2,0.897-2,2v5 H6v-5v-3v-1.586L12,4.414z"
                                        />
                                    </svg>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/" className="navlink" activeClassName="active" onClick={this.hideNav}>
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M4 6H6V8H4zM4 11H6V13H4zM4 16H6V18H4zM20 8L20 6 18.8 6 9.2 6 8.023 6 8.023 8 9.2 8 18.8 8zM8 11H20V13H8zM8 16H20V18H8z"/>
                                    </svg>
                                    Pages
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/posts/" className="navlink" activeClassName="active" onClick={this.hideNav}>
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M20,3H4C2.897,3,2,3.897,2,5v14c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z M4,19V5h16 l0.002,14H4z"/>
                                        <path d="M6 7H18V9H6zM6 11H14V13H6zM6 15H10V17H6z"/>
                                    </svg>
                                    Posts
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/images/" className="navlink" activeClassName="active" exact onClick={this.hideNav}>
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M19,3H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2V5C21,3.897,20.103,3,19,3z M5,19V5h14 l0.002,14H5z"/>
                                        <path d="M10 14L9 13 6 17 18 17 13 10z"/>
                                    </svg>
                                    Images
                                </NavLink>
                            </li>
                        </ul>
                        <ul className="secondary-navigation">
                            <li>
                                <a href="/" className="navlink">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M12 6C9.831 6 8.066 7.765 8.066 9.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626-.255.207-.496.404-.691.599C11.029 13.156 11 14.215 11 14.333V14.5h2l-.001-.133c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182C15.934 7.765 14.169 6 12 6zM11 16H13V18H11z"/>
                                        <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z"/>
                                    </svg>
                                    Docs
                                </a>
                            </li>
                            <li>
                                <NavLink to="/settings/" className="navlink" activeClassName="active" exact onClick={this.hideNav}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M12,16c2.206,0,4-1.794,4-4s-1.794-4-4-4s-4,1.794-4,4S9.794,16,12,16z M12,10c1.084,0,2,0.916,2,2s-0.916,2-2,2 s-2-0.916-2-2S10.916,10,12,10z"/>
                                        <path d="M2.845,16.136l1,1.73c0.531,0.917,1.809,1.261,2.73,0.73l0.529-0.306C7.686,18.747,8.325,19.122,9,19.402V20 c0,1.103,0.897,2,2,2h2c1.103,0,2-0.897,2-2v-0.598c0.675-0.28,1.314-0.655,1.896-1.111l0.529,0.306 c0.923,0.53,2.198,0.188,2.731-0.731l0.999-1.729c0.552-0.955,0.224-2.181-0.731-2.732l-0.505-0.292C19.973,12.742,20,12.371,20,12 s-0.027-0.743-0.081-1.111l0.505-0.292c0.955-0.552,1.283-1.777,0.731-2.732l-0.999-1.729c-0.531-0.92-1.808-1.265-2.731-0.732 l-0.529,0.306C16.314,5.253,15.675,4.878,15,4.598V4c0-1.103-0.897-2-2-2h-2C9.897,2,9,2.897,9,4v0.598 c-0.675,0.28-1.314,0.655-1.896,1.111L6.575,5.403c-0.924-0.531-2.2-0.187-2.731,0.732L2.845,7.864 c-0.552,0.955-0.224,2.181,0.731,2.732l0.505,0.292C4.027,11.257,4,11.629,4,12s0.027,0.742,0.081,1.111l-0.505,0.292 C2.621,13.955,2.293,15.181,2.845,16.136z M6.171,13.378C6.058,12.925,6,12.461,6,12c0-0.462,0.058-0.926,0.17-1.378 c0.108-0.433-0.083-0.885-0.47-1.108L4.577,8.864l0.998-1.729L6.72,7.797c0.384,0.221,0.867,0.165,1.188-0.142 c0.683-0.647,1.507-1.131,2.384-1.399C10.713,6.128,11,5.739,11,5.3V4h2v1.3c0,0.439,0.287,0.828,0.708,0.956 c0.877,0.269,1.701,0.752,2.384,1.399c0.321,0.307,0.806,0.362,1.188,0.142l1.144-0.661l1,1.729L18.3,9.514 c-0.387,0.224-0.578,0.676-0.47,1.108C17.942,11.074,18,11.538,18,12c0,0.461-0.058,0.925-0.171,1.378 c-0.107,0.433,0.084,0.885,0.471,1.108l1.123,0.649l-0.998,1.729l-1.145-0.661c-0.383-0.221-0.867-0.166-1.188,0.142 c-0.683,0.647-1.507,1.131-2.384,1.399C13.287,17.872,13,18.261,13,18.7l0.002,1.3H11v-1.3c0-0.439-0.287-0.828-0.708-0.956 c-0.877-0.269-1.701-0.752-2.384-1.399c-0.19-0.182-0.438-0.275-0.688-0.275c-0.172,0-0.344,0.044-0.5,0.134l-1.144,0.662l-1-1.729 L5.7,14.486C6.087,14.263,6.278,13.811,6.171,13.378z"/>
                                    </svg>
                                    Settings
                                </NavLink>
                            </li>
                            <li>
                                <button onClick={this.logout} className="navlink">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M2 12L7 16 7 13 16 13 16 11 7 11 7 8z"/>
                                        <path d="M13.001,2.999c-2.405,0-4.665,0.937-6.364,2.637L8.051,7.05c1.322-1.322,3.08-2.051,4.95-2.051s3.628,0.729,4.95,2.051 s2.051,3.08,2.051,4.95s-0.729,3.628-2.051,4.95s-3.08,2.051-4.95,2.051s-3.628-0.729-4.95-2.051l-1.414,1.414 c1.699,1.7,3.959,2.637,6.364,2.637s4.665-0.937,6.364-2.637c1.7-1.699,2.637-3.959,2.637-6.364s-0.937-4.665-2.637-6.364 C17.666,3.936,15.406,2.999,13.001,2.999z"/>
                                    </svg>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </>
        )
    }
}
