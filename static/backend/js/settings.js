import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { client } from './index.js';

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            backendData: undefined,
        };
    };
    componentDidMount() {
        client.post('/api/get/siteData/')
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
                    <Header siteTitle={this.state.backendData['general']['data']['site-title']}/>
                    <main className="main">
                        <div className="breadcrumbs">
                            <h1>Admin / Settings</h1>
                        </div>
                    </main>
                    <Footer />
                </>
            );
        } else {
            return null;
        };
    };
};
