import { batch } from 'react-redux';
import API from '../core/api';
import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';


//
// Action Types
//
const CATEGORIES_SET_CATEGORIES = 'categories/setCategories';
const CATEGORIES_START_LOADING = 'categories/startLoading';
const CATEGORIES_END_LOADING = 'categories/endLoading';

//
// Initial State
//

const INITIAL_STATE = {
    loading: false,
    categories: []
}

//
// Reducer
//
export const categoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CATEGORIES_SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload || []
            };

        case CATEGORIES_START_LOADING:
            return {
                ...state,
                loading: true
            };

        case CATEGORIES_END_LOADING:
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
export const setCategories = (data) => ({
    type: CATEGORIES_SET_CATEGORIES,
    payload: data
});
export const startLoading = () => ({
    type: CATEGORIES_START_LOADING
});
export const endLoading = () => ({
    type: CATEGORIES_END_LOADING
});

//
// Thunks
//

export const loadCategories = () => (dispatch) => {
    dispatch(startLoading());

    API.category.getAll()
        .then(data => batch(() => {
            dispatch(setCategories(data))
            dispatch(endLoading());
        }))
        .catch(error => dispatch(endLoading()))
}


//
// Selectors
//

export const selectCategories = state => state.categories.categories;
export const selectLoading = state => state.categories.loading;

export const selectCategoriesSorted = createSelector(
    selectCategories,
    categories => sortBy(categories, 'name')
)