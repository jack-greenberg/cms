import React from 'react';
import * as Icon from 'react-feather';
var autosize = require('autosize');
// import axios from 'axios';
import { client } from './index.js';
var $ = require('jquery');

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
