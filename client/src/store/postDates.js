import { batch } from 'react-redux';
import API from '../core/api';


//
// Action Types
//
const POST_DATES_SET_DATES = 'postDates/setDates';
const POST_DATES_START_LOADING = 'postDates/startLoading';
const POST_DATES_END_LOADING = 'postDates/endLoading';

//
// Initial State
//

const INITIAL_STATE = {
    loading: false,
    dates: []
}

//
// Reducer
//
export const postDatesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case POST_DATES_SET_DATES:
            return {
                ...state,
                dates: action.payload || []
            };

        case POST_DATES_START_LOADING:
            return {
                ...state,
                loading: true
            };

        case POST_DATES_END_LOADING:
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
}

//
// Action Creators
//
export const setDates = (data) => ({
    type: POST_DATES_SET_DATES,
    payload: data
});
export const startLoading = () => ({
    type: POST_DATES_START_LOADING
});
export const endLoading = () => ({
    type: POST_DATES_END_LOADING
});

//
// Thunks
//

export const loadPostDates = () => (dispatch) => {
    dispatch(startLoading());

    API.post.getAllDates()
        .then(data => batch(() => {
            dispatch(setDates(data))
            dispatch(endLoading());
        }))
        .catch(() => dispatch(endLoading()))
}


//
// Selectors
//

export const selectDates = state => state.postDates.dates;
export const selectLoading = state => state.postDates.loading;
