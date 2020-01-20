/**
 * Created by Paul on 19.01.2020.
 */
const initialState = {
    loading : -1, online : false
    }


export function tempdataReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ONLINE':
            return {...state, online : action.payload}
        case 'APP_LOADING' :
            return{...state, loading : true}
        case 'APP_LOADED' :
            return{...state, loading : false}
        default :
            return state
    }
}
