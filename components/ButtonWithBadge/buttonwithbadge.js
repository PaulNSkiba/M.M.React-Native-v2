/**
 * Created by Paul on 12.09.2019.
 */
import React, {Fragment, Component} from 'react';
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar,} from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import {    Container, Header, Left, Body, Right, Button,
    Title, Content,  Footer, FooterTab,
    Form, Item, Input, Label} from 'native-base';
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

        const todayMessages = this.props.userSetup.localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString())).length
        const homework = this.props.userSetup.homework.length
        // console.log("ButtonWithBadge", this.props.icontype, this.props.iconname, todayMessages, homework)

        return (
        <Button style={this.props.enabled?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}}
                disabled={this.props.disabled}
                badge vertical
                active={this.props.enabled&&(!this.props.disabled)}
                onPress={()=>this.props.setstate({selectedFooter : this.props.stateid})}>
            {(this.props.kind==='chat'&&(todayMessages||this.props.value))?
            <Badge value={this.props.value?this.props.value:todayMessages}
                   status={this.props.badgestatus}
                   containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
            </Badge>:null}
            {(this.props.kind==='homework'&&homework||this.props.value)?
                <Badge value={this.props.value?this.props.value:homework}
                       status={this.props.badgestatus}
                       containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                </Badge>:null}
            {(this.props.kind==='info'||this.props.value)?
                <Badge value={this.props.value?this.props.value:null}
                       status={this.props.badgestatus}
                       containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                </Badge>:null}
            {(this.props.kind==='marks'||this.props.value)?
                <Badge value={this.props.value?this.props.value:null}
                       status={this.props.badgestatus}
                       containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                </Badge>:null}
            <Icon color={this.props.enabled?"#fff":"#4472C4"} active type={this.props.icontype} name={this.props.iconname} inverse />
            <Text style={this.props.enabled?[styles.tabColorSelected, {fontSize: RFPercentage(1.8)}]:[styles.tabColor, {fontSize: RFPercentage(1.8)}]}>{this.props.name}</Text>
        </Button>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonWithBadge)