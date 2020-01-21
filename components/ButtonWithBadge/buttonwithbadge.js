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
        const {localChatMessages, userID, marks, classNews} = this.props.userSetup
        const {chatID, markID, newsID, buildsID, newsCnt, buildsCnt, chatCnt, markCnt} = this.props.stat
        const {showFooter, showKeyboard, theme, themeColor, online} = this.props.interface

        const windowRatio = Dimensions.get('window').width? Dimensions.get('window').height / Dimensions.get('window').width : 1.9
        // const todayMessages = localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString())).length

        // let unreadMsgsCount = 0
        // if (this.props.kind==='chat') {
        //     // const {chatID} = this.props.stat
        //     unreadMsgsCount = localChatMessages.filter(item => (item.id > chatID && item.user_id !== userID)).length
        // }
        // let unreadMarksCount = 0
        // if (this.props.kind==='marks') {
        //     unreadMarksCount = this.props.value//marks.filter(item =>(Number(item.id) > markID)).length
        // }
        // let unreadNewsCount = 0, unreadBuildsCount = 0
        // if (this.props.kind==='info') {
        //     unreadNewsCount = newsCnt //classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID)).length
        //     unreadBuildsCount = buildsCnt //classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID)).length
        // }
        // console.log("renderButtons", newsID, buildsID)
        return (
            <Button style={[{backgroundColor : theme.secondaryColor,
                borderWidth : 2,
                borderColor : theme.secondaryColor}, this.props.enabled?{color : theme.secondaryDarkColor}:{ color : theme.secondaryLightColor}]}
                    badge vertical
                    active={this.props.enabled&&(!this.props.disabled)}
                    onPress={()=> {
                         this.props.setstate({selectedFooter: this.props.stateid, showLogin: false, isSpinner : false})
                    }
                    }>
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
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithBadge)