import React from 'react';
import { client } from '../api';
import LoadingScreen from '../loading-screen';

import { Link } from 'react-router-dom';

import { Header } from '../components/header';
import { Footer } from '../components/footer';

export class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
        }
    }
    componentDidMount() {
        client.get('/api/v1/posts/')
        .then(res => {
            console.log(res)
            this.setState({
                posts: res.data,
                ready: true,
            })
        })
    }
    render() {
        if (!this.state.ready) {
            return <LoadingScreen />;
        };

        var renderedPostList = this.state.posts.map((post, index) => {
            return (
                <div className="Post  mb-2" key={index}>
                    <h2 className="f-2  mr-1  inline"><Link to={"/posts/" + post['_id']['$oid']} className="link  dim  blue">{post.title}</Link></h2>
                    <span className={"Label  f-1  " + (post.status == 'live' ? "Label--green" : "")}>{post.status}</span>
                </div>
            )
        })

        return (
            <>
                <Header />
                <main className="p-1">
                    <h1 className="h3  mb-1">Posts</h1>
                    <div className="PostList">
                        {renderedPostList}
                    </div>
                </main>
                <Footer />
            </>
        )
    }
}
