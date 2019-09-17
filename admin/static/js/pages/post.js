import React from 'react';
import Error404 from '../404';
import LoadingScreen from '../loading-screen';
import { client } from '../api';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Input } from '../components/inputs/';
import { Form } from '../components/inputs/form';

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
                published: (new Date()).toUTCString(),
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
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.state = {
            edited: false,
        }
    }
    handleChange(e) {
        if (e.target.value !== this.props.post[e.target.name]) {
            this.setState({
                edited: true,
            })
        } else {
            this.setState({
                edited: false,
            })
        }
    }
    saveChanges() {
        client.put('/api/v1/posts/' + this.props.post['_id']['$oid'], {
            title: document.getElementById("post-title").value,
        })
        .then(res => {
            console.log(res);
            this.setState({
                edited: false,
            })
        })
    }
    render() {
        return (
            <section>
                <Input.Text
                    label="Title"
                    name="title"
                    inputId="post-title"
                    defaultValue={this.props.post.title}
                    className="my-2"
                    onChange={this.handleChange}
                />
                {/* <Input.Text
                    label="Description / Subtitle"
                    name="subtitle"
                    defaultValue={this.props.post.subtitle}
                    className="my-2"
                    onChange={this.handleChange}
                /> */}
                {this.state.edited && <button className="Button  Button--green" onClick={this.saveChanges}>Save Changes</button>}
            </section>
        )
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.addContent = this.addContent.bind(this);
        this.getNewChanges = this.getNewChanges.bind(this);
        this.removeEdits = this.removeEdits.bind(this);
        this.saveNewContent = this.saveNewContent.bind(this);

        this.state = {
            newContent: {},
        }
    }
    addContent(e) {
        client.post('/api/v1/content/', {
            type: e.target.value,
            postId: this.props.post['_id']['$oid'],
        })
        .then(res => {
            console.log(res)
            this.props.addContent(res.data);
        })
    }
    saveNewContent() {
        for (var change /* key */ in this.state.newContent) {
            client.put('/api/v1/content/' + change, this.state.newContent[change])
            .then(res => {
                console.log(res);
                let newContentCopy = this.state.newContent;
                delete newContentCopy[change];
                this.setState({
                    newContent: newContentCopy,
                }, _ => {
                    if (Object.entries(this.state.newContent).length === 0) {
                        this.setState({
                            edited: false,
                        })
                    }
                });
            })
        }
    }
    getNewChanges(id, newChanges) {
        let newContentClone = this.state.newContent;
        newContentClone[id] = newChanges;
        this.setState({
            newContent: newContentClone,
            edited: true,
        }, () => {
            console.log("Edits added")
        })
    }
    removeEdits(id, newText) {
        let newContentClone = this.state.newContent;
        delete newContentClone[id]
        this.setState({
            newContent: newContentClone,
            edited: false,
        }, () => {
            console.log("Edits Removed")
        })
    }
    render() {
        var content = this.props.post.content;
        
        var renderedContent = content.map((contentModule, index) => {
            switch(contentModule.type) {
                case "text":
                    return <TextEditor content={contentModule} key={index} formId={"content-" + this.props.post['_id']['$oid']} getNewChanges={this.getNewChanges} removeEdits={this.removeEdits} />
                    break;
                case "image":
                    // return <ImageEditor content={contentModule} key={index} formId={"content-" + this.props.post['_id']['$oid']} getNewChanges={this.getNewChanges} />
                    break;
                case "video":
                    // return <VideoEditor content={contentModule} key={index} formId={"content-" + this.props.post['_id']['$oid']} getNewChanges={this.getNewChanges} />
                    break;
                default:
                    throw new Error("No content module by that name")
                    break;
            }
        })
        return (
            <section>
                <div className="flex  flex-alignCenter">
                    {this.state.edited && <button className="Button  Button--green  mt-2" onClick={this.saveNewContent}>Save</button>}
                    <button className="Button  Button--blue  mt-2">Manage</button>
                </div>
                <Form id={"content-" + this.props.post['_id']['$oid']}>
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
                </Form>
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

//* Content Editors
/*
* Currently trying to develop a method to cycle through all <*Editor edited={true} />s to send data to the API as a FormData js object
*/
class TextEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.propogateEdit = this.propogateEdit.bind(this);

        this.state = {
            edited: false,
        }
    }
    handleChange(e) {
        let newText = e.target.innerText;
        this.setState({
            edited: newText !== this.props.content.value,
        }, () => {
            if (this.state.edited) {
                this.propogateEdit({value: newText});
            } else {
                this.removeEdits({value: newText});
            }
        })
    }
    propogateEdit(newValue) {
        this.props.getNewChanges(this.props.content['_id']['$oid'], newValue)
    }
    removeEdits(newText) {
        this.props.removeEdits(this.props.content['_id']['$oid'], newText)
    }
    render() {
        return (
            <Input.FormattedText
                id={this.props.content['_id']['$oid']}
                value={this.props.content.value}
                className="my-2"
                onChange={this.handleChange}
                formId={this.props.formId}
            />
        )
    }
}
// class ImageEditor extends React.Component {
//     constructor(props) {
//         super(props);

//         this.handleChange = this.handleChange.bind(this);

//         this.state = {
//             edited: false,
//         }
//     }
//     handleChange(e) {

//     }
//     render() {
//         return (
//             <>
//                 <Input.Image
//                     id={this.props.content['_id']['$oid']}
//                     className="my-2"
//                     src={this.props.content.src}
//                     srcset={this.props.content.srcset}
//                     onChange={this.handleChange}
//                     formId={this.props.formId}
//                 />
//                 <Input.Text
//                     id={this.props.content['_id']['$oid']}
//                     placeholder="Caption"
//                     defaultValue={this.props.content.caption}
//                     className="my-2"
//                     onChange={this.handleChange}
//                     formId={this.props.formId}
//                 />
//             </>
//         )
//     }
// }
// class VideoEditor extends React.Component {
//     constructor(props) {
//         super(props);

//         this.handleChange = this.handleChange.bind(this);

//         this.state = {
//             edited: false,
//         }
//     }
//     handleChange(e) {

//     }
//     render() {
//         return (
//             <Input.Text
//                 placeholder="YouTube Id"
//                 id={this.props.content['_id']['$oid']}
//                 defaultValue={this.props.content.youtubeId}
//                 className="my-2"
//                 onChange={this.props.handleChange}
//                 formId={this.props.formId}
//             />
//         )
//     }
// }
