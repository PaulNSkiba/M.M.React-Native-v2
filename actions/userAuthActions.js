/**
 * Created by Paul on 22.01.2019.
 */
import { LOGINUSER_URL } from '../config/config'
import { instanceAxios, langLibrary as langLibraryF } from '../js/helpersLight'
import { AsyncStorage } from 'react-native';

export const userLoggedIn = (email, pwd, provider, provider_id, langLibrary) => {
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
        instanceAxios().post(LOGINUSER_URL, JSON.stringify(data), null)
            .then(response => {
                console.log('USER_LOGGEDIN.1', response.data);
                switch (response.data.loggedin) {
                    case false :
                        dispatch({type: 'USER_PWD_MISSEDMATCH', payload: response.data.message})
                        dispatch({type: 'LOG_BTN_UNCLICK', payload : false})
                        dispatch({type: 'USER_LOGGEDIN_DONE'})
                        // console.log("LOGGEDIN_FALSE", response.data.message)
                        break;
                    case true :
                    // alert('USER_LOGGEDIN.1')
                        console.log('USER_LOGGIN', response.data)
                        dispatch ({type: 'USER_LOGGEDIN', payload: response.data, langLibrary: langLibrary});
                        dispatch({type: 'ADD_CHAT_MESSAGES', payload: response.data.chatrows});
                        // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                        saveToLocalStorage("myMarks.data", email, response.data)
                        AsyncStorage.setItem("myMarks.marksInBase", response.data.markscount);

                        dispatch({type: 'USER_LOGGEDIN_DONE'})
                        dispatch({type: 'APP_LOADED'})

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

export const userLoggedInByToken = (email, token, kind, langLibrary) => {
    return dispatch => {
        const data = {
            "email": email,
            "token": token,
            "kind": kind,
        };
        // console.log("userLoggedInByToken", LOGINUSER_URL, data);
        // document.body.style.cursor = 'progress';
        dispatch ({type: 'USER_LOGGING'})
        instanceAxios().post(LOGINUSER_URL, data, null)
            .then(response => {
                // console.log('USER_LOGGEDIN.1', response.data);
                // langLibrary?langLibrary:langLibraryF(localStorage.getItem("myCountryCode")?localStorage.getItem("myCountryCode"):"EN")
                dispatch({type: 'USER_LOGGEDIN', payload: response.data, langLibrary : "EN"});
                dispatch({type: 'ADD_CHAT_MESSAGES', payload : response.data.chatrows});
                // dispatch({type: 'APP_LOADED'})
                // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
                saveToLocalStorage("myMarks.data", email, response.data)
                dispatch({type: 'USER_LOGGEDIN_DONE'})
                // localStorage.setItem("localChatMessages", response.data.chatrows)
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
export const userLoggedOut = (token, langLibrary) => {
    return dispatch => {
            // console.log("userLoggedOut", AsyncStorage.getItem("userSetupDate"))
            // document.body.style.cursor = 'progress';
        AsyncStorage.removeItem("myMarks.data");
        AsyncStorage.removeItem("userSetup")
        AsyncStorage.removeItem("userSetupDate")
        AsyncStorage.removeItem("localChatMessages")

            dispatch({type: 'APP_LOADING'})
            instanceAxios().get('logout')
                .then(response => {
                    // return response.data;
                    // console.log(response.data, response.data);
                    dispatch({type: 'USER_LOGGEDOUT', langLibrary : langLibrary});
                    // dispatch({type: 'APP_LOADED'})
                    console.log("logoutSuccess", response);
                    // document.body.style.cursor = 'default';
                })
                .catch(response => {
                    dispatch({type: 'USER_LOGGEDOUT', langLibrary : langLibrary});
                    dispatch({type: "LANG_LIBRARY", payload: langLibrary})
                    // dispatch({type: 'APP_LOADED'})
                    // document.body.style.cursor = 'default';
                    console.log("logoutError", response);
                    // Список ошибок в отклике...
                })
                // dispatch({type: 'APP_LOADED'})
                // document.body.style.cursor = 'default';
            };
}

const saveToLocalStorage=(localName, email, data)=>{
    let ls = {}
    let { name : userName, id : userID, class_id : classID } = data.user;
    let { token} = data;
    ls.email = email;
    ls.name = userName;
    ls.id = userID;
    ls.token = token;
    ls.class_id = classID;
    // console.log("saveToLocalStorage", JSON.stringify(ls))
    AsyncStorage.setItem(localName, JSON.stringify(ls));
}