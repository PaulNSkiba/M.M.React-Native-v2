/**
 * Created by Paul on 19.01.2020.
 */
const initialState = {
    loading : -1, online : false,
    showUserList : false,
    users : [], typingUsers : new Map(),
    Echo : null, updateLang : false,
    missLangWords : [], localChatMessages : [], photoPath : []
    };

export function tempdataReducer(state = initialState, action) {
    switch (action.type) {
        case "INIT_TEMPDATA" :
            return {
                loading : -1, online : false,
                showUserList : false,
                users : [], typingUsers : new Map(),
                Echo : null, updateLang : false,
                missLangWords : [], localChatMessages : [], photoPath : []
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
        case "UPDATE_LANGLIBRARY" :
            return{...state, updateLang: action.payload}
        case "UPDATE_MISSLANGWORDS" :
            return{...state, missLangWords: [...state.missLangWords, action.payload]}
        case "INIT_MISSLANGWORDS" :
            return{...state, missLangWords: []}
        case "UPDATE_TYPING_USERS" :
            return{...state, typingUsers: action.payload}
        case "ADD_CHAT_MESSAGES" : {
            return{...state, localChatMessages: action.payload}
        }
        case 'PHOTO_PATH' : {
            return{...state, photoPath: action.payload}
        }
        default :
            return state
    }
}
