import React, {useEffect, useCallback} from 'react';

import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { selectCategories, selectLoading } from '../store/categories';
import css from './CategoriesSelector.module.css';

import Divider from '@material-ui/core/Divider';
import CategoryButton from './CategoryButton';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import EmptyData from './EmptyData';


const CategoryButtonsList = React.memo(function CategoryButtonsList({items, onClick, isSelected}) {
    return items.map(c => (
        <div key={c.id} className="py-1">
            <CategoryButton
                color={c.color}
                onClick={onClick(c.id)}
                disableElevation={!isSelected}
            >{c.name}</CategoryButton>
        </div>
    ))
})


function CategoriesSelector({ value, onChange }) {
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);

    //
    // lists
    //
    const selectedCategories = sortBy(
        categories.filter(c => value.includes(c.id)),
        'name'
    );
    const hasSelected = selectedCategories.length > 0;

    const availableCategories = sortBy(
        categories.filter(c => !value.includes(c.id)),
        'name'
    );
    const allSelected = !availableCategories.length;

    //
    // handlers
    //
    const handleSelect = useCallback(id => () => {
        onChange(v => [...v, id]);
    }, [onChange]);
    const handleUnselect = useCallback(id => () => {
        onChange(v => v.filter(i => i !== id));
    }, [onChange]);

    //
    // reset selected on categories update
    //
    useEffect(() => {
        onChange(v => {
            if (!v.length) {
                return v; // do nothing if no categories selected

            } else {
                return v.filter(id => categories.some(c => c.id === id));
            }
        });
    }, [onChange, categories]);


    //
    // render
    //

    if (loading) return <CategoriesLoadingSkeleton />;

    return (<>
        <div className={css.available}>
            {!hasSelected && <EmptyData>Ничего не выбрано</EmptyData>}
            {hasSelected && <div className={css.list}>
                <CategoryButtonsList items={selectedCategories} onClick={handleUnselect} isSelected />
            </div>}
        </div>
        <Divider className="my-3" />
        <div className={css.selected}>
            {allSelected && <EmptyData>Все выбрано</EmptyData>}
            {!allSelected && <div className={css.list}>
                <CategoryButtonsList items={availableCategories} onClick={handleSelect} />
            </div>}
        </div>
    </>);
}

export default React.memo(CategoriesSelector);