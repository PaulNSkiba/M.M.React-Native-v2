/**
 * Created by Paul on 12.09.2019.
 */
import React, {Fragment, Component} from 'react';
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar,
         Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
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
        const {userID, marks, classNews} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata
        const {chatID, markID, newsID, buildsID, newsCnt, buildsCnt, chatCnt, markCnt} = this.props.stat
        const {showFooter, showKeyboard, theme, themeColor, online, footerHeight} = this.props.interface

        const windowRatio = Dimensions.get('window').width? Dimensions.get('window').height / Dimensions.get('window').width : 1.9
        const buttonWidth = Dimensions.get('window').width/6
        return (
            <TouchableOpacity   key={0} id={"msgarea-"+0}
                                        delayLongPress={300}
                                        onLongPress={()=>{this.props.longpress!==null?this.props.longpress(this.props.stateid):null}}
                                        onPress={()=> {
                                            this.props.setstate({selectedFooter: this.props.stateid, showLogin: false, isSpinner : false, helpChat : false})
                                            }}
                                        activeOpacity={.9}
                                        style={{zIndex : 10}}
            >
            <View style={[{
                backgroundColor : theme.secondaryColor,
                borderWidth : 2,
                borderColor : theme.secondaryColor,
                height : 50,
                width : buttonWidth,
                display : "flex",
                alignItems : "center",
                justifyContent : "center",
                },
                this.props.enabled?{color : theme.secondaryDarkColor}:{ color : theme.secondaryLightColor}

                ]}
                    badge vertical
                    active={this.props.enabled&&(!this.props.disabled)}

                    >
                {(this.props.kind==='chat'&&chatCnt)?
                    <Badge value={chatCnt}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='homework'&&this.props.value)?
                    <Badge value={this.props.value?this.props.value:0}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.errorColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='marks'&&markCnt)?
                    <Badge value={markCnt}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='info'&&newsCnt)?
                    <Badge value={newsCnt}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 0 }}>
                    </Badge>:null}
                {(this.props.kind==='info'&&buildsCnt)?
                    <Badge value={buildsCnt}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: 8, right: 0 }}>
                    </Badge>:null}
                {/*{(this.props.value)?*/}
                    {/*<Badge value={this.props.value?this.props.value:null}*/}
                           {/*status={this.props.badgestatus}*/}
                           {/*containerStyle={{ position: 'absolute', top: -8, right: 2 }}>*/}
                    {/*</Badge>:null}*/}
                {this.props.iconname!==null?<Icon color={!this.props.enabled?theme.secondaryLightColor:theme.primaryDarkColor} active type={this.props.icontype} name={this.props.iconname} inverse />:null}
                <Text style={{color :!this.props.enabled?theme.secondaryLightColor:theme.primaryDarkColor,
                    fontSize: (windowRatio < 1.8?RFPercentage(1.5):RFPercentage(1.6))}}>
                    {this.props.name}
                </Text>
            </View>
            </TouchableOpacity>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithBadge)