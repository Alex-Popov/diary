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

import * as materialColors from 'material-colors';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import '../theme/react-colorful-overrides.css';
import css from './CategoryEditor.module.css';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CategoryButton from './CategoryButton';
import Typography from '@material-ui/core/Typography';
import ColorizeRoundedIcon from '@material-ui/icons/ColorizeRounded';


import CategoryChip from './CategoryChip';


const colors = [
    [materialColors.red['900'], materialColors.red['700'], materialColors.red['500'], materialColors.red['300']],
    [materialColors.pink['900'], materialColors.pink['700'], materialColors.pink['500'], materialColors.pink['300']],
    [materialColors.purple['900'], materialColors.purple['700'], materialColors.purple['500'], materialColors.purple['300']],
    [materialColors.deepPurple['900'], materialColors.deepPurple['700'], materialColors.deepPurple['500'], materialColors.deepPurple['300']],
    [materialColors.indigo['900'], materialColors.indigo['700'], materialColors.indigo['500'], materialColors.indigo['300']],
    [materialColors.blue['900'], materialColors.blue['700'], materialColors.blue['500'], materialColors.blue['300']],
    [materialColors.lightBlue['900'], materialColors.lightBlue['700'], materialColors.lightBlue['500'], materialColors.lightBlue['300']],
    [materialColors.cyan['900'], materialColors.cyan['700'], materialColors.cyan['500'], materialColors.cyan['300']],
    [materialColors.teal['900'], materialColors.teal['700'], materialColors.teal['500'], materialColors.teal['300']],
    ['#194D33', materialColors.green['700'], materialColors.green['500'], materialColors.green['300']],
    [materialColors.lightGreen['900'], materialColors.lightGreen['700'], materialColors.lightGreen['500'], materialColors.lightGreen['300']],
    [materialColors.lime['900'], materialColors.lime['700'], materialColors.lime['500'], materialColors.lime['300']],
    [materialColors.yellow['900'], materialColors.yellow['700'], materialColors.yellow['500'], materialColors.yellow['300']],
    [materialColors.amber['900'], materialColors.amber['700'], materialColors.amber['500'], materialColors.amber['300']],
    [materialColors.orange['900'], materialColors.orange['700'], materialColors.orange['500'], materialColors.orange['300']],
    [materialColors.deepOrange['900'], materialColors.deepOrange['700'], materialColors.deepOrange['500'], materialColors.deepOrange['300']],
    [materialColors.brown['900'], materialColors.brown['700'], materialColors.brown['500'], materialColors.brown['300']],
    [materialColors.blueGrey['900'], materialColors.blueGrey['700'], materialColors.blueGrey['500'], materialColors.blueGrey['300']]
];
const colorsFlat = flattenDeep(colors);


const Palette = React.memo(function Palette({className, onClick}) {
    return <div className={`row no-gutters justify-content-between ${className || ''}`}>
        {colors.map(col => (
            <div key={col.join('')} className={css.paletteSection}>
                {col.map(c => (
                    <div key={c} className={css.paletteColor} style={{backgroundColor:c}} onClick={e => onClick(c)}></div>
                ))}
            </div>
        ))}
    </div>;
});


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
                    <span className="on-hover_hide">{c.name}</span>
                    <ColorizeRoundedIcon fontSize="small" className="on-hover_show" />
                </CategoryButton>
            </div>
        ))}
    </div>
})



function CategoryEditor() {
    const categories = useSelector(selectCategoriesSorted);
    const dispatch = useDispatch();

    // editor state by context
    const { categoryEditorOpen, categoryEditorId } = useContext(context.state);
    const { setCategoryEditorOpen } = useContext(context.setters);
    const isEdit = useMemo(() => !isNil(categoryEditorId), [categoryEditorId]);

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
        if (!categoryEditorOpen) return;

        if (!isNil(categoryEditorId)) {
            const category = categories.find(c => c.id === categoryEditorId);

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
    }, [categoryEditorOpen, categoryEditorId, categories, dispatch]);

    //
    // handlers
    //
    const closeModal = useCallback(() => {
        setCategoryEditorOpen(false);
    }, [setCategoryEditorOpen]);

    const handleSubmit = e => {
        e.preventDefault();

        dispatch(showLoading());
        API.category.save({
            id: categoryEditorId,
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
            open={categoryEditorOpen}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xl"
            fullWidth
            scroll="paper"
        >
            <DialogTitle>{isEdit ? 'Редактирование категории' : 'Создание категории'}</DialogTitle>

            <DialogContent dividers>
                <div className="row no-gutters">
                    <div className="col-12 col-md-4 pt-2 pb-4 px-4">
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
                    <div className="col-12 col-md-4 pr-4 pl-4 pl-md-0 pb-3 pt-2 pt-md-4 px-4">
                        <HexColorPicker color={color} onChange={setColor} />
                        <Palette onClick={setColor} className="mt-3" />
                    </div>
                    <div className={`col-12 col-md-4 py-4 px-4 ${css.paletteButtonsSection}`}>
                        <CategoryButtonsList items={categories} onClick={setColor} currentId={categoryEditorId} />
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button
                    disableRipple
                    onClick={closeModal}
                >
                    Отменить
                </Button>
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


export default React.memo(CategoryEditor);