import React from 'react';
import * as Icon from 'react-feather';
var autosize = require('autosize');
// import axios from 'axios';
import { client } from './index.js';
var $ = require('jquery');
import showdown from 'showdown';
import {useDropzone} from 'react-dropzone';


/*
    <TextInput [fullWidth, important, multiline] storedValue={} name={""} form={""} label={""} handleUpdate={this.handleTextUpdate} />
    <FileInput storedValue={} name={} form={} label={} accept={} />
    <ImageInput />
*/

export class TextInput extends React.Component {
    /*
        props: fullWidth (sets width 100%), important (bold text), storedValue (default value from db), name (db key), label, pk, endpoint
    */
    constructor(props) {
        super(props);
        this.handleTextEdit = this.handleTextEdit.bind(this);
        this.handleFinalizeEdit = this.handleFinalizeEdit.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);

        this.inputRef = React.createRef();

        this.state = {
            edited: false,
            storedValue: this.props.storedValue,
        }
    }
    componentDidMount() {
        autosize($('#form-' + this.props.form + "--" + this.props.name));
    }
    handleTextEdit(e) {
        if (this.props.multiline) {
            autosize($('#form-' + this.props.form + "--" + this.props.name)); // autosizes the multiline inputs so there is no scrolling
        };

        let storedValue = this.state.storedValue;
        let currentValue = e.target.value;
        if (currentValue !== storedValue) {
            // set state.edited if the input has been changed
            this.setState({
                edited: true,
            });
        } else {
            this.setState({
                edited: false,
            });
        };
    };
    handleFinalizeEdit() {
        // triggered by the finalize edit box, when a user confirms changes
        console.log(this.props.form, this.props.name, this.inputRef.current.value);
        let dataObject = {}
        dataObject[this.props.name] = this.inputRef.current.value
        client.put('/api/v1/' + this.props.endpoint + '/' + this.props.pk, dataObject)
        .then(function(response) {
            console.log(response);
        });

        this.setState({
            // set the stored value to the new data
            edited: false,
            storedValue: this.inputRef.current.value,
        });
    }
    handleCancelEdit() {
        // reset the value of the input to the initial value
        this.inputRef.current.value = this.state.storedValue;
        this.setState({
            edited: false,
        });
    }
    render() {
        let inputClassList = "input--text";

        // sets the style of the input based on props
        if (this.props.fullWidth || this.props.multiline) {
            inputClassList += "  input--text--full-width";
        } else {
            inputClassList += "  input--text--small";
        };
        if (this.props.important) {
            inputClassList += "  input--text--important";
        };
        if (this.props.code) {
            inputClassList += "  input--text--code";
        };
        if (this.props.multiline) {
            inputClassList += "  input--text--multiline";
            return (
                <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                    <label htmlFor={"form-" + this.props.form + '--' + this.props.name} className="input__label">{this.props.label}</label>
                    <textarea name={this.props.name} className={inputClassList} id={"form-" + this.props.form + "--" + this.props.name} defaultValue={this.props.storedValue} onKeyUp={this.handleTextEdit} ref={this.inputRef} />

                    {this.state.edited ? <FinalizeEditBox handleFinalizeEdit={this.handleFinalizeEdit} handleCancelEdit={this.handleCancelEdit} /> : null}
                </div>
            )
        }
        return (
            <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                <label htmlFor={"form-" + this.props.form + '--' + this.props.name} className="input__label">{this.props.label}</label>
                <div className="finalize-edit-container">
                    <input type="text" name={this.props.name} className={inputClassList} id={"form-" + this.props.form + '--' + this.props.name} defaultValue={this.state.storedValue} onKeyUp={this.handleTextEdit} ref={this.inputRef} autoComplete="off" />

                    {this.state.edited ? <FinalizeEditBox handleFinalizeEdit={this.handleFinalizeEdit} handleCancelEdit={this.handleCancelEdit} /> : null}
                </div>
            </div>
        )
    }
};
export class FileInput extends React.Component {
    /*
        props: name, label, form, storedValue
    */
    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFinalizeEdit = this.handleFinalizeEdit.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);
        this.removeFile = this.removeFile.bind(this);

        this.inputRef = React.createRef();

        this.state = {
            edited: false,
            storedValue: this.props.storedValue,
            tempValue: this.props.storedValue, // when the input is changed, store the new value as a temp, in case the user cancels
        };
    };
    handleFinalizeEdit() {
        let formData = new FormData(); // create form data to send to api
        formData.append('name', this.props.name)
        formData.append('data', $('#form-' + this.props.form + '--' + this.props.name).prop('files')[0])

        client.post('/api/v1/siteData/' + this.props.form, formData, {
            'Content-Type': 'multipart/form-data', // required by Flask
        })
        .then(function(response) {
            console.log(response);
        });

        this.setState({
            edited: false,
            storedValue: this.inputRef.current.value.split('\\').pop(), // remove `fakepath:\\`
        });
    }
    handleCancelEdit() {
        this.inputRef.current.value = "";
        this.setState({
            edited: false,
            tempValue: this.state.storedValue,
        });
    }
    removeFile(e) {
        // remove the file
        e.preventDefault(); // prevent the browser from opening up a file selection
        let confirmation = window.confirm("Are you sure you want to delete this file?");
        if (confirmation) {
            this.setState({
                edited: false,
                storedValue: "",
                tempValue: "",
            });
            // axios call
            alert("File deleted");
        };
    }
    handleFileChange(e) {
        // temporary edit handler
        let storedValue = this.state.storedValue;
        let fileName = e.target.value.split('\\').pop();

        this.setState({
            edited: true,
            tempValue: fileName,
        });
    };
    render() {
        return (
            <div className={this.state.edited ? "input-container  input-container--edited" : "input-container"}>
                <div className="input__label">{this.props.label}</div>
                <input type="file" encType="multipart/form-data" id={"form-" + this.props.form + '--' + this.props.name} className="input--file" onChange={this.handleFileChange} accept={this.props.accept} ref={this.inputRef} />
                <label htmlFor={"form-" + this.props.form + '--' + this.props.name} className="align--horizontal">
                    <div className="input--file__filename">{this.state.tempValue ? this.state.tempValue : <span className="text--faint">No file saved</span>}</div>
                    {this.state.tempValue ?
                        <button onClick={this.removeFile} className="btn  btn--icon  btn--icon  btn--delete-file">
                            <Icon.XCircle />
                        </button>
                    :
                        null
                    }
                    <div className="input--file__button">Choose a file...</div>
                </label>
                {this.state.edited ? <FinalizeEditBox handleFinalizeEdit={this.handleFinalizeEdit} handleCancelEdit={this.handleCancelEdit} /> : null}
            </div>
        )
    }
};
class FinalizeEditBox extends React.Component {
    /*
        Buttons to confirm and cancel edits
    */
    render() {
        return (
            <div className="finalize-edits">
                <button className="btn  btn--icon  btn--icon--green" onClick={this.props.handleFinalizeEdit}>
                    <Icon.Check />
                </button>
                <button className="btn  btn--icon  btn--icon--red" onClick={this.props.handleCancelEdit}>
                    <Icon.X />
                </button>
            </div>
        )
    }
}

