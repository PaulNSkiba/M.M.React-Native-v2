/**
 * Created by Paul on 27.08.2019.
 */

import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label} from 'native-base';
import { bindActionCreators } from 'redux';
// import { addFriend } from './FriendActions';
// import { LOGINUSER_URL } from './config/config'
import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import { LOGINUSER_URL } from '../../config/config'
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
                <Button transparent>
                    <Icon style={styles.leftArrow} name='arrow-back' />
                </Button>
            </Left>
            <Body>
                <Title style={styles.myTitle}>My.Marks</Title>
            </Body>
            <Right>
                <Button transparent>
            {/*<Icon style={styles.menuIcon} name='menu' />*/}
                    {this.props.userSetup.userID?<Text>{this.props.userSetup.userName}  </Text>:null}
                    <Icon style={styles.menuIcon} name='md-person' onPress={()=>this.props.updateState('showLogin')}/>
                </Button>
            </Right>
        </Header>
        )
}
}

export default connect(mapStateToProps)(HeaderBlock)