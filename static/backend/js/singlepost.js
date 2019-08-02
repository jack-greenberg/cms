import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Navigation } from './nav';
import { TextInput } from './components';
import { PostTextEditor, PostImageEditor, PostVideoEditor } from './editors';
import { Link } from 'react-router-dom';
import { client } from './index';
import { pad } from './posts';
var $ = require('jquery');

function arrayRemove(arr, value) {
    // Helper function to remove element from array
    return arr.filter(function(ele){
        return ele != value;
    });
}

export class SinglePost extends React.Component {
    /*
        Page for a single post editor
        path: /admin/posts/<postID>/
    */
    constructor(props) {
        super(props);
        this.changeView = this.changeView.bind(this);
        this.delete = this.delete.bind(this);

        this.state = {
            postData: null,
            view: window.location.hash ? window.location.hash.slice(1) : "general",
        }
    }
    componentDidMount() {
        client.get('/api/v1/posts/' + window.location.href.split("/")[5])
        .then(response => {
            this.setState({
                postData: response.data,
            });
            console.log(response);
        })
        .catch(err => {
            console.log(err.config);
        })
    };
    delete() {
        if (window.confirm("Are you sure you want to delete this post?")) {
            client.delete('/api/v1/posts/' + this.state.postData['_id']['$oid'])
            .then(response => {
                console.log(response);
                window.location.href = '/admin/posts/';
            })
        }
    }
    changeView(e) {
        this.setState({
            view: e.target.value,
        });
        window.location.hash = e.target.value;
    };
    render() {
        if (this.state.postData) {
            var viewComponent;
            switch(this.state.view) {
                case "general":
                    viewComponent = <General postData={this.state.postData} delete={this.delete} />
                    break;
                case "content":
                    viewComponent = <Content postData={this.state.postData} />
                    break;
            }

            return (
                <>
                    <Navigation />
                        <div className="main-wrapper">
                            <Header />
                            <main className="main  main--single-post">
                                <div className="post-link-wrapper">
                                    <Link to="/posts/">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z" />
                                        </svg>
                                        Back to posts
                                    </Link>
                                </div>
                                <div className="main__menu">
                                    <button className={this.state.view == 'general' ? "menu__button  menu__button--active" : "menu__button"} value="general" onClick={this.changeView}>General</button>
                                    <button className={this.state.view == 'content' ? "menu__button  menu__button--active" : "menu__button"} value="content" onClick={this.changeView}>Content</button>
                                </div>
                                {viewComponent}
                            </main>
                            <aside>
                                {/*<Actions />*/}
                                <Tags tags={this.state.postData.tags} postId={this.state.postData['_id']['$oid']} />
                            </aside>
                            <Footer />
                        </div>
                </>
            )
        } else {
            return null;
        }
    }
}

class PostEditor extends React.Component {
    constructor(props) {
        super(props);

        this.toggleAddOptions = this.toggleAddOptions.bind(this);
        this.addModule = this.addModule.bind(this);

        this.postId = this.props.postData['_id']['$oid'];
        this.state = {
            postData: this.props.postData,
            showAddOptions: false,
        }
    }
    toggleAddOptions() {
        this.setState({
            showAddOptions: !this.state.showAddOptions,
        })
    }
    addModule(e) {
        client.post('/api/v1/content/', {
            type: e.target.value,
            postId: this.postId,
        })
        .then(res => {
            console.log(res);
            var newPostData = this.state.postData;
            var newContent = this.state.postData.content;
            newContent.push(res.data);
            newPostData.content = newContent;

            this.setState({
                postData: newPostData,
                showAddOptions: false,
            })
        })
    }
    render() {
        var contentModules = this.state.postData.content.map((item, index) => {
            switch(item.type) {
                case 'text':
                    return <p key={index}>Text</p>;
                    break;
                case 'image':
                    return <p key={index}>Image</p>;
                    break;
                case 'video':
                    return <p key={index}>Video</p>
                    break;
                default:
                    console.error("Invalid content type: " + item.type);
                    break;
            }
        })

        return (
            <article>
                <TextInput
                    title
                    endpoint="post"
                    name="title"
                    pk={this.postId}
                    storedValue={this.state.postData.title}
                    label="Your Title"
                    placeholder="Your Title"
                />
                {contentModules}
                <div className="add-options">
                    <button className="btn  btn--icon  add-options__trigger" onClick={this.toggleAddOptions}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </button>
                    {this.state.showAddOptions && (
                        <div className="add-options__options">
                            <button onClick={this.addModule} value="text">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Text
                            </button>
                            <button onClick={this.addModule} value="image">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                Image
                            </button>
                            <button onClick={this.addModule} value="video">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                Video
                            </button>
                        </div>
                    )}
                </div>
            </article>
        )
    }
}

class Tags extends React.Component {
    constructor(props) {
        super(props);

        this.handleTagKeyUp = this.handleTagKeyUp.bind(this);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);

        this.state = {
            tags: this.props.tags,
        }
    }
    handleTagKeyUp(e) {
        if (e.keyCode == 13 && e.target.value == "") {
            // user presses enter, but nothing is in the field
            return;
        };
        if (e.keyCode == 13) {
            this.addTag();
        } else {
            return;
        }
    }
    addTag(e) {
        if ($('.js-add-tag__input').val() == "") {
            return;
        }
        var tagList = this.state.tags;
        tagList.push($('.js-add-tag__input').val());
        this.setState({
            tags: tagList.filter((v, i, a) => a.indexOf(v) === i),
        }, function() {
            client.put('/api/v1/posts/' + this.props.postId, {
                tags: this.state.tags,
            })
            .then(response => {
                console.log(response);
            })
        });
        $('.js-add-tag__input').val("");
        $('.js-add-tag__input').focus();
    }
    removeTag(e) {
        var tagList = this.state.tags;
        var tagToRemove = $(e.target).closest('button').attr("value");
        var newTagList = arrayRemove(tagList, tagToRemove);
        this.setState({
            tags: newTagList,
        }, function() {
            client.put('/api/v1/posts/' + this.props.postId, {
                tags: this.state.tags,
            })
            .then(response => {
                console.log(response);
            })
        })
    }
    render() {
        return (
            <section className="section  main__general__tags">
                <h2 className="section__heading">Tags</h2>
                <div className="tag-list  flex-wrapper">
                    {this.state.tags.map((tag, index) => {
                        return (
                            <div className="tag" key={index}>
                                <button onClick={this.removeTag} value={tag}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M9.172 16.242L12 13.414 14.828 16.242 16.242 14.828 13.414 12 16.242 9.172 14.828 7.758 12 10.586 9.172 7.758 7.758 9.172 10.586 12 7.758 14.828z" />
                                        <path d="M12,22c5.514,0,10-4.486,10-10S17.514,2,12,2S2,6.486,2,12S6.486,22,12,22z M12,4c4.411,0,8,3.589,8,8s-3.589,8-8,8 s-8-3.589-8-8S7.589,4,12,4z" />
                                    </svg>
                                </button>
                                {tag}
                            </div>
                        )
                    })}
                </div>
                <div className="add-tag">
                    <input className="add-tag__input  js-add-tag__input" type="text" placeholder="Add a new tag..." onKeyUp={this.handleTagKeyUp}/>
                    <button className="add-tag__button" onClick={this.addTag}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M13 7L11 7 11 11 7 11 7 13 11 13 11 17 13 17 13 13 17 13 17 11 13 11z"/>
                            <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8 s3.589-8,8-8s8,3.589,8,8S16.411,20,12,20z"/>
                        </svg>
                    </button>
                </div>
            </section>
        )
    }
}

