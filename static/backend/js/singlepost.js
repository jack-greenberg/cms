import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { TextInput } from './components';
import { Link } from 'react-router-dom';
import { client } from './index.js';
import { pad } from './posts.js';

export class SinglePost extends React.Component {
    /*
        Page for a single post editor
        path: /admin/posts/<postID>/
    */
    constructor(props) {
        super(props);

        this.state = {
            postData: null,
        }
    }
    componentDidMount() {
        client.post('/api/get/post-data/', {
            postID: window.location.href.slice(1,-1).split('/').pop() || window.location.href.slice(1,-1).split('/').pop(),
        })
        .then(response => {
            this.setState({
                postData: response.data,
            });
            console.log(response.data);
        })
    }
    render() {
        if (this.state.postData) {
            var buttonText;
            switch(this.state.postData.status) {
                case "live":
                    buttonText = "Archive";
                    break;
                case "draft":
                    buttonText = "Publish";
                    break;
                case "archived":
                    buttonText = "Unarchive";
                    break;
            }

            return (
                <>
                    <Navigation />
                        <div className="main-wrapper">
                            <Header />
                            <main className="main">
                                <div className="post-link-wrapper">
                                    <Link to="/posts/">Back to posts</Link>
                                </div>
                                <div className="main__menu">
                                    <button className="menu__button">General</button>
                                    <button className="menu__button">Content</button>
                                </div>
                                <article className="main__general">
                                    <section className="main__general__basic">
                                        <h2>{pad(this.state.postData.postID, 4)}</h2>
                                        <TextInput important storedValue={this.state.postData['title']} form="basic" name="title" label="Title" />
                                        <TextInput form="basic" title="author" label="Author" />
                                        <div className="flex-wrapper">
                                            <button>
                                                {buttonText}
                                            </button>
                                            <a href={"/admin/posts/private/" + this.state.postData.postID + "/"}>Private link</a>
                                        </div>
                                    </section>
                                </article>
                            </main>
                            <Footer />
                        </div>
                </>
            )
        } else {
            return null;
        }
    }
}
