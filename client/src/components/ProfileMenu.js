import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
//import { Link } from 'react-router-dom';

import API from "../core/api";
import { destroySession } from '../store/auth';

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FaceRoundedIcon from '@material-ui/icons/FaceRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';



function ProfileMenu({className}) {
    const theme = useTheme();
    const minWidthMd = useMediaQuery(theme.breakpoints.up('md'), {noSsr: true});
console.log(minWidthMd);
    // dropdown menu connector
    const menuState = usePopupState({
        variant: 'popover',
        popupId: 'profileMenu'
    });

    // logout
    const dispatch = useDispatch();
    const handleLogout = useCallback(() => {
        API.auth.logout()
			.catch(() => {})
            .finally(() => dispatch(destroySession()))
    }, [dispatch]);

    return <>
        <IconButton
            color="inherit"
            size="small"
            className={className}
            {...bindTrigger(menuState)}
        >
            <FaceRoundedIcon />
        </IconButton>
        <Menu
            {...bindMenu(menuState)}
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: minWidthMd ? 'bottom' : 'top',
                horizontal: minWidthMd ? 'left': 'right',
            }}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </>;
}
//<MenuItem component={Link} to="/profile">Profile</MenuItem>

export default React.memo(ProfileMenu);