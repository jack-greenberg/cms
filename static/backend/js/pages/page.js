import React from 'react';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

export class Page extends React.Component {
    render() {
        return (
            <>
                <Header />
                <main>
                    <h1>Page</h1>
                </main>
                <Footer />
            </>
        )
    }
}
