/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {StyleSheet, Text, View, TextInput, Dimensions, Modal, TouchableOpacity} from 'react-native';
import {AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {
    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content, Footer, FooterTab, Badge,
    Form, Item, Input, Label, Spinner, CheckBox
} from 'native-base';
import {bindActionCreators} from 'redux';
import {instanceAxios, mapStateToProps, msgTimeOut /*, langLibrary as langLibraryF*/} from '../../js/helpersLight'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import Dialog, {DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';
import styles from '../../css/styles'
import {LOGINUSER_URL, API_URL} from '../../config/config'
import FacebookLogin from '../FacebookLogin/facebooklogin'
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
import Video from 'react-native-video';
import VideoFile from '../../download/1.Android-Studying.mp4'
// import AsyncStorage from '@react-native-community/async-storage';

class LoginBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatMessages: [],
            selectedFooter: 0,
            showLogin: true,
            username: '',
            password: '',
            userID: 0,
            // userName: '',
            sendMailButtonDisabled: false,
            showVideo: false,
            checkSave : false,
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
    componentDidMount(){
        this.getSavedCreds()
    }
    getSavedCreds=()=>{
        let credents = ''
        AsyncStorage.getItem("credent#")
            .then(res => {
                credents = res
                console.log("credents", credents, credents.slice(0,1), credents.slice(0,1)==="1")
                if (credents.length){
                    if (credents.slice(0,1)==="1"){
                        // console.log(login, pwd)
                        const username = credents.split("#")[1]
                        const password = credents.split("#")[2]
                        this.setState({checkSave : true, username, password})
                    }
                }

            })
            .catch(err => console.log("getSavedCreds", err));
    }
    shouldComponentUpdate(nextProps, nextState) {
        const {logging, loginmsg, logBtnClicked} = this.props.user
        // console.log("shouldComponentUpdate", this.props.user,
        //     logging, loginmsg,
        //     this.state.buttonClicked,
        //     this.buttonClicked,
        //     logBtnClicked,
        //     "test")

        if (logging) {
            return true
        }
        if ((!logging) && (!loginmsg.length) && (logBtnClicked)) {
            this.props.updateState("showLogin", false)
            this.showLogin = false
            this.props.onReduxUpdate("LOG_BTN_UNCLICK")
        }
        return true
    }

    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val, this.refs)
        this.setState({[key]: val})

        // alert(key, val)
        // this.props.updateState()
    }
    onLogin = () => {
        // alert(this.state.username + ' ' + this.state.password + ' ' + this.refs)
        // alert(this.refs.nameLogin.value + " " + this.refs.pwdLogin.value)
        // return
        this.props.updateState("userEmail", this.state.username)

        let name = this.state.username, //"test@gmail.com",
            pwd = this.state.password, //"test1",
            provider = null,
            provider_id = null

        this.saveCredentials(this.state.checkSave);

        // console.log("START_LOGIN", "!!!")
        this.props.onReduxUpdate("SHOW_LOGIN", false)

        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")
        this.props.onUserLogging(name, pwd, provider, provider_id);
    }

    clearError() {
        console.log("clearError", this.props.user)
        this.props.onReduxUpdate("LOG_BTN_UNCLICK")
        this.props.onStopLogging()
        this.props.user.loginmsg.length && this.props.onClearErrorMsg()
        // this.setState({buttonClicked : false})
        // this.buttonClicked = false
    }

    forgotPwd = () => {
        // this.refs.nameLogin.blur()
        // this.refs.nameLogin.setNativeProps({'editable': false});
        // this.refs.nameLogin.setNativeProps({'editable':true});
        instanceAxios().get(API_URL + 'mail/' + this.state.username)
            .then(response => {
                console.log("forgotPwd", response)
            })
            .catch(error => {
                console.log("forgotPwd", error)
            })
        this.setState({sendMailButtonDisabled: true})
    }

    handleFacebookLogin() {
        LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log('Login cancelled')
                } else {
                    console.log('Login success with permissions: ' + result.grantedPermissions.toString())
                }
            },
            function (error) {
                console.log('Login fail with error: ' + error)
            }
        )
    }
    saveCredentials=(save)=>{
        if (save)
            AsyncStorage.setItem('credent#', `1#${this.state.username}#${this.state.password}`)
        else {
            AsyncStorage.setItem('credent#', `0##`)
        }
        this.setState({checkSave : save})
        console.log( save)
    }
    render() {
        const {logging, loginmsg, logBtnClicked} = this.props.user
        // console.log("LOGIN_RENDER", this.props.user)
        // const showModal = this.showLogin&&logBtnClicked&&(!loginmsg.length)
        return (
            <View style={{backgroundColor: "#fff"}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showVideo}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{
                        // borderWidth: 2,
                        // borderColor: "#f00",

                        width: Dimensions.get('window').width * 1,
                        height: Dimensions.get('window').height * 0.94,
                        // marginBottom : 50,
                    }}>
                        <Video
                            // source={{uri: `${API_URL}download/1.Android-StudingSmall.mp4`}}//{VideoFile}
                            source={VideoFile}
                            resizeMode="cover"
                            style={StyleSheet.absoluteFill}
                            // muted={true}
                            controls={true}
                            //{uri: `${API_URL}download/1.Android-Studing.mp4`} // Can be a URL or a local file.
                        />

                        <TouchableOpacity
                            style={{position: "absolute", top: 10, right: 10, zIndex: 10}}
                            onPress={() => this.setState({showVideo: false})}>
                            <View style={{

                                paddingTop: 5, paddingBottom: 5,
                                paddingLeft: 15, paddingRight: 15, borderRadius: 5,
                                borderWidth: 2, borderColor: "#33ccff", zIndex: 10,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: "#33ccff",
                                    zIndex: 10,
                                }}
                                >X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>
                {this.props.user.logging ? <View
                    style={{position: "absolute", flex: 1, alignSelf: 'center', marginTop: 240, zIndex: 100}}>
                    <Spinner color="#33ccff"/>
                </View> : null}
                <Form>
                    <View>
                        <Dialog
                            visible={loginmsg.length ? true : false}
                            dialogStyle={{backgroundColor: "#1890e6", color: "#fff"}}
                            footer={
                                <DialogFooter>
                                    <DialogButton
                                        text="OK"
                                        onPress={this.clearError}
                                    />
                                </DialogFooter>
                            }
                        >
                            <DialogContent style={{paddingTop: 20, paddingBottom: 20}}>
                                <Text style={{color: "#fff"}}>{this.props.user.loginmsg}</Text>
                            </DialogContent>
                        </Dialog>
                    </View>

                    <Item floatingLabel>
                            <Label>Email</Label>
                            <Input ref={component => this._nameLogin = component}
                                // autoFocus={true}
                                   value={this.state.username}
                                   onChangeText={text => this.onChangeText('username', text)}
                            />
                    </Item>
                    <Item floatingLabel>
                            <Label>Пароль</Label>
                            <Input secureTextEntry={true}
                                   value={this.state.password}
                                   ref={component => this._pwdLogin = component}
                                   onChangeText={val => this.onChangeText('password', val)}/>
                    </Item>
                    {/*<TouchableOpacity onPress={()=>{this.setState({checkSave:!this.state.checkSave})}}>*/}
                    <Item style={{ marginTop : 10, marginBottom : 5, borderColor : "#fff"}}>
                            {/*<View style={{display : "flex", flex : 1, width : "100%"}}>*/}
                           <View>
                                <CheckBox checked={this.state.checkSave} onPress={()=>{this.saveCredentials(!this.state.checkSave)}} color="#62b1f6"/>
                            </View>
                            <View style={{ marginLeft : 20}}>
                                <Text>{"Сохранить логин и пароль"}</Text>
                            </View>
                    </Item>
                    {/*</TouchableOpacity>*/}
                    <Button block info style={styles.inputButton} onPress={this.onLogin}>
                        <Text style={styles.loginButton}>Логин</Text>
                    </Button>

                    {/*<LoginButton*/}
                    {/*style={{ width: "100%", height: 48, marginTop : 10, padding : 10 }}*/}
                    {/*onLoginFinished={*/}
                    {/*(error, result) => {*/}
                    {/*if (error) {*/}
                    {/*console.log("login has error: " + result.error);*/}
                    {/*} else if (result.isCancelled) {*/}
                    {/*console.log("login is cancelled.");*/}
                    {/*} else {*/}
                    {/*AccessToken.getCurrentAccessToken().then(*/}
                    {/*(data) => {*/}
                    {/*console.log(data.accessToken.toString())*/}
                    {/*}*/}
                    {/*)*/}
                    {/*}*/}
                    {/*}*/}
                    {/*}*/}
                    {/*onLogoutFinished={() => console.log("logout.")}/>*/}

                    {/*<FacebookLogin/>*/}

                    <Button block primary disabled style={styles.inputButton} onPress={() => alert("Facebook")}>
                        <Text style={styles.loginButton}>Facebook</Text>
                    </Button>
                    <Button block danger disabled style={styles.inputButton} onPress={() => alert("Google")}>
                        <Text style={styles.loginButton}>Google</Text>
                    </Button>
                    <Button block light style={styles.inputButtonDark} onPress={this.forgotPwd}>
                        <Text style={styles.loginButton}
                              disabled={this.state.sendMailButtonDisabled}>
                            {!this.state.sendMailButtonDisabled ? `Забыли пароль - отправить на${this.state.username && this.state.username.length ? (': ' + this.state.username) : ' почту'}?` : "Отправлено"}</Text>
                    </Button>
                    {this.props.userSetup.userID ? <Button block warning style={[styles.inputButton, {marginTop: 15}]}
                                                           onPress={()=>this.props.onUserLoggingOut(this.props.userSetup.token)}>
                        <Text style={styles.loginButton}>ВЫХОД</Text>
                    </Button> : null}
                </Form>
                <View style={{marginTop: 5}}>
                    <Button block info style={[styles.inputButton, {marginTop: 10}]}
                            onPress={() => this.setState({showVideo: true})}>
                        <Icon name='videocam'/>
                        <Text style={[styles.loginButton, {"color": "#fff"}]}>ОБУЧАЮЩЕЕ ВИДЕО</Text>
                    </Button>
                </View>
            </View>
        )

    }
}

const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onUserLogging: (name, pwd, provider, provider_id, langLibrary) => {
            dispatch({type: 'APP_LOADING'})
            console.log("OnUserLogging")
            const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary) => {
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary))
                }
            }
            dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary))
        },
        onUserLoggingByToken: async (email, token, kind, langLibrary) => {
            const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                return async dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind, langLibrary))
                }
            }
            dispatch(asyncLoggedInByToken(email, token, kind, langLibrary))
        },
        onUserLoggingOut: (token, langLibrary) => {
            return dispatch(userLoggedOut(token, langLibrary))
        },
        onClearErrorMsg: () => {
            dispatch({type: 'USER_MSG_CLEAR', payload: []})
        },
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStudentChartSubject: value => {
            return dispatch({type: 'UPDATE_STUDENT_CHART_SUBJECT', payload: value})
        },
        onStopLogging: () => dispatch({type: 'USER_LOGGEDIN_DONE'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        // onStartLogging : ()=> dispatch({type: 'USER_LOGGING'}),
        onChangeStepsQty: (steps) => dispatch({type: 'ENABLE_SAVE_STEPS', payload: steps})
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock)