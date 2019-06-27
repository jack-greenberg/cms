import React from 'react';
import { Header } from './header.js';
import { Footer } from './footer.js';
import { Navigation } from './nav.js';
import { TextInput } from './components';
import { Link } from 'react-router-dom';
import { client } from './index.js';
import { pad } from './posts.js';
var $ = require('./jquery.min.js');

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

        this.state = {
            postData: null,
            view: 'general',
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
    changeView(e) {
        this.setState({
            view: e.target.value,
        });
    };
    render() {
        if (this.state.postData) {
            var viewComponent;
            switch(this.state.view) {
                case "general":
                    viewComponent = <General postData={this.state.postData} />
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
                            <Footer />
                        </div>
                </>
            )
        } else {
            return null;
        }
    }
}

class General extends React.Component {
    constructor(props) {
        super(props);
        this.changeStatus = this.changeStatus.bind(this);
    }
    changeStatus(e) {

    }
    render() {
        var buttonText;
        switch(this.props.postData.status) {
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
            <article className="main__general  flex-wrapper">
                <section className="section  main__general__basic">
                    <h2 className="section__heading">{pad(this.props.postData.postID, 4)}</h2>
                    <TextInput important storedValue={this.props.postData['title']} form="post" name="title" label="Title" />
                    <TextInput storedValue={this.props.postData['author']} form="post" title="author" label="Author" />
                    <div className="flex-wrapper  flex-wrapper--between">
                        <button onClick={this.changeStatus} className="btn  btn--text">
                            {buttonText}
                        </button>
                        <a href={"/admin/posts/private/" + this.props.postData.postID + "/"} className="link">Private link</a>
                    </div>
                </section>
                <Tags tags={this.props.postData['tags']} />
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
            // user clicks enter, but nothing is in the field
            return;
        };
        if (e.keyCode == 13) {
            // axios call to add tag
            var tagList = this.state.tags;
            tagList.push(e.target.value);
            this.setState({
                tags: tagList,
            });
            e.target.value = "";
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
            tags: tagList,
        });
        $('.js-add-tag__input').val("");
        $('.js-add-tag__input').focus();
    }
    removeTag(e) {
        var tagList = this.state.tags;
        var tagToRemove = $(e.target).closest('button').attr("value");
        console.log(tagToRemove);
        var newTagList = arrayRemove(tagList, tagToRemove);
        this.setState({
            tags: newTagList,
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
class Content extends React.Component {
    render() {
        return (
            <article className="main__content">
                <h2>Content</h2>
            </article>
        )
    }
}
