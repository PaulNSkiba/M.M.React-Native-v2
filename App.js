/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar,
        TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions,
        AppState, Platform, Animated, Checkbox } from 'react-native';
import {setStorageData, getStorageData, getNextStudyDay, daysList, toYYYYMMDD,
        themeOptions, hasAPIConnection, axios2, getViewStat, getViewStatStart,
        getNearestSeptFirst, prepareJSON, prepareMessageToState, dateFromYYYYMMDD, prepareImageJSON, sendMail} from './js/helpersLight'
import axios from 'axios';
import {API_URL, arrLangs, supportEmail}        from './config/config'
import { Container, Content, Body, Footer, FooterTab, Spinner, Button, Tabs, Tab, TabHeading, Toast } from 'native-base';
import HeaderBlock from './components/HeaderBlock/headerBlock'
import ChatBlock from './components/ChatBlock/chatblock'
import ChatMobile from './components/ChatMobile/chatmobile'
import HomeworkBlock from './components/HomeworkBlock/homeworkblock'
import MarksBlock from './components/MarksBlock/marksblock'
import HelpBlock from './components/HelpBlock/helpblock'
import CameraBlock from './components/CameraBlock/camerablock'
import ETCBlock from './components/ETCBlock/etcblock'
import ButtonWithBadge from './components/ButtonWithBadge/buttonwithbadge'
import styles from './css/styles'
import {instanceAxios} from './js/helpersLight'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Drawer from 'react-native-drawer'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import FlagUK from './img/united-kingdom-flag-square-icon-32.png'
import FlagRU from './img/russia-flag-square-icon-32.png'
import FlagUA from './img/ukraine-flag-square-icon-32.png'
import Modal from "react-native-modal";
import WhoTyping from './components/WhoTyping/whotyping'
import AddMsgContainer from './components/AddMsgContainer/addmsgcontainer'
import LoginBlock from './components/LoginBlock/loginBlock'
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

