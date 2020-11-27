import React, {useCallback, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import CategoriesSelector from './CategoriesSelector';
import CategoriesManager from './CategoriesManager';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import IconButtonStateful from './IconButtonStateful';

const useStyles = makeStyles((theme) => ({
    manageModeOn: {
        position: 'relative',
        zIndex: 1,
        boxShadow: theme.shadows[8],
        backgroundColor: '#dfe7ef'
    },
}));



function SidebarCategories({ categories, setCategories }) {
    const [manageMode, setManageMode] = useState(false);
    const { manageModeOn } = useStyles();

    //
    // handlers
    //
    const handleToggleManage = useCallback(() => {
        setManageMode(m => !m);
    }, [setManageMode]);

    const handleClear = useCallback(() => {
        setCategories([]);
    }, [setCategories]);


    return (
        <div className={`px-4 py-3 flex-grow-1 ${manageMode && manageModeOn}`}>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="icon-placeholder_def-sm">
                    <IconButtonStateful
                        color="inherit"
                        onClick={handleToggleManage}
                        size="small"
                        isActive={manageMode}
                    >
                        <SettingsIcon />
                    </IconButtonStateful>
                </div>

                <div className="flex-grow-1 text-align_center">
                    <Typography variant="h4">Категории</Typography>
                </div>

                <div className="icon-placeholder_def-sm">
                    {!!categories.length && !manageMode &&
                    <IconButton
                        color="inherit"
                        disableRipple
                        onClick={handleClear}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                    }
                </div>
            </div>

            {manageMode && <CategoriesManager />}
            {!manageMode && <CategoriesSelector value={categories} onChange={setCategories} />}
        </div>
    );
}


export default React.memo(SidebarCategories);