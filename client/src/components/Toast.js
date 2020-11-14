import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { deleteAlert } from '../store/alerts';

import Alert from '@material-ui/lab/Alert';
import InfoIcon from '@material-ui/icons/Info';
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded';
import BlockRoundedIcon from '@material-ui/icons/BlockRounded';
import CheckIcon from '@material-ui/icons/Check';


const ICONS = {
    info: <InfoIcon fontSize="inherit" />,
    warning: <ReportProblemRoundedIcon fontSize="inherit" />,
    error: <BlockRoundedIcon fontSize="inherit" />,
    success: <CheckIcon fontSize="inherit" />
}

function Toast({id, severity, message, delay}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!delay) return; // fixed toast

        const timeoutId = setTimeout(() => {
            dispatch(deleteAlert(id));
        }, delay);
        return () => clearInterval(timeoutId);
    }, [dispatch, id, delay]);

    return (
        <Alert
            severity={severity}
            onClose={() => dispatch(deleteAlert(id))}
            icon={ICONS[severity]}
            variant="filled"
            elevation={6}
        >{message}</Alert>
    );
}

export default React.memo(Toast);