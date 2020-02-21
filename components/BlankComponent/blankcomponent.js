/**
 * Created by Paul on 17.02.2020.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {axios2, mapStateToProps} from '../../js/helpersLight'
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { Icon } from 'react-native-elements'
import styles from '../../css/styles'

class BlankComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {

    }
    componentWillUnmount(){

    }
    render(){
        return (<View>

        </View>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(BlankComponent)