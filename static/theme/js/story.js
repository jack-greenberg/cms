import React from 'react';
import { PostContext } from './index';
import showdown from 'showdown';
var converter = new showdown.Converter({
    simpleLineBreaks: false,
    emoji: true,
    openLinksInNewWindow: true,
    strikethrough: true,
    headerLevelStart: 2,
    noHeaderId: true,
});
converter.setFlavor('github');

export class Story extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPost: this.props.currentPost,
        }
    }
    render() {
        console.log(this.props.currentPost);
        let bodyText = converter.makeHtml(this.props.postData[this.props.currentPost].content[0].value)

        return (
            <article className="story">
                <div className="story__body" id='post-body' dangerouslySetInnerHTML={{'__html': bodyText}}>
                </div>
            </article>
        )
    }
}
