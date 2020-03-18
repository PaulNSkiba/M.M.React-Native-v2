/**
 * Created by Paul on 22.01.2019.
 */
import { LOGINUSER_URL, LOGOUTUSER_URL, LOGINUSERBYTOKEN_URL  } from '../config/config'
import { instanceAxios, axios2, langLibrary as langLibraryF, getViewStat } from '../js/helpersLight'
import { AsyncStorage, Platform } from 'react-native';
// import axios from 'axios';

export const userLoggedIn = (email, pwd, provider, provider_id, langLibrary, theme, themeColor) => {
    return dispatch => {

        const data = {
            "email": email,
            "password": pwd,
            "provider" : provider,
            "provider_id" : provider_id,
            "token" : null,
        };
        // console.log('USER_LOGGIN', LOGINUSER_URL, JSON.stringify(data))
        // document.body.style.cursor = 'progress';
        dispatch ({type: 'USER_LOGGING'})
        instanceAxios().post(`${LOGINUSER_URL}/1`, JSON.stringify(data), null)
            .then(res => {
                // console.log('USER_LOGGEDIN.1', response.data);
                switch (res.data.loggedin) {
                    case true :
                    // alert('USER_LOGGEDIN.1')
                        console.log('USER_LOGGIN') // , res.data.user.name, res.data.user.id, res.data
                        dispatch({type: 'SHOW_LOGIN',  payload : false})
                        dispatch ({type: 'USER_LOGGEDIN', payload: {data : res.data, langLibrary : langLibrary, theme : theme, themeColor : themeColor}});
                        dispatch({type: 'ADD_CHAT_MESSAGES', payload: res.data.chatrows});
                        dispatch({type: 'PHOTO_PATH', payload: []});
                        // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации

                        // console.log("saveToLocalStorage", JSON.stringify(ls))
                        // saveToLocalStorage("myMarks.data", email, response.data)
                        const {name : userName, id : userID, class_id : classID } = res.data.user;
                        let saveddata = {}
                        saveddata.email = email
                        saveddata.userName = userName
                        saveddata.userID = userID
                        saveddata.classID = classID
                        saveddata.token = res.data.token
                        // console.log("saveddata", saveddata)
                        dispatch({type : 'SAVE_DATA', payload : saveddata});
                        // const stat = getViewStat(classID);
                        // dispatch({type : "UPDATE_VIEWSTAT", payload : stat})
                        // getViewStat(classID)
                        //     .then(res=> dispatch({type : "UPDATE_VIEWSTAT", payload : res}))
                        // AsyncStorage.setItem("myMarks.marksInBase", response.data.markscount);
                        dispatch({type: 'USER_LOGGEDIN_DONE'})
                        dispatch({type: 'APP_LOADED'})
                        break;
                    case false :
                        dispatch({type: 'USER_PWD_MISSEDMATCH', payload: res.data.message})
                        dispatch({type: 'LOG_BTN_UNCLICK', payload : false})
                        dispatch({type: 'USER_LOGGEDIN_DONE'})
                        // console.log("LOGGEDIN_FALSE", response.data.message)
                        break;
                }
            })
            .catch(error => {
                // Список ошибок в отклике...
                console.log("ERROR_LOGGEDIN", error, error.data)
                // alert('ERROR_LOGGEDIN', email, pwd)
                // document.body.style.cursor = 'default';
                dispatch({type: 'USER_PWD_MISSEDMATCH'})
                dispatch({type: 'APP_LOADED'})
                dispatch({type: 'USER_LOGGEDIN_DONE'})
            })
   };
}

