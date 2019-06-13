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
                        <label htmlFor="form-general--site-title" className="input-container">
                            <div className="input__label">Site Title</div>
                            <input type="text" className="input--text  input--text--short  input--text--important" id="input-general--site-title"/>
                        </label>
                        <label htmlFor="form-general--author" className="input-container">
                            <div className="input__label">Author / Organization</div>
                            <input type="text" className="input--text  input--text--short" id="form-general--author"/>
                        </label>
                        <label htmlFor="form-general--url" className="input-container">
                            <div className="input__label">URL</div>
                            <input type="text" className="input--text  input--text--short" id="form-general--url"/>
                        </label>
                        <label htmlFor="form-general--google-analytics" className="input-container">
                            <div className="input__label">Google Analytics Tracking Code</div>
                            <input type="text" className="input--text  input--text--short" id="form-general--google-analytics"/>
                        </label>
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
                        <label htmlFor="form-general--meta-description" className="input-container  input-container--text">
                            <div className="input__label">Meta Description</div>
                            <input type="text" className="input--text  input--text--long" id="input-general--meta-description"/>
                        </label>
                        <label htmlFor="form-general--favicon" className="input-container  input-container--file">
                            <div className="input__label">Favicon</div>
                            <input type="file" id="form-general--favicon" className="input--file"/>
                            <div className="input--file-text-wrapper">
                                <div className="input--file__name"><span className="text--faint">No file selected</span></div>
                                <div className="input--file__button">Choose a file...</div>
                            </div>
                        </label>
                        <label htmlFor="form-general--meta-image" className="input-container  input-container--file">
                            <div className="input__label">Meta Image</div>
                            <input type="file" id="form-general--meta-image" className="input--file"/>
                            <div className="input--file-text-wrapper">
                                <div className="input--file__name"><span className="text--faint">No file selected</span></div>
                                <div className="input--file__button">Choose a file...</div>
                            </div>
                        </label>
                        <label htmlFor="form-general--robots-txt" className="input-container  input-container--text">
                            <div className="input__label">robots.txt</div>
                            <textarea rows="4" className="input--text  input--text--long  input--text--multiline" id="form-general--robots-txt"/>
                        </label>
                        <label htmlFor="form-general--sitemap" className="input-container  input-container--file">
                            <div className="input__label">Sitemap</div>
                            <input type="file" id="form-general--sitemap" className="input--file"/>
                            <div className="input--file-text-wrapper">
                                <div className="input--file__name"><span className="text--faint">No file selected</span></div>
                                <div className="input--file__button">Choose a file...</div>
                            </div>
                        </label>
                    </fieldset>
                </div>
            </section>
        )
    }
}
