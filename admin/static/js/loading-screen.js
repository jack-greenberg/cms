import React from 'react';
import { Loader } from 'react-feather';

export default class LoadingScreen extends React.Component {
    // Loading screen with a set of friendly phrases
    constructor(props) {
        super(props);

        this.phraseList = [
            "We're getting your page ready...",
            "Sit tight while we get our stuff together...",
            "Hold on a second while we organize...",
            "One moment while we make our AJAX calls...",
        ];
    }

    render() {
        return (
            <div className="loading-screen">
                <div className="loading-screen__text">
                    {this.phraseList[Math.floor(Math.random() * this.phraseList.length)]}
                </div>
                <Loader className="loading-screen__icon  animate--rotate" />
            </div>
        )
    }
}
