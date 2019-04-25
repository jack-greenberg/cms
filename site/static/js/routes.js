import React from 'react';
import { BrowserRouter, StaticRouter, Router, Route } from 'react-router-dom';
import { Home } from './components/home';

export default (
    <BrowserRouter>
        <div>
            <Route exact path='/' component={ Home } />
        </div>
    </BrowserRouter>
)
