/**
 * Created by Paul on 20.01.2019.
 */
// import { createStore } from 'redux'
// import { rootReducer } from '../reducers'
// import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import { userSetupReducer } from '../reducers/userSetup'
import { userReducer } from '../reducers/user'
import { chatReducer } from '../reducers/chatReduser'
import { statReducer } from '../reducers/stat'
import { interfaceReducer } from '../reducers/interface'
import { saveddataReducer } from '../reducers/saveddata'
import { tempdataReducer } from '../reducers/tempdata'
import { persistStore, persistReducer } from "redux-persist";
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from "redux-saga";
import { reducer as network, createNetworkMiddleware, networkEventsListenerSaga } from "react-native-offline";

// import { PersistGate } from "redux-persist/integration/react";
// import storage from "redux-persist/lib/storage";
// function* watcherSaga() {
//     yield all([
//         fork(networkEventsListenerSaga, {
//             timeout: 5000,
//             checkConnectionInterval: 1000
//         })
//     ]);
// }

const persistConfig = {
    key: 'root',
    storage : AsyncStorage,
    stateReconciler: hardSet,
}

const sagaMiddleware = createSagaMiddleware();
const networkMiddleware = createNetworkMiddleware();

const rootReducer = combineReducers({
    userSetup: userSetupReducer,
    user: userReducer,
    chat : chatReducer,
    stat : statReducer,
    interFace : interfaceReducer,
    saveddata : saveddataReducer,
    tempdata : tempdataReducer,
    network,
    blacklist: ["network", "user", "tempdata", "stat"]
})
export const persistedReducer = persistReducer(persistConfig, rootReducer)

// const rootReducer = (state = [], action) => {
//     switch (action.type) {
//         default:
//             return state
//     }
// };
// const initialState = {};
// export const store = createStore(rootReducer, initialState);
// export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
// let persistor = persistStore(store);
export default store = createStore(persistedReducer, applyMiddleware(networkMiddleware, thunk, sagaMiddleware))
// sagaMiddleware.run(watcherSaga);

// export default store; //const store = persistStore(createStore(rootReducer, applyMiddleware(thunk, networkMiddleware, sagaMiddleware)));