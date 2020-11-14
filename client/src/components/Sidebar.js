import React, { useContext, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";

import { context } from "../context/AppContext";
import css from './Sidebar.module.css';
import headerCss from '../components/Header.module.css';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
    zindex: {
        zIndex: theme.zIndex.appBar + 1
    },
    [theme.breakpoints.up('md')]: {
        zindex: {
            zIndex: theme.zIndex.appBar - 1
        }
    }
}));



function Sidebar(props) {
    // dynamic zindex based on appBar
    const { zindex } = useStyles();

    // open state of Sidebar
    const [open, setOpen] = useState(false);

    // mount toolbar icon into Header
    const { setHeaderToolbar } = useContext(context.setters);
    useEffect(() => {
        if (!props.toolbarIcon) return;

        setHeaderToolbar(
            <IconButton color="inherit" disableRipple onClick={() => setOpen(true)} className="d-md-none">
                {props.toolbarIcon}
            </IconButton>
        );

        return () => setHeaderToolbar(null);
    }, [props.toolbarIcon, setHeaderToolbar]);

    // disable scroll in body when open
    useEffect(() => {
        if (open)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.removeProperty('overflow');
    }, [open]);



    return (
        <>
            <div className={[
                zindex,
                css.sidebar,
                open ? css.open : ''
            ].join(' ')}>
                <div className="d-md-none d-flex flex-shrink-0 justify-content-end align-items-center p-2">
                    <IconButton disableTouchRipple onClick={() => setOpen(false)}>
                        <CheckIcon />
                    </IconButton>
                </div>

                {props.children}
            </div>
            <div className={`d-none d-md-block flex-shrink-0 ${css.width}`}></div>
        </>
    );
}


export default Sidebar;