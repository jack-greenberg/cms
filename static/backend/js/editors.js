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

        this.inputID = "post-" + this.props.postID + '--' + this.props.hash;
        this.inputRef = React.createRef();

        this.state = {
            content: this.props.content,
            tempContent: this.props.content,
            preview: false,
        }
    }
    componentDidMount() {
        this.inputRef.current.innerText = this.state.content;
        autosize($('#' + this.inputID));
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
        client.get('/api/v1/posts/' + this.props.postID)
        .then(response => {
            let postContent = response.data.content;

            let toUpdate = postContent.filter(obj => {
                return obj.hash === this.props.hash;
            })[0] // {content: ..., hash: ...}

            let index = postContent.indexOf(toUpdate);

            toUpdate.content = this.state.tempContent;

            postContent[index] = toUpdate;

            client.put('/api/v1/posts/' + this.props.postID, {
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
                                name={"toggle--text--" + this.inputID}
                                id={"toggle--" + this.inputID + "--markdown"}
                                defaultChecked={true}
                                value="markdown"
                                onClick={this.preview}
                            />
                            <label htmlFor={"toggle--" + this.inputID + "--markdown"}>
                                Markdown
                            </label>

                            <input
                                type="radio"
                                name={"toggle--text--" + this.inputID}
                                id={"toggle--" + this.inputID + "--preview"}
                                value="preview"
                                onClick={this.preview}
                            />
                            <label htmlFor={"toggle--" + this.inputID + "--preview"}>
                                Preview
                            </label>
                        </div>
                    </div>
                </div>
                <div className={"input-container" + (this.state.edited ? "  input-container--edited" : "")}>
                    <label htmlFor={this.inputID} className="input__label">{this.props.label}</label>

                    <div
                        contentEditable={!this.state.preview}
                        className={"input--text  input--text--markdown  markdown-body" + (this.state.preview ? "  preview" : "")}
                        id={this.inputID}
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
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} id={"file-" + props.hash} />
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
            altText: this.props.altText,
            tempAltText: this.props.altText,
            altTextEdited: false,

            caption: this.props.caption,
            tempCaption: this.props.caption,
            captionEdited: false,

            content: this.props.content,
            imageEdited: false,
            tempFile: undefined,
        }
    }
    save() {
        if (!(this.state.altTextEdited || this.state.captionEdited || this.state.imageEdited)) {
            console.log('Nothing edited');
            return;
        };

        client.get('/api/v1/posts/' + this.props.postID)
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
            $("#image-" + this.props.postID + '-' + this.props.hash).attr("src", event.target.result);
            $("#image-" + this.props.postID + '-' + this.props.hash).css('display', 'block');
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
                        {this.props.content.length > 0 ?
                            <img
                                src={"/static/images/" + this.props.postID + "/" + this.props.hash + '.' + this.props.imageID + ".jpg"}
                                alt={this.props.altText}
                                className="image-preview__image  js-image-preview__image"
                                id={"image-" + this.props.postID + '-' + this.props.hash}
                            />
                        :
                            null
                        }
                    </div>
                    <Dropzone handleFileChange={this.handleFileChange} hash={this.props.hash} />
                </div>
                <div>
                    <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                        <label htmlFor={"post-" + this.props.postID + "-" + this.props.hash + "-caption"} className="input__label">Caption</label>
                        <div className="finalize-edit-container">
                            <input
                                type="text"
                                name={"post-" + this.props.postID + "-" + this.props.hash + "-caption"}
                                className={"input--text  input--text--full-width" + (this.state.captionEdited ? "  input--text--edited" : "")}
                                id={"post-" + this.props.postID + "-" + this.props.hash + "-caption"}
                                defaultValue={this.state.caption}
                                autoComplete="off"
                                onKeyUp={this.handleCaptionChange} />
                        </div>
                    </div>
                    <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                        <label htmlFor={"post-" + this.props.postID + "-" + this.props.hash + "-altText"} className="input__label">Alt-text</label>
                        <div className="finalize-edit-container">
                            <input
                                type="text"
                                name={"post-" + this.props.postID + "-" + this.props.hash + "-altText"}
                                className={"input--text  input--text--full-width" + (this.state.altTextEdited ? "  input--text--edited" : "")}
                                id={"post-" + this.props.postID + "-" + this.props.hash + "-altText"}
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

        this.inputID = "post-" + this.props.postID + '--' + this.props.hash;
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
        client.get('/api/v1/posts/' + this.props.postID)
        .then(response => {
            let postContent = response.data.content;

            let toUpdate = postContent.filter(obj => {
                return obj.hash === this.props.hash;
            })[0] // {content: ..., hash: ...}

            let index = postContent.indexOf(toUpdate);

            toUpdate.content = this.state.tempContent;

            postContent[index] = toUpdate;

            client.put('/api/v1/posts/' + this.props.postID, {
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
                    <label htmlFor={this.inputID} className="input__label">YouTube Video ID</label>

                    <input
                        type="text"
                        className={"input--text" + (this.state.edited ? "  input-container--edited" : "")}
                        id={this.inputID}
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
