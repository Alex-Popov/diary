import React, {useCallback, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {addErrorAlert, addSuccessAlert} from '../store/alerts';
import {hideLoading, showLoading} from '../store/loading';
import API from '../core/api';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CategoryChipList from './CategoryChipList';
import Formatter from './Formatter';
import {DATE_FORMAT} from '../core/formatter';
import Skeleton from '@material-ui/lab/Skeleton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FileTile from './FileTile';




function Post({ id }) {
    const dispatch = useDispatch();
    let history = useHistory();

    //
    // form state
    //
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    //
    // init data
    //
    useEffect(() => {
        if (!id) {
            dispatch(addErrorAlert('Invalid ID'));
            return;
        }

        setLoading(true);
        API.post.getById(id)
            .then(data => {
                console.log(data);
                if (!data) {
                    dispatch(addErrorAlert('Invalid ID'));
                    return;
                }
                setData(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false))

    }, [id, dispatch]);


    //
    // handlers
    //
    const handleDelete = useCallback(id => () => {
        dispatch(showLoading());
        API.post.deleteById(id)
            .then(() => {
                dispatch(addSuccessAlert('Пост успешно удален'));
                history.push('/');
            })
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    }, [dispatch, history]);



    //
    // return
    //
    if (loading)
        return <div className="p-4">
            <Skeleton type="rect" height={60} />
            <div className="d-flex mt-2 mb-5">
                {[...Array(3).keys()].map(i => (
                    <Skeleton key={i} variant="circle" width={30} height={30} className="ml-2" />
                ))}
            </div>

            <div className="mb-5">
                {[...Array(5).keys()].map(i => (
                    <Skeleton key={i} variant="text" className="my-3" />
                ))}
            </div>
            <div className="mb-5">
                {[...Array(5).keys()].map(i => (
                    <Skeleton key={i} variant="text" className="my-3" />
                ))}
            </div>
        </div>;

    if (!loading && data)
        return (
            <div className="p-4">
                <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1">
                        <Typography variant="body2" color="textSecondary" component="div">
                            <Formatter format={DATE_FORMAT}>{data.date}</Formatter>
                        </Typography>
                        <Typography variant="h2" className="mb-4">{data.title}</Typography>

                        <CategoryChipList categories={data.categories} />
                    </div>

                    <div className="d-flex flex-column">
                        <IconButton
                            color="inherit"
                            disableRipple
                            component={Link}
                            to="/"
                        >
                            <CloseIcon />
                        </IconButton>

                        <IconButton
                            color="inherit"
                            disableRipple
                            component={Link}
                            to={`/edit/${id}`}
                        >
                            <EditIcon />
                        </IconButton>

                        <IconButton
                            color="inherit"
                            disableRipple
                            onClick={handleDelete(id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>

                </div>

                <div
                    className="mt-5"
                    dangerouslySetInnerHTML={{__html: data.body}}
                />

                {data.attachments && <div className="row">
                    {data.attachments.map(a => (
                        <div key={a.id} className="col-6 col-sm-3 col-lg-4 col-xl-2 py-3">
                            <FileTile
                                id={a.id}
                                fileName={a.fileName}
                                mimeType={a.mimeType}
                            />
                        </div>
                    ))}
                </div>}
            </div>
        );

    return null;
}

export default React.memo(Post);