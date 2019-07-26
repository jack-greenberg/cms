import React, { useState } from 'react';
import { PostContext } from './index';
import { Transition } from 'react-transition-group';
var $ = require('jquery');
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

const duration = 200;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 1,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 0 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 1 },
};

var makeSRCSET = (srcset, postId) => {
    let srcsetText = '';
    for (let i=0; i < srcset.length; i++) {
        srcsetText += 'static/images/' + postId + '/' + srcset[i] + ' ' + srcset[i].split('.')[2] + 'w, ';
    }
    return srcsetText;
}

export class Story extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPost: this.props.currentPost,
            transition: false,
        }
    }
    static getDerivedStateFromProps(props, currentState) {
        if ((currentState.currentPost !== props.currentPost) && !currentState.transition) {
            return {transition: true, currentPost: currentState.currentPost}
        } else if (currentState.transition) {
            return {transition: false, currentPost: props.currentPost}
        };
        return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.currentPost !== this.props.currentPost) && this.state.transition) {
            setTimeout(() => {
                this.setState({
                    transition: true,
                    currentPost: this.props.currentPost,
                })
            }, duration)
        }
    }
    render() {
        var postId = this.props.postData[this.state.currentPost]['_id']['$oid'];
        var contentArray = this.props.postData[this.state.currentPost].content;
        let renderedContentArray = [];
        for (let i = 0; i < contentArray.length; i++) {
            switch (contentArray[i].type) {
                case 'text':
                    let bodyText = converter.makeHtml(contentArray[i].value);
                    renderedContentArray.push(
                        <section
                            key={i}
                            className="story__text"
                            dangerouslySetInnerHTML={{'__html': bodyText}}
                        ></section>
                    );
                    break;
                case 'image':
                    renderedContentArray.push(
                        <figure className="story__image" key={i}>
                            <img
                                src={"static/images/" + postId + '/' + contentArray[i].src}
                                srcSet={makeSRCSET(contentArray[i].srcset, postId)}
                                alt={contentArray[i].altText}
                            />
                            <figcaption className="story__image__caption">
                                {contentArray[i].caption}
                            </figcaption>
                        </figure>
                    )
                    break;
                case 'video':
                    renderedContentArray.push(
                        <section className="story__video" key={i}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={'https://www.youtube.com/embed/' + contentArray[i].youtubeId}
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                frameBorder="0"
                            ></iframe>
                        </section>

                    )
                    break;
            }
        }

        let bodyText = converter.makeHtml(this.props.postData[this.state.currentPost].content[0].value);
        return (
            <div className="story-container">
                <Transition
                    in={this.state.transition}
                    timeout={0}
                >
                    {state => (
                        <article
                            className="story"
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state]
                            }}
                        >
                        {renderedContentArray}
                        </article>
                    )}
                </Transition>
            </div>
        )
    }
}
