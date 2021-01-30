import React, {useEffect, useState, useRef} from 'react';

import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { selectCategories, selectLoading } from '../store/categories';
import css from './CategoriesSelector.module.css';

import Divider from '@material-ui/core/Divider';
import CategoryButton from './CategoryButton';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import EmptyData from './EmptyData';


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

    //
    // buffer for timeout
    //
    const [valueBuffer, setValueBuffer] = useState(value);
    useEffect(() => {
        setValueBuffer(value);
    }, [setValueBuffer, value]);

    const timeoutIdRef = useRef(0);


    //
    // exit while loading
    //
    if (loading) return <CategoriesLoadingSkeleton />;



    // lists
    const selectedCategories = sortBy(
        categories.filter(c => valueBuffer.includes(c.id)),
        'name'
    );
    const hasSelected = selectedCategories.length > 0;

    const availableCategories = sortBy(
        categories.filter(c => !valueBuffer.includes(c.id)),
        'name'
    );
    const allSelected = !availableCategories.length;


    // handlers
    const handleClick = isSelect => id => {
        const newValueBuffer = isSelect ? [...valueBuffer, id] : valueBuffer.filter(i => i !== id);

        setValueBuffer(newValueBuffer);

        clearInterval(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
            onChange(newValueBuffer);
        } , 1000);
    };


    return (<>
        <div className={css.available}>
            {!hasSelected && <EmptyData>Ничего не выбрано</EmptyData>}
            {hasSelected && renderButtonsList(selectedCategories, handleClick(false), true)}
        </div>
        <Divider className="my-3" />
        <div className={css.selected}>
            {allSelected && <EmptyData>Все выбрано</EmptyData>}
            {!allSelected && renderButtonsList(availableCategories, handleClick(true))}
        </div>
    </>);
}

export default React.memo(CategoriesSelector);