import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../store/loading';
import { addSuccessAlert, addErrorAlert } from '../store/alerts';
import {loadPostDates} from '../store/postDates';
import API from '../core/api';
import { ENTITY_POST } from '../const';
import { quillDecodeIndent, quillEncodeIndent } from '../utils/quill-fix-indent.ts';

import css from './Editor.module.css';

import DatePicker from '../components/DatePicker';
import CategoriesSelector from '../components/CategoriesSelector';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RichText from '../components/RichText';
import Alert from '@material-ui/lab/Alert';
import LockIcon from '@material-ui/icons/Lock';
import Attachments from '../components/Attachments';



const renderFormActions = (id, onSubmit, disableSave) => (
    <div className="d-flex justify-content-between justify-content-md-end align-items-center text-align_right px-3 py-2">
        <Button
            component={Link}
            to={id ? `/post/${id}` : '/'}
        >
            Закрыть
        </Button>
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={disableSave}
            className="ml-3"
        >
            Сохранить
        </Button>
    </div>
);



function Editor() {
    const dispatch = useDispatch();
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
                    setBody(quillEncodeIndent(data.body));
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
            body: quillDecodeIndent(body),
            date,
            categories
        })
            .then(id => {
                dispatch(addSuccessAlert('Пост успешно сохранен'));
                dispatch(loadPostDates());
                history.push(`/edit/${id}`);
            })
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    };



    return (
        <div className={css.container}>
            {renderFormActions(id, handleSubmit, disableSave)}

            <div className="d-flex flex-column flex-xl-row no-gutters b-y">
                <div className="flex-grow-1 px-3 pt-2 pb-3 pt-xl-1">
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

                <div className={`col-12 col-xl-4 ${css.sidebarRight}`}>
                    <div className="px-3 py-3">
                        <Typography variant="h4" className="mb-3 text-align_center">Вложения</Typography>

                        {id
                            ? <Attachments
                                parentEntity={ENTITY_POST}
                                parentId={id}
                            />
                            :
                            <div className={`${css.lock} p-4 d-flex align-items-center justify-content-center`}>
                                <Alert
                                    severity="warning"
                                    variant="outlined"
                                    icon={<LockIcon fontSize="large" />}
                                    className={`${css.alert} flex-column align-items-center text-align_center`}
                                >
                                    Чтобы добавлять вложения, сначала сохраните пост
                                </Alert>
                            </div>
                        }
                    </div>
                </div>

                <div className={`${css.sidebarLeft} vertical-scroll ipad-scroll-fix`}>
                    <div className="px-2 pt-2 pb-3 b-b">
                        <Typography variant="h4" className="mb-1 text-align_center">Дата</Typography>
                        <div className="container_max-sm container_center">
                            <DatePicker selected={date} onChange={setDate} />
                        </div>
                    </div>
                    <div className="px-2 pt-2 pb-3">
                        <CategoriesSelector value={categories} onChange={setCategories} />
                    </div>
                </div>

            </div>

            {renderFormActions(id, handleSubmit, disableSave)}
        </div>
    );
}

export default Editor;