/**
 * Created by Paul on 15.01.2020.
 */
const initialState = {
    chatID : 0, tagID : 0, markID : 0, newsID : 0, buildsID : 0, QandAID : 0,
    budgetID : 0, statID : 0, chats : [], tags : [], marks : [], news : [],
    builds : [], QandAs : []
};

export function statReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_VIEWSTAT' : {
            console.log('UPDATE_VIEWSTAT_REDUCER', action.payload)
            return action.payload
        }
        default :
            return state
    }
}