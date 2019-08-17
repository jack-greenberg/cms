import React from 'react';
import { Form } from '../components/inputs/form';
import { Input } from '../components/inputs/';
import { Button } from '../components/button';
import axios from 'axios';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.tryLogin = this.tryLogin.bind(this);
    }
    tryLogin(e) {
        var urlParams = new URLSearchParams(window.location.search)

        e.preventDefault();
        axios.post('/admin/login/', {
            username: document.getElementById('login-username').value,
            password: document.getElementById('login-password').value,
            remember: document.getElementById('login-remember').value,
            redirect: urlParams.get('redirect'),
        })
        .then(res => {
            // set access_ and refresh_ tokens
            localStorage.setItem('access_token', res.data['access_token'])
            localStorage.setItem('refresh_token', res.data['refresh_token'])
            window.location.href = res.data['redirect']; // send the user to the admin page
        })
        .catch(err => {
            console.log(err)
            if (err.response.status != 200) {
                // Set an error color around the boxes if the username or password is wrong
                document.getElementById('login-username').style["box-shadow"] = "0 0 0 1px #f7484e";
                document.getElementById('login-password').style["box-shadow"] = "0 0 0 1px #f7484e";
            }
        })
    }
    render() {
        return (
            <>
                <main className="main">
                    <div className="section">
                        <h1 className="h1  sans">Admin Login</h1>
                        <form>
                            <Input.Text label="Username" inputId="login-username" />
                            <Input.Text label="Password" password inputId="login-password" />
                            <Input.Checkbox label="Remember for 30 days" inputId="login-remember" defaultChecked={true} />
                            <Button onClick={this.tryLogin} variants={['green', 'submit']}>
                                <span className="Button__label">Login</span>
                            </Button>
                        </form>
                    </div>
                    <p className="f3  sans">Here by mistake? <a className="link  dim  link-underline  sans" href="/">Go back to safety</a></p>
                </main>
            </>
        );
    };
};
