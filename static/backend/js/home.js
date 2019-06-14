import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { TextInput, FileInput } from './components.js';
import axios from 'axios';

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backendData: undefined,
        };
    };
    componentDidMount() {
        axios.post('/api/backend-data/')
            .then(function(response) {
                this.setState({
                    backendData: response.data,
                });
            }.bind(this))
            .catch(function(error) {
                throw new Error(error);
                console.error(error);
            });
    }
    render() {
        if (this.state.backendData) {
            return (
                <>
                    <Header siteTitle={this.state.backendData['general']['data']['site-title']}/>
                    <main className="main">
                        <div className="breadcrumbs">
                            <h1>Admin / Home</h1>
                        </div>
                        <General inputData={this.state.backendData['general']['data']} />
                        <SEO inputData={this.state.backendData['seo']['data']} />
                    </main>
                    <Footer />
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
                        <TextInput important storedValue={this.state.inputData['site-title']} form="general" name="site-title" label="Site Title"/>
                        <TextInput storedValue={this.state.inputData['author']} form="general" name="author" label="Author / Organization"/>
                        <TextInput storedValue={this.state.inputData['url']} form="general" name="url" label="URL"/>
                        <TextInput storedValue={this.state.inputData['google-analytics']} form="general" name="google-analytics" label="Google Analytics Tracking Code"/>
                    </fieldset>
                </div>
            </section>
        )
    }
}

class SEO extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileInput = this.handleFileInput.bind(this);

        this.state = {
            inputData: this.props.inputData,
        };
    }
    handleFileInput(e) {
        let fileName = e.target.value.split('\\').pop();
        let inputDataCopy = this.state.inputData;
        inputDataCopy[e.target.getAttribute('data-input-field')] = fileName;
        this.setState({
            inputData: inputDataCopy,
        });
    };
    render() {
        return (
            <section className="section  section--seo">
                <div className="section__heading-wrapper">
                    <h2 className="section__heading">Search Engine Optimization</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <TextInput multiline storedValue={this.state.inputData['meta-description']} form="seo" name="meta-description" label="Meta Description"/>
                        <FileInput storedValue={this.state.inputData['favicon']} form="seo" name="favicon" label="Favicon" accept=".ico,.png,.jpg"/>
                        <FileInput storedValue={this.state.inputData['favicon']} form="seo" name="meta-image" label="Meta Image" accept=".jpg,.png"/>
                        <TextInput multiline code storedValue={this.state.inputData['robots']} form="seo" name="robots" label="robots.txt"/>
                        <FileInput storedValue={this.state.inputData['favicon']} form="seo" name="sitemap" label="Sitemap" accept=".xml"/>
                    </fieldset>
                </div>
            </section>
        )
    }
}
