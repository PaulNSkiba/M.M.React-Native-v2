/**
 * Created by Paul on 28.08.2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label} from 'native-base';
// import { bindActionCreators } from 'redux';
// import { addFriend } from './FriendActions';
// import { LOGINUSER_URL } from './config/config'
import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import LoginBlock from '../LoginBlock/loginBlock'
import HeaderBlock from '../HeaderBlock/headerBlock'
import ChatMobile from '../ChatMobile/chatmobile'

class ChatBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // chatMessages : [],
            // selectedFooter : 0,
            // showLogin : false,
            // username: '',
            // password: '',
            // userID: 0,
            // userName : '',
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
    }
    render=()=>{
        return (
        <View style={{flex : 1, position : "relative", flexDirection: 'column', height : "50%"}}>
            <View style={{flex : 1, position : "relative"}}>
            {this.props.showLogin?
                <LoginBlock updateState={this.props.updateState}/>
                :null}
            {   this.props.userSetup.userID > 0&&(!this.props.showLogin)?
                    <ChatMobile
                        isnew={true}
                        updatemessage={this.props.updateMessages}

                        // session_id={this.props.userSetup.chatSessionID}
                        // homeworkarray={this.props.userSetup.homework}
                        // chatroomID={this.props.userSetup.classObj.chatroom_id}

                        messages={this.state.chatMessages}
                        subjs={this.props.userSetup.selectedSubjects}
                        btnclose={() => {
                            this.setState({displayChat: !this.state.displayChat})
                        }}
                        display={this.state.displayChat} newmessage={this.newChatMessage}
                    />
                :null
            }
            </View>
        </View>)
    }
}

export default connect(mapStateToProps)(ChatBlock)