export class ToggleSwitch extends React.Component {
    /*
        props: isChecked (determines the default state)
    */
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);

        this.state = {
            isChecked: this.props.isChecked,
        };
    }
    toggle() {
        this.setState({
            isChecked: !this.state.isChecked,
        })
    }
    render() {
        return (
            <label htmlFor={this.props.forId} className="toggle" onClick={this.toggle}>
                <input type="checkbox" defaultChecked={this.state.isChecked ? true : false} id={this.props.forId} />
                <span className="toggle__slider"></span>
            </label>
        )
    }
}

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
        console.log(e.target.innerText);
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
            console.log(response.data.content); // [{...}, {...}, {...}...]

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
            console.log(this.inputRef.current.innerText);
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
            console.log(getResponse.data.content); // [{...}, {...}, {...}...]

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
                        <img
                            src={this.props.content ?
                                "/static/images/" + this.props.postID + "/" + this.props.hash + '.' + this.props.imageID + ".jpg"
                            :
                                null
                            }
                            alt={this.props.content ?
                                this.props.altText
                            :
                                "Image preview"
                            }
                            className="image-preview__image  js-image-preview__image"
                            id={"image-" + this.props.postID + '-' + this.props.hash}
                        />
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
    }

    render() {
        return (
            <h2>Video Stuff</h2>
        )
    }
}
