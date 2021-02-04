import React from 'react';

import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';

import HeaderToolbar from './HeaderToolbar';
import ProfileMenu from './ProfileMenu';
import TodayNotificationsWidget from './TodayNotificationsWidget';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import { NavLink } from 'react-router-dom';

import css from './Header.module.css';


function Header() {
    const scrollTrigger = useScrollTrigger();

    return <>
        <Slide appear={false} direction="down" in={!scrollTrigger}>
            <AppBar className={`${css.bg} hide-on-print`}>
                <div className={`d-flex align-items-center px-4 ${css.minHeight}`}>
                    <div className="mr-auto">
                        <HeaderToolbar />
                    </div>


                    <IconButton
                        color="inherit"
                        className="mr-4 flex-shrink-0"

                        component={NavLink}
                        to="/new"
                        exact
                        activeClassName={css.buttonActive}
                    >
                        <AddCircleIcon fontSize="small" />
                    </IconButton>

                    <TodayNotificationsWidget />
                    <ProfileMenu />
                </div>
            </AppBar>
        </Slide>
        <div className={`${css.minHeight} hide-on-print`}></div>
    </>;
}


export default React.memo(Header);