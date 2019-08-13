import React from 'react';

export class Checkbox extends React.Component {
    render() {
        return (
            <div>
                <label htmlFor="remember">{this.props.label}</label>
                <input type="checkbox" name="remember" defaultChecked={this.props.defaultChecked} />
                <span className="checkmark"></span>
            </div>
        )
    }
}
