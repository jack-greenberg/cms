import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { TextInput, FileInput } from './components.js';
import { browserHistory } from 'react-router';
import { client } from './index.js';

export class Home extends React.Component {
    /*
        <Home /> page (main page of admin)
        path: /admin/
    */
    constructor(props) {
        super(props);

        this.state = {
            backendData: undefined,
        };
    };
    componentDidMount() {
        // Get data about the site (i.e. title, SEO stuff, author, etc.)
        client.get('/api/v1/siteData/')
            .then(function(response) {
                this.setState({
                    backendData: response.data,
                });
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
    }
    render() {
        if (this.state.backendData) {
            return (
                <>
                    <Navigation />
                    <div className="main-wrapper">
                        <Header siteTitle={this.state.backendData['general']['data']['site-title']}/>
                        <main className="main">
                            <div className="breadcrumbs">
                                <h1>Admin / Home</h1>
                            </div>
                            <div className="flex-wrapper">
                                <General inputData={this.state.backendData['general']['data']} />
                                <SEO inputData={this.state.backendData['seo']['data']} />
                                <Social inputData={this.state.backendData['social']['data']}/>
                            </div>
                        </main>
                        <Footer />
                    </div>
                </>
            );
        } else {
            return null;
        };
    };
};

class General extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputData: this.props.inputData,
        };
    }

    render() {
        return (
            <section className="section  section--general">
                <div className="section__heading-wrapper">
                    <h2 className="section__heading">General</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <TextInput important storedValue={this.state.inputData['site-title']} endpoint="siteData" pk="general" name="site-title" label="Site Title"/>
                        <TextInput storedValue={this.state.inputData['author']} endpoint="siteData" pk="general" name="author" label="Author / Organization"/>
                        <TextInput storedValue={this.state.inputData['url']} endpoint="siteData" pk="general" name="url" label="URL"/>
                        <TextInput storedValue={this.state.inputData['google-analytics']} endpoint="siteData" pk="general" name="google-analytics" label="Google Analytics Tracking Code"/>
                    </fieldset>
                </div>
            </section>
        )
    }
}

class SEO extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputData: this.props.inputData,
        };
    }
    render() {
        return (
            <section className="section  section--seo">
                <div className="section__heading-wrapper">
                    <h2 className="section__heading">Search Engine Optimization</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <TextInput multiline storedValue={this.state.inputData['meta-description']} endpoint="siteData" pk="seo" name="meta-description" label="Meta Description"/>
                        <FileInput storedValue={this.state.inputData['favicon']} endpoint="siteData" pk="seo" name="favicon" label="Favicon" accept=".ico,.png,.jpg"/>
                        <FileInput storedValue={this.state.inputData['meta-image']} endpoint="siteData" pk="seo" name="meta-image" label="Meta Image" accept=".jpg,.png"/>
                        <TextInput multiline code storedValue={this.state.inputData['robots']} endpoint="siteData" pk="seo" name="robots" label="robots.txt"/>
                        <FileInput storedValue={this.state.inputData['sitemap']} endpoint="siteData" pk="seo" name="sitemap" label="Sitemap" accept=".xml"/>
                    </fieldset>
                </div>
            </section>
        )
    }
}

class Social extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputData: this.props.inputData,
        }
    }
    render() {
        return (
            <section className="section">
                <div className="section__heading">
                    <h2>Social</h2>
                </div>
                <div className="section__body">
                    <fieldset className="form-container">
                        <TextInput storedValue={this.state.inputData['facebook']} endpoint="siteData" pk="social" name="facebook" label="Facebook" />
                        <TextInput storedValue={this.state.inputData['instagram']} endpoint="siteData" pk="social" name="instagram" label="Instagram" />
                        <TextInput storedValue={this.state.inputData['linkedin']} endpoint="siteData" pk="social" name="linkedin" label="LinkedIn" />
                        <TextInput storedValue={this.state.inputData['email']} endpoint="siteData" pk="social" name="email" label="Email" />
                    </fieldset>
                </div>
            </section>
        )
    }
}
