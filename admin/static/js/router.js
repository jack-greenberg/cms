import React from 'react';
import cf from './config';
import { BrowserRouter, Route, Switch } from "react-router-dom";

// import { Header } from './components/header';
// import { Footer } from './components/footer';
// import { Login } from './pages/login';

import Error404 from './404';

export default class Router extends React.Component {
    render() {
        return (
            <BrowserRouter basename={cf.url}>
                {/* <Header /> */}
                <Switch>
                    {cf.nav.map((page, index) => {
                        let Page = page.component;
                        if (page.subPage) {
                            let SubPage = page.subPageComponent;
                            return [
                                <Route key={index.toString()} exact path={page.url} render={(props) => <Page {...props} />} />,
                                <Route key={(index + 0.1).toString()} path={page.url + ':' + page.subPage + '/'} render={(props) => <SubPage {...props} />} />
                            ];
                        } else {
                            return <Route key={index.toString()} exact path={page.url} render={(props) => <Page {...props} />} />;
                        };
                    })}
                    <Route path="/settings/" render={(props) => <Settings {...props} />} />
                    <Route path="/login/" render={(props) => <Login {...props} />} />
                    <Route component={Error404} />
                </Switch>
                {/* <Footer /> */}
            </BrowserRouter>
        )
    }
}
