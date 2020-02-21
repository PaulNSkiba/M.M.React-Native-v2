/**
 * Created by Paul on 18.01.2020.
 */
const initialState = {
    showFooter : true, showLogin : false, showKeyboard : false,
    headerHeight : 0, footerHeight : 0, viewHeight : 0, keyboardHeight : 0, langCode : "",
    themeColor : "#46b5be",
    theme : {
        primaryColor : '#47b5be',
        primaryLightColor : '#9bd7dc',
        primaryDarkColor : '#007ba4',
        primaryBorderColor : '#6ddce5',
        secondaryColor : '#ffc909',
        secondaryLightColor : '#fff674',
        secondaryDarkColor : '#faa41b',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#007ba4',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#007ba4',
        googleColor : '#fff674',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    }
};

export function interfaceReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_FOOTER_SHOW' :
            return {...state, showFooter: action.payload}
        case 'UPDATE_KEYBOARD_SHOW' :
            return {...state, showKeyboard: action.payload}
        case 'UPDATE_KEYBOARD_HEIGHT' :
            return {...state, keyboardHeight: action.payload}
        case 'CHANGE_THEME' :
            return{...state, theme : action.payload}
        case 'CHANGE_COLOR' :
            return{...state, themeColor : action.payload}
        case "HEADER_HEIGHT" :
            return{...state, headerHeight: action.payload}
        case "FOOTER_HEIGHT" :
            return{...state, footerHeight: action.payload}
        case "SHOW_LOGIN" :
            return{...state, showLogin: action.payload}
        case 'LANG_CODE' :
            return{...state, langCode: action.payload}
        default :
            return state
    }
}