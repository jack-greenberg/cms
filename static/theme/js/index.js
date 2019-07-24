import '../css/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Timeline } from './timeline';
import { Story } from './story';
var axios = require('axios');

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.updatePostIndex = this.updatePostIndex.bind(this);

        this.state = {
            postData: undefined,
            currentPost: 0,
        }
    }
    updatePostIndex(dir) {
        this.setState({
            currentPost: Number(this.state.currentPost + dir).mod(this.state.postData.length),
        }, () => {
            console.log(this.state.currentPost);
        })
    }
    componentDidMount() {
        axios.get('/api/v1/public/posts/')
        .then(response => {
            console.log(response);
            this.setState({
                postData: response.data,
            })
        })
    }
    render() {
        if (this.state.postData) {
            return (
                <>
                    <Timeline postData={this.state.postData} currentPost={this.state.currentPost} updatePostIndex={this.updatePostIndex} />
                    <Story postData={this.state.postData} currentPost={this.state.currentPost} />
                </>
            )
        } else {
            return "Loading...";
        }
    }
}

ReactDOM.render(<App />, document.getElementById("app"))
