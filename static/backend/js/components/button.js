import React from 'react';

export class Button extends React.Component {
	render() {
		var classNames = ["Button"];

		for (var style in this.props.variants) {
			classNames.push("Button--" + this.props.variants[style])
		}

		console.log(this.props);

		classNames = classNames.join("  ");

		return (
			<button
				className={classNames}
				disabled={this.props.disabled}
			>
				{this.props.children}
			</button>
		)
	}
}
