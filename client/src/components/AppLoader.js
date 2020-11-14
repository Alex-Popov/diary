import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { destroySession, setSession, selectIsAuthenticated } from '../store/auth';
import API from '../core/api';

import Fullscreen from './Fullscreen';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from '../pages/Login';
import App from './App';


function AppLoader() {
    const [autoLoginLoading, setAutoLoginLoading] = useState(true);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        API.auth.autoLogin()
            .then(({sessionId, userId, userRole}) => {
                dispatch(setSession(sessionId, userId, userRole));
            })
            .catch(() => dispatch(destroySession()))
            .finally(() => setAutoLoginLoading(false))
    }, [dispatch]);


    //
    // render
    //

    return (autoLoginLoading ?
        <Fullscreen>
            <CircularProgress size={100} />
        </Fullscreen>
        : isAuthenticated ? <App /> : <Login />
    );
}

export default AppLoader;