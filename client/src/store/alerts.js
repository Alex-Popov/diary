import { nanoid } from '@reduxjs/toolkit';
import curry from 'lodash/curry';


const ALERT_SEVERITY_INFO = 'info';
const ALERT_SEVERITY_WARNING = 'warning';
const ALERT_SEVERITY_ERROR = 'error';
const ALERT_SEVERITY_SUCCESS = 'success';

//
// Action Types
//
const ALERTS_ADD_ALERT = 'alerts/addAlert';
const ALERTS_DELETE_ALERT = 'alerts/deleteAlert';
const ALERTS_CLEAR_ALL = 'alerts/clearAll';

//
// Initial State
//
const ALERT_INTERFACE = {
    id: nanoid(),
    severity: ALERT_SEVERITY_INFO,
    message: '',
    delay: 0
}
const INITIAL_STATE = {
    alerts: []
}

//
// Reducer
//
export const alertsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALERTS_ADD_ALERT:
            return {
                ...state,
                alerts: [
                    ...state.alerts,
                    action.payload
                ]
            };

        case ALERTS_DELETE_ALERT:
            return {
                ...state,
                alerts: state.alerts.filter(a => a.id !== action.payload)
            };

        case ALERTS_CLEAR_ALL:
            return {
                ...state,
                alerts: []
            };

        default:
            return state;
    }
}

//
// Action Creators
//

const prepareAlertPayload = (severity, delay, message) => ({
    ...ALERT_INTERFACE,
    id: nanoid(),
    severity,
    message,
    delay
});


export const addAlert = (severity, delay, message) => ({
    type: ALERTS_ADD_ALERT,
    payload: prepareAlertPayload(severity, delay, message)
});

const curriedAddAlert = curry(addAlert);
export const addInfoAlert = curriedAddAlert(ALERT_SEVERITY_INFO)(10000);
export const addWarningAlert = curriedAddAlert(ALERT_SEVERITY_WARNING)(5000);
export const addErrorAlert = curriedAddAlert(ALERT_SEVERITY_ERROR)(10000);
export const addSuccessAlert = curriedAddAlert(ALERT_SEVERITY_SUCCESS)(3000);


export const deleteAlert = (id) => ({
    type: ALERTS_DELETE_ALERT,
    payload: id
});
export const clearAll = () => ({
    type: ALERTS_CLEAR_ALL
});

//
// Selectors
//

export const selectAlerts = state => state.alerts.alerts;
