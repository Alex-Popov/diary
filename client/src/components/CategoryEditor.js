import React, {useEffect, useState, useCallback, useMemo, useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import flattenDeep from 'lodash/flattenDeep';
import sample from 'lodash/sample';

import { context } from '../context/AppContext';
import { hideLoading, showLoading } from '../store/loading';
import { loadCategories, selectCategoriesSorted } from '../store/categories';
import {addErrorAlert, addSuccessAlert} from '../store/alerts';

import API from '../core/api';

import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import './HexColorPicker.css';
import css from './CategoryEditor.module.css';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CategoryButton from './CategoryButton';
import Typography from '@material-ui/core/Typography';
import CategoryChip from './CategoryChip';
import Palette, {colors} from './Palette';

const colorsFlat = flattenDeep(colors);



const CategoryButtonsList = React.memo(function CategoryButtonsList({items, onClick, currentId}) {
    return <div className="row no-gutters mx-n1">
        {items.filter(c => c.id !== currentId).map(c => (
            <div key={c.id} className="col-12 col-sm-6 px-1 mb-2">
                <CategoryButton
                    color={c.color}
                    onClick={e => onClick(c.color)}
                    size="small"
                    className={`on-hover_trigger ${css.button}`}
                >
                    {c.name}
                </CategoryButton>
            </div>
        ))}
    </div>
});



function CategoryEditor() {
    const categories = useSelector(selectCategoriesSorted);
    const dispatch = useDispatch();

    // editor state by context
    const { categoryEditor: {id, show} } = useContext(context.state);
    const { resetCategoryEditor, setShowCategoriesManager } = useContext(context.setters);
    const isEdit = useMemo(() => !isNil(id), [id]);

    //
    // form state
    //
    const [name, setName] = useState('');
    const [color, setColor] = useState(sample(colorsFlat));
    const disableSave = (!name.trim() || !color);

    //
    // init data
    //
    useEffect(() => {
        if (!show) return;

        if (isEdit) {
            const category = categories.find(c => c.id === id);

            if (!category) {
                dispatch(addErrorAlert('Invalid ID'));
                return;
            }

            setName(category.name);
            setColor(category.color);

        } else {
            setName('');
            setColor(sample(colorsFlat));
        }
    }, [id, show, isEdit, categories, dispatch]);

    //
    // handlers
    //
    const closeModal = useCallback(() => {
        resetCategoryEditor();
        setShowCategoriesManager(true);
    }, [resetCategoryEditor, setShowCategoriesManager]);

    const handleSubmit = e => {
        e.preventDefault();

        dispatch(showLoading());
        API.category.save({
            id,
            name,
            color
        })
            .then(() => {
                dispatch(addSuccessAlert('Категория успешно сохранена'));
                dispatch(loadCategories());
                closeModal();
            })
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    };


    return (
        <Dialog
            open={show}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xl"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>{isEdit ? 'Редактирование категории' : 'Создание категории'}</DialogTitle>

            <DialogContent dividers>
                <div className="row no-gutters">
                    <div className="col-12 col-md-4 pt-2 pt-md-1 pb-3 px-3">
                        <TextField
                            label="Имя"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required

                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            label="Цвет"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            required

                            variant="outlined"
                            margin="normal"
                            fullWidth
                        />
                        <div className={`d-flex flex-column align-items-center justify-content-center ${css.preview}`}>
                            <Typography variant="overline" color="textSecondary" className={css.previewLabel}>Предпросмотр</Typography>

                            <CategoryButton color={color}>{name.trim() || 'Имя категории'}</CategoryButton>
                            <CategoryChip color={color} label={name.trim() || 'Имя категории'} className="mt-3" />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 pr-3 pl-3 pl-md-0 pb-3 pt-2 pt-md-3 px-3">
                        <HexColorPicker color={color} onChange={setColor} />
                        <div className="mt-3">
                            <Palette onSelect={setColor} />
                        </div>
                    </div>
                    <div className={`col-12 col-md-4 py-3 px-3 ${css.paletteButtonsSection}`}>
                        <CategoryButtonsList items={categories} onClick={setColor} currentId={id} />
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={closeModal}>Отменить</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={disableSave}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}


export default CategoryEditor;