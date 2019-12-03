/**
 * Created by Paul on 20.01.2019.
 */
const initialState = {
// мы вложили в user вместо строки, объект
        name: '',
        surname: '',
        age: 0,
        id : 0,
        token : "",
        logging : false,
        verified : false,
        email : "",
        loginmsg : "",
        logBtnClicked : false,
        loggedin : false,
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        // case 'USER_LOGGEDIN' :
        //     let {username, id, token, email_verified_at, email} = action.payload
        //     return {...state, name : username, id : id, token : token, logging : true, verified: email_verified_at, email,
        //                 loginmsg : "", loggedin : true}
        case 'USER_LOGGEDOUT' :
            return {...state, name: '',
                surname: '',
                age: 0,
                id : 0,
                token : "",
                logging : false,
                loggedin : false,};
        case 'USER_LOGGING' :
            return {...state, logging: true, loggedin : false};
        case 'LOG_BTN_CLICK' :
            return {...state, logBtnClicked : true};
        case 'LOG_BTN_UNCLICK' :
            return {...state, logBtnClicked : false};
        case 'USER_LOGGEDIN_DONE' : {
            return {...state, logging: false, loggedin : true}
        };
        case 'USER_PWD_MISSEDMATCH':
            return {...state, loginmsg: action.payload};
        case 'USER_MSG_CLEAR':
            return {...state, loginmsg: ''};
        default:
            return state
    }
}