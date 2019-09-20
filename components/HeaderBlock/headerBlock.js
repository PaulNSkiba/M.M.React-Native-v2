/**
 * Created by Paul on 27.08.2019.
 */

import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab,
            Form, Item, Input, Label} from 'native-base';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import { bindActionCreators } from 'redux';
import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import { LOGINUSER_URL, version } from '../../config/config'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
// import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from './js/helpersLight'
import styles from '../../css/styles'
import NetInfo from "@react-native-community/netinfo";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

class HeaderBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatMessages : [],
            selectedFooter : 0,
            showLogin : false,
            username: '',
            password: '',
            userID: 0,
            userName : '',
            netOnline : false,
            netType : '',
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
    }
    componentDidMount(){
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            this.setState({netOnline : state.isConnected, netType : state.type})
        });
    }
    render=()=>{
        {/*<LogginByToken email={this.props.email} token={this.props.token} logout={true}/>*/}
        // &&(!this.props.userSetup.userID)
        return (
        <Header style={styles.header}>
            {this.props.token.length?
                <LogginByToken email={this.props.email} token={this.props.token} logout={false}/>:
                null}
            <Left>
                <Text style={styles.versionNumber}>{version}</Text>
            </Left>
            <Body style={{position : "relative", flex: 1, flexDirection : "row"}}>
                <View>
                <Title style={styles.myTitle}>My.Marks</Title>
                </View>
                <View>
                    <Text style={[{fontSize: RFPercentage(1.5), position : "relative", left : 0, top : 0},this.state.netOnline?{color : "#080"}:{color : "#800"}]}>
                    {this.state.netOnline&&this.state.netType?"online":"offline"}
                    </Text>
                </View>
            </Body>
            <Right>
                <View style={{positon:"relative"}}>

            {/*<Icon style={styles.menuIcon} name='menu' />*/}
                    <View >
                        <Button transparent>
                            {this.props.userSetup.userID?<Text style={{color : "#4472C4", fontWeight : "700"}}>{this.props.userSetup.userName}  </Text>:null}
                            <Icon size={32} color={this.props.userSetup.userID?"#4472C4":"#A9A9A9"} style={styles.menuIcon} name='person' onPress={this.props.footer===0?()=>this.props.updateState('showLogin'):null}/>
                        </Button>
                    </View>
                </View>
            </Right>
        </Header>
        )
}
}

export default connect(mapStateToProps)(HeaderBlock)