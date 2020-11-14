import React from 'react';
import LoginForm from '../components/LoginForm';
import Fullscreen from '../components/Fullscreen';
import Container from '@material-ui/core/Container';

function Login() {
    return (
        <Fullscreen>
            <Container maxWidth="xs">
                <LoginForm />
            </Container>
        </Fullscreen>
    );
}

export default Login;