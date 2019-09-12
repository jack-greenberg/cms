import React from 'react'

export class Form extends React.Component {
	render () {
		return (
			<form id={this.props.id}>
				{this.props.children}
			</form>
		)
	}
}
