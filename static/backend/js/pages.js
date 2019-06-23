import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { ToggleSwitch } from './components.js';
import { client } from './index.js';

export class Pages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageData: undefined,
        };
    };
    componentDidMount() {
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
                            <div className="toolbar"></div>
                            <div className="table-wrapper">
                                <table className="page-list">
                                    <thead>
                                        <tr className="page-list__header">
                                            <th></th>
                                            <th>Page Name</th>
                                            <th>Status</th>
                                            <th>Last Edited</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.pageData.map((page, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th><input type="checkbox"/></th>
                                                    <td>{this.state.pageData[index]['name']}</td>
                                                    <td>
                                                        {this.state.pageData[index]['live'] ?
                                                            <ToggleSwitch isChecked={true} forId={"page-" + this.state.pageData[index]['name']} />
                                                        :
                                                            <ToggleSwitch isChecked={false} forId={"page-" + this.state.pageData[index]['name']} />
                                                        }
                                                    </td>
                                                    <td>{(new Date(this.state.pageData[index]['lastUpdated']['$date'])).toLocaleDateString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
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
