import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { client } from './index.js';

export function pad(n, width, z) {
    // Helper function to turn 1 into 0001
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export class Posts extends React.Component {
    /*
        Post List component
        path: /admin/posts/
    */
    constructor(props) {
        super(props);
        this.checkAll = this.checkAll.bind(this);

        this.state = {
            postData: [],
            allChecked: false,
        };
    };
    componentDidMount() {
        // Get the data about the posts (array)
        client.get('/api/v1/posts/')
            .then(function(response) {
                console.log(response);
                this.setState({
                    postData: response.data,
                    isPostDraft: response.data.status == "draft" ? true : false,
                });
            }.bind(this))
            .catch(error => {
                throw new Error(error);
            })
    };
    checkAll() {
        this.setState({
            allChecked: true,
        })
    }
    render() {
        if (this.state.postData) {
            return (
                <>
                    <Navigation />
                        <div className="main-wrapper">
                            <Header draft={this.state.isPostDraft} />
                            <main className="main">
                                <Toolbar checkAll={this.checkAll} />
                                <section className="post-list">
                                    <div className="post-list__head">
                                        <div role="cell">{/* Empty div to align the checkbox */}</div>
                                        <div role="cell">ID</div>
                                        <div role="cell">Title</div>
                                        <div role="cell">Status</div>
                                        <div role="cell">Published</div>
                                        <div role="cell">Last Edited</div>
                                        <div role="cell">Tags</div>
                                        <div role="cell">{/* Empty div to align the details button */}</div>
                                    </div>
                                    <div className="post-list__body">
                                        {this.state.postData.map((postData, index) => {
                                            return (
                                                <Post data={postData} key={index} allChecked={this.state.allChecked} />
                                            )
                                        }).sort((a,b) => {
                                            // sort by id
                                            return b.props.data.postID - a.props.data.postID;
                                        })}
                                    </div>
                                </section>

                            </main>
                            <Footer />
                        </div>
                </>
            );
        } else {
            return null;
        };
    };
};
class Toolbar extends React.Component {
    // Toolbar to edit checked posts and filter
    constructor(props) {
        super(props);

        this.newPost = this.newPost.bind(this);
    }
    newPost() {
        client.post('/api/v1/posts/')
        .then(response => {
            console.log(response);
            window.href = "/admin/posts/" + response.data.postID;
        })
    }
    render() {
        return (
            <div className="toolbar">
                {/*<button className="btn  btn--icon" data-tip data-for="checkAll" onClick={this.props.checkAll}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z"/></svg>
                </button>
                <button className="btn  btn--icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M14 10L10 10 10 13 7 13 12 18 17 13 14 13z" />
                        <path d="M21.8,6.4l-3-4C18.611,2.148,18.314,2,18,2H6C5.686,2,5.389,2.148,5.2,2.4l-3,4l0.014,0.01C2.088,6.577,2,6.774,2,7v12 c0,1.103,0.897,2,2,2h16c1.103,0,2-0.897,2-2V7c0-0.226-0.088-0.423-0.214-0.59L21.8,6.4z M6.5,4h11L19,6H5L6.5,4z M4,19V8h16 l0.002,11H4z"
                        />
                    </svg>
                </button>
                <button className="btn  btn--icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M11 10L9 10 9 13 6 13 6 15 9 15 9 18 11 18 11 15 14 15 14 13 11 13z"/>
                        <path d="M4,22h12c1.103,0,2-0.897,2-2V8c0-1.103-0.897-2-2-2H4C2.897,6,2,6.897,2,8v12C2,21.103,2.897,22,4,22z M4,8h12l0.002,12H4 V8z"/>
                        <path d="M20,2H8v2h12v12h2V4C22,2.897,21.103,2,20,2z"/>
                    </svg>
                </button>
                <div className="filter-wrapper">
                    <label htmlFor="filter" className="filter__label">
                        <svg className="filter__label__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z"/>
                            <path d="M11.412,8.586C11.791,8.966,12,9.468,12,10h2c0-1.065-0.416-2.069-1.174-2.828c-1.514-1.512-4.139-1.512-5.652,0 l1.412,1.416C9.346,7.83,10.656,7.832,11.412,8.586z"/>
                        </svg>
                    </label>
                    <input type="text" className="filter" id="filter" placeholder="Filter"/>
                </div>*/}
                <button className="btn  btn--text" onClick={this.newPost}>
                    New Post
                </button>
            </div>
        )
    }
}
class Post extends React.Component {
    // Individual post listing
    constructor(props) {
        super(props);
        this.checkPost = this.checkPost.bind(this);

        this.state = {
            data: this.props.data,
            checked: this.props.allChecked,
            status: this.props.data.status,
        }
    }
    checkPost() {
        this.setState({
            checked: !this.state.checked,
        })
    }
    render() {
        try {
            var published = this.state.data.published["$date"] ? new Date(this.state.data.published["$date"]).toLocaleDateString() : '-';
            var lastEdited = new Date(this.state.data.lastEdited["$date"]).toLocaleDateString();
        } catch {
            var published = undefined;
        }

        return (
            <div className={!this.state.checked ? "post" : "post  post--checked"}>
                <div className="post__checkbox" role="cell"><input type="checkbox" onClick={this.checkPost} defaultChecked={this.state.checked ? true : false} /></div>
                <div className="post__id" role="cell">
                    {this.state.status == 'draft' ? <span className="draft-prefix">d-</span> : null}{pad(this.state.data.postID, 4)}
                </div>
                <div className="post__title" role="cell">
                    <span className="truncate">
                        <a href={"/admin/posts/" + this.state.data.postID}>{this.state.data.title}</a>
                    </span>
                </div>
                <div className="post__status" role="cell">
                    <span className={"status  status--" + this.state.status}>
                        {this.state.status.charAt(0).toUpperCase() + this.state.status.slice(1)}
                    </span>
                </div>
                <div className="post__published" role="cell">
                    <span>
                        {published}
                    </span>
                </div>
                <div className="post__last-edited" role="cell">
                    <span>
                        {lastEdited}
                    </span>
                </div>
                <div className="post__tags" role="cell">
                    {this.state.data.tags.map((tag, index) => {
                        return (
                            <div className="tag" key={index}>{tag}</div>
                        )
                    })}
                </div>
                <div className="post__details" role="cell">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 10 12 10zM12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 4 12 4zM12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 16 12 16z" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}
