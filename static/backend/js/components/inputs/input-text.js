import React from 'react';

export class Text extends React.Component {
	render() {
		return (
			<>
				<label className="TextInput" htmlFor={this.props.inputId}>
					<span className="TextInput__label">{this.props.label}</span>
					<input className="TextInput__input" type={this.props.password ? "password" : "text"} id={this.props.inputId} defaultValue={this.props.defaultValue}/>
				</label>
			</>
		)
	}
}
