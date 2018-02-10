import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';

initStateObj = {
    token: null,
    expiryDate: null
}

const reducer = (state = initStateObj, action) => {
    switch(action.type) {
        case AUTH_SET_TOKEN:
            return {
                ...state,
                token: action.token,
                expiryDate: action.expiryDate
            }
        case AUTH_REMOVE_TOKEN:
            return {
                ...state,
                token: null,
                expiryDate: null
            }
        default:
            return state;
    }
}

export default reducer;