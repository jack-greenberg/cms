import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { TextInput, ToggleSwitch } from './components';
import { Link } from 'react-router-dom';
import { client } from './index.js';

export class SinglePage extends React.Component {
    /*
        Editor for a singular page
        path: /admin/pages/<pageName>/
    */
    constructor(props) {
        super(props);

        this.state = {
            pageData: null,
        }
    }
    componentDidMount() {
        let pathPage = window.location.href.slice(1,-1).split('/').pop() || window.location.href.slice(1,-1).split('/').pop();
        client.post('/api/get/page-data/', {
            pageName: pathPage.charAt(0).toUpperCase() + pathPage.slice(1),
        })
        .then(response => {
            this.setState({
                pageData: response.data,
            });
        })
    }
    render() {
        if (this.state.pageData) {
            return (
                <>
                    <Navigation />
                        <div className="main-wrapper">
                            <Header />
                            <main className="main">
                                <div className="page-link-wrapper">
                                    <Link to="/pages/">Back to pages</Link>
                                </div>
                                <div className="main__menu">
                                    <button className="menu__button">General</button>
                                    <button className="menu__button">Content</button>
                                </div>
                                <article className="main__general">
                                    <section className="main__general__basic">
                                        <TextInput important storedValue={this.state.pageData['name']} form="basic" name="title" label="Title" />
                                        <TextInput storedValue={this.state.pageData['path']} form="basic" title="path" label="Path" />
                                        <div className="flex-wrapper">
                                            <ToggleSwitch isChecked={this.state.pageData['live']} />
                                            {this.state.pageData['live'] ?
                                                null
                                            :
                                                <a href={"/admin/posts/private/" + this.state.pageData['title'] + "/"}>Private link</a>
                                            }
                                        </div>
                                    </section>
                                </article>
                            </main>
                            <Footer />
                        </div>
                </>
            )
        } else {
            return null;
        }
    }
}
