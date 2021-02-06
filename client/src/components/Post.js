import React, {useCallback, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import {addErrorAlert, addSuccessAlert} from '../store/alerts';
import {hideLoading, showLoading} from '../store/loading';
import API from '../core/api';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { FILE_TYPE_IMAGES, URL_ATTACHMENT_FILE } from '../const';
import { usePrompt } from './Prompt';
import saveFile from '../utils/save-file';
import css from './Post.module.css';

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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ImageViewer from './ImageViewer';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';



const renderSkeleton = () => (
    <div className="p-4">
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
    </div>
);




function Post({id, onDelete}) {
    const dispatch = useDispatch();
    let history = useHistory();

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

                data.attachments.forEach(a => {
                    a.isImage = FILE_TYPE_IMAGES.includes(a.mimeType);
                });
                data.images = data.attachments.filter(a => a.isImage).map(a => ({
                    id: a.id,
                    original: URL_ATTACHMENT_FILE+a.id,
                    thumbnail: URL_ATTACHMENT_FILE+a.id
                }));

                setData(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false))

    }, [id, dispatch]);


    //
    // handlers
    //
    const handleDelete = usePrompt(
        'Вы действительно хотите удалить пост?',
        () => {
            dispatch(showLoading());
            API.post.deleteById(id)
                .then(() => {
                    dispatch(addSuccessAlert('Пост успешно удален'));
                    history.push('/');
                    if (onDelete) onDelete();
                })
                .catch(() => {})
                .finally(() => dispatch(hideLoading()))
        }
    );
    const handleDownload = () => {
        dispatch(showLoading());
        API.post.getPDFById(id)
            .then(file => {
                saveFile(file, cyrillicToTranslit().transform(data.title, '_') +'.pdf');
            })
            .catch(() => {})
            .finally(() => dispatch(hideLoading()))
    }


    //
    // Image Gallery
    //
    const [galleryState, setGalleryState] = useState({
        show: false,
        index: 0
    });

    const handleShowGallery = useCallback(id => {
        setGalleryState({
            show: true,
            index: data.images.findIndex(img => img.id === id)
        });
    }, [data]);
    const handleHideGallery = useCallback(() => {
        setGalleryState(prevState => ({
            ...prevState,
            show: false
        }));
    }, []);



    //
    // return
    //
    if (loading)
        return renderSkeleton();

    if (!loading && data)
        return (
            <div className="p-4">
                <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1">
                        <Typography variant="subtitle1" color="textSecondary" component="div" className="mb-1">
                            <Formatter format={DATE_FORMAT}>{data.date}</Formatter>
                        </Typography>
                        <Typography variant="h1">{data.title}</Typography>

                        {data.categories.length > 0 && (
                            <div className="mt-2 hide-on-print">
                                <CategoryChipList categories={data.categories} />
                            </div>
                        )}
                    </div>

                    <div className="flex-shrink-0 d-flex flex-column hide-on-print">
                        <IconButton
                            color="inherit"
                            component={Link}
                            to="/"
                        >
                            <CloseIcon />
                        </IconButton>

                        <div className={css.actions}>
                            <IconButton color="inherit">
                                <MoreHorizIcon />
                            </IconButton>

                            <div className={css.actionsDropdown}>
                                <IconButton
                                    color="inherit"
                                    component={Link}
                                    to={`/edit/${id}`}
                                >
                                    <EditIcon />
                                </IconButton>

                                <IconButton
                                    color="inherit"
                                    onClick={handleDelete}
                                >
                                    <DeleteIcon />
                                </IconButton>

                                <IconButton
                                    color="inherit"
                                    onClick={handleDownload}
                                >
                                    <CloudDownloadIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                </div>

                <div
                    className="ql-content-view mt-4"
                    dangerouslySetInnerHTML={{__html: data.body}}
                />

                {data.attachments && <div className="row mt-4">
                    {data.attachments.map(a => (
                        <div key={a.id} className="col-6 col-sm-3 col-lg-4 col-xl-2 py-3">
                            <FileTile
                                id={a.id}
                                fileName={a.fileName}
                                mimeType={a.mimeType}
                                onClick={a.isImage ? handleShowGallery : undefined}
                            />
                        </div>
                    ))}
                </div>}

                {galleryState.show && (
                    <ImageViewer
                        items={data.images}
                        index={galleryState.index}
                        onClose={handleHideGallery}
                    />
                )}
            </div>
        );

    return null;
}

export default React.memo(Post);