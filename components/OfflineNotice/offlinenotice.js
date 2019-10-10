/**
 * Created by Paul on 04.10.2019.
 */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
const { width } = Dimensions.get('window');
import {instanceAxios, mapStateToProps, toYYYYMMDD, dateFromYYYYMMDD} from '../../js/helpersLight'
import {connect} from 'react-redux';
import {API_URL}        from '../../config/config'

class OfflineNotice extends PureComponent {
    state = {
        isConnected: true,
        netType: 'online',
        // netOnline : true,
    };

    componentDidMount() {
        // let netType = "", isConnected = true
        // NetInfo.fetch().then(state =>{
        //     console.log("Comp", state)
        //     netType=state.type
        //     isConnected=state.isConnected
        // })
        // this.setState({ isConnected, netOnline : isConnected, netType });
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        // NetInfo.type.removeEventListener('typeChange', this.handleTypeChange);
    }

    handleConnectivityChange = isConnected => {
        // const {classID, studentId, localChatMessages, markscount} = this.props.userSetup
        // if ((this.state.isConnected!==isConnected)&&isConnected) {
        //     if (classID) {
        //         instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
        //             .then(response => {
        //                 console.log('handleConnectivityChange', response, this.props.userSetup)
        //                 // homeworks: 13
        //                 // marks: 0
        //                 // msgs: 250
        //                 // news: 3
        //                 // ToDO: News исправим позже
        //                 const today = toYYYYMMDD(new Date())
        //                 const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today)))
        //                 if ((response.data.msgs!==localChatMessages.slice(-1).id)||(markscount!==response.data.marks)||(homeworks_count!==response.data.homeworks)) {
        //                     instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/1`)
        //                         .then(response => {
        //                             console.log('NewData', response, this.props.userSetup)
        //                             this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
        //                             this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
        //                             })
        //                         .catch(response=> {
        //                             console.log("NewData_ERROR", response)
        //                         })
        //                         }
        //                 // this.refs.textarea.setNativeProps({'editable':false});
        //                 // this.refs.textarea.setNativeProps({'editable':true});
        //                 // this.props.setstate({showFooter : true})
        //                 // this.setState({curMessage : ''})
        //             })
        //             .catch(response=> {
        //                 console.log("handleConnectivityChange_ERROR", response)
        //             })
        //     }
        // }
        NetInfo.fetch().then(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            // this.setState({netOnline: state.isConnected, netType: state.type})
            this.setState({ isConnected, netType: state.type});
        });

        // console.log("NET_TYPE", netType)
        // this.setState({ isConnected});
    };
    handleTypeChange = type => {
        // let netType = ""
        // NetInfo.fetch().then(state =>netType=state.type)
        this.setState({ netType : type });
    };
    render() {
        // console.log("OffLineNotice", this.state.netOnline, this.state.netType )
        // if (!this.state.isConnected) {
            return             <View>
                <Text style={[styles.hintText, this.state.isConnected? {color: "#080"} : {color: "#800"}]}>
                    {this.state.isConnected && this.state.netType ? this.state.netType : "offline"}
                </Text>
            </View>
        // }
        // return null;
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