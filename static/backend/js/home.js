import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { TextInput } from './components.js';
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
        this.handleTextChange = this.handleTextChange.bind(this);

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
    handleTextChange(e) {
        // get the input field
        // see how it compares to the saved value
        // if different, change the color of the box shadow, and of the color of the changed input (add a class (--modified, --deleted, --added))
        // click a lock to prevent changes?
    };
    render() {
        return (
            <section className="section  section--seo">
                <div className="section__heading">
                    <h2>Search Engine Optimization</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <TextInput multiline storedValue={this.state.inputData['meta-description']} form="seo" name="meta-description" label="Meta Description"/>
                        <div className="input-container">
                            <div className="input__label">Favicon</div>
                            <input type="file" id="form-seo--favicon" className="input--file" onChange={this.handleFileInput} data-input-field="favicon" />
                            <label htmlFor="form-seo--favicon" className="align--horizontal">
                                <div className="input--file__filename">{this.state.inputData['favicon'] ? this.state.inputData['favicon'] : <span className="text--faint">No file saved</span>}</div>
                                <div className="input--file__button">Choose a file...</div>
                            </label>
                        </div>
                        <div className="input-container">
                            <div className="input__label">Meta Image</div>
                            <input type="file" id="form-seo--meta-image" className="input--file" onChange={this.handleFileInput} data-input-field="favicon"/>
                            <label htmlFor="form-seo--meta-image" className="align--horizontal">
                                <div className="input--file__filename">{this.state.inputData['meta-image'] ? this.state.inputData['meta-image'] : <span className="text--faint">No file saved</span>}</div>
                                <div className="input--file__button">Choose a file...</div>
                            </label>
                        </div>
                        <TextInput multiline code storedValue={this.state.inputData['robots']} form="seo" name="robots" label="robots.txt"/>
                        <div className="input-container">
                            <div className="input__label">Sitemap</div>
                            <input type="file" id="form-seo--sitemap" className="input--file" onChange={this.handleFileInput} data-input-field="sitemap" />
                            <label htmlFor="form-seo--sitemap" className="align--horizontal">
                                <div className="input--file__filename">{this.state.inputData['sitemap'] ? this.state.inputData['sitemap'] : <span className="text--faint">No file saved</span>}</div>
                                <div className="input--file__button">Choose a file...</div>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </section>
        )
    }
}
