/**
 * Created by Paul on 19.01.2020.
 */
const initialState = {
    loading : -1, online : false,
    showUserList : false,
    users : [], typingUsers : new Map(),
    Echo : null,
    };

export function tempdataReducer(state = initialState, action) {
    switch (action.type) {
        case "INIT_TEMPDATA" :
            return {
                loading : -1, online : false,
                showUserList : false,
                users : [], typingUsers : new Map(),
                Echo : null,
            };
        case 'UPDATE_ONLINE':
            return {...state, online : action.payload}
        case 'APP_LOADING' :
            return{...state, loading : true}
        case 'APP_LOADED' :
            return{...state, loading : false}
        case "SHOW_USERLIST" :
            return{...state, showUserList: action.payload}
        case "UPDATE_USERS" :
            return{...state, users: action.payload}
        case "UPDATE_ECHO" :
            return{...state, Echo: action.payload}
        case "UPDATE_TYPING_USERS" :
            return{...state, typingUsers: action.payload}
        default :
            return state
    }
}
