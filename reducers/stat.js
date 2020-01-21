/**
 * Created by Paul on 15.01.2020.
 */
const initialState = {
    chatID : 0, tagID : 0, markID : 0, newsID : 0, buildsID : 0, QandAID : 0,
    budgetID : 0, statID : 0, chats : [], tags : [], marks : [], news : [],
    builds : [], QandAs : [], gotStats : false,
    chatCnt : 0, tagCnt : 0, markCnt : 0, newsCnt : 0, buildsCnt : 0, QandACnt : 0
};

export function statReducer(state = initialState, action) {
    switch (action.type) {
        case "INIT_STATDATA" :
            return {
                chatID : 0, tagID : 0, markID : 0, newsID : 0, buildsID : 0, QandAID : 0,
                budgetID : 0, statID : 0, chats : [], tags : [], marks : [], news : [],
                builds : [], QandAs : [], gotStats : false
            }
        case 'UPDATE_VIEWSTAT' : {
            // console.log('UPDATE_VIEWSTAT', action.payload)
            return action.payload
        }
        default :
            return state
    }
}