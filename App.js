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
        AppState, Platform, Animated, Checkbox, Linking } from 'react-native';
import {setStorageData, getStorageData, getNextStudyDay, daysList, toYYYYMMDD,
        themeOptions, hasAPIConnection, axios2, getViewStat, getViewStatStart,
        getNearestSeptFirst, prepareJSON, prepareMessageToState, dateFromYYYYMMDD,
        prepareImageJSON, sendMail, getLangWord, echoClient, prepareMessageToFormat} from './js/helpersLight'
import axios from 'axios';
import {API_URL, arrLangs, supportEmail}        from './config/config'
import { Container, Content, Body, Footer, FooterTab, Spinner,
        Button, Tabs, Tab, TabHeading, Toast, Icon, Input, Item } from 'native-base';
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
import PushNotification, {PushNotificationIOS} from "react-native-push-notification";
import AppIntroSlider from 'react-native-app-intro-slider';

window.Pusher = Pusher

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log("TOKEN:", token);
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification
        PushNotification.cancelAllLocalNotifications()

        // PushNotification.cancelLocalNotifications({id: notification.id});
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        if (Platform.OS === "ios") {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "MY.MARKS",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true
});
const slidesClass = [
    {
        key: 1.1,
        title: 'КЛАСС',
        text: 'Выберите новых класс',
        image: null,
        backgroundColor: '#59b2ab',
    },
    // {
    //     key: 1.2,
    //     title: 'КОЛИЧЕСТВО УЧЕНИКОВ',
    //     text: 'Выберите количество учеников',
    //     image: null,
    //     backgroundColor: '#febe29',
    // }
    // ,{
    //     key: 1.3,
    //     title: 'СИСТЕМА ОЦЕНИВАНИЯ',
    //     text: 'Выберите систему оценивания',
    //     image: null,
    //     backgroundColor: '#22bcb5',
    // }
    // ,{
    //     key: 1.4,
    //     title: 'ДАННЫЕ ДЛЯ РЕГИСТРАЦИИ',
    //     text: 'Введите данные для регистрации',
    //     image: null,
    //     backgroundColor: '#59b2ab',
    // }
];
const slidesUserLoggedin = [
    {
        key: 2.2,
        title: 'СОЗДАНИЕ СТУДЕНТА/РОДИТЕЛЯ',
        text: 'Выберите способ регистрации студента',
        image: null,
        backgroundColor: '#febe29',
    }
];
const slidesUserNotLoggedin = [
    {
        key: 2.1,
        title: 'ВЫБОР КЛАССА',
        text: 'Выберите способ привязки к классу',
        image: null,
        backgroundColor: '#59b2ab',
    },
    {
        key: 2.2,
        title: 'СОЗДАНИЕ СТУДЕНТА/РОДИТЕЛЯ',
        text: 'Выберите способ регистрации студента',
        image: null,
        backgroundColor: '#febe29',
    }
];

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
            localChatMessages : this.props.tempdata.localChatMessages,
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
            showRegisterDrawer : false,
            username: '',
            userID: 0,
            userName: '',
            userEmail: '',
            userToken: '',
            registerStep : 0,
            initialPage : 0,
            activeTab : 0,
            emailToLinkStudent : '',
            emailToRegisterStudent : '',
            realNameOfNewStudent : '',
            nickOfNewStudent : '',
            isCheckedNewStudent : false,
            newStudentID : 0,
            addUserToken : this.props.userSetup.addUserToken,
            userCreated : false
        }
        let {langCode} = this.props.interface
        this.defLang = langCode && arrLangs.includes(this.props.userSetup.langCode)?langCode : "UA"
        this.session_id = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
        this.showDrawer = this.showDrawer.bind(this)
        this.connectivityCheck = this.connectivityCheck.bind(this)
        this.thisYearMarks = []
        this.renewStat = this.renewStat.bind(this)
        this.isnew = true
        this.notifchats = new Map()
        this.notifhws = new Map()
        this.notifmarks = new Map()
        this.initLocalPusher = this.initLocalPusher.bind(this)
        this.findUserByEmail = this.findUserByEmail.bind(this)
        this.registerNewUser = this.registerNewUser.bind(this)
        this.onLoginMock = this.onLoginMock.bind(this)
    }
    componentWillMount(){
    //     (async ()=> {
    //         const {langCode} = this.props.interface
    //         const {classID, langLibrary} = this.props.userSetup
    //         const {gotStats} = this.props.stat
    //         if (langLibrary===undefined) {
    //             this.props.onStartLoading()
    //             await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
    //             this.props.onStopLoading()
    //         }
    //         else {
    //             if (!Object.keys(langLibrary).length) {
    //                 this.props.onStartLoading()
    //                 await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
    //                 this.props.onStopLoading()
    //             }
    //         }
    //         // if (!this.state.calcStat&&classID>0&&!gotStats)
    //     })()
        this.props.onReduxUpdate("INIT_STATDATA")
        this.props.onReduxUpdate("INIT_TEMPDATA")
        this.checkLangLibrary()
    }
    async componentDidMount() {
        // console.log("COMPONENT_DID_MOUNT", this.props.userSetup)
        const {updateLang} = this.props.tempdata
        const {langCode} = this.props.interface
        const {classID} = this.props.userSetup

        if ((Platform.OS === 'ios') || ((Platform.OS === 'android')&&(Platform.Version > 22))) // > 5.1
        {
            // if (AppState._eventHandlers.change.size === 0) {
                AppState.addEventListener('change', this._handleAppStateChangeApp);
            // }
        }
        if (updateLang) {
            console.log("UPDATE_LANGLIBRARY")
            this.props.onStartLoading()
            await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
            this.props.onReduxUpdate("UPDATE_LANGLIBRARY", false)
            this.props.onStopLoading()
        }

        MaterialIcons.loadFont()
        Ionicons.loadFont()
        AntDesign.loadFont()
        Foundation.loadFont()

        this.getSessionID();
        this.connectivityCheck();

        if (classID) this.getChatMessages(classID)
        // console.log("COMPONENT_DID_MOUNT", classID)

        const {email, token} = this.props.saveddata
//            const dataSaved = JSON.parse(await getStorageData("myMarks.data"))
//             const {email, token} = dataSaved

        this.props.onReduxUpdate("UPDATE_TOKEN", token===null?'':token)
        this.setState({userEmail: email, userToken: token===null?'':token})

    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate:chatMobile", nextProps.userSetup.userID, this.state.Echo)

        if (nextProps.userSetup.userID&&this.state.Echo===null) {
            if (this.isnew) {
                console.log("shouldUpdateEcho", nextProps.userSetup.userID, this.state.Echo)
                if (!this.state.isChatConnected) this.initLocalPusher()
            }
            else {
                // this.initNetPusher()
            }
        }
        else {
            if ((!nextProps.userSetup.userID) && this.state.Echo!==null) {
                this.state.Echo.disconnect()
                this.state.Echo = null
            }
        }

        return true
    }
    componentWillUnmount() {
        // if (this.typingTimer) clearInterval(this.typingTimer)
        AppState.removeEventListener('change', this._handleAppStateChangeApp);
    }
    getChatMessages=classID=>{
        this.props.onStartLoading()
        axios2('get', `${API_URL}chat/get/${classID}`)
            .then(resp => {
                this.setState({localChatMessages : resp.data})
                // this.props.setstate({localChatMessages : resp.data})
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", resp.data)
                this.props.onReduxUpdate("UPDATE_HOMEWORK", resp.data.filter(item=>(item.homework_date!==null)))
                this.props.onStopLoading()
                console.log("getChatMessages : Загружено!", new Date().toLocaleTimeString())
            })
            .catch(error => {
                console.log('getChatMessagesError', error)
                this.props.onStopLoading()
            })
        this.props.onReduxUpdate("USER_LOGGEDIN_DONE")
    }
    checkLangLibrary=async ()=>{
        const {langCode} = this.props.interface
        const {classID, langLibrary} = this.props.userSetup

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
    }
    _toggleSubview() {
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
        let {token} = this.props.userSetup

        if (!lang) {
            lang = langCode ? langCode : this.defLang
        }
        let langObj = {}
        // console.log("getLangLibrary:start", lang)
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
                // console.log("AppCheck", res)
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
    _handleAppStateChangeApp = (nextAppState) => {
        const {classID, studentId, markscount} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata

        // console.log("APP_STATE", this.state.appState, nextAppState)
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // console.log('AppState: ', 'App has come to the foreground!');
            if (classID) {
                this.renewStat(classID)

                    axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/0`)
                        .then(res => {
                            // homeworks: 13
                            // marks: 0
                            // msgs: 250
                            // news: 3
                            // ToDO: News исправим позже
                            const today = toYYYYMMDD(new Date())
                            const {msgs, marks, homeworks} = res.data
                            const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today))).length
                            console.log("OFF_LINE_UPDATE", msgs, localChatMessages.slice(-1)[0].id, markscount, marks, homeworks_count, homeworks)

                            if ((msgs!==localChatMessages.slice(-1)[0].id)||(markscount!==marks)||(homeworks_count!==homeworks)) {
                                console.log('UPDATE_OFFLINE')
                                axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/1`)
                                    .then(res => {
                                        const msgs = res.data.msgs
                                        let arr = localChatMessages//this.props.localchatmessages //this.state.localChatMessages
                                        // console.log("GetStatMsgs", res.data.marks)
                                        if (msgs.length) {
                                            msgs.forEach(msgitem=>{
                                                let isinmsg = false
                                                arr = arr.map(item=>{
                                                    if (item.id === msgitem.id) {
                                                        item = msgitem
                                                        isinmsg = true
                                                    }
                                                    return item
                                                })
                                                if (!isinmsg) {
                                                    if (toYYYYMMDD(new Date(msgitem.msg_date))>=toYYYYMMDD(new Date()))
                                                        arr.push(msgitem)
                                                    else
                                                        arr.unshift(msgitem)
                                                }
                                            })
                                        }
                                        // this.setState({localChatMessages : arr})
                                        // this.props.setstate({localChatMessages : arr})
                                        this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arr)

                                        console.log("Загружено по оффлайну!", this.notifmarks, AppState._eventHandlers.change.size, homeworks_count, homeworks, markscount, marks)
                                        if (homeworks_count!==homeworks) {
                                            this.props.onReduxUpdate("UPDATE_HOMEWORK", res.data.msgs.filter(item => (item.homework_date !== null)))
                                            // this.sendPush("НОВАЯ ДОМАШКА", "Домашка", "", 0)
                                        }
                                        // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", res.data.msgs)

                                        if (markscount!==marks) {

                                            this.props.onReduxUpdate("ADD_MARKS", res.data.marks)
                                            if (!(this.notifmarks.has(marks))) {
                                                this.sendPush(`НОВЫЕ ОЦЕНКИ[${marks - markscount}]`, "Оценки", "", 0)
                                                this.notifmarks.set(marks, true)
                                            }
                                        }
                                        this.renewStat(classID)
                                    })
                                    .catch(response=> {
                                        console.log("NewData_ERROR", response)
                                    })
                            }
                        })
                        .catch(response=> {
                            console.log("handleConnectivityChange_ERROR", response)
                        })

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
        console.log("setstate", obj)
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
    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val)
        this.setState({[key]: val})
    }
    renderPalette = (color) => {
        return <View>
                    <TouchableOpacity key={color} onPress={() => this.props.onReduxUpdate('CHANGE_THEME', color)}>
                        <View style={{height: 40, width: 40, borderRadius: 20, backgroundColor: color, margin: 5}}>
                        </View>
                    </TouchableOpacity>
            </View>
    };
    // renderRegisterDrawer(){
    //     return <View><Text>RegisterBlock</Text></View>
    // }
    setActiveTab=i=>{
        this.setState({activeTab:i})
    }
    isReadyToRegister(){
        return this.state.emailToRegisterStudent.length && this.state.realNameOfNewStudent.length && this.state.nickOfNewStudent.length
    }
    findUserByEmail() {
        const {classID} = this.props.userSetup

        const json = {
            kind: "user",
            type: "email",
            email: this.state.emailToLinkStudent,
            classID : classID
        }

        // console.log("classID", classID, json)

        axios2('post', `${API_URL}find`, JSON.stringify(json))
            .then(res => {
                // console.log('FIND_USER', res)
                // alert(res.data.id)
                if (res.data.id)
                    this.setState({
                    realNameOfNewStudent : res.data.student_name + ' [copy]',
                    nickOfNewStudent : res.data.student_nick,
                    isCheckedNewStudent : true,
                    newStudentID : res.data.student_id})
                else {
                    this.setState({isCheckedNewStudent : false, newStudentID : 0})
                }
            })
            .catch(res => {
                    console.log("AXIOUS_ERROR", res, text)
                    this.setState({isCheckedNewStudent : false, newStudentID : 0})
                }
            )
    }
    onLoginMock=()=>{
        const {langLibrary, classID, userID} = this.props.userSetup
        const {theme, themeColor} = this.props.interface
        // this.props.updateState("showDrawer", false)
        console.log("onLoginMock", userID)

        this.props.onReduxUpdate("SHOW_LOGIN", false)
        this.props.onReduxUpdate("USER_LOGGING")
        this.props.onReduxUpdate("LOG_BTN_CLICK")
        // if (userID) this.props.onUserLoggingOut();
        this.props.onUserMockLogging(langLibrary, theme, themeColor);
        this.setState({showDrawer : false})
        // this.showDrawer()
    }
    registerNewUser=()=>{

        const {addUserToken, newStudentID, realNameOfNewStudent, nickOfNewStudent, emailToRegisterStudent} = this.state
        const {classID} = this.props.userSetup

        // alert (addUserToken)
        // return
        if (newStudentID) {
            let json = {
                'class_id': classID,
                'email': emailToRegisterStudent,
                'token' : addUserToken,
                'stud_id' : newStudentID,
                'name' : realNameOfNewStudent
            }
            axios2('post', `${API_URL}student/clone`, JSON.stringify(json))
                .then(res => {
                    this.setState({userCreated : true})
                    Toast.show({
                        text: `Пользователь ${realNameOfNewStudent} создан: проверьте почту ${emailToRegisterStudent}`,
                        buttonText: 'ОК',
                        position : 'bottom',
                        duration : 5000,
                        style : {marginBottom : 100}
                        // type : 'success'
                    })
                })
                .catch(err=>{
                    console.log("Error:newStudentClone", err)
                })
        }
        else {
            let json = {
                'email': emailToRegisterStudent,
                'student_nick' : nickOfNewStudent,
                'name' : realNameOfNewStudent,
                'notwebadding' : null,
                'provider' : null,
                'mobversion' : true
            }
            axios2('post', `${API_URL}students/add/${addUserToken}`, JSON.stringify(json))
                .then(res => {
                    this.setState({userCreated : true})
                    Toast.show({
                        text: `Пользователь ${realNameOfNewStudent} создан: проверьте почту ${emailToRegisterStudent}`,
                        buttonText: 'ОК',
                        position : 'bottom',
                        duration : 5000,
                        style : {marginBottom : 100}
                        // type : 'success'
                    })
                })
                .catch(err=>{
                    console.log("Error:createdNewStudent", err)
                })

        }
    }
    _renderItem = ({ item }) => {
        const {theme} = this.props.interface
        const {langLibrary} = this.props.userSetup

        // console.log("Item", item)
        // alert(item.id)
        switch (item.key) {
            case  2.2:
               return (
                   <View style={[styles.slide, {backgroundColor: theme.primaryDarkColor, height: "100%"}]}>
                       {/*<Text style={[styles.title, {marginLeft : 30, marginTop : 5, color: theme.primaryLightColor, fontSize : RFPercentage(2)}]}>{item.title}</Text>*/}
                       {/*<Image source={item.image}/>*/}
                       <Text style={{color: theme.primaryLightColor, marginLeft : 30, marginRight : 20, marginTop : 10}}>
                           Если Вы хотите просматривать оценки уже созданного раннее ученика, то присоединитесь к нему,
                           указав в качестве проверочного уже зарегистрированный Email</Text>

                       <Item rounded style={{marginLeft : 20, marginRight : 20, marginTop : 2, borderColor: 'transparent'}}>
                           <Input
                               style={{ fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0,
                                        color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3,
                                        borderColor : theme.primaryLightColor, borderRadius : 30, height : 50}}
                               value={this.state.emailToLinkStudent.length?this.state.emailToLinkStudent:""}
                               onChangeText={text =>this.onChangeText('emailToLinkStudent', text)}
                               onBlur={this.findUserByEmail}
                               placeholder=""
                               placeholderTextColor={theme.primaryLightColor}
                           />
                           {this.state.isCheckedNewStudent?
                               <Icon
                                    name='checkmark-circle'
                                    style={{color : theme.secondaryLightColor, position : "absolute", right : 0}}
                               />:null
                           }
                       </Item>

                       {/*||  this.state.emailToLinkStudent*/}

                       {/*<View style={{backgroundColor : theme.primaryColor, padding : 20}}>*/}
                       <Text style={{fontSize : RFPercentage(1.8), marginLeft : 30,  marginTop : 20, color : theme.primaryColor}}>
                           Email-логин для регистрации
                       </Text>
                           <Item rounded style={{marginLeft : 20, marginRight : 20, marginTop : 2, borderColor: 'transparent'}}>
                               <Input
                                   style={{ fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0,
                                       color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3,
                                       borderColor : theme.primaryColor, borderRadius : 30, height : 50}}
                                   value={this.state.emailToRegisterStudent.length?this.state.emailToRegisterStudent:""}
                                   onChangeText={text =>this.onChangeText('emailToRegisterStudent', text)}
                                   onBlur={()=>console.log("Input:emailToRegisterStudent:blur")}
                                   placeholder=""
                                   placeholderTextColor={theme.primaryColor}
                                   placeholderFontSize={2}
                               />
                           </Item>
                           <Text style={{fontSize : RFPercentage(1.8), marginLeft : 30,  marginTop : 10, color : theme.primaryColor}}>
                               Настоящее имя студента (для учителя)
                           </Text>
                           <Item rounded style={{marginLeft : 20, marginRight : 20, marginTop : 2, borderColor: 'transparent'}}>
                               <Input
                                   style={{ fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0,
                                       color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3,
                                       borderColor : theme.primaryColor, borderRadius : 30, height : 50}}
                                   value={this.state.realNameOfNewStudent.length?this.state.realNameOfNewStudent:""}
                                   onChangeText={text =>this.onChangeText('realNameOfNewStudent', text)}
                                   onBlur={()=>console.log("Input:realNameOfNewStudent:blur")}
                                   placeholder=""
                                   placeholderTextColor={theme.primaryColor}
                                   placeholderFontSize={2}
                               />
                           </Item>
                           <Text style={{fontSize : RFPercentage(1.8), marginLeft : 30,  marginTop : 10, color : theme.primaryColor}}>
                               Ник студента (для общеклассных данных)
                           </Text>
                           <Item rounded style={{marginLeft : 20, marginRight : 20, marginTop : 2, borderColor: 'transparent'}}>
                               <Input
                                   style={{ fontSize : RFPercentage(3), paddingLeft : 10, paddingRight : 0,
                                       color : theme.primaryTextColor, fontWeight : "600", borderWidth: 3,
                                       borderColor : theme.primaryColor, borderRadius : 30, height : 50}}
                                   value={this.state.nickOfNewStudent.length?this.state.nickOfNewStudent:""}
                                   onChangeText={text =>this.onChangeText('nickOfNewStudent', text)}
                                   onBlur={()=>console.log("Input:nickOfNewStudent:blur")}
                                   placeholder=""
                                   placeholderTextColor={theme.primaryColor}
                                   placeholderFontSize={2}
                               />
                           </Item>
                       {/*</View>*/}
                       {/*<Text style={[styles.text, {color: theme.primaryLightColor}]}>{item.text}</Text>*/}
                       <Button style={{marginLeft : 20, marginRight : 20, marginTop : Platform.OS !== 'ios'?25:30, borderRadius : 30,
                           justifyContent: "center",
                           alignItems: "center",
                           color : theme.primaryDarkColor, backgroundColor : !this.isReadyToRegister()? "#E0E0E0": theme.primaryTextColor}}
                               onPress={!this.isReadyToRegister()&&!this.state.userCreated?null:this.registerNewUser}>
                           <View style={{ justifyContent: "center", alignItems: "center" }}>
                               <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>
                                   {this.state.userCreated?"Cоздан. Проверьте email":!this.isReadyToRegister()? "Заполните данные студента": this.state.isCheckedNewStudent ||  this.state.emailToLinkStudent?"Присоединиться к студенту":"Создать нового студента"}
                               </Text>
                           </View>
                       </Button>

                   </View>
               )
            case 1.1 :
               return (
                   <View style={[styles.slide, {backgroundColor: theme.primaryDarkColor, marginLeft : 30, height: "100%", justifyContent: "center", alignItems: "center"}]}>
                       <Text style={{fontSize : RFPercentage(2.5), color : theme.primaryTextColor}}
                             onPress={() => Linking.openURL('https://mymarks.info')}>
                           {getLangWord("mobLinkTo", langLibrary)}
                       </Text>
                       <Button style={{marginLeft : 60, padding : 20, marginTop : Platform.OS !== 'ios'?5:10, marginRight : 60, borderRadius : 30,
                           justifyContent: "center",
                           alignItems: "center",
                           color : theme.primaryDarkColor, backgroundColor : theme.primaryTextColor}}
                               onPress={() => Linking.openURL('https://mymarks.info')}>
                           <View style={{ justifyContent: "center", alignItems: "center" }}>
                               <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>
                                   {"mymarks.info"}
                               </Text>
                           </View>
                       </Button>
                       {/*<Text style={{fontSize : RFPercentage(2.5), color : theme.secondaryLightColor, fontWeight : "800"}}*/}
                             {/*onPress={() => Linking.openURL('https://mymarks.info')}>*/}
                           {/*mymarks.info*/}
                       {/*</Text>*/}
                       <Text style={{fontSize : RFPercentage(2.5), color : theme.primaryTextColor}}
                             onPress={() => Linking.openURL('https://mymarks.info')}>
                           {getLangWord("mobLinkTo2", langLibrary)}
                       </Text>
                   </View>)
            default :
            return
                (
                    <View style={[styles.slide, {backgroundColor: theme.primaryDarkColor, height: "100%"}]}>
                        <Text style={[styles.title, {color: theme.primaryLightColor}]}>{item.title}</Text>
                        <Image source={item.image}/>
                        <Text style={[styles.text, {color: theme.primaryLightColor}]}>{item.text}</Text>
                    </View>
                );
        }
    }
    _renderPrevButton = () => {
        return (
            <View style={[styles.buttonCircle, {marginLeft : 20}]}>
                <Ionicons
                    name="md-arrow-round-back"
                    color="rgba(255, 255, 255, .9)"
                    size={40}
                />
            </View>
        );
    };
    _renderNextButton = () => {
        return (
            <View style={[styles.buttonCircle, {marginRight : 20}]}>
                <Ionicons
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={40}
                />
            </View>
        );
    };
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Ionicons
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={40}
                />
            </View>
        );
    };
    renderDrawer(){
        const {langLibrary, userName, classID, userID, token} = this.props.userSetup
        const {showFooter, showKeyboard, theme, themeColor} = this.props.interface
        const {online} = this.props.tempdata
        const colorOptions = Object.keys(themeOptions)
        const {registerStep} = this.state
        let {stat} = this.props

        // console.log("renderDrawer")
        return  <Tabs initialPage={this.state.initialPage}
                      page={this.state.activeTab}
                      onChangeTab={({ i, ref, from }) => this.setActiveTab(i)}>

            <Tab key={"tab1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.4)}}>
                {getLangWord("mobLogin", langLibrary).toUpperCase()}
                </Text></TabHeading>}>
                <View>
                    <LoginBlock updateState={this.updateState}/>
                </View>
            </Tab>

            <Tab key={"tab2"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.4)}}>
                {getLangWord("mobRegister", langLibrary).toUpperCase()}
                </Text></TabHeading>}>
                <View style={{height : "100%", width : "100%", backgroundColor : theme.primaryDarkColor,
                    display : "flex",
                    flexDirection : "column",
                    // justifyContent : "center",
                    alignItems : "center"
                }}>

                    {(!registerStep)?<View style={{width : "100%", backgroundColor : theme.primaryDarkColor,
                        display : "flex",
                        flexDirection : "column",
                        alignItems : "center",
                        marginLeft : 30,
                        marginRight : 30
                    }}>
                        <View style={{width : "100%", backgroundColor : theme.primaryDarkColor,
                            display : "flex",
                            flexDirection : "column",
                            alignItems : "center",
                            marginTop : "30%",
                            marginLeft : 30,
                            marginRight : 30
                        }}>
                            <View style={{
                                display : "flex",
                                flexDirection : "column",
                                alignItems : "center"
                                }}>
                                <Icon type="Ionicons" style={{fontSize: 70, color: theme.primaryLightColor}} name="ios-people"/>
                            </View>
                            <View style={{  width : "80%", display : "flex",
                                            flexDirection : "row",
                                            justifyContent : "space-between",
                                            alignItems : "center"}}>
                                <Text style={{fontSize : RFPercentage(4), color : theme.primaryLightColor}}>{getLangWord("mobNewClass", langLibrary).toUpperCase()}</Text>
                                <TouchableOpacity
                                    style={{ borderWidth:1,
                                        borderColor:    theme.secondaryLightColor,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width:40,
                                        height:40,
                                        backgroundColor: theme.secondaryLightColor,
                                        borderRadius: 40,
                                        zIndex : 21,
                                    }}
                                    onPress={()=>{this.setState({registerStep : 1})}}>
                                    <Icon
                                        name='ios-arrow-forward'
                                        type='Ionicons'
                                        color={theme.primaryDarkColor}
                                        size={50}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{width : "100%", backgroundColor : theme.primaryDarkColor,
                            display : "flex",
                            flexDirection : "column",
                            alignItems : "center",
                            marginTop : 40,
                            marginLeft : 30,
                            marginRight : 30
                        }}>
                            <View style={{
                                display : "flex",
                                flexDirection : "column",
                                // justifyContent : "space-around",
                                alignItems : "center"
                            }}>
                                <Icon type="Ionicons" style={{fontSize: 70, color: theme.primaryLightColor}} name="ios-person-add"/>
                            </View>
                            <View style={{width : "80%", display : "flex",
                                flexDirection : "row",
                                justifyContent : "space-between",
                                alignItems : "center"
                            }}>
                                {/*<Icon type="Ionicons" style={{fontSize: 40, color: theme.secondaryLightColor}} name="ios-person-add"/>*/}
                                <Text style={{fontSize : RFPercentage(4), color : theme.primaryLightColor}}>{getLangWord("mobNewStudent", langLibrary).toUpperCase()}</Text>
                                <TouchableOpacity
                                    style={{ borderWidth:1,
                                        borderColor:    theme.secondaryLightColor,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width:40,
                                        height:40,
                                        backgroundColor: theme.secondaryLightColor,
                                        borderRadius: 40,
                                        zIndex : 21,
                                    }}
                                    onPress={()=>{this.setState({registerStep : 2})}}
                                    // delayLongPress={300}
                                    // onLongPress={()=>{this._scrollView.scrollToEnd()}}
                                >
                                    <Icon
                                        name='ios-arrow-forward'
                                        type='Ionicons'
                                        color={theme.primaryDarkColor}
                                        size={50}
                                    />
                                    {/*<View style={{position : "absolute", right : 7, bottom : 7, fontSize : RFPercentage(1.2), color : theme.secondaryColor}}>*/}
                                        {/*<Text style={{fontSize : RFPercentage(1.7), fontWeight : "800", color : theme.primaryDarkColor, opacity : 1}}>{messages.filter(item=>item.id>this.state.currentMsgID).length}</Text>*/}
                                    {/*</View>*/}
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>
                        :<View style={{width : "100%", height : "100%"}}>

                            <AppIntroSlider renderItem={this._renderItem}
                                            data={registerStep===1?slidesClass:(registerStep===2&&userID?slidesUserLoggedin:slidesUserNotLoggedin)}
                                            onDone={()=>{this.setState({registerStep : 0})}}
                                            renderDoneButton={this._renderDoneButton}
                                            renderNextButton={this._renderNextButton}
                                            renderPrevButton={this._renderPrevButton}
                                            showPrevButton={true}
                            />

                        </View>}
                </View>
            </Tab>

            {/*<TouchableOpacity*/}
                {/*style={{ borderWidth:1,*/}
                    {/*borderColor:    theme.secondaryLightColor,*/}
                    {/*alignItems: 'center',*/}
                    {/*justifyContent: 'center',*/}
                    {/*width:40,*/}
                    {/*height:40,*/}
                    {/*backgroundColor: theme.secondaryLightColor,*/}
                    {/*borderRadius: 40,*/}
                    {/*zIndex : 21,*/}
                {/*}}*/}
                {/*onPress={()=>{alert("<"), this.setState({registerStep : 0})}}*/}
            {/*>*/}
                {/*<Icon*/}
                {/*name='ios-arrow-back'*/}
                {/*type='Ionicons'*/}
                {/*color={theme.primaryDarkColor}*/}
                {/*size={50}*/}
            {/*/>*/}
            {/*</TouchableOpacity>*/}
            <Tab key={"tab2_1"} heading={
                <TabHeading style={{backgroundColor : theme.primaryColor}}>
                    <Text style={{color: theme.primaryDarkColor, backgroundColor: theme.secondaryLightColor, borderRadius : 5, padding: 5, fontSize : RFPercentage(1.4)}}>
                        {getLangWord("mobTest", langLibrary).toUpperCase()}
                    </Text>
                </TabHeading>}>
                    <View style={{
                        backgroundColor : theme.primaryColor,
                        height : Dimensions.get('window').height,
                        width : Dimensions.get('window').width,
                        flex: 1,
                        flexDirection : 'column',
                        zIndex : 102,
                    }}>

                        <View style={[styles.slide, {backgroundColor: theme.primaryDarkColor, height: "100%", justifyContent: "center", alignItems: "center"}]}>
                            <Text style={{fontSize : RFPercentage(2.1), color : theme.primaryTextColor, marginLeft : 30}}>
                                {getLangWord("mobTestText", langLibrary)}
                            </Text>

                            <Button style={{marginLeft : 60, padding : 20, marginTop : Platform.OS !== 'ios'?5:10, marginRight : 60, borderRadius : 30,
                                justifyContent: "center",
                                alignItems: "center",
                                color : theme.primaryDarkColor, backgroundColor : theme.primaryTextColor}}
                                    onPress={()=>{!userID?this.onLoginMock():this.props.onUserLoggingOut(token, langLibrary, theme, themeColor)}}>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>
                                        {!userID?getLangWord("mobLogin", langLibrary).toUpperCase():getLangWord("mobExit", langLibrary).toUpperCase()}
                                    </Text>
                                </View>
                            </Button>
                        </View>
                    </View>
            </Tab>


            <Tab key={"tab3"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize : RFPercentage(1.4)}}>
                    {getLangWord("mobSettings", langLibrary).toUpperCase()}
                    </Text></TabHeading>}>
                    <Container>
                    <View style={{
                    backgroundColor : theme.primaryColor,
                    height : Dimensions.get('window').height,
                    width : Dimensions.get('window').width,
                    flex: 1,
                    flexDirection : 'column',
                    zIndex : 102,
                    }}>
                    <View style={{height: 100, width: 300, margin : 5}}>
                        <View><Text style={{color : theme.primaryTextColor, fontWeight : '800', marginLeft : 10}}>
                            {getLangWord("lang", langLibrary)}
                        </Text></View>
                        <View style={{  flex : 1, margin : 10, backgroundColor : "#fff", borderRadius: 10, height : 100, width : Dimensions.get('window').width - 30,
                            flexDirection : 'row', justifyContent : "space-around", alignItems : "center"}}>
                            <TouchableOpacity key={0} onPress={()=>{this.onSelectLang('GB')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : getLangWord("langCode", langLibrary)!=='GB'?"#dcdcdc":theme.primaryDarkColor, borderWidth : getLangWord("langCode", langLibrary)!=='GB'?1:4}}>
                                    <Image source={FlagUK}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity key={1} onPress={()=>{this.onSelectLang('RU')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : getLangWord("langCode", langLibrary)!=='RU'?"#dcdcdc":theme.primaryDarkColor, borderWidth : getLangWord("langCode", langLibrary)!=='RU'?1:4}}>
                                    <Image source={FlagRU}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity key={2} onPress={()=>{this.onSelectLang('UA')}}>
                                <View style={{position : 'relative', textAligh: "center", borderColor : getLangWord("langCode", langLibrary)!=='UA'?"#dcdcdc":theme.primaryDarkColor, borderWidth : getLangWord("langCode", langLibrary)!=='UA'?1:4}}>
                                    <Image source={FlagUA}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Button style={{  marginLeft : 60, marginTop : 5, marginRight : 60, borderRadius : 30,
                            justifyContent: "center",
                            alignItems: "center",
                            color : theme.primaryDarkColor, backgroundColor : theme.secondaryLightColor}} onPress={async ()=>{
                            const {langCode} = this.props.interface
                            const {classID, langLibrary} = this.props.userSetup
                              if (langLibrary===undefined) {
                                this.props.onStartLoading()
                                await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
                                this.props.onStopLoading()
                            }
                        }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>Обновить словарь</Text>
                            </View>
                        </Button>
                    </View>
                    <View style={{height: 100, width: 300, margin : 5}}>
                        <View><Text style={{color : theme.primaryTextColor, fontWeight : '800', marginLeft : 10}}>
                            {getLangWord("colorTheme", langLibrary)}
                        </Text></View>
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
                </Container>
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
                const {marks, userID, classNews} = this.props.userSetup
                const {localChatMessages} = this.props.tempdata
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
        const {localChatMessages} = this.props.tempdata
        const obj = prepareJSON(text, this.props.userSetup, true, null, null, null)
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
                                                const {localChatMessages} = this.props.tempdata
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
                    let arr = classNews
                    arr.unshift(response.data)
                    this.props.onReduxUpdate("UPDATE_NEWS", arr)

                    if (!this.state.isNews)
                        sendMail(supportEmail, text, this.props.userSetup, this.session_id)

                    this.setState({curMessage : ''})
                // }
            })
            .catch(response=> {
                    console.log("AXIOUS_ERROR", response)
                    // this.setState({isSpinner : false})
                }
            )
    }

    sendPush=(text, subText, author, id)=>{
        const {theme} = this.props.interface
        console.log("NOTIF", text, subText, id)
        PushNotification.localNotification({
            /* Android Only Properties */
            id: id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: "My.Marks Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: text, // (optional) default: "message" prop
            subText: author, // (optional) default: none
            color: theme.primaryDarkColor, // (optional) default: system default
            vibrate: false, // (optional) default: true
            // vibration: 100, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high

            /* iOS only properties */
            alertAction: "view", // (optional) default: view
            category: "My.Marks", // (optional) default: null
            userInfo: {author : author}, // (optional) default: null (object containing additional notification data)

            /* iOS and Android properties */
            title: subText, // (optional)
            message: text, // (required)
            // playSound: false, // (optional) default: true
            // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    });

    }
    initLocalPusher=()=>{
        const {chatSSL, token, userName, classID, studentNick, userID} = this.props.userSetup
        const {users} = this.props.tempdata
        const echo = echoClient(token, chatSSL)

        console.log("INIT_LOCAL_PUSHER", userID, userName)

        // echo.connector.pusher.logToConsole = true
        // echo.connector.pusher.log = (msg) => {console.log(msg);};
        echo.connect()

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('Chat connected', new Date().toLocaleTimeString())
            this.setState({isChatConnected : true})
            // this.props.setstate({isChatConnected : true})
        });
        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('Chat disconnected')
            this.setState({isChatConnected : false})
            // this.props.setstate({isChatConnected : false})
        });
