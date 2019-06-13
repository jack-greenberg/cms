import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';

export class Home extends React.Component {
    render() {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="breadcrumbs">
                        <h1>Admin / Home</h1>
                    </div>
                    <General />
                    <SEO />
                </main>
                <Footer />
            </>
        );
    };
};

class General extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <section className="section  section--general">
                <div className="section__heading-wrapper">
                    <h2 className="section__heading">General</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <div className="input-container">
                            <label htmlFor="form-general--site-title" className="input__label">Site Title</label>
                            <input type="text" className="input--text  input--text--short  input--important" id="form-general--site-title"/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-general--author" className="input__label">Author / Organization</label>
                            <input type="text" className="input--text  input--text--short" id="form-general--author"/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-general--url" className="input__label">URL</label>
                            <input type="text" className="input--text  input--text--short" id="form-general--url"/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-general--google-analytics" className="input__label">Google Analytics Tracking Code</label>
                            <input type="text" className="input--text  input--text--short" id="form-general--google-analytics"/>
                        </div>
                    </fieldset>
                </div>
            </section>
        )
    }
}

class SEO extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <section className="section  section--seo">
                <div className="section__heading">
                    <h2>Search Engine Optimization</h2>
                </div>

                <div className="section__body">
                    <fieldset className="form-container">
                        <div className="input-container">
                            <label htmlFor="form-seo--meta-description" className="input__label">Meta Description</label>
                            <input type="text" className="input--" id="form-seo--meta-description"/>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-seo--favicon" className="input__label">Favicon</label>
                            <input type="file" id="form-seo--favicon" className="input--file"/>
                            <div className="file-interface">
                                <div className="file-interface__filename"><span className="text--faint">No file selected</span></div>
                                <div className="file-interface__button">Choose a file...</div>
                            </div>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-seo--meta-image" className="input__label">Meta Image</label>
                            <input type="file" id="form-seo--meta-image" className="input--file"/>
                            <div className="file-interface">
                                <div className="file-interface__filename"><span className="text--faint">No file selected</span></div>
                                <div className="file-interface__button">Choose a file...</div>
                            </div>
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-seo--robots-txt" className="input__label">robots.txt</label>
                            <textarea name="" id="" cols="30" rows="4" className="input--text  input--text--long  input--text--multiline" />
                        </div>
                        <div className="input-container">
                            <label htmlFor="form-seo--sitemap" className="input__label">Sitemap</label>
                            <input type="file" id="form-seo--sitemap" className="input--file"/>
                            <div className="file-interface">
                                <div className="file-interface__filename"><span className="text--faint">No file selected</span></div>
                                <div className="file-interface__button">Choose a file...</div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </section>
        )
    }
}
