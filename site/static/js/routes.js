import React from 'react';
import { BrowserRouter, StaticRouter, Router, Route } from 'react-router-dom';
import { Home } from './components/home';
import { CMS } from './components/cms';

export default (
    <BrowserRouter>
        <div>
            <Route exact path='/' component={ Home } />
            <Route path='/admin/' component={ CMS } />
        </div>
    </BrowserRouter>
)
