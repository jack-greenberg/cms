import React from 'react';
import { client } from '../api';
import LoadingScreen from '../loading-screen';

import { Link } from 'react-router-dom';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Button } from '../components/button';
import { makeDate } from '../helpers';

export class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.newPost = this.newPost.bind(this)

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
    newPost(e) {
        client.post('/api/v1/posts/')
        .then(res => {
            console.log(res)
            window.location.href = "/admin/posts/" + res.data['_id']['$oid'] + "/"
        })
    }
    render() {
        if (!this.state.ready) {
            return <LoadingScreen />;
        };

        var renderedPostList = this.state.posts.map((post, index) => {
            return (
                <div className="Post  mb-2" key={index} lastedited={post.lastEdited['$date']}>
                    <h2 className="f-2  mr-1  inline"><Link to={"/posts/" + post['_id']['$oid']} className="link  dim  blue">{post.title}</Link></h2>
                    <span className={"Label  f-1  " + (post.status == 'live' ? "Label--green" : "")}>{post.status}</span>
                    <p className="f-1">Last Edited: {makeDate(post['lastEdited']['$date'])}</p>
                </div>
            )
        }).sort((a,b) => {
            return a.props.lastedited < b.props.lastedited;
        })

        return (
            <>
                <Header />
                <main className="Main  p-1">
                    <div className="flex  flex-alignCenter  mb-2">
                        <h1 className="h3  mr-2">Posts</h1>
                        <button className="Button  Button--green  f-1  dim" onClick={this.newPost}>New Draft</button>
                    </div>
                    <div className="PostList">
                        {renderedPostList}
                    </div>
                </main>
                <Footer />
            </>
        )
    }
}