// import * as Animatable from 'react-native-animatable';
// import BottomDrawer from 'rn-bottom-drawer';
// import SlidingUpPanel from 'rn-sliding-up-panel';
// import { checkInternetConnection, offlineActionCreators } from 'react-native-offline';
// import {AsyncStorage} from 'react-native';
// import {AsyncStorage} from '@react-native-community/async-storage';

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(0),
            appState : AppState.currentState,
            appStateChanged : false,
            appNetWorkChanget : false,
            bounceValue: new Animated.Value(100),  //This is the initial position of the subview
            chatMessages: [],
            chatID : this.props.stat.chatID,
            calcStat : false,
            curMessage : "",
            daysArr : daysList().map(item => { let o = {}; o.label = item.name; o.value = item.id; o.date = item.date; return o; }),
            Echo : null,
            isChatConnected : false,
            isHiddenMenu : true,
            isSpinner: false,
            isLastMsg : false,
            initialDay : 0,
            isNews : false,
            helpChat : false,
            homeworks: 0,
            localChatMessages : this.props.userSetup.localChatMessages,
            langLibrary : {},
            marksInBaseCount: 0,
            msgs: 0,
            messagesNew : [],
            messages : [],
            markID : this.props.stat.markID,
            password: '',
            selectedFooter: 0,
            showLogin: false,
            showDrawer : false,
            username: '',
            userID: 0,
            userName: '',
            userEmail: '',
            userToken: '',
        }
        let {langCode} = this.props.interface
        this.defLang = langCode && arrLangs.includes(this.props.userSetup.langCode)?langCode : "UA"
        this.session_id = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
        this.showDrawer = this.showDrawer.bind(this)
        this.connectivityCheck = this.connectivityCheck.bind(this)
        // this.firstSeptember = getNearestSeptFirst()
        this.thisYearMarks = [] //this.props.userSetup.marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst()))
        this.renewStat = this.renewStat.bind(this)
        this.isnew = true
        // this.isHidden = true
    }
    // handleOpen = () => {
    //     Animated.timing(this.state.animation, {
    //         toValue: 1,
    //         duration: 300,
    //         useNativeDriver: true,
    //     }).start();
    // };
    // handleClose = () => {
    //     console.log("handleClose")
    //     Animated.timing(this.state.animation, {
    //         toValue: 0,
    //         duration: 200,
    //         useNativeDriver: true,
    //     }).start();
    // };
    componentWillMount(){
        (async ()=> {
            const {langCode} = this.props.interface
            const {classID, langLibrary} = this.props.userSetup
            const {gotStats} = this.props.stat
            if (langLibrary===undefined) {
                this.props.onStartLoading()
                await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
                this.props.onStopLoading()
            }
            else {
                if (!Object.keys(langLibrary).length) {
                    this.props.onStartLoading()
                    await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
                    this.props.onStopLoading()
                }
            }
            // if (!this.state.calcStat&&classID>0&&!gotStats)
        })()
    }
    async componentDidMount() {
        // console.log("COMPONENT_DID_MOUNT", this.props.userSetup)
        if ((Platform.OS === 'ios') || ((Platform.OS === 'android')&&(Platform.Version > 22))) // > 5.1
        {
            MaterialIcons.loadFont()
            Ionicons.loadFont()
            AntDesign.loadFont()
            Foundation.loadFont()
            AppState.addEventListener('change', this._handleAppStateChange);

            this.getSessionID();

            this.connectivityCheck();

            const {classID} = this.props.userSetup

            // console.log("COMPONENT_DID_MOUNT", classID)
            // this.renewStat(classID)

            // console.log("componentDidMount: App", this.props.userSetup)
            // if (classID > 0) {
            //     console.log("GETSTAT")
            //     // const stat =
            //     this.props.onReduxUpdate("UPDATE_VIEWSTAT", await getViewStat(classID))
            // }

            const {email, token} = this.props.saveddata
//            const dataSaved = JSON.parse(await getStorageData("myMarks.data"))
//             const {email, token} = dataSaved
            this.props.onReduxUpdate("INIT_STATDATA")
            this.props.onReduxUpdate("INIT_TEMPDATA")
            this.props.onReduxUpdate("UPDATE_TOKEN", token===null?'':token)
            this.setState({userEmail: email, userToken: token===null?'':token})
        }
    }

    // componentWillUnmount(){
    //     this.keyboardDidShowSub.remove();
    //     this.keyboardDidHideSub.remove();
    // }
    componentWillUnmount() {
        // if ((Platform.OS === 'ios') || ((Platform.OS === 'android')&& (Platform.Version > 22))) // > 5.1
        // {
        //     AppState.removeEventListener('change', this._handleAppStateChange);
        // }
        AppState.removeEventListener('change', this._handleAppStateChange);
        // this.keyboardDidShowSub.remove();
        // this.keyboardDidHideSub.remove();
    }
    _toggleSubview() {
        // this.setState({
        //     buttonText: !isHidden ? "Show Subview" : "Hide Subview"
        // });
        let toValue = 100;
        if(this.state.isHiddenMenu)
            toValue = 0;

        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 3,
                // tension: 2,
                // friction: 8,
            }
        ).start();
        this.setState({isHiddenMenu : !this.state.isHiddenMenu})
    }
    handleKeyboardDidShow = (event) => {
        // const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;

        // console.log("keyboardHeight", keyboardHeight)
        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", true)
        this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", keyboardHeight)
        // this.setState({viewHeight : (windowHeight - keyboardHeight), keyboardHeight})
        // console.log("handleKeyboardDidShow")
    }

    handleKeyboardDidHide = () => {
        // const { height: windowHeight } = Dimensions.get('window');
        // this.setState({viewHeight : (windowHeight), keyboardHeight : 0})

        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", 0)

        // console.log("handleKeyboardDidHide")

    }
    getLangAsync = async (lang) => {
        let {langCode} = this.props.interface
        if (!lang) {
            lang = langCode ? langCode : this.defLang
        }
        let langObj = {}

        // console.log("getLangLibrary:start", lang)
        // console.log("langURL_0")
        // console.log('langURL_', `${API_URL}langs/get${lang?('/'+lang):''}`)
        // console.log('langURL', AUTH_URL + ('/api/langs/get' + (lang.length?('/' + lang) : '')))

        let {token} = this.props.userSetup

        this.props.onReduxUpdate("LANG_CODE", lang)

        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }
        await axios.get(`${API_URL}langs/get${lang?('/'+lang):''}`, null, headers)
            .then(res => {
                    console.log("LANG_RES", res)
                    res.data.forEach(item => langObj[item.alias] = item.word)
                    this.props.onReduxUpdate("LANG_LIBRARY", langObj)
                    this.setState({langLibrary: langObj});
                    this.props.onStopLoading()
            })
            .catch(res => {
                this.props.onStopLoading()
                console.log("ERROR_LANG", res)
            })
    }
    onSelectLang = async countryCode => {
        this.getLangAsync(countryCode)
        this.props.onReduxUpdate("LANG_LIBRARY", this.state.langLibrary)
        this.props.onReduxUpdate("LANG_CODE", countryCode)
    }
    connectivityCheck() {
        hasAPIConnection()
            .then(res=> {
                console.log("AppCheck", res)
                this.props.onReduxUpdate('UPDATE_ONLINE', res)
            })
            .catch(res=>console.log("AppCheck:error", res))

        // checkInternetConnection()
        //     .then(isConnected => {
        //             console.log("AppCheck", isConnected)
        //             // store.dispatch(connectionChange(isConnected));
        //             this.props.onReduxUpdate('UPDATE_ONLINE', isConnected)
        //     })
        //     .catch(res=>console.log("AppCheck:error", res))
    }
    _handleAppStateChange = (nextAppState) => {
        const {classID, studentId} = this.props.userSetup
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // console.log('AppState: ', 'App has come to the foreground!');
            if (classID) {
                this.renewStat(classID)
            }
        }
        else {
            // console.log('AppState: ', nextAppState);
        }
        this.setState({appState: nextAppState});
    };
    getSessionID() {
        let session_id = ''
        let header = {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            }
        }
        axios.get(`${API_URL}session`, [], header)
            .then(response => {
                // console.log("session", response.data.session_id);
                session_id = response.data.session_id
                this.session_id = session_id;
                setStorageData('chatSessionID', session_id)
                // AsyncStorage.setItem('chatSessionID', session_id)
            })
            .catch(response => {
                console.log("session_error", response);
            })
        return session_id
    }
    updateState = (stateKey, stateValue) => {
        switch (stateKey) {
            case 'showLogin' :
                this.setState({[stateKey]: !this.state.showLogin});
                break;
            default :
                this.setState({[stateKey]: stateValue});
                break;
        }
    }
    setstate = (obj) => {
        // console.log("setstate")
        this.setState(obj)
        this.setState({isHiddenMenu : true})
        this.props.onReduxUpdate("UPDATE_PAGE", obj.selectedFooter)
        obj.selectedFooter?this.props.onReduxUpdate("SHOW_LOGIN", false):null

    }
    fireRender = (msgs, homeworks) => {
        console.log("forceUpdate", homeworks)
        this.setState({msgs, homeworks})
    }
    measureView(event : Object) {
        // console.log("*** event:Footer:", event.nativeEvent);
        this.props.onReduxUpdate("FOOTER_HEIGHT", event.nativeEvent.layout.height)
    }
    showDrawer(){
        this.setState({showDrawer : !this.state.showDrawer})
    }
    renderPalette = (color) => {
        return <View>
                    <TouchableOpacity key={color} onPress={() => this.props.onReduxUpdate('CHANGE_THEME', color)}>
                        <View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: color, margin: 5}}>
                        </View>
                    </TouchableOpacity>
            </View>
    };
    renderDrawer(){
        const {langLibrary, userName, classID} = this.props.userSetup
        const {showFooter, showKeyboard, theme, themeColor} = this.props.interface
        const {online} = this.props.tempdata
        const colorOptions = Object.keys(themeOptions)
        let {stat} = this.props

        // console.log("renderDrawer")
        return  <Tabs initialPage={0} page={0}>
            <Tab key={"tab1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.8)}}>{langLibrary===undefined?'':(langLibrary.mobLogin===undefined?'':langLibrary.mobLogin.toUpperCase())}</Text></TabHeading>}>
                <View>
                    <LoginBlock updateState={this.updateState}/>
                </View>
            </Tab>
            {/*<Tab key={"tab2"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.8)}}>{langLibrary===undefined?'':(langLibrary.mobRegister===undefined?'':langLibrary.mobRegister.toUpperCase())}</Text></TabHeading>}>*/}
                {/*<View style={{height : "100%", width : "100%", backgroundColor : theme.primaryDarkColor}}>*/}

                {/*</View>*/}
            {/*</Tab>*/}
            <Tab key={"tab3"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.8)}}>{langLibrary===undefined?'':(langLibrary.mobSettings===undefined?'':langLibrary.mobSettings.toUpperCase())}</Text></TabHeading>}>
                    <View style={{
                    backgroundColor : theme.primaryColor,
                    height : Dimensions.get('window').height,
                    width : Dimensions.get('window').width,
                    flex: 1,
                    flexDirection : 'column',
                    zIndex : 102,
                    }}>
                    <View style={{height: 100, width: 300, margin : 5}}>
                        <View><Text style={{color : theme.primaryTextColor, fontWeight : '800', marginLeft : 10}}>{langLibrary===undefined?'':(langLibrary.lang===undefined?'':langLibrary.lang)}:</Text></View>
                        <View style={{  flex : 1, margin : 10, backgroundColor : "#fff", borderRadius: 10, height : 100, width : Dimensions.get('window').width - 30,
                            flexDirection : 'row', justifyContent : "space-around", alignItems : "center"}}>
                            <TouchableOpacity key={0} onPress={()=>{this.onSelectLang('GB')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : langLibrary===undefined?'':(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='GB'?"#dcdcdc":theme.primaryDarkColor, borderWidth : langLibrary===undefined?1:(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='GB'?1:4}}>
                                    <Image source={FlagUK}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity key={1} onPress={()=>{this.onSelectLang('RU')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : langLibrary===undefined?'':(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='RU'?"#dcdcdc":theme.primaryDarkColor, borderWidth : langLibrary===undefined?1:(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='RU'?1:4}}>
                                    <Image source={FlagRU}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity key={2} onPress={()=>{this.onSelectLang('UA')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : langLibrary===undefined?'':(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='UA'?"#dcdcdc":theme.primaryDarkColor, borderWidth : langLibrary===undefined?1:(langLibrary.langCode===undefined?'':langLibrary.langCode)!=='UA'?1:4}}>
                                    <Image source={FlagUA}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: 100, width: 300, margin : 5}}>
                        <View><Text style={{color : theme.primaryTextColor, fontWeight : '800', marginLeft : 10}}>{langLibrary===undefined?'':(langLibrary.colorTheme===undefined?'':langLibrary.colorTheme)}:</Text></View>
                        <View style={{  flex : 1, margin : 10, backgroundColor : "#fff", borderRadius: 10, height : 100, width : Dimensions.get('window').width - 30,
                                        flexDirection : 'row', justifyContent : "space-around", alignItems : "center"}}>
                            {
                                colorOptions.map(color=>
                                    <TouchableOpacity key={color} onPress={() =>{console.log("pressed"); this.props.onReduxUpdate('CHANGE_THEME', themeOptions[color]); this.props.onReduxUpdate('CHANGE_COLOR', color)}}>
                                        <View style={{position : 'relative', borderColor : themeColor!==color?"#dcdcdc":theme.primaryDarkColor, borderWidth : themeColor!==color?1:4}}>
                                            <View
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderWidth: 17,
                                                    position: 'relative',
                                                    borderLeftColor: themeOptions[color].primaryColor,
                                                    borderTopColor: themeOptions[color].primaryColor,
                                                    borderBottomColor: themeOptions[color].secondaryColor,
                                                    borderRightColor: themeOptions[color].secondaryColor
                                            }}>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            {/*<View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: "#fff", margin: 5}}></View>*/}
                            {/*<View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: "#fff", margin: 5}}></View>*/}
                        </View>
                    </View>
                    {userName==="Geo"||userName==="Paul"||userName==="Paul42"?
                        <Button style={{  marginLeft : 60, marginTop : 5, marginRight : 60, borderRadius : 30,
                            justifyContent: "center",
                            alignItems: "center",
                            color : theme.primaryDarkColor, backgroundColor : theme.secondaryLightColor}} onPress={()=>{
                                this.props.onReduxUpdate("INIT_STATDATA")
                                stat.chatID = 0
                                stat.markID = 0
                                setStorageData(`${classID}labels`, JSON.stringify(stat))
                            }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>Очистить счётчики</Text>
                            </View>
                        </Button>
                        :null}
                </View>
            </Tab>
        </Tabs>
    }
    renewStat=classID=>{
        // let {stat} = this.props
        // stat.gotStats = true
        // this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
        console.log("renewStat:start", classID)
        this.setState({calcStat : true})
        getViewStatStart(classID)
            .then(res=>{
                const {marks, localChatMessages, userID, classNews} = this.props.userSetup
                console.log("renewStat:then", res)
                // const unreadMsgsCount = localChatMessages.filter(item=>(item.id>chatID&&item.user_id!==userID)).length
                res.markCnt = marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst())).filter(item =>(Number(item.id) > res.markID)).length
                res.chatCnt = localChatMessages.filter(item => (item.id > res.chatID && item.user_id !== userID)).length
                res.newsCnt = classNews.filter(item =>(item.is_news===2&&(Number(item.id) > res.newsID))).length
                res.buildsCnt = classNews.filter(item =>(item.is_news===1&&(Number(item.id) > res.buildsID))).length

                this.props.onReduxUpdate("UPDATE_VIEWSTAT", res)

                this.setState({calcStat : false})
            })
            .catch(err=>console.log("renewStat:catch", err))
    }
    onLongPress=i=>{
        const {footerHeight} = this.props.interface
        if (i===0) {
           // this._toggleSubview()
           //  if (!this.state.isHidden)
           //      this._panel.show(footerHeight + 75)
           //  else
           //      this._panel.hide()
           //  if (this.state.isHidden)
           //      this.handleOpen()
           //  else
           //      this.handleClose()

            this.setState({isHiddenMenu : !this.state.isHiddenMenu})
            // this.handledView.transitionTo({ bottom : 150 })
        }
    }
    // renderContent = () => {
    //     return (
    //         <View style={{height : 100, width : 200}}>
    //             <Text>Get directions to your location</Text>
    //         </View>
    //     )
    // }
    addMessage=(text)=>{
        if (!text.length) return
        const {localChatMessages} = this.props.userSetup
        const obj = prepareJSON(text, this.props.userSetup, true, null, null, null)
        // console.log("APP: addMessage", [...localChatMessages, JSON.parse(obj)], obj)
        const objParsed = JSON.parse(obj)

        if (JSON.parse(obj).message.length) {
            // console.log("addMessage", objForState)
            if (this.isnew) {
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", [...localChatMessages, objParsed])
                this.setState({messagesNew : [...this.state.messagesNew, objParsed]})
                const objForState = prepareMessageToState(obj)
                objForState.msg_date = dateFromYYYYMMDD(toYYYYMMDD(new Date()))
                this.setState({messages: [...this.state.messages, objForState], isLastMsg : true})
             }
            this.sendMessage(obj, 0, false, true)
        }
    }
    async sendMessage(text, id, fromChat, isnew) {
        // console.log("sendMessage.1", id, text)
        // console.log("Next message!", text)
        // Передаём сообщение с определёнными параметрами (ID-сессии + ClassID)
        // console.log("sendMessage.2", text, id, this.props.isnew)

        switch (isnew) {
            case true :
                let arrChat = this.state.localChatMessages, obj = {}
                // console.log("601: Send message to server.1", "arr.before: ", arr)
                if (id > 0) {
                    arrChat = arrChat.map(item => {
                        obj = item
                        if (Number(obj.id) !== id)
                            return item
                        else {
                            obj.text = JSON.parse(text).message
                            return JSON.stringify(obj)
                        }
                    })
                }
                else {
                    arrChat.push(JSON.parse(text))
                }
                this.setState({messages: arrChat})
                await axios2('post', `${API_URL}chat/add${id?'/'+id:''}`, text)
                    .then(response => {
                        console.log('ADD_MSG', response)
                        // this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                        this.setState({curMessage : ''})
                    })
                    .catch(response=> {
                            console.log("AXIOUS_ERROR", response, text)
                            let {offlineMsgs} = this.props.userSetup
                            offlineMsgs.push(JSON.parse(text))
                            this.props.onReduxUpdate("ADD_OFFLINE", offlineMsgs)
                            // this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                            this.setState({curMessage: ''})
                        }
                    )
                // console.log("sendMessage", text, id)
                break;
            default :
                this.state.currentUser.sendMessage({
                    text,
                    roomId: this.roomId.toString()
                })
                    .catch(error => console.error('error Sending message', error));
                break;
        }
    }
    loadFile=async ()=>{
        const {classID, userName, userID, studentId, studentName} = this.props.userSetup
        let cnt = 0
        // Pick multiple files
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
            });
            this.props.onStartLoading()
            for (const res of results) {
                cnt++
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                );
                const split = res.uri.split('/');
                const splittype = res.type.split('/');
                // image/jpeg
                console.log("RES.SIZE", res.size, splittype[0], split[0], Platform.OS)
                let data = {}
                let data100 = {}

                if (res.size&&splittype[0]==="image") {
                    console.log("RES.SIZE", split[0], Platform.OS)
                    if ((Platform.OS === "android" && split[0] === "content:") || (Platform.OS === "ios" && split[0] === "file:")) {

                        // ImageResizer.createResizedImage(res.uri, 960, 540, 'PNG', 100)
                        //     .then(response => {
                        // console.log("ImageResizer, response)

                        RNFS.readFile(res.uri, 'base64')
                            .then(base64String => {
                                data.base64 = base64String
                                data.uri = res.uri
                                // data.height = 540
                                // data.width = 960
                                // console.log("READFILE:960", res.uri, base64String)
                                ImageResizer.createResizedImage(res.uri, 240, 240, 'PNG', 100)
                                    .then(response => {
                                        // console.log("ImageResizer, response)

                                        RNFS.readFile(response.uri, 'base64')
                                            .then(base64String => {
                                                data100.base64 = base64String
                                                data100.uri = response.uri
                                                data100.height = 240
                                                data100.width = 240
                                                // console.log("READFILE:240", res.uri, base64String)
                                                // console.log("IMG_JSON", data, data100, prepareImageJSON(data, data100,classID, userName, userID, studentId, studentName))
                                                // Toast.show({
                                                //     text: `Сообщение добавлено: ${cnt} из ${results.length}`,
                                                //     buttonText: 'ОК'
                                                // })

                                                const {localChatMessages} = this.props.userSetup
                                                const obj = prepareImageJSON(JSON.stringify(data), JSON.stringify(data100), classID, userName, userID, studentId, studentName)
                                                const objParsed = JSON.parse(obj)
                                                this.setState({messagesNew : [...this.state.messagesNew, objParsed]})
                                                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", [...localChatMessages, objParsed])
                                                this.setState({isLastMsg : true})

                                                this.sendMessage(obj, 0, false, true)

                                                this.props.onStopLoading()
                                                Toast.show({
                                                    text: `Файл добавлен: ${cnt} из ${results.length}`,
                                                    buttonText: 'ОК',
                                                    position : 'bottom',
                                                    duration : 2500,
                                                    style : {marginBottom : 100}
                                                    // type : 'success'
                                                })
                                            })
                                            .catch(err => {
                                                console.log("readFile0:Err", err)
                                                this.props.onStopLoading()
                                                // this.setState({isSpinner : false})
                                            });
                                    })
                                    .catch(err => {console.log("ImgToBase64:Err", err)
                                        this.props.onStopLoading()
                                        // this.setState({isSpinner : false})
                                    });
                            })
                            .catch(err => {
                                console.log("readFile1:Err")
                                this.props.onStopLoading()
                                // this.setState({isSpinner : false})
                            });
                        // })
                        // .catch(err => {console.log("ImgToBase64:Err")
                        //     // this.setState({isSpinner : false})
                        // });
                    }
                    else {
                        if (split[0] === "http:"||split[0] === "https:")
                            setTimeout(this.uploadFile(res.uri), 500)
                    }
                }
            }
        }
        catch (err) {
            console.log("FILE_ERROR", err)
            if (DocumentPicker.isCancel(err)) {

                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    addQuestionToService=text=>{
        // Если вопрос, то отправляем электронку на админский ящик
        // this._textarea.setNativeProps({'editable': false});
        // this._textarea.setNativeProps({'editable':true});
        if (!text.length) return
        // this.setState({isSpinner : true})
        const {studentId, userID, classID, classNews} = this.props.userSetup

        let json = `{
            "student_id" : ${studentId},
            "user_id" : ${userID?userID:1},
            "class_id" : ${classID?classID:1},
            "msg_date" : "${toYYYYMMDD(new Date())}",
            "msg_header" : "${userID?(this.state.isNews?"Новость":""):"Вопрос от незарегистрированного пользователя"}",
            "question" : "${""}",
            "answer" : "${""}",
            "is_news" : ${this.state.isNews?2:null}
        }`

        json = JSON.parse(json)
        json.question = text
        // console.log("addserv", `${API_URL}chat/addserv`, JSON.parse(JSON.stringify(json)), this.props.userSetup.token)
        axios2('post', `${API_URL}chat/addserv`, JSON.stringify(json))
            .then(response => {
                // console.log('ADD_MSG', response)
                // if (this.state.isNews) {
                //     let arr = classNews
                //     // console.log("NEWS", text)
                //     arr.unshift(response.data)
                //     this.props.onReduxUpdate("UPDATE_NEWS", arr)
                //
                //     // this._textarea.setNativeProps({'editable': false});
                //     // this._textarea.setNativeProps({'editable':true});
                //     // this.props.setstate({showFooter : true})
                //     this.setState({curMessage : ''})
                //     // this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                // }
                // else {
                    // console.log("QUESTION", text)

                    let arr = classNews
                    arr.unshift(response.data)
                    this.props.onReduxUpdate("UPDATE_NEWS", arr)

                    if (!this.state.isNews)
                        sendMail(supportEmail, text, this.props.userSetup, this.session_id)

                    // this._textarea.setNativeProps({'editable': false});
                    // this._textarea.setNativeProps({'editable':true});
                    // console.log("SETSTATE", arr)

                    // this.props.setstate({showFooter : true})
                    // this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                    this.setState({curMessage : ''})
                // }
            })
            .catch(response=> {
                    console.log("AXIOUS_ERROR", response)
                    // this.setState({isSpinner : false})
                }
            )
        // this.refs.textarea.blur()

        // this.refs.textarea.setNativeProps({'editable':true});
        // console.log("sendMessage", text, API_URL + 'chat/addserv')
    }
    render() {

        const {marks, localChatMessages, userID, token, langLibrary, classID, classNews, selectedSubjects} = this.props.userSetup
        const { theme, themeColor } = this.props.interface
        const {online, loading} = this.props.tempdata
        const {markID, markCnt, chatCnt, newsID} = this.props.stat
        const {selectedFooter, showDrawer} = this.state

        console.log("App:render", this.state.helpChat)

        const hwarray = localChatMessages.filter(item=>(item.homework_date!==null))
        let {daysArr, initialDay} = this.state
        initialDay = initialDay?initialDay: getNextStudyDay(daysArr)[0]

        const homework =
            (hwarray.length&&daysArr.length&&initialDay?hwarray.filter(item=>{
                    if (item.hasOwnProperty('ondate')) item.homework_date = new Date(item.ondate)
                    return toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(new Date((daysArr[initialDay]).date))
                }
            ).length:0)
        // Новости обновляются сразу
        if (selectedFooter===3) {
            const news = classNews.filter(item =>(item.is_news===2))
            if (news.length){
                let stat = this.props.stat
                stat.newsID = news[0].id
                stat.newsCnt = 0
                this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
                // console.log("STAT_OF_STAT", news, stat)
                setStorageData(`${classID}labels`, JSON.stringify(stat))
            }
        }

        // if (!this.state.calcStat&&classID>0&&!this.props.stat.gotStats) this.renewStat(classID)
        const buttonWidth = Dimensions.get('window').width/6

        if (!classID&&this.props.stat.gotStats) this.props.onReduxUpdate("INIT_STATDATA")

        const footerButtons = [
            {   name : langLibrary===undefined?'':langLibrary.mobChat===undefined?'':langLibrary.mobChat,
                icontype : 'material', iconname : 'message', badgestatus : 'primary', kind : 'chat', value : chatCnt },
            {   name : langLibrary===undefined?'':langLibrary.mobHomework===undefined?'':langLibrary.mobHomework,
                icontype : 'material', iconname : 'notifications', badgestatus : 'error', kind : 'homework', value : homework },
            {   name : langLibrary===langLibrary===undefined?'':langLibrary.mobMarks===undefined?'':langLibrary.mobMarks,
                icontype : 'material', iconname : 'timeline', badgestatus : 'success', kind : 'marks', value : markCnt },
            {   name : 'Info',
                icontype : 'material', iconname : 'info', badgestatus : 'warning', kind : 'info', value : 0 },
            {   name : langLibrary===undefined?'':langLibrary.mobCamera===undefined?'':langLibrary.mobCamera,
                icontype : 'material', iconname : 'camera', badgestatus : 'error', kind : '', value : 0 },
            {   name : 'etc',
                icontype : 'material', iconname : 'apps', badgestatus : 'error', kind : '', value : 0 },
        ]
        const modalButtons = [{name : 'ДЗ'}, {name : 'Родители'}, {name : '+Учитель'}, {name : 'Личные'}, {name : 'Workflox'}]
        return (
                <Container>
                    <StatusBar backgroundColor={theme.primaryDarkColor} hidden={false}/>
                    <HeaderBlock updateState={this.updateState}
                                 email={this.state.userEmail}
                                 showdrawer={this.showDrawer}
                                 token={(!this.props.user.logging)&&(!this.props.user.loggedin)?token:''}
                                 langLibrary={langLibrary}
                                 theme={theme}
                                 themeColor={themeColor}
                                 footer={this.state.selectedFooter}/>
                    {this.state.isSpinner||(loading&&loading!==-1) ? <View style={{position : "absolute", flex: 1, alignSelf : 'center', marginTop : 240, zIndex : 100 }}>
                        <Spinner color={theme.secondaryColor}/>
                    </View> : null}

                    <Drawer
                        open={!userID||this.state.showDrawer}
                        type="overlay"
                        content={this.renderDrawer()}
                        tapToClose={true}
                        openDrawerOffset={0} // 20% gap on the right side of drawer
                        panCloseMask={0}
                        closedDrawerOffset={-3}
                        styles={{
                            drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
                            main: {paddingLeft: 3},
                        }}
                        tweenHandler={(ratio) => ({
                            main: { opacity:(2-ratio)/2 }
                        })}
                    >
                        <Container>
                            <ChatMobile
                                isnew={true}
                                // updatemessage={this.props.updateMessages}
                                hidden={selectedFooter !== 0}
                                forceupdate={this.fireRender}
                                setstate={this.setstate}
                                // messages={this.state.chatMessages}
                                subjs={selectedSubjects}
                                // btnclose={() => {this.setState({displayChat: !this.state.displayChat}) }}
                                // display={this.state.displayChat}
                                // newmessage={this.newChatMessage}
                                updateState={this.updateState}
                                inputenabled={true}
                                newmessages={this.state.messagesNew}
                                localchatmessages={this.state.localChatMessages}
                                islastmsg={this.state.isLastMsg}
                            />
                            {/*<ChatBlock hidden={selectedFooter !== 0}*/}
                                       {/*showLogin={showLogin || (!token.length)}*/}
                                       {/*updateState={this.updateState}*/}
                                       {/*forceupdate={this.fireRender}*/}
                                       {/*setstate={this.setstate}*/}
                                       {/*inputenabled={true}*/}
                                       {/*newmessages={this.state.messagesNew}*/}
                            {/*/>*/}
                            {selectedFooter === 1 ?
                                <View style={styles.absoluteView}>
                                    <HomeworkBlock hidden={selectedFooter !== 1}
                                                   showLogin={this.state.showLogin}
                                                   forceupdate={this.fireRender}
                                                   setstate={this.setstate}/>
                                </View> : null}
                            {selectedFooter === 2 ?
                                <View style={styles.absoluteView}>
                                         <MarksBlock hidden={selectedFooter !== 2}
                                                    showLogin={this.state.showLogin}
                                                    // forceupdate={this.fireRender}
                                                    // setstate={this.setstate}
                                                    updateState={this.updateState}
                                         />
                                </View>
                                : null}
                            {selectedFooter === 3 ?
                                <View style={styles.absoluteView}>
                                    <HelpBlock hidden={selectedFooter !== 3}
                                               showLogin={this.state.showLogin}
                                               forceupdate={this.fireRender}
                                               setstate={this.setstate}
                                               session_id={this.session_id}
                                    />
                                </View> : null}
                            {selectedFooter === 4 ?
                                <View style={styles.absoluteView}>
                                    <CameraBlock hidden={selectedFooter !== 4}
                                                 showLogin={this.state.showLogin}
                                                 forceupdate={this.fireRender}
                                                 setstate={this.setstate}/>
                                </View> : null}
                            {selectedFooter === 5 ?
                                <View style={styles.absoluteView}>
                                    <ETCBlock hidden={selectedFooter !== 5}
                                              showLogin={this.state.showLogin}
                                              forceupdate={this.fireRender}
                                              setstate={this.setstate}/>
                                </View> : null}
                        </Container>
                    </Drawer>

                    <View style={{  position : "relative",
                        opacity : !userID?0:showDrawer?0:1,
                        height : !userID?0:showDrawer?0:(50+(selectedFooter===0?90:((this.state.helpChat&&selectedFooter===3)?70:0))),
                        // height : (50+70+20),
                    }}
                          onLayout={(event) =>this.measureView(event)}>
                        <Footer style={{
                            elevation: 0,
                            // borderWidth : 2, borderColor : "#f00",
                            zIndex : 1,
                            display : "flex", flexDirection : "column",
                            height : (50+(selectedFooter===0?90:((this.state.helpChat&&selectedFooter===3)?70:0))),
                            backgroundColor : theme.primaryTextColor
                        }}>
                            {(selectedFooter===0||(selectedFooter===3&&this.state.helpChat))?<View style={{display : "flex", flexDirection : "column", height : (selectedFooter===0?90:((this.state.helpChat&&selectedFooter===3)?70:0))}}>
                                {selectedFooter===0?<WhoTyping isConnected={this.state.isChatConnected} />:null}
                                <AddMsgContainer
                                    Echo={this.state.Echo}
                                    isnew={true}
                                    addmessage={selectedFooter===0?this.addMessage:(selectedFooter===3&&this.state.helpChat)?this.addQuestionToService:null}
                                    loadfile={this.loadFile}
                                    newmessages={this.state.messagesNew}
                                    localchatmessages={this.state.localChatMessages}
                                    index={this.state.selectedFooter}
                                    setstate={this.setstate}
                                    isNews={this.state.isNews}
                                />
                            </View>:null
                            }
                            <FooterTab style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor, height : 50}}>
                                {footerButtons.map((item, key)=><ButtonWithBadge
                                    enabled={this.state.selectedFooter === key}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={item.name}
                                    icontype={item.icontype}
                                    iconname={item.iconname}
                                    badgestatus={item.badgestatus}
                                    kind={item.kind}
                                    value={item.value}
                                    setstate={this.setstate}
                                    stateid={key}
                                    longpress={this.onLongPress}
                                />)}
                            </FooterTab>
                        </Footer>
                        <Modal
                            isVisible={!this.state.isHiddenMenu}
                            backdropOpacity={0.1}
                            style={{position : "absolute", height : 65, margin : 0,
                                padding : 0, bottom : 55,
                                width : buttonWidth * 5,
                                marginLeft : 5, marginRight : 5,
                                borderRadius : 8,
                                backgroundColor : theme.secondaryColor}}
                            onBackdropPress={() => this.setState({ isHiddenMenu : true })}>
                            <TouchableWithoutFeedback  onPress={()=>this.setState({isHiddenMenu : true})}>
                                <View style={{  height : 60,
                                    backgroundColor : theme.secondaryColor,
                                    bottom : 0, margin : 0,
                                    flex : 1,
                                    justifyContent : "space-between",
                                    flexDirection : "row",
                                    alignItems : "center",
                                    borderRadius : 8,
                                }}>
                                    {modalButtons.map((item, key)=>
                                        <ButtonWithBadge
                                            enabled={this.state.selectedFooter === key}
                                            disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                            onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                            name={item.name}
                                            icontype={'material'}
                                            iconname={'message'}
                                            badgestatus={'primary'}
                                            kind={'chat'}
                                            value={chatCnt}
                                            setstate={this.setstate}
                                            stateid={key}
                                            longpress={null}
                                        />
                                    )}
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>

                    {/*{showFooter ?*/}
                        {/*<View style={{position : "relative"}} onLayout={(event) =>this.measureView(event)}>*/}
                        {/*<Footer style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor, zIndex : 51}}>*/}
                            {/*<FooterTab style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor}}>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 0}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'':langLibrary.mobChat}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'message'}*/}
                                    {/*badgestatus={'primary'}*/}
                                    {/*kind={'chat'}*/}
                                    {/*value={chatCnt}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={0}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 1}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={langLibrary===undefined?'':langLibrary.mobHomework===undefined?'':langLibrary.mobHomework}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'notifications'}*/}
                                    {/*badgestatus={'error'}*/}
                                    {/*kind={'homework'}*/}
                                    {/*value={homework}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={1}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 2}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={langLibrary===undefined?'':langLibrary.mobMarks===undefined?'':langLibrary.mobMarks}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'timeline'}*/}
                                    {/*badgestatus={'success'}*/}
                                    {/*kind={'marks'}*/}
                                    {/*value={markCnt}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={2}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 3}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={"Info"}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'info'}*/}
                                    {/*badgestatus={'warning'}*/}
                                    {/*kind={'info'}*/}
                                    {/*value={0}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={3}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 4}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={langLibrary===undefined?'':langLibrary.mobCamera===undefined?'':langLibrary.mobCamera}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'camera'}*/}
                                    {/*badgestatus={'error'}*/}
                                    {/*kind={''}*/}
                                    {/*value={0}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={4}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                                {/*<ButtonWithBadge*/}
                                    {/*enabled={this.state.selectedFooter === 5}*/}
                                    {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                    {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                    {/*name={"etc"}*/}
                                    {/*icontype={'material'}*/}
                                    {/*iconname={'apps'}*/}
                                    {/*badgestatus={'error'}*/}
                                    {/*kind={''}*/}
                                    {/*value={0}*/}
                                    {/*setstate={this.setstate}*/}
                                    {/*stateid={5}*/}
                                    {/*longpress={this.onLongPress}*/}
                                {/*/>*/}
                            {/*</FooterTab>*/}
                        {/*</Footer>*/}
                        {/*<Modal*/}
                            {/*isVisible={!this.state.isHidden}*/}
                            {/*backdropOpacity={0.1}*/}
                            {/*style={{position : "absolute", height : 65, margin : 0,*/}
                                    {/*padding : 0, bottom : footerHeight + 5,*/}
                                    {/*width : buttonWidth * 5,*/}
                                    {/*marginLeft : 5, marginRight : 5,*/}
                                    {/*// borderWidth : .5, borderColor : theme.primaryDarkColor,*/}
                                    {/*borderRadius : 8,*/}
                                    {/*backgroundColor : theme.secondaryColor}}*/}
                            {/*onBackdropPress={() => this.setState({ isHidden : true })}>*/}
                            {/*<TouchableWithoutFeedback  onPress={()=>this.setState({isHidden : true})}>*/}
                                {/*<View style={{  height : 60,*/}
                                                {/*// borderWidth : .5, borderColor : theme.primaryDarkColor, borderRadius : 10,*/}
                                                {/*backgroundColor : theme.secondaryColor,*/}
                                                {/*bottom : 0, margin : 0,*/}
                                                {/*flex : 1,*/}
                                                {/*justifyContent : "space-between",*/}
                                                {/*flexDirection : "row",*/}
                                                {/*alignItems : "center",*/}
                                                {/*borderRadius : 8,*/}
                                    {/*}}>*/}
                                    {/*<ButtonWithBadge*/}
                                        {/*enabled={this.state.selectedFooter === 0}*/}
                                        {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                        {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                        {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'ДЗ':'ДЗ'}*/}
                                        {/*icontype={'material'}*/}
                                        {/*iconname={'message'}*/}
                                        {/*badgestatus={'primary'}*/}
                                        {/*kind={'chat'}*/}
                                        {/*value={chatCnt}*/}
                                        {/*setstate={this.setstate}*/}
                                        {/*stateid={0}*/}
                                        {/*longpress={null}*/}
                                    {/*/>*/}
                                    {/*<ButtonWithBadge*/}
                                        {/*enabled={false}*/}
                                        {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                        {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                        {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'Родители':'Родители'}*/}
                                        {/*icontype={'material'}*/}
                                        {/*iconname={'message'}*/}
                                        {/*badgestatus={'primary'}*/}
                                        {/*kind={'chat'}*/}
                                        {/*value={chatCnt}*/}
                                        {/*setstate={this.setstate}*/}
                                        {/*stateid={0}*/}
                                        {/*longpress={null}*/}
                                    {/*/>*/}
                                    {/*<ButtonWithBadge*/}
                                        {/*enabled={false}*/}
                                        {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                        {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                        {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'+Учитель':'+Учитель'}*/}
                                        {/*icontype={'material'}*/}
                                        {/*iconname={'message'}*/}
                                        {/*badgestatus={'primary'}*/}
                                        {/*kind={'chat'}*/}
                                        {/*value={chatCnt}*/}
                                        {/*setstate={this.setstate}*/}
                                        {/*stateid={0}*/}
                                        {/*longpress={null}*/}
                                    {/*/>*/}
                                    {/*<ButtonWithBadge*/}
                                        {/*enabled={false}*/}
                                        {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                        {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                        {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'Личные':'Личные'}*/}
                                        {/*icontype={'material'}*/}
                                        {/*iconname={'message'}*/}
                                        {/*badgestatus={'primary'}*/}
                                        {/*kind={'chat'}*/}
                                        {/*value={chatCnt}*/}
                                        {/*setstate={this.setstate}*/}
                                        {/*stateid={0}*/}
                                        {/*longpress={null}*/}
                                    {/*/>*/}
                                    {/*<ButtonWithBadge*/}
                                        {/*enabled={false}*/}
                                        {/*disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)*/}
                                        {/*onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null*/}
                                        {/*name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'Workflow':'Workflow'}*/}
                                        {/*icontype={'material'}*/}
                                        {/*iconname={'message'}*/}
                                        {/*badgestatus={'primary'}*/}
                                        {/*kind={'chat'}*/}
                                        {/*value={chatCnt}*/}
                                        {/*setstate={this.setstate}*/}
                                        {/*stateid={0}*/}
                                        {/*longpress={null}*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</TouchableWithoutFeedback>*/}
                        {/*</Modal>*/}
                     {/*</View> : null}*/}

                </Container>
        )
    }
}

export default App;
