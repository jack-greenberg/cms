import React from 'react';
import * as Icon from 'react-feather';
var autosize = require('autosize');

/*
    <TextInput [fullWidth, important, multiline] storedValue={} name={""} form={""} label={""} handleUpdate={this.handleTextUpdate} />
    <FileInput />
    <ImageInput />
*/

export class TextInput extends React.Component {
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
            autosize($('#form-' + this.props.form + "--" + this.props.name));
        };

        let storedValue = this.state.storedValue;
        let currentValue = e.target.value;
        if (currentValue !== storedValue) {
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
        // make axios call
        this.setState({
            edited: false,
            storedValue: this.inputRef.current.value,
        });
    }
    handleCancelEdit() {
        this.inputRef.current.value = this.state.storedValue;
        this.setState({
            edited: false,
        });
    }
    render() {
        let inputClassList = "input--text";
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
                <input type="text" name={this.props.name} className={inputClassList} id={"form-" + this.props.form + '--' + this.props.name} defaultValue={this.state.storedValue} onKeyUp={this.handleTextEdit} ref={this.inputRef} />

                {this.state.edited ? <FinalizeEditBox handleFinalizeEdit={this.handleFinalizeEdit} handleCancelEdit={this.handleCancelEdit} /> : null}
            </div>
        )
    }
};

class FinalizeEditBox extends React.Component {
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
