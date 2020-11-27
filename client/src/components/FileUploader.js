import React, {useState} from 'react';

import API from '../core/api';
import css from './FileUploader.module.css';
import useMountEffect from '../hooks/useMountEffect';

import CircularProgress from '@material-ui/core/CircularProgress';
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import FileTile from './FileTile';




function FileUploader({ file, parentEntity, parentId, onSuccess, onFail }) {
    const [isSucceeded, setIsSucceeded] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [error, setError] = useState('');

    //
    // init data
    //
    useMountEffect(() => {
        API.attachment.uploadFile({
            file,
            parentEntity,
            parentId
        })
            .then(() => {
                setIsSucceeded(true);
                onSuccess();
            })
            .catch(e => {
                setError(e.message);
                setIsFailed(true);
                onFail();
            })
    });


    //
    // return
    //
    return (
        <div className={css.container}>
            <div className={css.status}>
                {!isSucceeded && !isFailed &&
                    <CircularProgress color="inherit" size="100%" />
                }

                {isSucceeded &&
                    <CheckIcon fontSize="inherit" className={css.succeeded} />
                }
                {isFailed &&
                    <Tooltip title={error}>
                        <ReportProblemRoundedIcon fontSize="inherit" className={css.failed} />
                    </Tooltip>
                }
            </div>

            <FileTile fileName={file.name} />
        </div>
    );
}

export default React.memo(FileUploader);