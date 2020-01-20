/**
 * Created by Paul on 18.01.2020.
 */
const initialState = {
        userName : "", password : "", token : "", saveCreds : false, considerTimetable : true
};

export function saveddataReducer(state = initialState, action) {
    switch (action.type) {
        // case 'UPDATE_VIEWSTAT' : {
        //     return action.payload
        // }
        default :
            return state
    }
}