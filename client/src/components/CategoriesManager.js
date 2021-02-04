import React, {useContext} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectCategoriesSorted, selectLoading, loadCategories } from '../store/categories';
import { context } from '../context/AppContext';
import API from '../core/api';
import { hideLoading, showLoading } from '../store/loading';
import {addSuccessAlert} from '../store/alerts';
import css from './CategoriesManager.module.css';
import { usePrompt } from './Prompt';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CategoryButton from './CategoryButton';
import CategoriesLoadingSkeleton from './CategoriesLoadingSkeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';



function CategoriesManager() {
    const categories = useSelector(selectCategoriesSorted);
    const loading = useSelector(selectLoading);
    const dispatch = useDispatch();

    const { setCategoryEditor, resetShowCategoriesManager } = useContext(context.setters);
    const { showCategoriesManager } = useContext(context.state);


    //
    // handlers
    //
    const handleCreate = () => {
        setCategoryEditor({
            show: true,
            id: null
        });
        resetShowCategoriesManager();
    };

    const handleEdit = id => () => {
        setCategoryEditor({
            show: true,
            id
        });
        resetShowCategoriesManager();
    };

    const handleDelete = usePrompt(
        'Вы действительно хотите удалить категорию?',
        id => {
            dispatch(showLoading());
            API.category.deleteById(id)
                .then(() => {
                    dispatch(addSuccessAlert('Категория успешно удалена'));
                    dispatch(loadCategories());
                })
                .catch(() => {})
                .finally(() => dispatch(hideLoading()))
        }
    );


    return (
        <Dialog
            open={showCategoriesManager}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>Категории</DialogTitle>

            <DialogContent className="py-1" dividers>
                {loading && (
                    <div className="px-4 py-2">
                        <CategoriesLoadingSkeleton />
                    </div>
                )}

                {!loading && categories.map(c => (
                    <div key={c.id} className={`d-flex align-items-center py-2 pl-4 pr-3 ${css.row}`}>
                        <CategoryButton
                            color={c.color}
                            className={css.button}
                            disableElevation
                            size="small"
                        >{c.name}</CategoryButton>

                        <IconButton
                            onClick={handleEdit(c.id)}
                            color="inherit"
                            size="small"
                            className={css.action}
                        >
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(c.id)}
                            color="inherit"
                            size="small"
                            className={css.action}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </div>
                ))}
            </DialogContent>

            <DialogActions className="justify-content-between">
                <Button
                    variant="outlined"
                    onClick={handleCreate}
                >Добавить категорию</Button>

                <Button onClick={resetShowCategoriesManager}>Отменить</Button>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(CategoriesManager);