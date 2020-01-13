/**
 * Created by Paul on 12.09.2019.
 */
import React, {Fragment, Component} from 'react';
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar, Dimensions} from 'react-native';
import { Badge, Icon } from 'react-native-elements'
import { mapStateToProps, addDay, toYYYYMMDD } from '../../js/helpersLight'
import { Button } from 'native-base';
import styles from '../../css/styles'
import {connect} from 'react-redux';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class ButtonWithBadge extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render () {
        const {theme, localChatMessages} = this.props.userSetup
        const windowRatio = Dimensions.get('window').width? Dimensions.get('window').height / Dimensions.get('window').width : 1.9
        const todayMessages = localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString())).length
        // const test = true
        // const hwarray = this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null))
        // const homework = hwarray.length?hwarray.filter(item=>{
        //                 if (item.hasOwnProperty('ondate')) item.homework_date = new Date(item.ondate)
        //                     return toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(addDay((new Date()), 1))
        //                 }
        //             ).length:0
        // console.log("ButtonWithBadge", this.props.icontype, this.props.iconname, todayMessages, homework)
        // if (this.props.kind==='marks') console.log("MARKS_COUNT", this.props.value)
        return (
            <Button style={this.props.enabled?  {   backgroundColor : theme.secondaryColor,
                                                    color : theme.secondaryDarkColor, borderWidth : 2, borderColor : theme.secondaryColor}:
                                                {   backgroundColor : theme.secondaryColor,
                                                    color : theme.secondaryLightColor, borderWidth : 2, borderColor : theme.secondaryColor}}
                    badge vertical
                    active={this.props.enabled&&(!this.props.disabled)}
                    onPress={()=> {
                        this.props.setstate({selectedFooter: this.props.stateid, showLogin: false, isSpinner : false})
                    }
                    }>
                {(this.props.kind==='chat'&&(todayMessages||this.props.value))?
                    <Badge value={this.props.value?this.props.value:todayMessages}
                           status={this.props.badgestatus}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.value)?
                    <Badge value={this.props.value?this.props.value:null}
                           status={this.props.badgestatus}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='info'&&this.props.value)?
                    <Badge value={this.props.value?this.props.value:null}
                           status={this.props.badgestatus}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='marks'&&this.props.value)?
                    <Badge value={this.props.value?this.props.value:null}
                           status={this.props.badgestatus}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                <Icon color={!this.props.enabled?theme.secondaryLightColor:theme.primaryDarkColor} active type={this.props.icontype} name={this.props.iconname} inverse />
                <Text style={{color :!this.props.enabled?theme.secondaryLightColor:theme.primaryDarkColor,
                    fontSize: (windowRatio < 1.8?RFPercentage(1.5):RFPercentage(1.6))}}>
                    {this.props.name}
                </Text>
            </Button>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithBadge)