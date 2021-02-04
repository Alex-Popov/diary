import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../store/loading';
import { addSuccessAlert, addErrorAlert } from '../store/alerts';
import {loadPostDates} from '../store/postDates';
import API from '../core/api';
import { ENTITY_POST } from '../const';
import { quillDecodeIndent, quillEncodeIndent } from '../utils/quill-fix-indent.ts';

import sidebarCss from '../components/Sidebar.module.css';
import css from './Editor.module.css';

import DatePicker from '../components/DatePicker';
import CategoriesSelector from '../components/CategoriesSelector';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RichText from '../components/RichText';
import Alert from '@material-ui/lab/Alert';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Attachments from '../components/Attachments';



const renderFormActions = (id, onSubmit, disableSave) => (
    <div className="d-flex justify-content-between justify-content-md-end align-items-center text-align_right px-4 py-3">
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



    return (<>
        {renderFormActions(id, handleSubmit, disableSave)}

        <div className="d-block d-md-flex b-y">
            <div className="flex-grow-1 order-0 order-md-1 d-block d-xl-flex no-gutters">
                <div className="flex-grow-1 px-4 pb-4 pt-2 pt-xl-1">
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
                    <div className="px-4 py-3">
                        <Typography variant="h4" className="mb-3 text-align_center">Вложения</Typography>

                        {id
                            ? <Attachments
                                parentEntity={ENTITY_POST}
                                parentId={id}
                            />
                            : <Alert
                                severity="warning"
                                variant="outlined"
                                icon={<InsertDriveFileIcon fontSize="large" />}
                                className="flex-column align-items-center text-align_center"
                            >Чтобы добавлять вложения, сначала сохраните пост</Alert>
                        }
                    </div>
                </div>
            </div>

            <div className={`order-1 order-md-0 flex-shrink-0 ${css.sidebarLeft} ${sidebarCss.width}`}>
                <div className="px-3 py-3 b-b">
                    <Typography variant="h4" className="mb-2 text-align_center">Дата</Typography>
                    <div className="container_max-sm container_center">
                        <DatePicker selected={date} onChange={setDate} />
                    </div>
                </div>
                <div className="px-3 pt-3 pb-4">
                    <CategoriesSelector value={categories} onChange={setCategories} />
                </div>
            </div>
        </div>

        {renderFormActions(id, handleSubmit, disableSave)}
    </>);
}

export default Editor;