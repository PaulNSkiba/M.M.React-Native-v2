/**
 * @format
 */
import React, {Fragment, Component} from 'react';
import { AppRegistry, View } from 'react-native';
import { Spinner } from 'native-base';
import App from './App';
import {name as appName} from './app.json';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import AsyncStorage from '@react-native-community/async-storage';
import store, {persistedReducer} from './store/configureStore'
import {Provider, connect} from 'react-redux';
import {mapStateToProps, themeOptions } from './js/helpersLight'
import { persistStore, persistReducer } from "redux-persist";
import { Root } from "native-base";
import {userLoggedInMock, userLoggedOut} from './actions/userAuthActions'

// import thunk from 'redux-thunk';
// import { withNetworkConnectivity, reducer as network, createNetworkMiddleware, networkSaga, ReduxNetworkProvider, NetworkProvider } from "react-native-offline";
// import createSagaMiddleware from "redux-saga";
// import { fork, all } from "redux-saga/effects";
// import { PersistGate } from "redux-persist/integration/react";

// function* watcherSaga() {
//     yield all([
//         fork(networkSaga , {
//             timeout: 5000,
//             checkConnectionInterval: 1000,
//             pingInterval : 5000,
//         })
//     ]);
// }
// const sagaMiddleware = createSagaMiddleware();
// const networkMiddleware = createNetworkMiddleware();

// const storeLocal = createStore(persistedReducer, applyMiddleware(networkMiddleware, thunk, sagaMiddleware))

const mapDispatchToProps = dispatch => { return {
    onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    onStartLoading: () => dispatch({type: 'APP_LOADING'}),
    onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    onUserMockLogging: (langLibrary, theme, themeColor) => {
        dispatch({type: 'APP_LOADING'})
        console.log("OnUserMockLogging")
        const asyncMockLoggedIn = (langLibrary, theme, themeColor) => {
            return dispatch => {
                dispatch(userLoggedInMock(langLibrary, theme, themeColor))
            }
        }
        dispatch(asyncMockLoggedIn(langLibrary, theme, themeColor))
    },
    onUserLoggingOut: (token, langLibrary, theme, themeColor) => {
        return dispatch(userLoggedOut(token, langLibrary, theme, themeColor))
    },
}}

const MyApp = connect(mapStateToProps, mapDispatchToProps)(App)

// let persistor =
//     persistStore(store);
// sagaMiddleware.run(watcherSaga);

class RootOfMyApp extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded : false
        }
    }
    componentDidMount(){
        persistStore(store, {}, ()=>{this.setState({isLoaded : true})});
    }
    render() {
        if (!this.state.isLoaded)
            return (
            <View style={{position : "absolute", flex: 1, alignSelf : 'center', marginTop : 240, zIndex : 100 }}>
                <Spinner color={themeOptions['#7DA8E6'].primaryColor}/>
            </View>)
        return (
            <Root>
                <Provider store={store}>
            {/*<PersistGate loading={<View style={{position : "absolute", flex: 1, alignSelf : 'center', marginTop : 240, zIndex : 100 }}><Spinner color={themeOptions['#46b5be'].secondaryColor}/></View>}*/}
            {/*persistor={store}>*/}
            {/*<ReduxNetworkProvider>*/}
            {/*<NetworkProvider>*/}
                    <MyApp/>
            {/*</NetworkProvider>*/}
            {/*</ReduxNetworkProvider>*/}
            {/*</PersistGate>*/}
                </Provider>
            </Root>
        )
    }
}

AppRegistry.registerComponent(appName, () => RootOfMyApp);

