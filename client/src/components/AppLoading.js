import React from 'react';

import css from './AppLoading.module.css';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { selectLoadingState } from '../store/loading';


function AppLoading() {
    const isShow = useSelector(selectLoadingState);

    return (
        <Backdrop className={css.backdrop} open={isShow}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default React.memo(AppLoading);