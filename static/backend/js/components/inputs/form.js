import React from 'react'

export class Form extends React.Component {
	render () {
		return (
			<form id={this.props.formId}>
				{this.props.children}
			</form>
		)
	}
}
