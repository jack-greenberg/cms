import React from 'react';
import { Form } from '../components/inputs/form';
import { Input } from '../components/inputs/';
import { AppContext } from '../index';

export class Home extends React.Component {
    /*
    TODO: decide on content for home page
    */
    render() {
        return (
            <>
                <main className="main">
                    <AppContext.Consumer>
                        {value => {
                            return (
                                <>
                                    <h1>{value.General.data['site-title']}</h1>
                                    <p>A site by <span>{value.General.data['author']}</span></p>
                                </>
                            )
                        }}
                    </AppContext.Consumer>
                    <div className="flex">
                        <nav className="tabs tabs--vertical">
                            <ul>
                                <AppContext.Consumer>
                                    {value => {
                                        return Object.keys(value).map((section, index) => <li key={index}><button>{section}</button></li>);
                                    }}
                                </AppContext.Consumer>
                            </ul>
                        </nav>
                    </div>
                    {/* <AppContext.Consumer> */}
                        {/* <Form>
                            {value => {
                                console.log(value);
                                return Object.keys(value).map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <h2 key={index}>{item}</h2>
                                            <AppContext.Consumer>
                                                {value => {
                                                    try {
                                                        return Object.keys(value[item].data).map((field, index) => {
                                                            return <Input.Text label={field} defaultValue={value[item].data[field]} key={index} />;
                                                        });
                                                    } catch {
                                                        return;
                                                    };
                                                }}
                                            </AppContext.Consumer>
                                        </React.Fragment>
                                    );
                                })
                            }}
                        </Form> */}
                    {/* </AppContext.Consumer> */}
                </main>
            </>
        );
    };
};
