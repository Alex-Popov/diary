import React, {useCallback, useContext} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectCategoriesSorted, selectLoading, loadCategories } from '../store/categories';
import { context } from '../context/AppContext';
import API from '../core/api';
import { hideLoading, showLoading } from '../store/loading';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import CategoryButton from './CategoryButton';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';



function CategoriesManager() {
    const categories = useSelector(selectCategoriesSorted);
    const loading = useSelector(selectLoading);
    const dispatch = useDispatch();

    const { setCategoryEditorOpen, setCategoryEditorId } = useContext(context.setters);

    //
    // handlers
    //
    const handleCreate = useCallback(() => {
        setCategoryEditorId(null);
        setCategoryEditorOpen(true);
    }, [setCategoryEditorId, setCategoryEditorOpen]);

    const handleEdit = useCallback(id => () => {
        setCategoryEditorId(id);
        setCategoryEditorOpen(true);
    }, [setCategoryEditorId, setCategoryEditorOpen]);

    const handleDelete = useCallback(id => () => {
        dispatch(showLoading());
        API.category.deleteById(id)
            .then(() => dispatch(loadCategories()))
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    }, [dispatch]);


    return (
        <div>
            <Button
                fullWidth
                variant="outlined"
                onClick={handleCreate}
                className="mt-3 mb-3"
                startIcon={<PlaylistAddIcon />}
            >Добавить категорию</Button>

            {loading && <CategoriesLoadingSkeleton />}

            {!loading && categories.map(c => (
                <div key={c.id} className="d-flex align-items-center py-1">
                    <CategoryButton
                        color={c.color}
                        className="mr-2"
                        disableElevation
                    >{c.name}</CategoryButton>

                    <IconButton color="inherit" disableRipple onClick={handleEdit(c.id)} size="small">
                        <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="inherit" disableRipple onClick={handleDelete(c.id)} size="small">
                        <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                </div>
            ))}
        </div>
    );
}

export default React.memo(CategoriesManager);