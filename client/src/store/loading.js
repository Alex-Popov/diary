

//
// Action Types
//
const LOADING_SHOW = 'loading/showLoading';
const LOADING_HIDE = 'loading/hideLoading';

//
// Initial State
//

const INITIAL_STATE = {
    isShow: false
}

//
// Reducer
//
export const loadingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_SHOW:
            return {
                ...state,
                isShow: true
            };

        case LOADING_HIDE:
            return {
                ...state,
                isShow: false
            };

        default:
            return state;
    }
}

//
// Action Creators
//
export const showLoading = () => ({
    type: LOADING_SHOW
});
export const hideLoading = () => ({
    type: LOADING_HIDE
});



//
// Selectors
//

export const selectLoadingState = state => state.loading.isShow;