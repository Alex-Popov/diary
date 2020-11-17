import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsExpired } from '../store/auth';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Alert from '@material-ui/lab/Alert';

import LoginForm from './LoginForm';
import UpdateIcon from '@material-ui/icons/Update';


function ExpiredSessionDialog() {
    const isExpired = useSelector(selectIsExpired);

    return (
        <Dialog
            open={isExpired}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
        >
            <DialogContent className="p-4">
                <Alert
                    severity="warning"
                    icon={<UpdateIcon fontSize="large" />}
                    className="align-items-center mb-4"
                >
                    Похоже, что ваша сессия истекла.<br/>
                    Авторизуйтесь, чтобы продолжить работу.
                </Alert>

                <LoginForm />
            </DialogContent>
        </Dialog>
    );
}


export default React.memo(ExpiredSessionDialog);