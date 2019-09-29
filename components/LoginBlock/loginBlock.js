/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label, Spinner} from 'native-base';
import { bindActionCreators } from 'redux';
import { instanceAxios, mapStateToProps, msgTimeOut /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import styles from '../../css/styles'
// import { addFriend } from './FriendActions';
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
            sendMailButtonDisabled : false,
            // buttonClicked : false,
            // loading : false,
            // buttonClicked : false,
        }
        // this.buttonClicked = false
        this.showLogin = true
        this.onLogin = this.onLogin.bind(this)
        this.clearError = this.clearError.bind(this)
        this.forgotPwd = this.forgotPwd.bind(this)
    }
    shouldComponentUpdate(nextProps, nextState) {
        const {logging, loginmsg, logBtnClicked} = this.props.user
        console.log("shouldComponentUpdate", this.props.user,
            logging, loginmsg,
            this.state.buttonClicked,
            this.buttonClicked,
            logBtnClicked,
            "test")

        if (logging) {
            return true
        }
        if ((!logging)&&(!loginmsg.length)&&(logBtnClicked)){
            this.props.updateState("showLogin", false)
            this.showLogin = false
            this.props.onReduxUpdate("LOG_BTN_UNCLICK")
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

        // alert('onLogin', this.state.username, this.state.password)
        // ToDO: Подсветить неверный пароль
        // console.log("START_LOGIN", "!!!")

        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")
        this.props.onUserLogging(name, pwd, provider, provider_id);
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
    forgotPwd=()=>{
        // this.refs.nameLogin.blur()
        // this.refs.nameLogin.setNativeProps({'editable': false});
        // this.refs.nameLogin.setNativeProps({'editable':true});
        this.setState({sendMailButtonDisabled : true})
    }
    render() {

        const {logging, loginmsg, logBtnClicked} = this.props.user
        const showModal = this.showLogin&&logBtnClicked&&(!loginmsg.length)
        console.log("RENDER_LOGIN", showModal, this.state.showLogin, logBtnClicked, !loginmsg.length, this.showLogin)
        return (
            <View style={{backgroundColor : "#fff"}}>
                {this.props.user.logging?<View style={{position : "absolute", flex: 1, alignSelf : 'center', marginTop : 240, zIndex : 100 }}><Spinner color="#33ccff"/></View>:null}
                <Form>
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
                        <Input ref="nameLogin"
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
                    <Button block info style={styles.inputButton} onPress={() => this.onLogin()}>
                        <Text style={styles.loginButton}>Логин</Text>
                    </Button>
                    <Button block primary disabled style={styles.inputButton} onPress={() => alert("Facebook")}>
                        <Text style={styles.loginButton}>Facebook</Text>
                    </Button>
                    <Button block danger disabled style={styles.inputButton} onPress={() => alert("Google")}>
                        <Text style={styles.loginButton}>Google</Text>
                    </Button>
                    <Button block light style={styles.inputButtonDark} onPress={this.forgotPwd}>
                        <Text style={styles.loginButton}
                              disabled={this.state.sendMailButtonDisabled}>
                            {!this.state.sendMailButtonDisabled?`Забыли пароль - отправить на${this.state.username.length?(': '+this.state.username):' почту'}?`:"Отправлено"}</Text>
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