import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { useDispatch } from 'react-redux';
import {addErrorAlert, addSuccessAlert} from '../store/alerts';
import { nanoid } from '@reduxjs/toolkit';
import { ACCEPTED_FILES } from '../const';

import API from '../core/api';
import css from './Attachments.module.css';

import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';
import Dropzone from './Dropzone';
import FileUploader from './FileUploader';
import EmptyData from './EmptyData';
import FileTile from './FileTile';




const gridItemClasses = 'col-6 col-sm-4 col-md-3 col-xl-4 py-3';

function Attachments({ parentEntity, parentId }) {
    const dispatch = useDispatch();

    //
    // form state
    //
    const [data, setData] = useState([]);
    const [uploaders, setUploaders] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeoutId = useRef(0);

    const hasErrors = useMemo(() => uploaders.some(u => u.isFailed), [uploaders]);


    //
    // data loader
    //
    const fetchData = useCallback(() => {
        if (!parentEntity || !parentId) {
            dispatch(addErrorAlert('Invalid Parent settings'));
            return;
        }

        return API.attachment.getAllByParent(parentEntity, parentId)
            .then(data => setData(data))
            .catch(() => {})

    }, [parentEntity, parentId, dispatch]);

    // init
    useEffect(() => {
        async function asyncFetchData() {
            setLoading(true);
            await fetchData();
            setLoading(false);
        }
        asyncFetchData();
    }, [fetchData])


    //
    // handlers
    //
    const onDrop = useCallback(files => {
        setUploaders(uu => [
            ...uu,
            ...files.map(f => ({
                id: 'uploader_'+nanoid(),
                file: f
            }))
        ]);
    }, []);

    const handleUploadSuccess = useCallback(id => {
        setUploaders(uu => uu.filter(u => u.id !== id));

        // load data
        clearInterval(timeoutId.current);
        timeoutId.current = setTimeout(() => {
            fetchData();
        } , 1000);
    }, [fetchData]);

    const handleUploadFail = useCallback(id => {
        setUploaders(uu => uu.map(u => {
            if (u.id === id)
                return {
                    ...u,
                    isFailed: true
                }
            return u;
        }));
    }, []);

    const handleClearErrors = useCallback(() => {
        setUploaders(uu => uu.filter(u => !u.isFailed));
    }, []);

    const handleDelete = useCallback(id => e => {
        e.preventDefault();

        API.attachment.deleteById(id)
            .then(() => {
                dispatch(addSuccessAlert('Вложение успешно удалено'));
                fetchData();
            })
            .catch(() => {})
    }, [fetchData, dispatch]);



    //
    // return
    //
    return <>
        <Dropzone onDrop={onDrop} accept={ACCEPTED_FILES} />

        {!!uploaders.length && <div className="b-b mb-3 pb-3">
            <div className="row mt-4">
                {uploaders.map(u => (
                    <div key={u.id} className={gridItemClasses}>
                        <FileUploader
                            file={u.file}
                            parentEntity={parentEntity}
                            parentId={parentId}

                            onSuccess={() => handleUploadSuccess(u.id)}
                            onFail={() => handleUploadFail(u.id)}
                        />
                    </div>
                ))}
            </div>
            {hasErrors && <div className="text-align_center">
                <Button
                    onClick={handleClearErrors}
                    className="mt-3"
                    size="small"
                    startIcon={<CloseIcon fontSize="small" />}
                >Очистить ошибки</Button>
            </div>}
        </div>}
        
        <div className="row mt-4">
            {loading && [...Array(3).keys()].map(i => (
                <div key={i} className={gridItemClasses}>
                    <Skeleton variant="rect" height={110} />
                </div>
            ))}

            {data.map(a => (
                <div key={a.id} className={gridItemClasses}>
                    <div className={css.item} onClick={handleDelete(a.id)}>
                        <FileTile
                            id={a.id}
                            fileName={a.fileName}
                            mimeType={a.mimeType}
                        />
                        <div className={`d-flex align-items-center justify-content-center ${css.remove}`}>
                            <CloseIcon />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {!loading && !data.length && <EmptyData>Ни одного файла не загружено</EmptyData>}

    </>;
}

export default React.memo(Attachments);