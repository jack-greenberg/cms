import React from 'react';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

export class Pages extends React.Component {
    render() {
        return (
            <>
                <Header />
                <main className="Main">
                    <h1>Pages</h1>
                </main>
                <Footer />
            </>
        )
    }
}
