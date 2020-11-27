import React, { useState} from 'react';
import API from '../core/api';
import { useDispatch } from 'react-redux';
import { setSession } from '../store/auth';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { showLoading, hideLoading } from '../store/loading';



function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const disableSave = !username || !password;

    const handleSubmit = e => {
        e.preventDefault();

        dispatch(showLoading());
        API.auth.login(username, password)
            .then(({sessionId, userId, userRole}) => dispatch(setSession(sessionId, userId, userRole)))
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required

                variant="outlined"
                margin="normal"
                fullWidth
            />
            <TextField
                type="password"
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required

                variant="outlined"
                margin="normal"
                fullWidth
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disableSave}
                className="mt-2"
            >
                Login
            </Button>
        </form>
    );
}

export default LoginForm;