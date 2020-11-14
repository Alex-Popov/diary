import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addErrorAlert } from '../store/alerts';
import API from '../core/api';

import css from './Post.module.css';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CategoryChipList from './CategoryChipList';
import Formatter from './Formatter';
import {DATE_FORMAT} from '../core/formatter';
import Skeleton from '@material-ui/lab/Skeleton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';



function Post() {
    const dispatch = useDispatch();
//    let history = useHistory();

    // editor state by context
    let { id } = useParams();

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
                            <EditRoundedIcon />
                        </IconButton>

                        <IconButton
                            color="inherit"
                            disableRipple
                        >
                            <DeleteRoundedIcon />
                        </IconButton>
                    </div>

                </div>

                <div
                    className="mt-5"
                    dangerouslySetInnerHTML={{__html: data.body}}
                />
            </div>
        );

    return null;
}

export default Post;