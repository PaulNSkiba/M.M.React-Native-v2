/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {StyleSheet, Text, View, TextInput, Dimensions, Modal,
        TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
import {connect} from 'react-redux';
import {Container, Header, Left, Body, Right, Button,
        Icon, Title, Content, Footer, FooterTab, Badge,
        Form, Item, Input, Label, Spinner, CheckBox} from 'native-base';
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
import SvgUri from 'react-native-svg-uri-reborn';

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
            sendMailButtonDisabled: false,
            showVideo: false,
            checkSave : false,
        }
        this.showLogin = true
        this.onLogin = this.onLogin.bind(this)
        this.clearError = this.clearError.bind(this)
        this.forgotPwd = this.forgotPwd.bind(this)
    }
    componentDidMount(){
        this.getSavedCreds()
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', false);
    }
    componentWillUnmount(){
        this.keyboardDidShowSub&&this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub&&this.keyboardDidHideSub.remove();
        this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate", this.props)
        // return true
        const {logging, loginmsg, logBtnClicked} = this.props.user

        // console.log("shouldComponentUpdate", this.props)
        if (logging) {
            return true
        }
        if ((!logging) && (loginmsg!==undefined&&!loginmsg.length) && (logBtnClicked)) {
            this.props.updateState("showLogin", false)
            this.showLogin = false
            this.props.onReduxUpdate("LOG_BTN_UNCLICK")
        }
        return true
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        console.log("keyboardHeight", keyboardHeight)
        // const currentlyFocusedField = this._animatedView;

        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", true)
        this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", keyboardHeight)
        // this.setState({viewHeight : (windowHeight - keyboardHeight), keyboardHeight})

        console.log("handleKeyboardDidShow")
    }

    handleKeyboardDidHide = () => {
        // const { height: windowHeight } = Dimensions.get('window');
        // this.setState({viewHeight : (windowHeight), keyboardHeight : 0})

        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", 0)
        console.log("handleKeyboardDidHide")

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
        const {userName, password, email} = this.props.saveddata
        // console.log("getCreds", creds)
        if (Platform.OS==='ios'){
            this.setState({checkSave: true, username: email, password: password})
        }
        else {
            if (creds) {
                if (creds.isSet) {
                    this.setState({checkSave: true, username: creds.userName, password: creds.userPwd})
                }
                else {
                    this.setState({checkSave: true, username: email, password: password})
                }
            }
            else {
                this.setState({checkSave: true, username: email, password: password})
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
        // console.log( save)
    }
    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val)
        this.setState({[key]: val})
    }
    onLogin = () => {
        const {langLibrary, classID} = this.props.userSetup
        const {theme, themeColor} = this.props.interface
        this.props.updateState("showDrawer", false)
        this.props.updateState("userEmail", this.state.username)
        this.props.updateState("calcStat", false)

        let name = this.state.username, //"test@gmail.com",
            pwd = this.state.password, //"test1",
            provider = null,
            provider_id = null

        if (Platform.OS !== 'ios')
        this.saveCredentials(this.state.checkSave);

        // if (classID > 0) {
        //     console.log("GETSTAT")
        //     this.props.onReduxUpdate("UPDATE_VIEWSTAT", getViewStat(classID))
        // }

        this.props.onReduxUpdate("SAVE_CREDS", {userName : name, password : pwd})
        this.props.onReduxUpdate("SHOW_LOGIN", false)
        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")
        this.props.onUserLogging(name, pwd, provider, provider_id, langLibrary, theme, themeColor);
    }

    clearError() {
        console.log("clearError", this.props.user)
        this.props.onReduxUpdate("LOG_BTN_UNCLICK")
        this.props.onStopLogging()
        this.props.onStopLoading()
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
    getLangWord=keyword=>{
        const {langLibrary} = this.props.userSetup
        if (langLibrary!==undefined&&langLibrary[keyword]!==undefined)
            return langLibrary[keyword]
        else
        // this.props.onReduxUpdate("UPDATE_LANGLIBRARY", true)
            return keyword

    }
    render() {
        if (!this.props.user.hasOwnProperty("loginmsg"))
            this.props.user.loginmsg = ''
        if (!this.props.user.hasOwnProperty("logBtnClicked"))
            this.props.user.logBtnClicked = false

        const {logging, loginmsg, logBtnClicked} = this.props.user
        const {showFooter, showKeyboard, footerHeight, theme, themeColor, online} = this.props.interface
        const {userID, token, langLibrary} = this.props.userSetup
        const {userName, password, email} = this.props.saveddata

        // console.log("LOGIN_RENDER")
        // const showModal = this.showLogin&&logBtnClicked&&(!loginmsg.length)
        // return <View></View>

 //       const svgLogo = `
  // <svg width="32" height="32" viewBox="0 0 32 32">
  //   <path
  //     fill-rule="evenodd"
  //     clip-rule="evenodd"
  //     fill="url(#gradient)"
  //     d="M4 0C1.79086 0 0 1.79086 0 4V28C0 30.2091 1.79086 32 4 32H28C30.2091 32 32 30.2091 32 28V4C32 1.79086 30.2091 0 28 0H4ZM17 6C17 5.44772 17.4477 5 18 5H20C20.5523 5 21 5.44772 21 6V25C21 25.5523 20.5523 26 20 26H18C17.4477 26 17 25.5523 17 25V6ZM12 11C11.4477 11 11 11.4477 11 12V25C11 25.5523 11.4477 26 12 26H14C14.5523 26 15 25.5523 15 25V12C15 11.4477 14.5523 11 14 11H12ZM6 18C5.44772 18 5 18.4477 5 19V25C5 25.5523 5.44772 26 6 26H8C8.55228 26 9 25.5523 9 25V19C9 18.4477 8.55228 18 8 18H6ZM24 14C23.4477 14 23 14.4477 23 15V25C23 25.5523 23.4477 26 24 26H26C26.5523 26 27 25.5523 27 25V15C27 14.4477 26.5523 14 26 14H24Z"
  //   />
  //   <defs>
  //     <linearGradient
  //       id="gradient"
  //       x1="0"
  //       y1="0"
  //       x2="8.46631"
  //       y2="37.3364"
  //       gradient-units="userSpaceOnUse">
  //       <stop offset="0" stop-color="#FEA267" />
  //       <stop offset="1" stop-color="#E75A4C" />
  //     </linearGradient>
  //   </defs>
  // </svg>`;
  //       const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 192.756 192.756"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#fff" d="M0 0h192.756v192.756H0V0z"/><path d="M61.711 107.064c-11.23 0-16.256-4.338-16.256-10.764 0-6.227 5.025-10.608 16.256-10.608 11.186 0 16.212 4.359 16.212 10.608 0 6.427-5.004 10.764-16.212 10.764zm73.535-.789l-19.926-.016.008-2.615s2.02-.236 2.842-.344c.82-.109 1.143-.807 1.139-1.58-.002-.773.01-9.693.01-10.598-.002-.905-.414-1.428-1.301-1.556-.887-.127-2.719-.311-2.719-.311V86.46h19.947c9.051 0 12.965 4.403 12.965 9.652 0 5.827-3.914 10.163-12.965 10.163zm-56.437.071v-2.717s2.383-.264 2.756-.328c.899-.158 1.223-.756 1.222-1.693V91.229c0-1.012-.445-1.573-1.41-1.68-.312-.034-2.568-.296-2.568-.296v-2.796s13.832-.011 14.044-.01c.752.004 1.267.364 1.663.871.08.102 10.488 13.857 10.488 13.857s.004-8.895 0-9.833c-.002-.938-.33-1.635-1.283-1.752-.297-.037-2.695-.318-2.695-.318v-2.815h12.73v2.791s-2.232.241-2.697.314c-1.094.17-1.275.91-1.281 1.699-.004.79 0 15.086 0 15.086l-9.982-.002c-.662 0-1.32-.301-1.678-.76-.236-.303-10.556-13.957-10.556-13.957s-.005 9.207 0 10.119.449 1.475 1.258 1.572c.808.098 2.72.311 2.72.311v2.717H78.809v-.001zm-70.297-.004l-.008-2.654s1.628-.191 2.635-.314c1.007-.125 1.35-.773 1.351-1.908V91.372c.002-1.014-.251-1.721-1.321-1.883-.373-.057-2.656-.31-2.656-.31l-.001-2.727h15.912l-.015 2.711s-2.373.267-2.687.313c-.813.113-1.27.639-1.276 1.778v3.154h12.265v-3.084c0-.987-.292-1.729-1.215-1.852s-2.77-.333-2.77-.333l.006-2.688h15.912l-.014 2.713s-1.9.223-2.739.327c-.839.104-1.228.752-1.226 1.817.001.187-.006 9.213 0 10.354.006 1.143.643 1.568 1.166 1.637.524.066 2.819.324 2.819.324l-.007 2.719h-15.91l.014-2.729s2.423-.268 2.732-.328c1.086-.219 1.236-.957 1.232-1.861s0-3.039 0-3.039H20.446s-.009 1.846 0 3.186.639 1.719 1.248 1.805c.77.1 2.728.316 2.728.316l.002 2.65H8.512zm130.558-9.963c0-5.003-2.023-6.117-6.871-6.117h-5.092v12.169h5.092c4.848.001 6.871-1.003 6.871-6.052zm-70.286-.012c0-5.159-2.58-6.855-7.094-6.855-4.515 0-7.094 1.696-7.094 6.855 0 5.227 2.58 6.891 7.094 6.891s7.094-1.664 7.094-6.891zm90.589 9.983h-12.729v-2.715s1.756-.236 2.705-.359 1.328-.879 1.436-1.051c.109-.168 6.209-10.05 6.74-10.935s-.029-1.561-.725-1.685c-.486-.087-3.523-.399-3.523-.399l-.002-2.75h15.533c.973.027 1.572 1.12 1.572 1.12l8.924 13.651c.723 1.1 1.271 1.908 2.154 2.039.885.129 2.781.35 2.781.35l.012 2.73h-17.199l.016-2.697s1.133-.15 2.168-.285c1.037-.135 1.908-.584 1.049-1.846-.859-1.26-.838-1.248-.838-1.248l-12.191.027s-.379.57-.971 1.486c-.59.914.033 1.492.908 1.6l2.182.271-.002 2.696zm.104-9.647l7.678.039-3.883-6.14-3.795 6.101z"/></g></svg>`
        return (
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss(), console.log("LoginBlock:onPress")}}>
            <View style={{position : "relative", backgroundColor: theme.primaryColor, height : (Dimensions.get('window').height - (footerHeight===0?60:footerHeight))}}>
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
                            visible={loginmsg===undefined?'':loginmsg.length ? true : false}
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
                    <Item style={{marginTop : 10, borderColor: 'transparent'}}>
                        {!showKeyboard?
                        <View onPress={()=>{console.log("View: Press")}} style={{flex : 1, alignItems : "center", justifyContent : "center", height : 120, width : Dimensions.get('window').width}}>
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

                            {/*<SvgUri*/}
                                {/*width="100"*/}
                                {/*height="100"*/}
                                {/*source={{uri:'http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg'}}*/}
                                {/*fill={theme.primaryDarkColor}*/}
                                {/*// svgXmlData={svgLogo}*/}
                            {/*/>*/}

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
                            :null}
                        {/*</TouchableWithoutFeedbackComponent>*/}
                    </Item>

                    <Item rounded style={{marginLeft : 60, marginRight : 60, marginTop : 20, borderColor: 'transparent'}}>
                        <Input
                               style={{fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0, color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3, borderColor : theme.primaryBorderColor, borderRadius : 30}}
                               value={this.state.username!==undefined?(this.state.username.length?this.state.username:""):''}
                               onChangeText={text =>this.onChangeText('username', text)}
                               onBlur={()=>console.log("Input:username:blur")}
                        />
                    </Item>
                    <Item rounded style={{marginLeft : 60, marginTop : 10, marginRight : 60, borderColor: 'transparent'}}>
                        <Input
                            style={{fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0, color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3, borderColor : theme.primaryBorderColor, borderRadius : 30}}
                            secureTextEntry={true}
                            value={this.state.password.length?this.state.password:""}
                            onChangeText={text => this.onChangeText('password', text)}
                        />
                    </Item>
                    {/*<Item floatingLabel>*/}
                            {/*<Label>Пароль</Label>*/}
                            {/*<Input secureTextEntry={true}*/}
                                   {/*value={this.state.password}*/}
                                   {/*ref={component => this._pwdLogin = component}*/}
                                   {/*onChangeText={val => this.onChangeText('password', val)}/>*/}
                    {/*</Item>*/}

                    {/*<TouchableOpacity onPress={()=>{this.setState({checkSave:!this.state.checkSave})}}>*/}
                    {Platform.OS !== 'ios'?
                    <Item style={{ marginLeft : 60, marginTop : 10, marginBottom : 5, borderColor : 'transparent'}}>
                       <View>
                            <CheckBox checked={this.state.checkSave} onPress={()=>{this.saveCredentials(!this.state.checkSave)}} color={theme.primaryDarkColor}/>
                        </View>
                        <View style={{ marginLeft : 20}}>
                            <Text style={{color : theme.primaryDarkColor}}>{this.getLangWord("mobSaveCheckBox")}</Text>
                        </View>
                    </Item>:null}

                    {userID&&token ?   <Button style={{  marginLeft : 60, marginTop : Platform.OS !== 'ios'?5:10, marginRight : 60, borderRadius : 30,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color : theme.primaryDarkColor, backgroundColor : theme.secondaryLightColor}}
                                        onPress={()=>{this.props.onReduxUpdate("INIT_STATDATA"); this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false); this.props.onUserLoggingOut(token, langLibrary, theme, themeColor)}}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>
                                            {this.getLangWord("mobExit").toUpperCase()}
                                        </Text>
                                    </View>
                                </Button> :
                                <Button style={{marginLeft : 60, marginTop : Platform.OS !== 'ios'?5:10, marginRight : 60, borderRadius : 30,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color : theme.primaryDarkColor, backgroundColor : theme.primaryTextColor}}
                                        onPress={()=>{Keyboard.dismiss(); this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false);this.onLogin()}}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>
                                            {this.getLangWord("mobLogin").toUpperCase()}
                                        </Text>
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
                                        {!this.state.sendMailButtonDisabled ? `${this.getLangWord("mobSendPwd")}`: `${this.getLangWord("mobSendPwd")}`}</Text>
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
                <View style={{position: "absolute", bottom: Platform.OS !== 'ios'?120:70, marginLeft : Dimensions.get('window').width - 70}}>
                    <Icon onPress={() => this.setState({showVideo: true})} style={{fontSize : 54, color : theme.primaryLightColor}} name='videocam'/>
                </View>
            </View>
            </TouchableWithoutFeedback>
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