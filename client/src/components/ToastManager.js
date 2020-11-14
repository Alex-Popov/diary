import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlerts, clearAll } from '../store/alerts';

import css from './ToastManager.module.css';
import Toast from '../components/Toast';
import Button from '@material-ui/core/Button';


function ToastManager() {
    const alerts = useSelector(selectAlerts);
    const dispatch = useDispatch();

    return (
        <div className={`d-flex flex-column align-items-center justify-content-center ${css.position} ${css.container}`}>
            {alerts.map(a => (
                <Toast
                    key={a.id}
                    id={a.id}
                    severity={a.severity}
                    delay={a.delay}
                    message={a.message}
                />
            ))}

            {alerts.length > 2 && (
                <Button
                    className={css.clearButton}
                    variant="contained"
                    onClick={() => dispatch(clearAll())}
                >Очистить</Button>
            )}
        </div>
    );
};

export default React.memo(ToastManager);