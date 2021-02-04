import React, {useContext} from 'react';

import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { selectCategories, selectLoading } from '../store/categories';
import css from './CategoriesSelector.module.css';
import useValueBuffer from '../hooks/useValueBuffer';

import Divider from '@material-ui/core/Divider';
import CategoryButton from './CategoryButton';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import EmptyData from './EmptyData';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import {context} from '../context/AppContext';


const renderButtonsList = (items, onClick, isSelected = false) => (
    <div className={css.list}>
        {items.map(c => (
            <div key={c.id} className="py-1">
                <CategoryButton
                    color={c.color}
                    onClick={() => onClick(c.id)}
                    disableElevation={!isSelected}
                >{c.name}</CategoryButton>
            </div>
        ))}
    </div>
);



function CategoriesSelector({ value, onChange }) {
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const [buffer, updateBuffer] = useValueBuffer(value, onChange, 1000);
    const { setShowCategoriesManager } = useContext(context.setters);


    // lists
    const selectedCategories = sortBy(
        categories.filter(c => buffer.includes(c.id)),
        'name'
    );
    const hasSelected = selectedCategories.length > 0;

    const availableCategories = sortBy(
        categories.filter(c => !buffer.includes(c.id)),
        'name'
    );
    const allSelected = !availableCategories.length;


    // handlers
    const handleClick = isSelect => id => {
        updateBuffer(isSelect
            ? [...buffer, id]
            : buffer.filter(i => i !== id)
        );
    };
    const handleManage = () => {
        setShowCategoriesManager(true);
    };
    const handleClear = () => {
        onChange([]);
    };



    return (<>
        <div className="d-flex align-items-center justify-content-between mb-2">
            <IconButton
                color="inherit"
                onClick={handleManage}
                size="small"
            >
                <SettingsIcon />
            </IconButton>

            <div className="flex-grow-1 text-align_center">
                <Typography variant="h4">Категории</Typography>
            </div>
            <div className="icon-placeholder_def-sm">
                {hasSelected && (
                    <IconButton
                        color="inherit"
                        onClick={handleClear}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </div>
        </div>

        {loading && <CategoriesLoadingSkeleton />}

        {!loading && (<>
            <div className={css.available}>
                {!hasSelected && <EmptyData>Ничего не выбрано</EmptyData>}
                {hasSelected && renderButtonsList(selectedCategories, handleClick(false), true)}
            </div>
            <Divider className="my-3" />
            <div className={css.selected}>
                {allSelected && <EmptyData>Все выбрано</EmptyData>}
                {!allSelected && renderButtonsList(availableCategories, handleClick(true))}
            </div>
        </>)}
    </>);
}

export default React.memo(CategoriesSelector);