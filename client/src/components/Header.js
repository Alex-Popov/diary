import React, {useCallback, useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {context} from '../context/AppContext';

import css from './Header.module.css';

import ProfileMenu from './ProfileMenu';
//import TodayNotificationsWidget from './TodayNotificationsWidget';
import IconButton from '@material-ui/core/IconButton';
import AddCommentIcon from '@material-ui/icons/AddComment';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Logo from '../icons/Logo';


function Header() {
    const { headerToolbar } = useContext(context.state);
    const { setShowCategoriesManager } = useContext(context.setters);

    const handleManage = useCallback(() => {
        setShowCategoriesManager(true);
    }, [setShowCategoriesManager]);

    return (
        <div className={css.header}>
            <div className={css.logo}>
                <Logo
                    fontSize="inherit"
                    color="inherit"
                    className="d-block"
                />
            </div>

            {headerToolbar}

            <div className="d-md-none m-auto"></div>

            <IconButton
                color="inherit"
                size="small"
                className="m-1"

                component={NavLink}
                to="/new"
                exact
                //activeClassName={css.buttonActive}
            >
                <AddCommentIcon />
            </IconButton>
            <IconButton
                color="inherit"
                size="small"
                className="m-1"

                onClick={handleManage}
            >
                <ClearAllIcon />
            </IconButton>

            <div className="d-md-none mx-3"></div>
            <div className="d-none d-md-block d-md-none m-auto"></div>


            <ProfileMenu />
        </div>
    );
}
//<TodayNotificationsWidget className="m-1" />

export default React.memo(Header);