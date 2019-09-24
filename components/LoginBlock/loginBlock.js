/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label} from 'native-base';
import { bindActionCreators } from 'redux';
// import { addFriend } from './FriendActions';
import { instanceAxios, mapStateToProps, msgTimeOut /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

import styles from '../../css/styles'
import { LOGINUSER_URL } from '../../config/config'

class LoginBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatMessages : [],
            selectedFooter : 0,
            showLogin : true,
            username: '',
            password: '',
            userID: 0,
            userName : '',
            // buttonClicked : false,
            // loading : false,
            // buttonClicked : false,
        }
        // this.buttonClicked = false
        this.showLogin = true
        this.onLogin = this.onLogin.bind(this)
        this.clearError = this.clearError.bind(this)
        // this.onChangeText = this.onChangeText.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
    }
    componentDidMount() {
        // this.props.onStartLogging()
        // this.props.onReduxUpdate("USER_LOGGING")
        // this.nameLogin.focus()
    }
    shouldComponentUpdate(nextProps, nextState) {
        const {logging, loginmsg, logBtnClicked} = this.props.user
        console.log("shouldComponentUpdate", this.props.user,
            logging, loginmsg,
            this.state.buttonClicked,
            this.buttonClicked,
            logBtnClicked,
            "test")

        // if ((this.props.userSetup.chatSessionID !== nextProps.userSetup.chatSessionID))
        //     return false
        // else
        // if (!this.state.langLibrary)
        //     return false
        // else {
        //     return true
        // }


        // if (this.props.user.loginmsg.length){
        //     // this.setState({loading : false})
        //     // this.props.updateState("showLogin", false)
        //     return true
        // }
        // if (this.props.user.loading) {
        //     return true
        // }
        if (logging) {
            return true
        }
        if ((!logging)&&(!loginmsg.length)&&(logBtnClicked)){
            this.props.updateState("showLogin", false)
            this.showLogin = false
            // console.log('SHOWLOGIN_FALSE')
            // this.setState({showLogin : false})
            // this.forceUpdate()
            this.props.onReduxUpdate("LOG_BTN_UNCLICK")
            // this.props.onReduxUpdate('USER_LOGGEDIN_DONE')
            // this.props.onStopLogging()

        }
        return true
    }

    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val, this.refs)
        this.setState({ [key]: val})
        // alert(key, val)
        // this.props.updateState()
    }
    onLogin=()=>{
        // alert(this.state.username + ' ' + this.state.password + ' ' + this.refs)
        // alert(this.refs.nameLogin.value + " " + this.refs.pwdLogin.value)
        // return
        let  name = this.state.username, //"test@gmail.com",
            pwd = this.state.password, //"test1",
            provider = null,
            provider_id = null


        // const data = {
        //     "email": name,
        //     "password": pwd,
        //     "provider" : provider,
        //     "provider_id" : provider_id,
        //     "token" : null,
        // };
        // alert('onLogin', this.state.username, this.state.password)
        // ToDO: Подсветить неверный пароль
        // console.log("START_LOGIN", "!!!")

        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")

        this.props.onUserLogging(name, pwd, provider, provider_id /*,  langLibraryF(this.state.myCountryCode?this.state.myCountryCode:"GB")*/);

        // console.log("AFTER_LOGGING", this.props.user)
        // this.setState({buttonClicked : true})
        // this.buttonClicked = true

        //
        // if (!this.props.user.loginmsg.length&&!this.props.user.logging)
        // this.props.updateState("showLogin", false)
    }
    clearError(){
        console.log("clearError",this.props.user)
        // this.props.user.loginmsg.length&&setTimeout(this.props.onClearErrorMsg(), msgTimeOut)
        this.props.onReduxUpdate("LOG_BTN_UNCLICK")
        this.props.onStopLogging()
        this.props.user.loginmsg.length&&this.props.onClearErrorMsg()
        // this.setState({buttonClicked : false})
        // this.buttonClicked = false
    }
    render() {

        const {logging, loginmsg, logBtnClicked} = this.props.user
        const showModal = this.showLogin&&logBtnClicked&&(!loginmsg.length)
        console.log("RENDER_LOGIN", showModal, this.state.showLogin, logBtnClicked, !loginmsg.length, this.showLogin)
        return (
            <View style={{backgroundColor : "#fff"}}>
                <Form>
                    {/*<View>*/}
                        {/*<Dialog*/}
                            {/*visible={showModal}*/}
                            {/*dialogStyle={{ backgroundColor: "#1890e6",  color: "#fff" }}>*/}
                            {/*<DialogContent style={{paddingTop : 20, paddingBottom : 20}}>*/}
                                {/*<Text style={{color : "#fff"}}>{"LOADING..."}</Text>*/}
                            {/*</DialogContent>*/}
                        {/*</Dialog>*/}
                    {/*</View>*/}
                    {/*{showModal?*/}
                        {/*<View style={{  backgroundColor :  "#1890e6", color : "#fff",*/}
                                        {/*width : 80, height : 40, borderRadius : 20,*/}
                                        {/*position : "absolute", marginTop : "50%", marginLeft : "50%"}}>*/}
                            {/*<Text style={{color : "#fff"}}>{"LOADING..."}</Text>*/}
                        {/*</View>:*/}
                        {/*null}*/}
                     <View>
                         <Dialog
                             visible={loginmsg.length?true:false}
                             dialogStyle={{ backgroundColor: "#1890e6",  color: "#fff" }}
                             footer={
                                <DialogFooter>
                                     <DialogButton
                                        text="OK"
                                        onPress={this.clearError}
                                    />
                                 </DialogFooter>
                            }
                        >
                             <DialogContent style={{paddingTop : 20, paddingBottom : 20}}>
                                 <Text style={{color : "#fff"}}>{this.props.user.loginmsg}</Text>
                             </DialogContent>
                         </Dialog>
                     </View>



                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input ref="nameLogin"/*ref={ (c) => this.nameLogin = c }*/
                               // autoFocus={true}
                               onChangeText={text=>this.onChangeText('username', text)}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Пароль</Label>
                        <Input secureTextEntry={true}
                               ref="pwdLogin"
                               onChangeText={val => this.onChangeText('password', val)}/>
                    </Item>
                    <Button iconRight full info style={styles.inputButton} onPress={() => this.onLogin()}>
                        <Text style={styles.loginButton}>Логин</Text>
                    </Button>
                    <Button iconRight full primary style={styles.inputButton} onPress={() => alert("Facebook")}>
                        <Text style={styles.loginButton}>Facebook</Text>
                    </Button>
                    <Button iconRight full danger style={styles.inputButton} onPress={() => alert("Google")}>
                        <Text style={styles.loginButton}>Google</Text>
                    </Button>
                </Form>
            </View>
        )

    }
}

const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onUserLogging : (name, pwd, provider, provider_id, langLibrary) =>{
            dispatch({type: 'APP_LOADING'})
            console.log("OnUserLogging")
            const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary) =>{
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary))
                }}
            dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary))
        },
        onUserLoggingByToken :
            async (email, token, kind, langLibrary)=>{
                const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                    return async dispatch => {
                        dispatch(userLoggedInByToken(email, token, kind, langLibrary))
                    }
                }
                dispatch(asyncLoggedInByToken(email, token, kind, langLibrary))
            },
        onUserLoggingOut  : (token, langLibrary) => {
            return dispatch(userLoggedOut(token, langLibrary))
        },
        onClearErrorMsg : ()=>{
            dispatch({type: 'USER_MSG_CLEAR', payload: []})
        },
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStudentChartSubject  : value => {
            return dispatch({type: 'UPDATE_STUDENT_CHART_SUBJECT', payload: value})
        },
        onStopLogging : ()=> dispatch({type: 'USER_LOGGEDIN_DONE'}),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
        // onStartLogging : ()=> dispatch({type: 'USER_LOGGING'}),
        onChangeStepsQty : (steps)=>dispatch({type: 'ENABLE_SAVE_STEPS', payload : steps})
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock)