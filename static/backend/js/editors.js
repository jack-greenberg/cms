import React from 'react';
var autosize = require('autosize');
import { client } from './index';
import { TextInput } from './components';
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
        this.delete = this.delete.bind(this);

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
            edited: this.state.content == this.state.tempContent
        });
    }
    save() {
        client.put('/api/v1/content/' + this.props.contentId, {
            value: this.state.tempContent,
        })
        .then(response => {
            console.log(response);
            this.setState({
                content: this.state.tempContent,
                edited: false,
            })
        })
    }
    delete() {this.props.deleteContent(this.props.contentId)}
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
                    <button onClick={this.delete}>Delete</button>
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
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);

        this.state = {
            src: this.props.src,
            srcset: this.props.srcset,
            imageId: this.props.imageId,
            imageEdited: false,
            tempFile: undefined,
        }
    }
    save() {
        let formData = new FormData();
        let imageId = (Math.random()*0xFFFFFF<<0).toString(16)

        formData.append('image', this.state.tempFile[0])
        formData.append('imageId', imageId)
        formData.append('contentId', this.props.contentId)
        formData.append('postId', this.props.postId)

        client.post('/api/v1/content/' + this.props.contentId, formData, {
            'Content-Type': 'multipart/form-data', // required by Flask
        })
        .then(response => {
            console.log(response);
            this.setState({
                imageEdited: false,
                src: response.data.src,
                srcset: response.data.srcset,
                imageId: imageId,
                tempFile: undefined,
            });
        })
    }
    delete() {this.props.deleteContent(this.props.contentId)}
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
                    <TextInput
                        fullWidth
                        endpoint="content"
                        name="altText"
                        pk={this.props.contentId}
                        storedValue={this.props.altText}
                        label="Alt text"
                    />
                    <TextInput
                        fullWidth
                        endpoint="content"
                        name="caption"
                        pk={this.props.contentId}
                        storedValue={this.props.caption}
                        label="Caption"
                    />
                </div>
                <div className="toolbar  toolbar--bottom">
                    <button onClick={this.save}>Save</button>
                    <button onClick={this.delete}>Delete</button>
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
        this.delete = this.delete.bind(this);

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
            edited: (this.state.content === this.state.tempContent)
        });
    }
    delete() {this.props.deleteContent(this.props.contentId)}
    save() {
        client.put('/api/v1/content/' + this.props.contentId, {
            youtubeId: this.state.tempContent,
        })
        .then(response => {
            console.log(response);
            this.setState({
                content: this.state.tempContent,
                edited: false,
            })
        })
    }
    render() {
        return (
            <section className="section  section--full-width">
                <TextInput
                    fullWidth
                    endpoint="content"
                    name="youtubeId"
                    pk={this.props.contentId}
                    storedValue={this.props.youtubeId}
                    label="Youtube Video Id"
                />
                <div className="toolbar  toolbar--bottom">
                    <button onClick={this.save}>Save</button>
                    <button onClick={this.delete}>Delete</button>
                </div>
            </section>
        )
    }
}
