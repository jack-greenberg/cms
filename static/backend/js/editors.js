import React from 'react';
var autosize = require('autosize');
import { client } from './index';
var $ = require('jquery');
import showdown from 'showdown';
import {useDropzone} from 'react-dropzone';


/* * * * * * * * * * *
POST EDITOR STUFF HERE
* * * * * * * * * * */
var converter = new showdown.Converter({
    simpleLineBreaks: false,
    emoji: true,
    openLinksInNewWindow: true,
    strikethrough: true,
    headerLevelStart: 2,
    noHeaderId: true,
});
converter.setFlavor('github');

export class PostTextEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
        this.preview = this.preview.bind(this);
        this.save = this.save.bind(this);

        this.inputId = "post-" + this.props.postId + '--' + this.props.contentId;
        this.inputRef = React.createRef();

        this.state = {
            content: this.props.content,
            tempContent: this.props.content,
            preview: false,
        }
    }
    componentDidMount() {
        this.inputRef.current.innerText = this.state.content;
        autosize($('#' + this.inputId));
    }
    handleInput(e) {
        this.setState({
            tempContent: e.target.innerText,
        }, () => {
            if (this.state.content != this.state.tempContent) {
                this.setState({
                    edited: true,
                })
            } else {
                this.setState({
                    edited: false,
                })
            }
        });
    }

    save() {
        client.get('/api/v1/posts/' + this.props.postId)
        .then(response => {
            let postContent = response.data.content;

            let toUpdate = postContent.filter(obj => {
                return obj.hash === this.props.hash;
            })[0] // {content: ..., hash: ...}

            let index = postContent.indexOf(toUpdate);

            toUpdate.content = this.state.tempContent;

            postContent[index] = toUpdate;

            client.put('/api/v1/posts/' + this.props.postId, {
                content: postContent,
            })
            .then(response => {
                console.log(response);
                this.setState({
                    content: this.state.tempContent,
                    edited: false,
                })
            })
        })
    }
    preview(e) {
        if (e.target.value == "preview") {
            this.setState({
                preview: true,
            }, () => {
                this.inputRef.current.innerHTML = converter.makeHtml(this.inputRef.current.innerText);
            })
        } else {
            this.setState({
                preview: false,
            }, () => {
                this.inputRef.current.innerText = this.state.tempContent;
            })
        };
    }
    render() {
        return (
            <section className={"section  section--full-width"}>
                <div className="toolbar">
                    <div className="toolbar__left">

                    </div>
                    <div className="toolbar__right">
                        <div className="toggle--text">
                            <input
                                type="radio"
                                name={"toggle--text--" + this.inputId}
                                id={"toggle--" + this.inputId + "--markdown"}
                                defaultChecked={true}
                                value="markdown"
                                onClick={this.preview}
                            />
                            <label htmlFor={"toggle--" + this.inputId + "--markdown"}>
                                Markdown
                            </label>

                            <input
                                type="radio"
                                name={"toggle--text--" + this.inputId}
                                id={"toggle--" + this.inputId + "--preview"}
                                value="preview"
                                onClick={this.preview}
                            />
                            <label htmlFor={"toggle--" + this.inputId + "--preview"}>
                                Preview
                            </label>
                        </div>
                    </div>
                </div>
                <div className={"input-container" + (this.state.edited ? "  input-container--edited" : "")}>
                    <label htmlFor={this.inputId} className="input__label">{this.props.label}</label>

                    <div
                        contentEditable={!this.state.preview}
                        className={"input--text  input--text--markdown  markdown-body" + (this.state.preview ? "  preview" : "")}
                        id={this.inputId}
                        defaultValue={this.state.content}
                        onInput={this.handleInput}
                        ref={this.inputRef}
                    ></div>
                </div>
                <div className="toolbar  toolbar--bottom">
                    <button onClick={this.save}>Save</button>
                    <button>Revert</button>
                    <button>Hide</button>
                </div>
            </section>
        )
    }
};

function Dropzone(props) {
    // Taken from https://react-dropzone.js.org
    const {acceptedFiles, rejectedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png, image/jpg',
        multiple: false,
        noDrag: false,
        onDrop: acceptedFiles => {
            props.handleFileChange(acceptedFiles);
        }
    });
    // const files = acceptedFiles.map(file => (
    //     <li key={file.path}>
    //         {file.path} - {file.size} bytes
    //     </li>
    // ));

    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} id={"file-" + props.contentId} />
            <p>Drag the image here, or click to select from files<br/>
            (Must be JPEG or PNG)</p>
        </div>
  );
}
export class PostImageEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleCaptionChange = this.handleCaptionChange.bind(this);
        this.handleAltTextChange = this.handleAltTextChange.bind(this);
        this.save = this.save.bind(this);

        this.state = {
            src: this.props.content.src,
            srcset: this.props.content.srcset,
            caption: this.props.content.caption,
            altText: this.props.content.altText,
            imageId: this.props.content.imageId,


            // altText: this.props.altText,
            tempAltText: this.props.altText,
            altTextEdited: false,

            // caption: this.props.caption,
            tempCaption: this.props.caption,
            captionEdited: false,

            // content: this.props.content,
            imageEdited: false,
            tempFile: undefined,
        }
    }
    save() {
        if (!(this.state.altTextEdited || this.state.captionEdited || this.state.imageEdited)) {
            console.log('Nothing edited');
            return;
        };

        client.get('/api/v1/posts/' + this.props.postId)
        .then(getResponse => {
            let postContent = getResponse.data.content;

            if (this.state.imageEdited) {
                let formData = new FormData();

                let imageID = (Math.random()*0xFFFFFF<<0).toString(16)

                formData.append('image', this.state.tempFile[0])
                formData.append('imageID', imageID)
                formData.append('hash', this.props.hash)
                formData.append('postID', this.props.postID)

                client.post('/api/v1/posts/', formData, {
                    'Content-Type': 'multipart/form-data', // required by Flask
                })
                .then(postResponse => {
                    console.log(postResponse);

                    this.setState({
                        imageEdited: false,
                        content: postResponse.data,
                    }, () => {
                        let toUpdate = postContent.filter(obj => {
                            return obj.hash === this.props.hash;
                        })[0] // {content: ..., hash: ...}

                        let index = postContent.indexOf(toUpdate);

                        toUpdate['alt-text'] = this.state.tempAltText;
                        toUpdate['caption'] = this.state.tempCaption;
                        toUpdate['imageId'] = imageID;
                        toUpdate.content = this.state.content;

                        postContent[index] = toUpdate;

                        client.put('/api/v1/posts/' + this.props.postID, {
                            content: postContent,
                        })
                        .then(response => {
                            console.log(response);
                        })
                    });
                });
            } else /* If the image wasn't edited, just something else */ {
                let toUpdate = postContent.filter(obj => {
                    return obj.hash === this.props.hash;
                })[0] // {content: ..., hash: ...}

                let index = postContent.indexOf(toUpdate);

                toUpdate['alt-text'] = this.state.tempAltText;
                toUpdate['caption'] = this.state.tempCaption;

                postContent[index] = toUpdate;

                client.put('/api/v1/posts/' + this.props.postID, {
                    content: postContent,
                })
                .then(response => {
                    console.log(response);
                })
            };
        });
    }
    handleTextChange(e) {
        if (this.state[e.target.name.split('-').pop()] !== e.target.value) {
            var temp = this.state.temp;
            temp[e.target.name.split('-').pop()] = e.target.value;
            this.setState({
                temp,
                edited: true,
            })
        } else {
            this.setState({
                edited: false,
            })
        }
    }
    handleCaptionChange(e) {
        this.setState({
            tempCaption: e.target.value,
            captionEdited: (this.state.caption !== e.target.value) ? true : false,
        })
    }
    handleAltTextChange(e) {
        this.setState({
            tempAltText: e.target.value,
            altTextEdited: (this.state.altText !== e.target.value) ? true : false,
        })
    }
    handleFileChange(file) {
        var reader = new FileReader();

        reader.addEventListener("load", (event) => {
            $("#image-" + this.props.contentId).attr("src", event.target.result);
            $("#image-" + this.props.contentId).css('display', 'block');
        }, false)

        reader.readAsDataURL(new Blob(file));
        this.setState({
            imageEdited: true,
            tempFile: file,
        });
    }
    render() {
        return (
            <section className="section  section--full-width">
                <div className="flex-wrapper  file-upload-container">
                    <div className={"image-preview" + (this.state.imageEdited ? "  image-preview--edited" : "")}>
                        {this.state.src ?
                            <img
                                src={"/static/images/" + this.props.postId + "/" + this.state.src}
                                alt={this.state.altText}
                                className="image-preview__image  js-image-preview__image"
                                id={"image-" + this.props.contentId}
                            />
                        :
                            null
                        }
                    </div>
                    <Dropzone handleFileChange={this.handleFileChange} contentId={this.props.contentId} />
                </div>
                <div>
                    <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                        <label htmlFor={"caption-" + this.state.contentId} className="input__label">Caption</label>
                        <div className="finalize-edit-container">
                            <input
                                type="text"
                                name={"caption-" + this.state.contentId}
                                className={"input--text  input--text--full-width" + (this.state.captionEdited ? "  input--text--edited" : "")}
                                id={"caption-" + this.state.contentId}
                                defaultValue={this.state.caption}
                                autoComplete="off"
                                onKeyUp={this.handleCaptionChange} />
                        </div>
                    </div>
                    <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                        <label htmlFor={"altText-" + this.props.contentId} className="input__label">Alt-text</label>
                        <div className="finalize-edit-container">
                            <input
                                type="text"
                                name={"altText-" + this.props.contentId}
                                className={"input--text  input--text--full-width" + (this.state.altTextEdited ? "  input--text--edited" : "")}
                                id={"altText-" + this.props.contentId}
                                defaultValue={this.state.altText}
                                autoComplete="off"
                                onKeyUp={this.handleAltTextChange} />
                        </div>
                    </div>
                </div>
                <div className="toolbar  toolbar--bottom">
                    <button onClick={this.save}>Save</button>
                    <button>Revert</button>
                    <button>Hide</button>
                </div>
            </section>
        )
    }
}
export class PostVideoEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
        this.save = this.save.bind(this);

        this.inputId = "video-" + this.props.contentId;
        this.inputRef = React.createRef();

        this.state = {
            content: this.props.content,
            tempContent: this.props.content,
        }
    }
    handleInput(e) {
        this.setState({
            tempContent: e.target.value,
        }, () => {
            if (this.state.content != this.state.tempContent) {
                this.setState({
                    edited: true,
                })
            } else {
                this.setState({
                    edited: false,
                })
            }
        });
    }

    save() {
        client.get('/api/v1/posts/' + this.props.postId)
        .then(response => {
            let postContent = response.data.content;

            let toUpdate = postContent.filter(obj => {
                return obj.hash === this.props.hash;
            })[0] // {content: ..., hash: ...}

            let index = postContent.indexOf(toUpdate);

            toUpdate.content = this.state.tempContent;

            postContent[index] = toUpdate;

            client.put('/api/v1/posts/' + this.props.postId, {
                content: postContent,
            })
            .then(response => {
                this.setState({
                    content: this.state.tempContent,
                    edited: false,
                })
            })
        })
    }
    render() {
        return (
            <section className="section  section--full-width">
                <div className="input-container">
                    <label htmlFor={this.inputID} className="input__label">YouTube Video Id</label>

                    <input
                        type="text"
                        className={"input--text" + (this.state.edited ? "  input-container--edited" : "")}
                        id={this.inputId}
                        defaultValue={this.state.content}
                        onKeyUp={this.handleInput}
                        ref={this.inputRef}
                    />
                </div>
                <div className="toolbar  toolbar--bottom">
                    <button onClick={this.save}>Save</button>
                    <button>Revert</button>
                    <button>Hide</button>
                </div>
            </section>
        )
    }
}
