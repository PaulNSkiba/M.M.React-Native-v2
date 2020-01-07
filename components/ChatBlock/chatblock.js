/**
 * Created by Paul on 28.08.2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput, AppState} from 'react-native';
import { connect } from 'react-redux';
import {Spinner} from 'native-base';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label} from 'native-base';
import { instanceAxios, mapStateToProps } from '../../js/helpersLight'
import LoginBlock from '../LoginBlock/loginBlock'
import ChatMobile from '../ChatMobile/chatmobile'

class ChatBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render=()=>{
        // console.log("chatRender", this.props.user.logging, this.props.userSetup.loading)
        const {userID, showLogin, theme} = this.props.userSetup
        return (
        <View style={{flex : 1, position : "relative", flexDirection: 'column', height : "50%"}}>
            {this.props.user.logging?<View style={{position : "absolute", flex: 1, alignSelf : 'center', marginTop : 240, zIndex : 100 }}><Spinner color={theme.secondaryColor}/></View>:null}
            <View style={{flex : 1, position : "relative"}}>
            {/*{!userID||showLogin?<LoginBlock updateState={this.props.updateState}/>:null}*/}
            {userID&&(!showLogin)?
                        <ChatMobile
                            isnew={true}
                            updatemessage={this.props.updateMessages}
                            hidden={this.props.hidden}
                            forceupdate={this.props.forceupdate}
                            setstate={this.props.setstate}
                            messages={this.state.chatMessages}
                            subjs={this.props.userSetup.selectedSubjects}
                            btnclose={() => { this.setState({displayChat: !this.state.displayChat}) }}
                            display={this.state.displayChat} newmessage={this.newChatMessage}
                        />
                :<LoginBlock updateState={this.props.updateState}/>}
            </View>
        </View>)
    }
}

export default connect(mapStateToProps)(ChatBlock)