// class General extends React.Component {
//     constructor(props) {
//         super(props);
//         this.changeStatus = this.changeStatus.bind(this);
//
//         this.state = {
//             status: this.props.postData.status,
//             status: this.props.postData.status,
//         }
//     }
//     changeStatus(e) {
//         if (this.state.status == 'draft') {
//             if (!window.confirm("Are you sure you want to publish this draft?")) {
//                 return;
//             }
//             client.put('/api/v1/posts/' + this.props.postData['_id']['$oid'], {
//                 status: 'live',
//                 published: (new Date()).toUTCString(),
//             })
//             .then(response => {
//                 console.log(response);
//             })
//             this.setState({
//                 status: 'live',
//             })
//         } else if (this.state.status == 'live') {
//             if (!window.confirm("Are you sure you want to archive this post?")) {
//                 return;
//             }
//             this.setState({
//                 status: 'archived',
//             }, () => {
//                 client.put('/api/v1/posts/' + this.props.postData['_id']['$oid'], {
//                     status: this.state.status,
//                 })
//                 .then(response => {
//                     console.log(response);
//                 })
//             })
//         } else if (this.state.status == 'archived') {
//             if (!window.confirm("Are you sure you want to unarchive this post?")) {
//                 return;
//             }
//             this.setState({
//                 status: 'live',
//             }, () => {
//                 client.put('/api/v1/posts/' + this.props.postData['_id']['$oid'], {
//                     status: this.state.status,
//                 })
//                 .then(response => {
//                     console.log(response);
//                 })
//             })
//         }
//     }
//     render() {
//         var buttonText;
//         switch(this.state.status) {
//             case "live":
//                 buttonText = "Archive";
//                 break;
//             case "draft":
//                 buttonText = "Publish";
//                 break;
//             case "archived":
//                 buttonText = "Unarchive";
//                 break;
//         }
//         return (
//             <article className="main__general  flex-wrapper">
//                 <section className="section  main__general__basic">
//                     <TextInput important storedValue={this.props.postData['title']} endpoint="posts" pk={this.props.postData['_id']['$oid']} name="title" label="Title" />
//                     <TextInput storedValue={this.props.postData.author} endpoint="posts" pk={this.props.postData['_id']['$oid']} name="author" label="Author" />
//                     <div className="flex-wrapper  flex-wrapper--between">
//                         <button onClick={this.changeStatus} className="btn  btn--text">
//                             {buttonText}
//                         </button>
//                         <a href={"/admin/posts/private/" + this.props.postData['_id']['$oid'] + "/"} className="link">Private link</a>
//                         <button onClick={this.props.delete} className="btn  btn--text">
//                             Delete Post
//                         </button>
//                     </div>
//                 </section>
//                 <Tags tags={this.props.postData['tags']} postId={this.props.postData['_id']['$oid']} />
//             </article>
//         )
//     }
// }
// class Content extends React.Component {
//     constructor(props) {
//         super(props);
//
//         this.addSection = this.addSection.bind(this);
//         this.deleteContent = this.deleteContent.bind(this);
//
//         this.state = {
//             contentArray: this.props.postData['content'], // array
//         }
//     }
//     addSection(type) {
//         console.log(type, this.props.postData['_id']['$oid'])
//         client.post('/api/v1/content/', {
//             type: type,
//             postId: this.props.postData['_id']['$oid'],
//         })
//         .then(response => {
//             console.log(response);
//
//             var contentCopy = this.state.contentArray;
//             contentCopy.push(response.data);
//
//             this.setState({
//                 contentArray: contentCopy,
//             })
//         })
//     }
//     deleteContent(contentId) {
//         client.delete('/api/v1/content/' + contentId)
//         .then(response => {
//             console.log(response)
//             let index = this.state.contentArray.findIndex(obj => obj['_id']['$oid'] === contentId);
//             let newContentArray = [
//                 ...this.state.contentArray.slice(0, index),
//                 ...this.state.contentArray.slice(index + 1)
//             ]
//             this.setState({
//                 contentArray: newContentArray,
//             })
//         })
//     }
//     render() {
//         let contentEditor = [];
//
//         for (let i = 0;i < this.state.contentArray.length; i++) {
//             let type = this.state.contentArray[i]['type'];
//             let contentId = this.state.contentArray[i]['_id']['$oid'];
//             let postId = this.props.postData['_id']['$oid']
//
//             switch(type) {
//                 case 'text':
//                     contentEditor.push(
//                         <PostTextEditor
//                             key={i}
//                             contentId={contentId}
//                             content={this.state.contentArray[i].value}
//                             postId={postId}
//                             deleteContent={this.deleteContent}
//                         />
//                     );
//                     break;
//                 case 'image':
//                     contentEditor.push(
//                         <PostImageEditor
//                             key={i}
//                             contentId={contentId}
//                             src={this.state.contentArray[i].src}
//                             srcset={this.state.contentArray[i].srcset}
//                             caption={this.state.contentArray[i].caption}
//                             altText={this.state.contentArray[i].altText}
//                             imageId={this.state.contentArray[i].imageId}
//                             postId={postId}
//                             deleteContent={this.deleteContent}
//                         />
//                     )
//                     break;
//                 case 'video':
//                     contentEditor.push(
//                         <PostVideoEditor
//                             key={i}
//                             contentId={contentId}
//                             youtubeId={this.state.contentArray[i].youtubeId}
//                             postId={postId}
//                             deleteContent={this.deleteContent}
//                         />
//                     )
//                     break;
//                 default:
//                     contentEditor.push(<h1>ERROR: NO MODULE</h1>)
//                     break;
//             }
//         }
//
//         return (
//             <article className="main__content">
//                 { contentEditor }
//                 <PostSectionAdder addSection={this.addSection}/>
//             </article>
//         )
//     }
// }
// class PostSectionAdder extends React.Component {
//     constructor(props) {
//         super(props);
//
//         this.addText = this.addText.bind(this);
//         this.addImage = this.addImage.bind(this);
//         this.addVideo = this.addVideo.bind(this);
//     }
//     addText() {
//         this.props.addSection("text");
//     }
//     addImage() {
//         this.props.addSection("image");
//     }
//     addVideo() {
//         this.props.addSection("video");
//     }
//     render() {
//         return (
//             <div className="post-section-adder">
//                 <button className="btn btn--text" onClick={this.addText}>Text (Markdown)</button>
//                 <button className="btn btn--text" onClick={this.addImage}>Image</button>
//                 <button className="btn btn--text" onClick={this.addVideo}>Video</button>
//             </div>
//         )
//     }
// }
