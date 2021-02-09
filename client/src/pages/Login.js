import React from 'react';
import css from './Login.module.css';

import LoginForm from '../components/LoginForm';
import Fullscreen from '../components/Fullscreen';
import Logo from '../icons/Logo';

function Login() {
    return (
        <div className={css.container}>
            <Fullscreen>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <div className={css.logo}>
                        <Logo
                            fontSize="inherit"
                            color="inherit"
                            className="d-block"
                        />
                        <img alt="Дорогой Дневник" src="/img/logo.png" />
                    </div>

                    <div className={css.card}>
                        <LoginForm />
                    </div>
                </div>
            </Fullscreen>
        </div>
    );
}

export default Login;