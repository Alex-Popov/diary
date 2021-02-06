import React, {useContext} from 'react';

import css from './Header.module.css';

import ProfileMenu from './ProfileMenu';
import TodayNotificationsWidget from './TodayNotificationsWidget';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import {NavLink} from 'react-router-dom';
import {context} from '../context/AppContext';



function Header() {
    const { headerToolbar } = useContext(context.state);

    return (
        <div className={css.header}>
            <div className="d-none d-md-block">L</div>
            {headerToolbar}

            <IconButton
                color="inherit"
                size="small"
                className="m-1"

                component={NavLink}
                to="/new"
                exact
                activeClassName={css.buttonActive}
            >
                <AddCircleIcon />
            </IconButton>
            <TodayNotificationsWidget className="m-1" />

            <ProfileMenu className="mt-md-auto" />
        </div>
    );
}


export default React.memo(Header);