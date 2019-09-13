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
// import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from './js/helpersLight'
import styles from '../../css/styles'

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
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
    }
    render=()=>{
        return (
        <Header style={styles.header}>
            <Left>
                {/*<View style={{position : "absolute"}}>*/}
                    <Text style={styles.versionNumber}>{version}</Text>
                {/*</View>*/}
                {/*<Button transparent>*/}
                    {/*<Icon style={styles.leftArrow} name='arrow-back' />*/}
                {/*</Button>*/}
            </Left>
            <Body>
                {/*<Text style={styles.versionNumber}>{version}</Text>*/}
                <Title style={styles.myTitle}>My.Marks</Title>
            </Body>
            <Right>
                <View style={{positon:"relative"}}>

            {/*<Icon style={styles.menuIcon} name='menu' />*/}
                    <View >
                        <Button transparent>
                            {this.props.userSetup.userID?<Text style={{color : "#4472C4", fontWeight : "700"}}>{this.props.userSetup.userName}  </Text>:null}
                            <Icon size={32} color={"#4472C4"} style={styles.menuIcon} name='person' onPress={()=>this.props.updateState('showLogin')}/>
                        </Button>
                    </View>
                </View>
            </Right>
        </Header>
        )
}
}

export default connect(mapStateToProps)(HeaderBlock)