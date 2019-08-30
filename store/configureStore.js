/**
 * Created by Paul on 20.01.2019.
 */
// import { createStore } from 'redux'
// import { rootReducer } from '../reducers'
// import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore , applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import { combineReducers } from 'redux'
import { userSetupReducer } from '../reducers/userSetup'
import { userReducer } from '../reducers/user'
import { chatReducer } from '../reducers/chatReduser'

const rootReducer = combineReducers({
    userSetup: userSetupReducer,
    user: userReducer,
    chat : chatReducer,
})
// const rootReducer = (state = [], action) => {
//     switch (action.type) {
//         default:
//             return state
//     }
// };
const initialState = {};
// export const store = createStore(rootReducer, initialState);
// export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const store = createStore(rootReducer, applyMiddleware(thunk));