/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {StyleSheet, Text, View, TextInput, Dimensions, Modal, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {
    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content, Footer, FooterTab, Badge,
    Form, Item, Input, Label, Spinner, CheckBox
} from 'native-base';
import { Avatar } from 'react-native-elements';
import {bindActionCreators} from 'redux';
import {instanceAxios, mapStateToProps, msgTimeOut, setStorageData, getStorageData} from '../../js/helpersLight'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import Dialog, {DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';
import styles from '../../css/styles'
import {LOGINUSER_URL, API_URL} from '../../config/config'
import FacebookLogin from '../FacebookLogin/facebooklogin'
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
import Video from 'react-native-video';
import VideoFile from '../../download/1.Android-Studying.mp4'
import Logo150 from '../../img/logo150.png'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";

// import AntIcon from "react-native-vector-icons/AntDesign";

// import AsyncStorage from '@react-native-community/async-storage';
// import {AsyncStorage} from 'react-native';

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
        this.showLogin = true
        this.onLogin = this.onLogin.bind(this)
        this.clearError = this.clearError.bind(this)
        this.forgotPwd = this.forgotPwd.bind(this)
    }
    componentDidMount(){
        this.getSavedCreds()
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate", this.props)
        // return true
        const {logging, loginmsg, logBtnClicked} = this.props.user

        // console.log("shouldComponentUpdate", this.props)
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
    // getSavedCreds=async()=>{
    //     const credents = await getStorageData("credent#")
    //     if (credents.length){
    //         if (credents.slice(0,1)==="1"){
    //             // console.log(login, pwd)
    //             const username = credents.split("#")[1]
    //             const password = credents.split("#")[2]
    //             this.setState({checkSave : true, username, password})
    //         }
    //     }
    // }
    // saveCredentials=(save)=>{
    //     if (save)
    //         setStorageData('credent#', `1#${this.state.username}#${this.state.password}`)
    //     else {
    //         setStorageData('credent#', `0##`)
    //     }
    //     this.setState({checkSave : save})
    //     console.log( save)
    // }
    getSavedCreds=async()=>{
        console.log("creds")
        const store = await getStorageData("creds")
        const creds = JSON.parse(store)
        console.log("getCreds", creds)
        if (creds){
            if (creds.isSet){
                this.setState({checkSave : true, username : creds.userName, password : creds.userPwd})
            }
        }
    }
    saveCredentials=(save)=>{
        const obj = {
            isSet : !!save,
            userName : save?this.state.username:null,
            userPwd : save?this.state.password:null,
        }
        setStorageData('creds', JSON.stringify(obj))
        this.setState({checkSave : save})
        console.log( save)
    }
    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val, this.refs)
        this.setState({[key]: val})
    }
    onLogin = () => {
        const {langLibrary, theme, themeColor} = this.props.userSetup
        this.props.updateState("userEmail", this.state.username)

        let name = this.state.username, //"test@gmail.com",
            pwd = this.state.password, //"test1",
            provider = null,
            provider_id = null

        if (Platform.OS !== 'ios')
        this.saveCredentials(this.state.checkSave);

        this.props.onReduxUpdate("SHOW_LOGIN", false)
        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")
        this.props.onUserLogging(name, pwd, provider, provider_id, langLibrary, theme, themeColor);
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
    render() {
        if (!this.props.user.hasOwnProperty("loginmsg"))
            this.props.user.loginmsg = ''
        if (!this.props.user.hasOwnProperty("logBtnClicked"))
            this.props.user.logBtnClicked = false

        const {logging, loginmsg, logBtnClicked} = this.props.user
        const {theme, userID, token, footerHeight, langLibrary, themeColor} = this.props.userSetup
        console.log("LOGIN_RENDER")
        // const showModal = this.showLogin&&logBtnClicked&&(!loginmsg.length)
        // return <View></View>

        return (
            <View style={{backgroundColor: theme.primaryColor, height : Dimensions.get('window').height}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showVideo}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{
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
                                borderWidth: 2, borderColor: theme.photoButtonColor, zIndex: 10,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: theme.photoButtonColor,
                                    zIndex: 10,
                                }}
                                >X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>
                {/*{this.props.user.logging ? <View*/}
                    {/*style={{position: "absolute", flex: 1, alignSelf: 'center', marginTop: 240, zIndex: 100}}>*/}
                    {/*<Spinner color={theme.secondaryColor}/>*/}
                {/*</View> : null}*/}
                <Form>
                    <View>
                        <Dialog
                            visible={loginmsg.length ? true : false}
                            dialogStyle={{backgroundColor: theme.primaryColor, color: theme.primaryDarkColor}}
                            footer={
                                <DialogFooter>
                                    <DialogButton
                                        textStyle={{color: theme.primaryDarkColor}}
                                        text="OK"
                                        onPress={this.clearError}
                                    />
                                </DialogFooter>
                            }
                        >
                            <DialogContent style={{paddingTop: 20, paddingBottom: 20}}>
                                <Text style={{color: theme.primaryDarkColor}}>{this.props.user.loginmsg}</Text>
                            </DialogContent>
                        </Dialog>
                    </View>

                    {/*<View style={{position: "relative", marginLeft : 0}}>*/}
                       {/*<Image source={Logo150}/>*/}
                    {/*</View>*/}
                    {/*<Item floatingLabel>*/}
                            {/*<Label>Email</Label>*/}
                            {/*<Input ref={component => this._nameLogin = component}*/}
                                {/*// autoFocus={true}*/}
                                   {/*value={this.state.username}*/}
                                   {/*onChangeText={text => this.onChangeText('username', text)}*/}
                            {/*/>*/}
                    {/*</Item>*/}
                    <Item style={{marginTop : 20, borderColor: 'transparent'}}>
                        <View style={{flex : 1, alignItems : "center", justifyContent : "center", height : 120, width : Dimensions.get('window').width}}>
                            <View
                                style={{
                                    position : "relative",
                                    height: 120,
                                    width: 120,
                                    borderRadius: 120,
                                    backgroundColor : theme.primaryTextColor,
                                    alignItems : "center", justifyContent : "center"}}>
                                <View style={{ flex : 1, justifyContent: "center", alignItems: "center" }}>
                                    <Icon
                                        color={theme.primaryLightColor}
                                        style={{marginLeft : 10, color : theme.primaryLightColor, fontSize : 80}}
                                        name='person'/>
                                </View>
                            </View>
                            {/*<Avatar*/}
                                {/*size={"xlarge"}*/}
                                {/*rounded*/}
                                {/*icon={{name: 'user-graduate', type: 'font-awesome'}}*/}
                                {/*onPress={() => console.log("Works!")}*/}
                                {/*activeOpacity={0.7}*/}
                                {/*containerStyle={{flex: 2, marginLeft: 10, marginTop: 10}}*/}
                            {/*/>*/}
                            {/*<AntIcon name="minuscircleo" color="green" size={50} />*/}
                            {/*<Avatar*/}
                                {/*size={150}*/}
                                {/*rounded*/}
                                {/*icon={{name: 'user', type: 'font-awesome'}}*/}
                                {/*onPress={() => console.log("Works!")}*/}
                                {/*activeOpacity={0.7}*/}
                                {/*containerStyle={{flex: 2, marginLeft: 20, marginTop: 115}}*/}
                            {/*/>*/}
                        </View>
                    </Item>
                    <Item rounded style={{marginLeft : 60, marginRight : 60, marginTop : 20, borderColor: 'transparent'}}>
                        <Input
                               style={{fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0, color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3, borderColor : theme.primaryBorderColor, borderRadius : 30}}
                               value={this.state.username.length?this.state.username:""}
                               onChangeText={text => this.onChangeText('username', text)}
                        />
                    </Item>

                    {/*<Item floatingLabel>*/}
                            {/*<Label>Пароль</Label>*/}
                            {/*<Input secureTextEntry={true}*/}
                                   {/*value={this.state.password}*/}
                                   {/*ref={component => this._pwdLogin = component}*/}
                                   {/*onChangeText={val => this.onChangeText('password', val)}/>*/}
                    {/*</Item>*/}

                    <Item rounded style={{marginLeft : 60, marginTop : 10, marginRight : 60, borderColor: 'transparent'}}>
                        <Input
                            style={{fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0, color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3, borderColor : theme.primaryBorderColor, borderRadius : 30}}
                            secureTextEntry={true}
                            value={this.state.password.length?this.state.password:""}
                            onChangeText={text => this.onChangeText('password', text)}
                        />
                    </Item>

                    {/*<TouchableOpacity onPress={()=>{this.setState({checkSave:!this.state.checkSave})}}>*/}
                    <Item style={{ marginLeft : 60, marginTop : 10, marginBottom : 5, borderColor : 'transparent'}}>
                       <View>
                            <CheckBox checked={this.state.checkSave} onPress={()=>{this.saveCredentials(!this.state.checkSave)}} color={theme.primaryDarkColor}/>
                        </View>
                        <View style={{ marginLeft : 20}}>
                            <Text style={{color : theme.primaryDarkColor}}>{langLibrary.mobSaveCheckBox}</Text>
                        </View>
                    </Item>

                    {userID ?   <Button style={{  marginLeft : 60, marginTop : 5, marginRight : 60, borderRadius : 30,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color : theme.primaryDarkColor, backgroundColor : theme.secondaryLightColor}} onPress={()=>this.props.onUserLoggingOut(token, langLibrary, theme, themeColor)}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>{langLibrary.mobExit===undefined?'':langLibrary.mobExit.toUpperCase()}</Text>
                                    </View>
                                </Button> :
                                <Button style={{marginLeft : 60, marginTop : 5, marginRight : 60, borderRadius : 30,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color : theme.primaryDarkColor, backgroundColor : theme.primaryTextColor}} onPress={this.onLogin}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>{langLibrary.mobLogin===undefined?'':langLibrary.mobLogin.toUpperCase()}</Text>
                                    </View>
                                </Button>}

                    {/*<Button block light style={styles.inputButtonDark} onPress={this.forgotPwd}>*/}
                                <View style={{marginTop : 20,
                                    width : "100%",
                                    justifyContent: "center",
                                    alignItems: "center"}}>
                                    <Text style={{  color : theme.primaryDarkColor,
                                                    textDecorationLine: 'underline'}} onPress={this.forgotPwd}
                                          disabled={this.state.sendMailButtonDisabled}>
                                        {!this.state.sendMailButtonDisabled ? `${langLibrary.mobSendPwd}`: `${langLibrary.mobSendPwd}`}</Text>
                                        </View>

                                <View style={{marginTop : 50,
                                    width : Dimensions.get('window').width - 240,
                                    flex : 1,
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection : 'row',
                                    marginLeft : 120, marginRight : 120
                                    }}>
                                   <View
                                        style={{
                                            position : "relative",
                                            height: 40,
                                            width: 40,
                                            borderRadius: 40,
                                            color : theme.primaryTextColor,
                                            backgroundColor : theme.facebookColor,
                                            alignItems : "center", justifyContent : "center"}}>
                                       <Text style={{fontWeight : "800", color : theme.primaryTextColor}}>f</Text>
                                   </View>

                                    <View
                                        style={{
                                            position : "relative",
                                            height: 40,
                                            width: 40,
                                            borderRadius: 40,
                                            backgroundColor : theme.googleColor,
                                            alignItems : "center", justifyContent : "center"}}>
                                        <Text style={{fontWeight : "800", color : "#000"}}>g+</Text>
                                    </View>

                                </View>


                        {/*</Button>*/}

                    {/*<Button block info style={styles.inputButton} onPress={this.onLogin}>*/}
                        {/*<Text style={styles.loginButton}>Логин</Text>*/}
                    {/*</Button>*/}


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

                    {/* Живой код*/}
                    {/*<Button block primary disabled style={styles.inputButton} onPress={() => alert("Facebook")}>*/}
                        {/*<Text style={styles.loginButton}>Facebook</Text>*/}
                    {/*</Button>*/}
                    {/*<Button block danger disabled style={styles.inputButton} onPress={() => alert("Google")}>*/}
                        {/*<Text style={styles.loginButton}>Google</Text>*/}
                    {/*</Button>*/}


                    {/*<Button block light style={styles.inputButtonDark} onPress={this.forgotPwd}>*/}
                        {/*<Text style={styles.loginButton}*/}
                              {/*disabled={this.state.sendMailButtonDisabled}>*/}
                            {/*{!this.state.sendMailButtonDisabled ? `Забыли пароль - отправить на${this.state.username && this.state.username.length ? (': ' + this.state.username) : ' почту'}?` : "Отправлено"}</Text>*/}
                    {/*</Button>*/}

                    {/*{userID ? <Button block warning style={[styles.inputButton, {marginTop: 15}]}*/}
                                                           {/*onPress={()=>this.props.onUserLoggingOut(this.props.userSetup.token)}>*/}
                        {/*<Text style={styles.loginButton}>ВЫХОД</Text>*/}
                    {/*</Button> : null}*/}
                    {/* Живой код*/}

                </Form>
                <View style={{marginTop: 30, marginLeft : Dimensions.get('window').width - 70}}>
                    {/*/!*<Button block info style={[styles.inputButton, {marginTop: 10}]}*!/*/}
                    {/*/!*onPress={() => this.setState({showVideo: true})}>*!/*/}
                    <Icon onPress={() => this.setState({showVideo: true})} style={{fontSize : 54, color : theme.primaryLightColor}} name='videocam'/>
                    {/*/!*<Text style={[styles.loginButton, {"color": "#fff"}]}>ОБУЧАЮЩЕЕ ВИДЕО</Text>*!/*/}
                    {/*/!*</Button>*!/*/}
                </View>
                {/*<View style={{marginTop: 5}}>*/}
                    {/*<Button block info style={[styles.inputButton, {marginTop: 10}]}*/}
                            {/*onPress={() => this.setState({showVideo: true})}>*/}
                        {/*<Icon name='videocam'/>*/}
                        {/*<Text style={[styles.loginButton, {"color": "#fff"}]}>ОБУЧАЮЩЕЕ ВИДЕО</Text>*/}
                    {/*</Button>*/}
                {/*</View>*/}
            </View>
        )

    }
}

const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onUserLogging: (name, pwd, provider, provider_id, langLibrary, theme, themeColor) => {
            dispatch({type: 'APP_LOADING'})
            console.log("OnUserLogging")
            const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary, theme, themeColor) => {
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary, theme, themeColor))
                }
            }
            dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary, theme, themeColor))
        },
        onUserLoggingByToken: async (email, token, kind, langLibrary, theme, themeColor) => {
            const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                return async dispatch => {
                    dispatch(userLoggedInByToken(email, token, kind, langLibrary, theme, themeColor))
                }
            }
            dispatch(asyncLoggedInByToken(email, token, kind, langLibrary, theme, themeColor))
        },
        onUserLoggingOut: (token, langLibrary, theme, themeColor) => {
            return dispatch(userLoggedOut(token, langLibrary, theme, themeColor))
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