//        Reconnection:
//         echo.connector.socket.on('reconnecting', (attemptNumber) => {
//             //your code
//             console.log(`%cSocket reconnecting attempt ${attemptNumber}`, 'color:orange; font-weight:700;');
//         });

        const channelName = `class.${classID}`

        this.setState({Echo: echo})
        // this.props.setstate({Echo: echo})

        console.log('websocket', channelName, chatSSL)

        if (chatSSL) {
            // console.log('websocket-listening', echo)
            echo.join(channelName)
                .listen('ChatMessageSSL', (e) => {
                    // console.log("FILTER-SSL")

                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.tempdata.localChatMessages
                    let arrChat = []
                    console.log("FILTER-SSL")

                    arrChat = localChat
                    if (this.state.messagesNew.filter(newmsg=>newmsg.uniqid===JSON.parse(msg).uniqid).length)
                        arrChat = localChat.map(
                            item => {
                                // if (this.state.messagesNew.includes(item.uniqid)) {
                                if (this.state.messagesNew.filter(newmsg=>item.uniqid===newmsg.uniqid).length) {
                                    // Для своих новых
                                    if (JSON.parse(msg).uniqid === item.uniqid) {
                                        isSideMsg = false
                                        let obj = item
                                        obj.id = msgorig.id
                                        obj.msg_date = msgorig.msg_date
                                        return obj
                                    }
                                    else {
                                        return item
                                    }
                                }
                                else {
                                    return item
                                }
                            }
                        )
                    if (localChat.filter(newmsg=>newmsg.id===JSON.parse(msg).id).length)
                        arrChat = localChat.map(
                            item => {
                                // if (this.state.messagesNew.includes(item.uniqid)) {
                                // if (localChat.filter(newmsg=>item.id===newmsg.id).length) {
                                // Для своих новых
                                if (JSON.parse(msg).id === item.id) {
                                    // console.log("MSGORIG", msgorig, msgorig.id, this.props.newmessages.filter(newmsg=>item.uniqid===newmsg.uniqid))
                                    isSideMsg = false
                                    let obj = item
                                    obj.id = msgorig.id
                                    obj.msg_date = msgorig.msg_date
                                    return obj
                                }
                                else {
                                    return item
                                }
                                // }
                                // else {
                                //     return item
                                // }
                            }
                        )

                    // Если новое и стороннее!!!
                    if (isSideMsg) {
                        arrChat.push(msgorig)
                    }
                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)

                    this.setState({
                        localChatMessages: arrChat,
                        // messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                        isLastMsg : true,
                    })
                    // console.log("NEWMESSAGES", this.props.newmessages, arrChat)
                    // this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)), localChatMessages : arrChat})

                    // const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    // const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))
                    //
                    // this.props.forceupdate(todayMessages.length, homeworks.length)
                    // this.notifchats = new Map()
                    // this.notifhws = new Map()
                    if (!this.notifchats.has(JSON.parse(msg).id)&&JSON.parse(msg).userName!==userName)
                        this.sendPush(JSON.parse(msg).text, "Чат", JSON.parse(msg).userName, JSON.parse(msg).id)

                    this.notifchats.set(JSON.parse(msg).id, true)
                })
                .listen('ChatMessageSSLHomework', (e) => {
                    // ToDO: Обновлять таблицу домашек и пересчитывать Label
                    console.log("FILTER-SSL-HOMEWORK", e.message, e)
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.tempdata.localChatMessages
                    // let arrChat = []
                    // console.log("FILTER-NOT-SSL", this.state.localChatMessages)
                    let arrChat = localChat.map(
                        item => {
                            // console.log("222", item)
                            if (item.id === e.message.id) {

                                return e.message
                            }
                            else {
                                return item
                            }
                        }
                    )
                    // Если новое и стороннее!!!
                    // if (isSideMsg) arrChat.push(msgorig)
                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)

                    this.setState({
                        localChatMessages: arrChat,
                        // messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    // this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                    //     localChatMessages : arrChat})

                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
                    // const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    // const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))
                    //
                    // this.props.forceupdate(todayMessages.length, homeworks.length)
                    // this.notifhws = new Map()
                    if (!this.notifhws.has(JSON.parse(msg).id)&&JSON.parse(msg).userName!==userName)
                        this.sendPush(JSON.parse(msg).text, "Домашка", JSON.parse(msg).userName, JSON.parse(msg).id)

                    this.notifhws.set(JSON.parse(msg).id, true)

                })
                .listen('ChatMessageSSLUpdated', (e) => {
                    console.log("FILTER-SSL-UPDATED")
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.tempdata.localChatMessages
                    let arrChat = []
                    // console.log("FILTER-NOT-SSL"
                    arrChat = localChat.map(
                        item => {
                            // console.log("254", item)
                            if (item.id === e.message.id) {

                                return e.message
                            }
                            else {
                                return item
                            }
                        }
                    )
                    // Если новое и стороннее!!!
                    // if (isSideMsg.log()) arrChat.push(msgorig)
                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)

                    this.setState({
                        localChatMessages: arrChat,
                        // messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    // this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                    //     localChatMessages : arrChat})
                    //
                    // const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    // const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))
                    //
                    // this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listen('NewsMessage', (e) => {
                    let {classNews} = this.props.userSetup
                    classNews.unshift(e.message)
                    this.props.onReduxUpdate('UPDATE_NEWS', classNews)
                    let {stat} = this.props
                    stat.newsCnt++
                    this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
                    console.log("NewsMessage-SSL")
                })
                .listenForWhisper('typing', (e) => {
                    if (!this.props.tempdata.typingUsers.has(e.name)&&e.name!==(userName)) {
                        let mp = this.props.tempdata.typingUsers
                        mp.set(e.name, new Date())
                        console.log('SetTypingState: App', '#', e.name, '#', userName);
                        this.props.onReduxUpdate("UPDATE_TYPING_USERS", mp)
                        // this.setState({typingUsers: mp})
                    }
                    // console.log('typing', e.name);
                })
                .here((users) => {
                    //this.setState({users : users});
                    this.props.onReduxUpdate("UPDATE_USERS", users)
                    // console.log("USERS.HERE", users)
                })
                .joining((user) => {
                    // console.log("USERS.JOIN", users, user)
                    const arr = users.filter(item=>item !== user)
                    {userName!==user?Toast.show({
                        text: `${user} присоединился к чату`,
                        buttonText: 'ОК',
                        position : 'bottom',
                        duration : 1500,
                        style : {marginBottom : 100, fontSize : RFPercentage(1.8)}
                        // type : 'success'
                    }):null}
                    this.props.onReduxUpdate("UPDATE_USERS", [...arr, user])
                    // this.setState({users : [...arr, user]})
                })
                .leaving((person) => {
                    // this.users = this.users.filter(item=>item !== person);
                    if (person!==userName) {
                        // Toast.show({
                        //     text: `${person} покинул чат`,
                        //     buttonText: 'ОК',
                        //     position: 'bottom',
                        //     duration: 2500,
                        //     style: {marginBottom: 100, fontSize: RFPercentage(1.8)}
                        //     // type : 'success'
                        // })
                    }
                    console.log("USERS.LEAVE", users, person)
                    const arr = users.filter(item=>item !== person)
                    this.props.onReduxUpdate("UPDATE_USERS", arr)
                    //this.setState({users : this.state.users.filter(item=>item !== person)})
                });
        }
        else
            echo.channel(channelName)
                .listen('ChatMessage', (e) => {
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let arr = this.props.tempdata.localChatMessages
                    let newArr = []
                    console.log("FILTER-NOT-SSL")
                    // console.log("FILTER-NOT-SSL: this.props", this.props)
                    newArr = arr.map(
                        item=>
                        {
                            // if (this.state.messagesNew.includes(item.uniqid)) {
                            if (this.props.newmessages.filter(newmsg=>item.uniqid===newmsg.uniqid).length) {
                                // Для своих новых
                                if (JSON.parse(msg).uniqid === item.uniqid) {
                                    // console.log("MSGORIG", msgorig, msgorig.id)
                                    isSideMsg = false
                                    let obj = item
                                    obj.id = msgorig.id
                                    return obj
                                }
                                else {
                                    return item
                                }
                            }
                            else {
                                return item
                            }
                        }
                    )
                    // Если новое и стороннее!!!
                    if  (isSideMsg) newArr.push(msgorig)

                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", newArr)

                    this.setState({
                        localChatMessages : newArr,
                        // messages: [...arr, msg],
                        messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                    })
                    // this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)), localChatMessages : newArr})

                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", newArr)
                    // this.props.updatemessage(msg)
                })
    }
    render() {
        const {marks, userID, token, langLibrary, classID, classNews, selectedSubjects} = this.props.userSetup
        const { theme, themeColor } = this.props.interface
        const {online, loading, localChatMessages} = this.props.tempdata
        const {markCnt, chatCnt, newsID} = this.props.stat
        const {selectedFooter, showDrawer} = this.state

        // console.log("App:render", showDrawer)
        const hwarray = localChatMessages!==undefined?localChatMessages.filter(item=>(item.homework_date!==null)):[]
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
            {   name : getLangWord("mobChat", langLibrary),
                icontype : 'material', iconname : 'message', badgestatus : 'primary', kind : 'chat', value : chatCnt },
            {   name : getLangWord("mobHomework", langLibrary),
                icontype : 'material', iconname : 'notifications', badgestatus : 'error', kind : 'homework', value : homework },
            {   name : getLangWord("mobMarks", langLibrary),
                icontype : 'material', iconname : 'timeline', badgestatus : 'success', kind : 'marks', value : markCnt },
            {   name : 'Info',
                icontype : 'material', iconname : 'info', badgestatus : 'warning', kind : 'info', value : 0 },
            {   name : getLangWord("mobCamera", langLibrary),
                icontype : 'material', iconname : 'camera', badgestatus : 'error', kind : '', value : 0 },
            {   name : 'etc',
                icontype : 'material', iconname : 'apps', badgestatus : 'error', kind : '', value : 0 },
        ]
        const modalButtons = [{name : 'ДЗ'}, {name : 'Родители'}, {name : '+Учитель'}, {name : 'Личные'}, {name : 'Workflow'}]
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
                    {/*<Drawer*/}
                        {/*open={this.state.showRegisterDrawer}*/}
                        {/*content={this.renderRegisterDrawer()}*/}
                        {/*tapToClose={true}*/}
                        {/*/>*/}
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

                </Container>
        )
    }
}

export default App;
