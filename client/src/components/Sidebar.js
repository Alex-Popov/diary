import React, { useContext, useEffect, useState } from 'react';

import { context } from "../context/AppContext";
import css from './Sidebar.module.css';

import useDisableBodyScroll from '../hooks/useDisableBodyScroll';
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import TuneRoundedIcon from '@material-ui/icons/TuneRounded';



function Sidebar(props) {
    // open state of Sidebar
    const [open, setOpen] = useState(false);

    // disable body scroll
    useDisableBodyScroll(open);

    // mount toolbar icon into Header
    const { setHeaderToolbar } = useContext(context.setters);
    useEffect(() => {
         setHeaderToolbar(
            <IconButton
                color="inherit"
                size="small"
                onClick={() => setOpen(true)}
                className="d-md-none mr-auto"
            >
                <TuneRoundedIcon />
            </IconButton>
        );

        return () => setHeaderToolbar(null);
    }, [setHeaderToolbar]);


    return (
        <div className={[
            css.sidebar,
            'vertical-scroll',
            open ? css.open : ''
        ].join(' ')}>
            <div className="d-md-none d-flex flex-shrink-0 justify-content-end align-items-center p-2">
                <IconButton onClick={() => setOpen(false)}>
                    <CheckIcon />
                </IconButton>
            </div>

            {props.children}
        </div>
    );
}


export default Sidebar;