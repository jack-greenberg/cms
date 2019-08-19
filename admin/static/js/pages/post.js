import React from 'react';
import Error404 from '../404';
import LoadingScreen from '../loading-screen';
import { client } from '../api';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Input } from '../components/inputs/';

import * as Icon from 'react-feather';
import { makeDate } from '../helpers';

function id(oid) {
    return oid['$oid'];
}

export class Post extends React.Component {
    constructor(props) {
        super(props)
        this.postId = this.props.match.params.post
        this.changeTab = this.changeTab.bind(this)
        this.publishPost = this.publishPost.bind(this)
        this.addContent = this.addContent.bind(this)

        this.state = {
            data: undefined,
            ready: false,
            404: false,
            viewComponent: "overview",
        }
    }
    componentDidMount() {
        client.get('/api/v1/posts/' + this.postId)
        .then(res => {
            console.log(res)
            this.setState({
                data: res.data,
                ready: true,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                404: true,
                ready: true,
            })
        })
    }
    changeTab(e) {
        this.setState({
            viewComponent: e.target.value,
        });
    }
    publishPost() {
        if (window.confirm("Are you sure you want to publish this post?\n\nIt will be available to the public.")) {
            client.put('/api/v1/posts/' + this.postId, {
                status: 'live',
            })
            .then(res => {
                console.log(res.data)
                location.reload();
            })
        }
    }
    addContent(newObject) {
        console.log(newObject);
        var oldData = this.state.data;
        oldData.content.push(newObject)
        console.log(oldData.content)
        this.setState({
            data: oldData,
        })
    }
    render() {
        var post = this.state.data;

        if (!this.state.ready) {
            return <LoadingScreen />;
        }
        if (this.state[404]) {
            return <Error404 />;
        };

        var viewComponent;
        switch (this.state.viewComponent) {
            case "overview":
                viewComponent = <Overview post={post} />
                break;
            case "content":
                viewComponent = <Content post={post} addContent={this.addContent} />
                break;
            case "tags":
                viewComponent = <Tags post={post} />
                break;
            case "dangerzone":
                viewComponent = <DangerZone post={post} />
                break;
        };

        if (post['published'] === null) {
            post['published'] = false;
        }

        return (
            <>
                <Header />
                <main className="Main  p-1">                 
                    <div>
                        <h1 className="h3  blue  inline  mr-1">{post.title}</h1>
                        <span className={"Label  f-2  " + (post.status == 'live' ? "Label--green" : "")}>{post.status}</span>
                    </div>
                    <details className="Details  f-1  mt-1  mb-2">
                        <summary className="Details__summary">
                            <span tabIndex="0" className="Details__summary__label">Details</span>
                            <a href={"/admin/posts/" + this.postId + "/preview/"} style={{fontWeight: 400}} className="ml-2  blue  link  underline  dim" tabIndex="0">Preview</a>
                            {post.status !== 'live' ? <button className="Button  Button--green  f-1  bold  ml-2  dim" style={{float: 'right'}} onClick={this.publishPost} tabIndex="0">Publish...</button> : null}
                        </summary>
                        <div className="Details__content">
                            Last Edited: <strong>{makeDate(post.lastEdited['$date'])}</strong><br />
                            Published: <strong>{makeDate(post.published['$date'])}</strong><br />
                        </div>
                    </details>
                    <nav className="Tabs">
                        <ul className="Tabs__tab-container">
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "overview" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-overview" className="Tabs__tab__button" tabIndex="0">
                                    <Icon.Settings className="Icon  mr-1" /> Overview
                                    <input type="radio" name="tab" id="tab-overview" onClick={this.changeTab} value="overview" defaultChecked={this.state.viewComponent === "overview"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "content" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-content" className="Tabs__tab__button" tabIndex="0">
                                    <Icon.FileText className="Icon  mr-1" /> Content
                                    <input type="radio" name="tab" id="tab-content" onClick={this.changeTab} value="content" defaultChecked={this.state.viewComponent === "content"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2  mr-3" + (this.state.viewComponent === "tags" ? "  Tabs__tab--active" : "")}>
                                <label htmlFor="tab-tags" className="Tabs__tab__button" tabIndex="0">
                                    <Icon.Tag className="Icon  mr-1" /> Tags
                                    <input type="radio" name="tab" id="tab-tags" onClick={this.changeTab} value="tags" defaultChecked={this.state.viewComponent === "tags"}/>
                                </label>
                            </li>
                            <li className={"Tabs__tab  f-2" + (this.state.viewComponent === "dangerzone" ? "  Tabs__tab--danger--active" : "")} style={{marginRight: '10vw'}}>
                                <label htmlFor="tab-dangerzone" className="Tabs__tab__button  Tabs__tab__button--danger" tabIndex="0">
                                    <Icon.AlertTriangle className="Icon  mr-1" /> Danger Zone
                                    <input type="radio" name="tab" id="tab-dangerzone" onClick={this.changeTab} value="dangerzone" defaultChecked={this.state.viewComponent === "dangerzone"}/>
                                </label>
                            </li>
                        </ul>
                    </nav>
                    {viewComponent}
                </main>
                <Footer />
            </>
        )
    }
}

class Overview extends React.Component {
    render() {
        return (
            <section>
                <Input.Text label="Title" defaultValue={this.props.post.title} className="my-2" />
                <Input.Text label="Description / Subtitle" defaultValue={this.props.post.subtitle} className="my-2" />
            </section>
        )
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.addContent = this.addContent.bind(this)
    }
    addContent(e) {
        console.log(e.target.value);
        client.post('/api/v1/content/', {
            type: e.target.value,
            postId: this.props.post['_id']['$oid'],
        })
        .then(res => {
            console.log(res)
            this.props.addContent(res.data);
        })
    }
    render() {
        var content = this.props.post.content;
        
        var renderedContent = content.map((contentModule, index) => {
            switch(contentModule.type) {
                case "text":
                    return (
                        <Input.FormattedText
                            key={index}
                            id={id(contentModule['_id'])}
                            value={contentModule.value}
                            className="my-2"
                        />
                    )
                    break;
                case "image":
                    console.log(contentModule)
                    return (
                        <React.Fragment key={index}>
                            <Input.Image
                                id={id(contentModule['_id'])}
                                className="my-2"
                            />
                            <Input.Text placeholder="Caption" />
                        </React.Fragment>
                    )
                    break;
                case "video":
                    return <Input.Text label="YouTube Id" key={index} id={id(contentModule['_id'])} />
                    break;
                default:
                    throw new Error("No content module by that name")
                    break;
            }
        })
        return (
            <section>
                {renderedContent}
                <details className="Details  flex  flex-alignCenter  flex-justifyBetween  my-2">
                    <summary className="Details__summary  Details__summary--nomarker  mb-1  flex  flex-alignCenter" style={{pointerEvents: 'none', cursor: 'default'}}>
                        <div className="Button  Button--green  inline  f-1  dim  mr-2" style={{pointerEvents: 'auto', cursor: 'pointer'}}>Add content</div>
                        <p className="blue  link  bold  underline  Details__summary--openonly  f-1" role="button" style={{pointerEvents: 'auto', cursor: 'pointer'}}>Cancel</p>
                    </summary>
                    <p className="f-1  ml-1">
                        <button className="link  blue  dim  mr-2" onClick={this.addContent} value="text">Text</button>
                        <button className="link  blue  dim  mr-2" onClick={this.addContent} value="image">Image</button>
                        <button className="link  blue  dim" onClick={this.addContent} value="video">Video</button>
                    </p>
                </details>
            </section>
        )
    }
}

class Tags extends React.Component {
    render() {
        return <h2>Tags</h2>
    }
}

class DangerZone extends React.Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this)
        this.archivePost = this.archivePost.bind(this)
    }
    deletePost(e) {
        if (document.getElementById('deletePost').open) {
            e.stopPropagation();
            e.preventDefault();
            if (window.confirm("Are you sure you want to delete this post?")) {
                client.delete('/api/v1/posts/' + this.props.post['_id']['$oid'])
                .then(res => {
                    console.log(res.data)
                    window.location.href = '/admin/posts/';
                })
            }
        }
    }
    archivePost(e) {
        if (document.getElementById('archivePost').open) {
            e.stopPropagation();
            e.preventDefault();
            client.put('/api/v1/posts/' + this.props.post['_id']['$oid'], {
                status: 'archived'
            })
            .then(res => {
                console.log(res.data)
                location.reload();
            })
        }
    }
    render() {
        return (
            <section className="my-2">
                <details className="Details  flex  flex-alignCenter  flex-justifyBetween  my-2" id="deletePost">
                    <summary className="Details__summary  Details__summary--nomarker  mb-1  flex  flex-alignCenter" style={{pointerEvents: 'none', cursor: 'default'}}>
                        <div className="Button  Button--red  inline  f-1  dim  mr-2" onClick={this.deletePost} style={{pointerEvents: 'auto', cursor: 'pointer'}}>Delete post...</div>
                        <p className="blue  link  bold  underline  Details__summary--openonly  f-1" role="button" style={{pointerEvents: 'auto', cursor: 'pointer'}}>Cancel</p>
                    </summary>
                    <p className="f-1  ml-1">
                        This will permenantly delete your post!<br />
                        <span className="bold">THIS CANNOT BE UNDONE</span><br />
                        <span className="red">Click the button again to delete the post.</span><br />
                    </p>
                </details>
                {this.props.post.status === 'live'
                ? (<details className="Details  flex  flex-alignCenter  flex-justifyBetween  my-2" id="archivePost">
                        <summary className="Details__summary  Details__summary--nomarker  mb-1  flex  flex-alignCenter" style={{pointerEvents: 'none', cursor: 'default'}}>
                            <div className="Button  Button--red  inline  f-1  dim  mr-2" onClick={this.archivePost} style={{pointerEvents: 'auto', cursor: 'pointer'}}>Archive post...</div>
                            <p className="blue  link  bold  underline  Details__summary--openonly  f-1" role="button" style={{pointerEvents: 'auto', cursor: 'pointer'}}>Cancel</p>
                        </summary>
                        <p className="f-1  ml-1">
                            You will still be able to see and edit your post, but it won't be available to the public.<br />
                            <span className="red">Click the button again to archive the post.</span><br />
                        </p>
                    </details>
                )
                : null}
            </section>
        )
    }
}
