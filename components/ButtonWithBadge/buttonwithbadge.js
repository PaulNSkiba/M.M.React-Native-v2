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
        const {theme, localChatMessages, userID, marks, classNews} = this.props.userSetup

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
        // todayMessages||
        let unreadMsgsCount = 0
        if (this.props.kind==='chat') {
            const {chatID} = this.props.stat
            unreadMsgsCount = localChatMessages.filter(item => (item.id > chatID && item.user_id !== userID)).length
        }
        let unreadMarksCount = 0
        if (this.props.kind==='marks') {
            let {markID} = this.props.stat
            // MarkID = Number(!Number.isNaN(markID)?0:MarkID===null?0:MarkID)
            // console.log("MarkID", this.props.stat)
            unreadMarksCount = marks.filter(item =>(Number(item.id) > markID)).length
            // console.log("button", this.props.kind, markID, unreadMarksCount, marks)
        }
        let unreadNewsCount = 0, unreadBuildsCount = 0
        if (this.props.kind==='info') {
            let {newsID, buildsID} = this.props.stat
            // MarkID = Number(!Number.isNaN(markID)?0:MarkID===null?0:MarkID)
            // console.log("MarkID", this.props.stat)
            unreadNewsCount = classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID)).length
            unreadBuildsCount = classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID)).length
            // console.log("button", this.props.kind, markID, unreadMarksCount, marks)
        }
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
                {(this.props.kind==='chat'&&unreadMsgsCount)?
                    <Badge value={unreadMsgsCount}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='homework'&&(this.props.value))?
                    <Badge value={this.props.value?this.props.value:todayMessages}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.errorColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='marks'&&unreadMarksCount)?
                    <Badge value={unreadMarksCount}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='info'&&unreadNewsCount)?
                    <Badge value={unreadNewsCount}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, left: 2 }}>
                    </Badge>:null}
                {(this.props.kind==='info'&&unreadBuildsCount)?
                    <Badge value={unreadBuildsCount}
                           status={this.props.badgestatus}
                           textStyle={{color : theme.primaryTextColor}}
                           badgeStyle={{backgroundColor : theme.primaryColor }}
                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
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
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithBadge)