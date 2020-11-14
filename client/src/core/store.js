import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from '../store/auth';
import { categoriesReducer } from '../store/categories';
import { loadingReducer } from '../store/loading';
import { postDatesReducer } from '../store/postDates';
import { alertsReducer } from '../store/alerts';


const store = createStore(
    combineReducers({
        auth: authReducer,
        categories: categoriesReducer,
        loading: loadingReducer,
        postDates: postDatesReducer,
        alerts: alertsReducer
    }),
    applyMiddleware(thunk)
);

export default store;