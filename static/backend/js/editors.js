import React from 'react';
var autosize = require('autosize');
import { client } from './index';
import { TextInput } from './components';
var $ = require('jquery');
import showdown from 'showdown';
import {useDropzone} from 'react-dropzone';

function addKeyboardCommand(node, key, callback) {
    node.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key == key) {
            e.preventDefault();
            callback();
            return false;
        }
    })
}
function preventReload(e) {
    var confirmationMessage = 'It looks like you have been editing something. '
        + 'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
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

        this.contentId = this.props.contentId;
        this.cursor = {};
        this.state = {
            content: this.props.content,
            tempContent: converter.makeHtml(this.props.content),
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        this.cursor = {
            sel: document.getSelection(),
            range: document.createRange(),
            childNodes: Array.from(document.getElementById(this.contentId).childNodes),
            currentChildNodeIndex: Array.from(document.getElementById(this.contentId).childNodes).indexOf(document.getSelection().focusNode),
        };
        console.log(document.getSelection());
        return true;
    }
    componentDidUpdate() {
        console.log(this.cursor);
        if (this.cursor.currentChildNodeIndex === -1) {
            this.cursor.currentChildNodeIndex = this.cursor.childNodes.length - 1;
        }
        console.log(this.cursor.childNodes[this.cursor.currentChildNodeIndex], this.cursor.sel.focusOffset);
        this.cursor.range.setStart(this.cursor.childNodes[this.cursor.currentChildNodeIndex], this.cursor.sel.focusOffset);
    }
    handleInput(e) {
        this.setState({
            tempContent: this.element.innerHTML,
        });
    }
    render() {
        return (
            <section className="editor  text-editor">
                <div className="text-editor__toolbar">
                    <button onMouseDown={e => e.preventDefault()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path fill="none" d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path fill="none" d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                    </button>
                    <button onMouseDown={e => e.preventDefault()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                    </button>
                    <button onMouseDown={e => e.preventDefault()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 12px)'}} x="7" y="7">1</text><text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 21px)'}} x="7" y="14">2</text><text textAnchor="middle" style={{fontFamily: 'Inter', textAlign: 'center', transform: 'scale(.4) translate(1px, 30px)'}} x="7" y="21">3</text></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none"></path></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path stroke="none" d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z"/></svg>
                    </button>
                </div>
                <div
                    contentEditable
                    style={{display: 'inline-block', width: '100%'}}
                    className="text-editor__input"
                    id={this.contentId}
                    onInput={this.handleInput}
                    ref={node => this.element = node}
                    dangerouslySetInnerHTML={{__html: this.state.tempContent}}
                ></div>
            </section>
        )
    }
}

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <p>Drag and drop an image or click here.</p>
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
            <section className="editor">
                <Dropzone handleFileChange={this.handleFileChange} contentId={this.props.contentId} />
                <div className="alignment-options">
                    <label htmlFor={"align-left-" + this.props.contentId}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                        <input type="radio" id={"align-left-" + this.props.contentId} name={"image-align-" + this.props.contentId}/>
                    </label>
                    <label htmlFor={"align-center-" + this.props.contentId}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                        <input type="radio" id={"align-center-" + this.props.contentId} name={"image-align-" + this.props.contentId}/>
                    </label>
                    <label htmlFor={"align-right-" + this.props.contentId}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                        <input type="radio" id={"align-right-" + this.props.contentId} name={"image-align-" + this.props.contentId}/>
                    </label>
                </div>
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
            </section>
        )
        // return (
        //     <section className="section  section--full-width">
        //         <div className="flex-wrapper  file-upload-container">
        //             <div className={"image-preview" + (this.state.imageEdited ? "  image-preview--edited" : "")}>
        //                 {this.state.src ?
        //                     <img
        //                         src={"/static/images/" + this.props.postId + "/" + this.state.src}
        //                         alt={this.state.altText}
        //                         className="image-preview__image  js-image-preview__image"
        //                         id={"image-" + this.props.contentId}
        //                     />
        //                 :
        //                     <img
        //                         className="image-preview__image  js-image-preview__image"
        //                         id={"image-" + this.props.contentId}
        //                         style={{display: 'none'}}
        //                     />
        //                 }
        //             </div>
        //             <Dropzone handleFileChange={this.handleFileChange} contentId={this.props.contentId} />
        //         </div>
        //         <div>
        //             <TextInput
        //                 fullWidth
        //                 endpoint="content"
        //                 name="altText"
        //                 pk={this.props.contentId}
        //                 storedValue={this.props.altText}
        //                 label="Alt text"
        //             />
        //             <TextInput
        //                 fullWidth
        //                 endpoint="content"
        //                 name="caption"
        //                 pk={this.props.contentId}
        //                 storedValue={this.props.caption}
        //                 label="Caption"
        //             />
        //         </div>
        //         <div className="toolbar  toolbar--bottom">
        //             <button onClick={this.save}>Save</button>
        //             <button onClick={this.delete}>Delete</button>
        //         </div>
        //     </section>
        // )
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
            <section className="editor  section  section--full-width">
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
