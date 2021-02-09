import React, { useState} from 'react';
import API from '../core/api';
import { useDispatch } from 'react-redux';
import { setSession } from '../store/auth';
import { showLoading, hideLoading } from '../store/loading';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FaceIcon from '@material-ui/icons/Face';
import LockIcon from '@material-ui/icons/Lock';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';



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
            <OutlinedInput
                placeholder="Логин"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                fullWidth
                startAdornment={
                    <InputAdornment position="start">
                        <FaceIcon fontSize="small" />
                    </InputAdornment>
                }
            />
            <OutlinedInput
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                startAdornment={
                    <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                    </InputAdornment>
                }
                className="mt-3"
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disableSave}
                className="mt-4"
            >
                Login
            </Button>
        </form>
    );
}

export default LoginForm;