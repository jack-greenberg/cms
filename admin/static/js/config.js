import React from 'react';

import { Home } from './pages/home';
import { Posts } from './pages/posts';
import { Post } from './pages/post';
import { Pages } from './pages/pages';
import { Page } from './pages/page';
var cf;

export default cf = {
    title: "Contentify",
    url: "/admin/",
    nav: [
        {
            name: "Home",
            url: "/",
            component: Home,
        },
        {
            name: "Pages",
            url: "/pages/",
            component: Pages,
            subPage: "page",
            subPageComponent: Page,
        },
        {
            name: "Posts",
            url: "/posts/",
            component: Posts,
            subPage: "post",
            subPageComponent: Post,
        },
    ],
};
