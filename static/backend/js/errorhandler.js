import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        console.log(error.toString());

        this.setState({
            hasError: true,
            error: error,
            info: info,
        })
    }

    render() {
        if (this.state.hasError && this.state.error && this.state.info) {
            // You can render any custom fallback UI
            return (
                <>
                    <h2>Something went wrong :(</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }} open>
                        <summary>Details</summary>
                        {this.state.error.toString()}
                        <br />
                        {this.state.info.componentStack}
                    </details>
                </>
            );
        }

        return this.props.children;
    }
}
