/**
 * @format
 */

import React, {Fragment, Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {store} from './store/configureStore'
import {Provider, connect} from 'react-redux';
import {mapStateToProps} from './js/helpersLight'

const MyApp = connect(mapStateToProps,
    dispatch => { return {
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    }})(App)

const Root = () => (
    <Provider store={store}>
        <MyApp />
    </Provider>
)
// AppRegistry.registerComponent('Root', () => Root);
AppRegistry.registerComponent(appName, () => Root);
// AppRegistry.registerComponent(appName, () => App);
