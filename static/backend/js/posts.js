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

        this.state = {
            postData: [],
        };
    };
    componentDidMount() {
        // Get the data about the posts (array)
        client.get('/api/v1/posts/')
        .then(response => {
            console.log(response);
            this.setState({
                postData: response.data,
            });
        })
    };
    render() {
        if (this.state.postData) {
            return (
                <>
                    <Navigation />
                        <div className="main-wrapper">
                            <Header />
                            <main className="main">
                                <section className="post-list">
                                    <div className="post-list__head">
                                        <div role="cell">{/* Empty div to align the checkbox */}</div>
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
                                                <Post
                                                    data={postData}
                                                    key={index}
                                                />
                                            )
                                        }).sort((a,b) => {
                                            // sort by id
                                            return b.props.data['_id']['$oid'] - a.props.data['_id']['$oid'];
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
        var lastEdited = new Date(this.state.data.lastEdited["$date"]).toLocaleDateString();
        try {
            var published = new Date(this.state.data.published["$date"]).toLocaleDateString();
        } catch {
            var published = '-';
        };
        return (
            <div className={!this.state.checked ? "post" : "post  post--checked"}>
                <div className="post__checkbox" role="cell">
                    <input
                        type="checkbox"
                        onClick={this.checkPost}
                        defaultChecked={this.state.checked} />
                </div>
                <div className="post__title" role="cell">
                    <span className="truncate">
                        <a href={"/admin/posts/" + this.state.data['_id']['$oid']}>{this.state.data.title}</a>
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
