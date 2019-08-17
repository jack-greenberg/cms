import React from 'react';

export class Button extends React.Component {
	render() {
		var classNames = ["Button"];

		for (var style in this.props.variants) {
			classNames.push("Button--" + this.props.variants[style])
		}

		classNames = classNames.join("  ");

		return (
			<button
				className={classNames}
				disabled={this.props.disabled}
				onClick={this.props.onClick}
			>
				{this.props.children}
			</button>
		)
	}
}
