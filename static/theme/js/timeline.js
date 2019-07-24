import React from 'react';
import { PostContext } from './index';
import Swipe from 'swipejs';

export class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);

        this.state = {
            currentPost: this.props.currentPost,
        }
    }
    componentDidMount() {
        window.mySwipe = new Swipe(document.getElementById('slider'), {
            continuous: true,
            disableScroll: true,
            callback: (index, elem, dir) => {
                this.props.updatePostIndex(-1 * dir);
            }
        });
    }
    next() {
        window.mySwipe.next();
    }
    prev() {
        window.mySwipe.prev();
    }
    render() {
        var cards = this.props.postData.map((post, index) => {
            if (index == this.props.currentPost) {
                return (
                    <div key={index} data-current={true}>
                        <div className="card">
                            <button className="swipe-prev" onClick={this.prev}></button>
                            <h2>{post.title}</h2>
                            <button className="swipe-next" onClick={this.next}></button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="card" key={index} data-current={false}>
                        <div className="inner-card">
                            <button className="swipe-prev" onClick={this.prev}></button>
                            <p>{post.title}</p>
                            <button className="swipe-next" onClick={this.next}></button>
                        </div>
                    </div>
                )
            }
        })

        return (
            <div className="timeline">
                <div id="slider" className="swipe">
                    <div className="swipe-wrap">
                        {cards}
                    </div>
                </div>
                {/*<h2 className="text">{this.props.postData[this.state.currentPost].title}</h2>*/}
                {/*<p className="text">{this.props.postData[(this.state.currentPost + 1) % this.props.postData.length].title}</p>*/}
            </div>
        )
    }
}
