const { ROLE_ADMIN, ROLE_USER } = require('../roles');


// reexport roles
export {
    ROLE_ADMIN,
    ROLE_USER
};


//
// Action Types
//
const AUTH_SET_SESSION = 'auth/setSession';
const AUTH_DESTROY_SESSION = 'auth/removeSession';
const AUTH_MARK_SESSION_AS_EXPIRED = 'auth/markSessionAsExpired';

//
// Initial State
//
const EMPTY_SESSION = {
    sessionId: null,
    userId: null,
    userRole: null
}
const INITIAL_STATE = {
    ...EMPTY_SESSION,
    isAuthenticated: false,
    isExpired: false
}

//
// Reducer
//
export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AUTH_SET_SESSION:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };

        case AUTH_DESTROY_SESSION:
            return {
                ...state,
                ...EMPTY_SESSION,
                isAuthenticated: false
            };

        case AUTH_MARK_SESSION_AS_EXPIRED:
            return {
                ...state,
                ...EMPTY_SESSION,
                isExpired: true
            };

        default:
            return state;
    }
}

//
// Action Creators
//
const prepareSessionPayload = (sessionId, userId, userRole) => ({
    sessionId,
    userId,
    userRole
});

export const setSession = (sessionId, userId, userRole) => ({
    type: AUTH_SET_SESSION,
    payload: prepareSessionPayload(sessionId, userId, userRole)
});
export const destroySession = () => ({
    type: AUTH_DESTROY_SESSION
});
export const markSessionAsExpired = () => ({
    type: AUTH_MARK_SESSION_AS_EXPIRED
});


//
// Selectors
//

export const selectSessionId = state => state.auth.sessionId;
export const selectUserId = state => state.auth.userId;
export const selectUserRole = state => state.auth.userRole;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectIsExpired = state => state.auth.isExpired;