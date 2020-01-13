/**
 * Created by Paul on 04.10.2019.
 */
import React, { PureComponent, Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
import {instanceAxios, mapStateToProps} from '../../js/helpersLight'
import {connect} from 'react-redux';

class OfflineNotice extends Component {
    state = {
        isConnected: true,
        netType: 'online',
    };
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }
   componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }
   handleConnectivityChange = isConnected => {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected, netType: state.type});
        });
    };
    handleTypeChange = type => {
        this.setState({ netType : type });
    };
    render() {
        const {theme} = this.props.userSetup
            return  <View style={[{paddingRight : 2}, (this.state.isConnected&&this.props.userSetup.online)? {} : {}]}>
                <Text style={[{fontSize: RFPercentage(1),position: "relative", left: 0, top: 0},
                    (this.state.isConnected&&this.props.userSetup.online)? {color: theme.secondaryLightColor} : {color: theme.errorColor}]}>
                    {this.state.isConnected && this.state.netType ? this.state.netType : "offline"}
                </Text>
            </View>
    }
}

const styles = StyleSheet.create({
    hintText: {
        fontSize: RFPercentage(1),
        position: "relative",
        left: 0,
        top: 0,
    }
});

export default connect(mapStateToProps,
    dispatch => { return {
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    }})(OfflineNotice)