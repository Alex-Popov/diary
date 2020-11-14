import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../store/loading';
import { addSuccessAlert, addErrorAlert } from '../store/alerts';
import {context} from '../context/AppContext';
import API from '../core/api';

import sidebarCss from '../components/Sidebar.module.css';
import headerCss from '../components/Header.module.css';
import css from './Editor.module.css';

import DatePicker from '../components/DatePicker';
import CategoriesSelector from '../components/CategoriesSelector';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RichText from '../components/RichText';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import IconButton from '@material-ui/core/IconButton';



const FormActions = React.memo(function FormActions({onSubmit, disableSave}) {
    return (
        <div className="d-flex justify-content-between justify-content-md-end align-items-center align-right px-4 py-3">
            <Button
                disableRipple
                component={Link}
                to="/"
            >
                Отменить
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                disabled={disableSave}
                className="ml-2"
            >
                Сохранить
            </Button>
        </div>
    );
});



function Editor() {
    const dispatch = useDispatch();
    const { setCategoryEditorOpen, setCategoryEditorId } = useContext(context.setters);
    let history = useHistory();

    // editor state by context
    let { id } = useParams();

    //
    // form state
    //
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categories, setCategories] = useState([]);
    const [date, setDate] = useState(null);
    const disableSave = (!title.trim() || !date);

    //
    // init data
    //
    useEffect(() => {
        if (id) {
            dispatch(showLoading());
            API.post.getById(id)
                .then(data => {
                    if (!data) {
                        dispatch(addErrorAlert('Invalid ID'));
                        return;
                    }

                    setTitle(data.title);
                    setBody(data.body);
                    setCategories(data.categories.map(c => c.id));
                    setDate(new Date(data.date));
                })
                .catch(() => {})
                .finally(() => dispatch(hideLoading()))

        } else {
            setTitle('');
            setBody('');
            setCategories([]);
            setDate(new Date());
        }
    }, [id, dispatch]);


    //
    // submit
    //
    const handleSubmit = e => {
        e.preventDefault();

        dispatch(showLoading());
        API.post.save({
            id,
            title,
            body,
            date,
            categories
        })
            .then(id => {
                dispatch(addSuccessAlert('Пост успешно сохранен'));
                history.push(`/edit/${id}`);
            })
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    };

    //
    // handlers
    //
    const handleCreateCategory = useCallback(() => {
        setCategoryEditorId(null);
        setCategoryEditorOpen(true);
    }, [setCategoryEditorId, setCategoryEditorOpen]);




    return (
        <div className="d-block d-md-flex">
            <div className={`d-none d-md-block flex-shrink-0 ${sidebarCss.width}`}></div>

            <div className="flex-grow-1 container-max_medium py-1">
                <FormActions onSubmit={handleSubmit} disableSave={disableSave} />
                <Divider className="d-md-none" />

                <div className="px-4 pb-4 pt-2 py-xl-1">
                    <TextField
                        label="Заголовок"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required

                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                    <div className="pt-2">
                        <RichText
                            label="Текст"
                            value={body}
                            onChange={setBody}
                        />
                    </div>
                </div>

                <div className={`${css.sidebarRight} ${css.sidebarRightWidth}`}>
                    <div className="px-4 py-3">
                        <Typography variant="h4" className="mb-2 align-center">Attachments</Typography>
                    </div>
                </div>

                <div className={`${css.sidebarLeft} ${sidebarCss.width}`}>
                    <div className="px-4 py-3">
                        <Typography variant="h4" className="mb-2 align-center">Дата</Typography>
                        <div className="container_max-sm container_center">
                            <DatePicker selected={date} onChange={setDate} />
                        </div>
                    </div>
                    <Divider />
                    <div className="px-4 pt-3 pb-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <IconButton
                                color="inherit"
                                disableRipple
                                onClick={handleCreateCategory}
                                size="small"
                            >
                                <PlaylistAddIcon />
                            </IconButton>

                            <div className="flex-grow-1 align-center">
                                <Typography variant="h4">Категории</Typography>
                            </div>
                            <div className="icon-placeholder_def-sm"></div>
                        </div>

                        <CategoriesSelector value={categories} onChange={setCategories} />
                    </div>
                </div>

                <Divider className="d-md-none" />
                <FormActions onSubmit={handleSubmit} disableSave={disableSave} />
            </div>

            <div className={`d-none d-xl-block flex-shrink-0 ${css.sidebarRightWidth}`}></div>
        </div>
    );
}


export default Editor;