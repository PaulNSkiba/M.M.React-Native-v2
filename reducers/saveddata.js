/**
 * Created by Paul on 18.01.2020.
 */
const initialState = {
    userName : "", password : "", token : "", saveCreds : false, considerTimetable : false,
    email : "", userID : 0, classID : 0
};

// ls.email = email;
// ls.name = userName;
// ls.id = userID;
// ls.token = token;
// ls.class_id = classID;

export function saveddataReducer(state = initialState, action) {
    switch (action.type) {
        // case 'UPDATE_VIEWSTAT' : {
        //     return action.payload
        // }
        case "SAVE_CREDS" :
            return {...state, userName : action.payload.userName, password : action.payload.password}
        case "SAVE_DATA" :
            // console.log("save_data", action.payload)
            const {userName, password, token, saveCreds, considerTimetable, email, userID, classID} = action.payload
            return {...state, email : email, userName : userName, userID : userID, token : token, classID : classID }
        default :
            return state
    }
}