export const userLoggedInByToken = (email, token, kind, langLibrary, theme, themeColor) => {
    return dispatch => {
        const data = {
            "email": email,
            "token": token,
            "kind": kind,
        };
        console.log("userLoggedInByToken");
        // document.body.style.cursor = 'progress';
        dispatch ({type: 'USER_LOGGING'})

        axios2('get', LOGINUSERBYTOKEN_URL)
        .then(res => {
            // console.log("userLoggedInByTokenError", response);
            dispatch({type: 'SHOW_LOGIN',  payload : false})
            res.data.token = token
            // resp.token = token
            dispatch({type: 'USER_LOGGEDIN', payload: {data : res.data, langLibrary : langLibrary, theme : theme, themeColor : themeColor}});
            dispatch({type: 'ADD_CHAT_MESSAGES', payload : res.data.chatrows});

            // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
            // window.localStorage.setItem("userSetupDate", toYYYYMMDD(new Date()))

            // saveToLocalStorage("myMarks.data", email, response.data)
            const {name : userName, id : userID, class_id : classID } = res.data.user;
            let saveddata = {}
            saveddata.email = email
            saveddata.userName = userName
            saveddata.userID = userID
            saveddata.classID = classID
            saveddata.token = res.data.token
            // console.log("saveddata", saveddata)

                // .then(res=> dispatch({type : "UPDATE_VIEWSTAT", payload : res}))
            // dispatch({type : "UPDATE_VIEWSTAT", payload : getViewStat(classID)})

            dispatch({type : 'SAVE_DATA', payload : saveddata})

            dispatch({type: 'APP_LOADED'})
            dispatch({type: 'USER_LOGGEDIN_DONE'})

        })
        .catch(response => {
            console.log("userLoggedInByTokenError", response);
            AsyncStorage.removeItem("myMarks.data")
            dispatch({type: "LANG_LIBRARY", langLibrary: langLibrary})
            dispatch({type: 'USER_LOGGEDIN_DONE'})
            // dispatch({type: 'APP_LOADED'})
        })
    };
}
export const userLoggedOut = (token, langLibrary, theme, themeColor) => {
    return dispatch => {

        console.log("userLoggedOut")
            // document.body.style.cursor = 'progress';
        AsyncStorage.removeItem("myMarks.data");
        AsyncStorage.removeItem("userSetup")
        AsyncStorage.removeItem("userSetupDate")
        AsyncStorage.removeItem("localChatMessages")

        dispatch({type: 'SHOW_LOGIN',  payload : true})

        dispatch({type: 'APP_LOADING'})
        axios2('get', LOGOUTUSER_URL)
        .then(response => {
            console.log("logoutSuccess", response);
            dispatch({type: 'UPDATE_TOKEN',  payload : ''})
            dispatch({type: 'PHOTO_PATH', payload: []});
            dispatch({type: 'USER_LOGGEDOUT', payload : {langLibrary : langLibrary, theme : theme, themeColor : themeColor}});

            let saveddata = {}
            saveddata.email = null
            saveddata.userName = null
            saveddata.userID = null
            saveddata.classID = null
            saveddata.token = null

            dispatch({type : 'SAVE_DATA', payload : saveddata})
            dispatch({type: 'APP_LOADED'})
        })
        .catch(response => {
            dispatch({type: 'UPDATE_TOKEN',  payload : ''})
            dispatch({type: "LANG_LIBRARY", payload: langLibrary})
            dispatch({type: 'APP_LOADED'})
            console.log("logoutError", token, LOGOUTUSER_URL, response);
        })
        };
}

const saveToLocalStorage=(localName, email, data)=>{
    let ls = {}
    let {name : userName, id : userID, class_id : classID } = data.user;
    let {token} = data;
    ls.email = email;
    ls.name = userName;
    ls.id = userID;
    ls.token = token;
    ls.class_id = classID;
    // let saveddata = {}
    // saveddata.email = email
    // saveddata.userName = userName
    // saveddata.userID = userID
    // saveddata.token = token
    // saveddata.classID = classID
    // // console.log("saveToLocalStorage", JSON.stringify(ls))
    // // dispatch({type: 'APP_LOADED'})
    // dispatch({type : 'SAVE_DATA', saveddata})
    AsyncStorage.setItem(localName, JSON.stringify(ls));
}