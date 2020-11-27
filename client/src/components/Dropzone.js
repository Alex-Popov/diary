import React, {useCallback, useEffect, useRef, useState} from 'react';

import css from './Dropzone.module.css';
import { useDropzone } from 'react-dropzone';
import Alert from '@material-ui/lab/Alert';


function Dropzone({ onDrop, accept, maxFiles = 10 }) {

    //
    // fullscreen dropzone
    //
    const [isFullscreen, setIsFullscreen] = useState(false);
    const lastTarget = useRef(null);

    const handleDragIn = useCallback(e => {
        lastTarget.current = e.target;
        setIsFullscreen(true);
    }, []);

    const handleDragOut = useCallback(e => {
        if (e.target === lastTarget.current || e.target === document) {
            setIsFullscreen(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('dragenter', handleDragIn);
        window.addEventListener('dragleave', handleDragOut);

        return () => {
            window.removeEventListener('dragenter', handleDragIn);
            window.removeEventListener('dragleave', handleDragOut);
        }
    });

    //
    // init dropzone
    //
    const handleDrop = useCallback(files => {
        setIsFullscreen(false);
        if (files.length > 0) onDrop(files);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxFiles
    });


    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            <div className={`d-flex align-items-center justify-content-center ${css.main}`}>
                <div className={css.label}>Перетащите сюда файлы, или кликните, чтобы открыть диалоговое окно</div>
            </div>

            {isFullscreen && (
                <div className={`d-flex align-items-center justify-content-center ${css.fullscreen} ${(isDragReject ? css.reject : '')}`}>
                    <div className={css.label}>Перетащите сюда файлы</div>

                    {isDragReject && <Alert
                        severity="error"
                        variant="filled"
                        elevation={6}
                        className={css.alert}
                    >Один или несколько файлов имеют недопустимый формат</Alert>}
                </div>
            )}
        </div>
    );
}

export default React.memo(Dropzone);