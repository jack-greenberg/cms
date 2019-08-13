import React from 'react';
import { Form } from '../components/inputs/form';
import { Input } from '../components/inputs/';
import { AppContext } from '../index';
import { Button } from '../components/button';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.tryLogin = this.tryLogin.bind(this);
    }
    tryLogin() {

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
                            <Input.Checkbox label="Remember for 30 days" inputId="login-save" />
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
