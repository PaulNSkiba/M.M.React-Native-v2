/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../../store/configureStore'
import { StyleSheet, Text, View, Image, Modal, TextInput, TouchableWithoutFeedback, AppState,
         Animated, Dimensions, Keyboard, Platform } from 'react-native';
import { Icon } from 'react-native-elements'
import NetInfo from "@react-native-community/netinfo";
import { Container, Header, Left, Body, Right, Button,
    Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label, Textarea, Toast} from 'native-base';
import MessageList from '../MessageList/messagelist'
import { Picker, NimbleEmoji, getEmojiDataFromCustom, Emoji, emojiIndex  } from 'emoji-mart-native'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
        instanceLocator, testToken, chatUserName, arrLangs } from '../../config/config'
import {dateFromYYYYMMDD, addDay, arrOfWeekDays, dateDiff,
        toYYYYMMDD, instanceAxios, mapStateToProps, prepareMessageToFormat,
        echoClient, axios2, hasAPIConnection, getLangAsyncFunc, getViewStatStart,
        prepareImageJSON, getNearestSeptFirst} from '../../js/helpersLight'
import Pusher from 'pusher-js/react-native'
import Echo from 'laravel-echo'
import styles from '../../css/styles'
import Socketio from 'socket.io-client'
import { Smile } from 'react-feather';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";

// import WhoTyping from '../WhoTyping/whotyping'
// import AddMsgContainer from '../AddMsgContainer/addmsgcontainer'
// import addMsg from '../../img/addMsg.svg'
// import { Picker, emojiIndex } from 'emoji-mart';
// import { default as uniqid } from 'uniqid'
// import '../../css/colors.css'
// import './chatmobile.css'

// window.Pusher = Pusher

// export default
class ChatMobile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addMsgs : [],
            appState : AppState.currentState,
            appStateChanged : false,
            curDate: addDay(new Date(), 1),
            currentUser: null,
            currentRoom: {users:[]},
            Echo : null,
            messages: [],
            users: [],
            selSubject : false,
            selSubjkey : null,
            selSubjname : null,
            selDate : false,
            selUser : false,
            dayUp : true,
            subjUp : true,
            userUp : true,
            hwPlus : true,
            servicePlus : true,
            isServiceChat : this.props.isservice,
            showEmojiPicker : false,
            newMessage: '',
            messagesNew : [],
            // typingUsers : new Map(),
            localChatMessages : this.props.tempdata.localChatMessages,
            curMessage : '',
            modalVisible: false,
            isConnected: true,
            shift: new Animated.Value(0),
            height : Dimensions.get('window').height,
            chatViewHeight : Dimensions.get('window').height,
            keyboardHeight : 0,
            isLastMsg : false,
            chatID : 0,
            showUserList : false,
            isChatConnected : false,
        }
        this.now = new Date()
        this.editedMsgID = 0
        this.roomId = this.props.userSetup.classObj.chatroom_id // this.props.chatroomID //
        this.initLocalPusher = this.initLocalPusher.bind(this)
        this.initNetPusher = this.initNetPusher.bind(this)
        this.addEmoji = this.addEmoji.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
        this.sendMessageTextArea = this.sendMessageTextArea.bind(this);
        this.prepareJSON = this.prepareJSON.bind(this)
        this.initChatMessages = this.initChatMessages.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.addMessage = this.addMessage.bind(this)
        this.updateChatState = this.updateChatState.bind(this)
    }
    async componentDidMount(){

        let {langLibrary, classID} = this.props.userSetup
        console.log("ComponentDidMount: ChatMobile : start", classID, (new Date()).toLocaleTimeString())

        let {langCode} = this.props.interface
        // Print component dimensions to console
        // console.log("chatMobile", langLibrary)
        const defLang = langCode && arrLangs.includes(langCode)?langCode : "UA"

        this.renewStat(classID)

        if (!langLibrary) {
            this.props.onReduxUpdate("LANG_LIBRARY", getLangAsyncFunc(langCode ? langCode : defLang))
        }

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

        AppState.addEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);

        // this.props.onStartLoading()

        // if (this.props.isnew&&classID)
        //     this.initLocalPusher()
        // else {
        //     this.initNetPusher()
        // }

        // console.log("initChat:start", (new Date()).toLocaleTimeString())

        // await
        // if (classID) this.initChatMessages()

        // if (this.typingTimer) clearTimeout(this.typingTimer)

        this.typingTimer = setInterval(()=>{
            // console.log("setInterval-tag")
            let mp = this.props.tempdata.typingUsers,
                now = (new Date())

            for (let user of mp.keys()) {
                console.log("setInterval", user, now, mp.get(user),
                    Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()),
                    Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(mp.get(user).getFullYear(), mp.get(user).getMonth(), mp.get(user).getDate()) ) /(1000)))

                if (Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()) > 2) {
                    mp.delete(user)
                    // this.setState({typingUsers: mp})
                    this.props.onReduxUpdate("UPDATE_TYPING_USERS", mp)
                }
            }
        }, 2000)



        // console.log("ComponentDidMount:end", (new Date()).toLocaleTimeString())
    }
    componentWillUnmount() {
        if (this.typingTimer) clearInterval(this.typingTimer)

        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowSub&&this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub&&this.keyboardDidHideSub.remove();
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate:chatMobile", nextProps.userSetup.classID, this.props.userSetup.classID)

        // if (nextProps.userSetup.userID&&this.state.Echo===null) {
        //     if (this.props.isnew) {
        //         console.log("shouldUpdateEcho", nextProps.userSetup.userID, this.state.Echo)
        //         if (!this.state.isChatConnected) this.initLocalPusher()
        //     }
        //     else {
        //         this.initNetPusher()
        //     }
        // }
        // else {
        //     if ((!nextProps.userSetup.userID) && this.state.Echo!==null) {
        //         this.state.Echo.disconnect()
        //         this.state.Echo = null
        //     }
        // }

        if (nextProps.userSetup.classID!==this.props.userSetup.classID)
            this.renewStat(nextProps.userSetup.classID)

        return true
    }
    measureView(event: Object) {
        // console.log(`*** event: ${JSON.stringify(event.nativeEvent)}`);
    }
    getTags=async ()=>{
        axios2('get',`${API_URL}chat/tags/${this.props.userSetup.classID}`)
            .then(res=>this.props.onReduxUpdate("CHAT_TAGS", res.data))
            .catch(res=>console.log("tagError"))
    }
    handleKeyboardDidShow = (event) => {
        const { height } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        console.log("keyboardHeight", keyboardHeight)
        // const currentlyFocusedField = TextInputState.currentlyFocusedField();
        // const currentlyFocusedField = this._animatedView;
        this.setState({keyboardHeight, chatViewHeight : height - keyboardHeight})
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", true)
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", keyboardHeight)

        console.log("handleKeyboardDidShow")
        // this._animatedView.measure((originX, originY, width, height, pageX, pageY) => {
        //     const fieldHeight = height;
        //     const fieldTop = pageY;
        //     const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
        //     console.log("gap", gap)
        //     if (gap >= 0) {
        //         return;
        //     }
        //     Animated.timing(
        //         this.state.shift,
        //         {
        //             toValue: gap,
        //             duration: 1000,
        //             useNativeDriver: true,
        //         }
        //     ).start();
        // });
    }
    handleKeyboardDidHide = () => {
        const { height } = Dimensions.get('window');
        this.setState({keyboardHeight : 0, chatViewHeight : height})
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", 0)

        console.log("handleKeyboardDidHide")
        // return;
        // Animated.timing(
        //     this.state.shift,
        //     {
        //         toValue: 0,
        //         duration: 1000,
        //         useNativeDriver: true,
        //     }
        // ).start();
    }
    _handleAppStateChange = (nextAppState) => {
        const {classID, studentId, markscount} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // console.log('ChatState: ', 'App has come to the foreground!', this.state.appState, nextAppState);
            // ToDO: Вначале проверим, вернулись ли мы в онлайн, если да, то запрос
            let {offlineMsgs} = this.props.userSetup
            hasAPIConnection()
                .then(res=>{
                    // console.log("chatMobile: hasAPIConnection", res)
                    if (res&&offlineMsgs.length){
                        // this.props.onReduxUpdate('UPDATE_ONLINE', res)
                        console.log("chatMobile!!!", res)
                        if (offlineMsgs.length){
                            offlineMsgs.forEach(item=>{
                                console.log("OFFLINE_MSG", item);
                                // this.sendMessage(JSON.stringify(item), 0, false);
                                 instanceAxios().post(`${API_URL}chat/add`, JSON.stringify(item))
                                    .then(response => {
                                        console.log('ADD_MSG', response)
                                         offlineMsgs = offlineMsgs.filter(itemOff=>item.uniqid!==itemOff.uniqid)
                                        this.props.onReduxUpdate("ADD_OFFLINE", offlineMsgs)
                                    })
                                    .catch(response=> {
                                            console.log("AXIOUS_ERROR", response)
                                        }
                                    )
                            })
                        }
                    }
                    })
            // ToDO: Если есть неотправленные сообщения, то пытаемся отправить и чистить отправленные...

            // if (classID) {
            //     axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/0`)
            //         .then(res => {
            //             // homeworks: 13
            //             // marks: 0
            //             // msgs: 250
            //             // news: 3
            //             // ToDO: News исправим позже
            //             const today = toYYYYMMDD(new Date())
            //             const {msgs, marks, homeworks} = res.data
            //             const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today))).length
            //             console.log("OFF_LINE_UPDATE", msgs, localChatMessages.slice(-1)[0].id, markscount, marks, homeworks_count, homeworks)
            //
            //             if ((res.data.msgs!==localChatMessages.slice(-1)[0].id)||(markscount!==marks)||(homeworks_count!==homeworks)) {
            //                 console.log('UPDATE_OFFLINE')
            //                 axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/1`)
            //                     .then(res => {
            //                         const msgs = res.data.msgs
            //                         let arr = localChatMessages//this.props.localchatmessages //this.state.localChatMessages
            //                         // console.log("GetStatMsgs", res.data.marks)
            //                         if (msgs.length) {
            //                             msgs.forEach(msgitem=>{
            //                                 let isinmsg = false
            //                                 arr = arr.map(item=>{
            //                                     if (item.id === msgitem.id) {
            //                                         item = msgitem
            //                                         isinmsg = true
            //                                     }
            //                                     return item
            //                                 })
            //                                 if (!isinmsg) {
            //                                     if (toYYYYMMDD(new Date(msgitem.msg_date))>=toYYYYMMDD(new Date()))
            //                                         arr.push(msgitem)
            //                                     else
            //                                         arr.unshift(msgitem)
            //                                 }
            //                             })
            //                         }
            //                         this.setState({localChatMessages : arr})
            //                         this.props.setstate({localChatMessages : arr})
            //                         this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arr)
            //
            //                         // console.log("Загружено по оффлайну!")
            //                         this.props.onReduxUpdate("UPDATE_HOMEWORK", res.data.msgs.filter(item=>(item.homework_date!==null)))
            //                         // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", res.data.msgs)
            //                         this.props.onReduxUpdate("ADD_MARKS", res.data.marks)
            //
            //                         this.renewStat(classID)
            //                     })
            //                     .catch(response=> {
            //                         console.log("NewData_ERROR", response)
            //                     })
            //             }
            //         })
            //         .catch(response=> {
            //             console.log("handleConnectivityChange_ERROR", response)
            //         })
            // }
        }
        else {
            // console.log('AppState: ', nextAppState);
        }
        this.setState({appState: nextAppState});
    };
    renewStat=classID=>{
        console.log("RENEWSTAT2:start", new Date().toLocaleTimeString())
        this.setState({calcStat : true})
        getViewStatStart(classID)
            .then(res=>{
                const {marks, userID, classNews} = this.props.userSetup
                const {localChatMessages} = this.props.tempdata
                console.log("RENEWSTAT2:then", new Date().toLocaleTimeString(), res)
                res.markCnt = marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst())).filter(item =>(Number(item.id) > res.markID)).length
                res.chatCnt = localChatMessages.filter(item => (item.id > res.chatID && item.user_id !== userID)).length
                res.newsCnt = classNews.filter(item =>(item.is_news===2&&Number(item.id) > res.newsID)).length
                res.buildsCnt = classNews.filter(item =>(item.is_news===1&&Number(item.id) > res.buildsID)).length

                this.props.onReduxUpdate("UPDATE_VIEWSTAT", res)

                this.setState({calcStat : false, chatID : res.chatID})
            })
            .catch(err=>console.log("renewStat:catch", err))
    }
    handleConnectivityChange = isConnected => {
        const {classID, studentId, markscount, classNews} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata
        if ((this.state.isConnected!==isConnected)&&isConnected) {
            if (classID) {
                axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/0`)
                    .then(response => {
                        console.log('handleConnectivityChange', response, this.props.userSetup)
                        // homeworks: 13
                        // marks: 0
                        // msgs: 250
                        // news: 3
                        // ToDO: News исправим позже
                        const today = toYYYYMMDD(new Date())
                        const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today)))
                        if ((response.data.msgs!==localChatMessages.slice(-1).id)||(markscount!==response.data.marks)||(homeworks_count!==response.data.homeworks)||(classNews.length!==response.data.news)) {
                            axios2('get',`${API_URL}class/getstat/${classID}/${studentId}/1`)
                                .then(response => {
                                     // this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
                                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
                                    const msgs = response.data.msgs
                                    let arr = localChatMessages //this.props.localchatmessages//this.state.localChatMessages
                                    console.log("RESPONSE", msgs)
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
                                    this.setState({localChatMessages : arr})
                                    this.props.setstate({localChatMessages : arr})
                                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arr)

                                    console.log("Загружено по оффлайну!")
                                    this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
                                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
                                    this.props.onReduxUpdate('UPDATE_NEWS', response.data.news)
                                    this.props.onReduxUpdate("ADD_MARKS", response.data.marks)
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
        NetInfo.fetch().then(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            // this.setState({netOnline: state.isConnected, netType: state.type})
            this.setState({ isConnected });
        });

        // console.log("NET_TYPE", netType)
        // this.setState({ isConnected});
    };
    toggleEmojiPicker=()=>{
        this.setState({            showEmojiPicker: !this.state.showEmojiPicker,        });
    }
    getChatMessages=classID=>{
        // instanceAxios().get(API_URL +`chat/get/${classID}`, [], null)
            this.props.onStartLoading()
            // console.log("getChatMessages : Загрузка!", `${API_URL}chat/get/${classID}`, this.props.userSetup.token, new Date().toLocaleTimeString())
           axios2('get', `${API_URL}chat/get/${classID}`)
            .then(resp => {

                this.setState({localChatMessages : resp.data})
                this.props.setstate({localChatMessages : resp.data})
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
    initChatMessages=()=>{
        if (this.props.isnew) {
            this.getChatMessages(this.props.userSetup.classID)
        }
        else {
            return []
        }
    }
    addEmoji=(emoji)=>{
        const { newMessage } = this.state;
        const text = `${newMessage}${emoji.native}`;
        this.setState({
            newMessage: text,
            showEmojiPicker: false,
        });
        // this.inputMessage.value = this.inputMessage.value + emoji.native
    }
    initLocalPusher=()=>{
        const {chatSSL, token, userName, classID} = this.props.userSetup
        const {users, typingUsers} = this.props.tempdata
        // console.log("initLocalPusher")
        // const larasocket = pusherClient(store.getState().user.token, chatSSL)
        const echo = echoClient(token, chatSSL)

        echo.connector.pusher.logToConsole = true
        echo.connector.pusher.log = (msg) => {console.log(msg);};

        echo.connect()
//        Connection:

        echo.connector.pusher.connection.bind('connected', () => {
            //your code
            console.log('Chat connected', new Date().toLocaleTimeString())
            this.setState({isChatConnected : true})
            this.props.setstate({isChatConnected : true})
        });

//        Disconnection:
        echo.connector.pusher.connection.bind('disconnected', () => {
            //your code
            console.log('Chat disconnected')
            this.setState({isChatConnected : false})
            this.props.setstate({isChatConnected : false})
        });
//        Reconnection:
//         echo.connector.socket.on('reconnecting', (attemptNumber) => {
//             //your code
//             console.log(`%cSocket reconnecting attempt ${attemptNumber}`, 'color:orange; font-weight:700;');
//         });

        const channelName = `class.${classID}`

        this.setState({Echo: echo})
        this.props.setstate({Echo: echo})
        // this.Echo = echo
        console.log('websocket', echo, channelName, chatSSL)

        if (chatSSL) {
            console.log('websocket-listening', echo)
            echo.join(channelName)
                .listen('ChatMessageSSL', (e) => {
                    console.log("FILTER-SSL")

                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.tempdata.localChatMessages//this.props.localchatmessages //this.state.localChatMessages,
                    let arrChat = []
                    console.log("FILTER-SSL")

                    arrChat = localChat
                    if (this.props.newmessages.filter(newmsg=>newmsg.uniqid===JSON.parse(msg).uniqid).length)
                    arrChat = localChat.map(
                        item => {
                            // console.log("181", item)
                            // if (this.state.messagesNew.includes(item.uniqid)) {
                            if (this.props.newmessages.filter(newmsg=>item.uniqid===newmsg.uniqid).length) {
                                // Для своих новых
                                if (JSON.parse(msg).uniqid === item.uniqid) {
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
                            }
                            else {
                                return item
                            }
                        }
                    )
                    if (localChat.filter(newmsg=>newmsg.id===JSON.parse(msg).id).length)
                        arrChat = localChat.map(
                            item => {
                                // console.log("181", item)
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
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                        isLastMsg : true,
                    })
                    // console.log("NEWMESSAGES", this.props.newmessages, arrChat)
                    this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                                         localChatMessages : arrChat})

                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listen('ChatMessageSSLHomework', (e) => {
                    // ToDO: Обновлять таблицу домашек и пересчитывать Label
                    console.log("FILTER-SSL-HOMEWORK", e.message, e)
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.tempdata.localChatMessages //this.props.localchatmessages//this.state.localChatMessages,
                    let arrChat = []
                    // console.log("FILTER-NOT-SSL", this.state.localChatMessages)
                    arrChat = localChat.map(
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
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                                         localChatMessages : arrChat})

                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listen('ChatMessageSSLUpdated', (e) => {
                    console.log("FILTER-SSL-UPDATED")
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.props.userSetup.localChatMessages //this.props.localchatmessages//this.state.localChatMessages,
                    let arrChat = []
                    // console.log("FILTER-NOT-SSL", this.state.localChatMessages)
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
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                                         localChatMessages : arrChat})

                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
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
                    if (!this.props.tempdata.typingUsers.has(e.name)&&e.name!==userName) {
                        let mp = this.props.tempdata.typingUsers
                        mp.set(e.name, new Date())
                        console.log('SetTypingState', e.name);
                        this.props.onReduxUpdate("UPDATE_TYPING_USERS", mp)
                        // this.setState({typingUsers: mp})
                    }
                    console.log('typing', e.name);
                })
                .here((users) => {
                    //this.setState({users : users});
                    this.props.onReduxUpdate("UPDATE_USERS", users)
                    console.log("USERS.HERE", users)
                })
                .joining((user) => {
                    console.log("USERS.JOIN", users, user)
                    const arr = users.filter(item=>item !== user)
                    {userName!==user?Toast.show({
                        text: `${user} присоединился к чату`,
                        buttonText: 'ОК',
                        position : 'bottom',
                        duration : 2500,
                        style : {marginBottom : 100, fontSize : RFPercentage(1.8)}
                        // type : 'success'
                    }):null}
                    this.props.onReduxUpdate("UPDATE_USERS", [...arr, user])
                    // this.setState({users : [...arr, user]})
               })
                .leaving((person) => {
                    // this.users = this.users.filter(item=>item !== person);
                    if (person!==userName) {

                        Toast.show({
                            text: `${person} покинул чат`,
                            buttonText: 'ОК',
                            position: 'bottom',
                            duration: 2500,
                            style: {marginBottom: 100, fontSize: RFPercentage(1.8)}
                            // type : 'success'
                        })
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
                let arr = localChatMessages //this.props.localchatmessages//this.state.localChatMessages,
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
                    messages: [...arr, msg],
                    messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                })
                this.props.setstate({messagesNew : this.props.newmessages.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                                     localChatMessages : newArr})

                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", newArr)
                    // this.props.updatemessage(msg)
            })
        }

    initNetPusher=()=>{
        // console.log("initNetPusher:roomId", this.roomId)
        if (this.roomId) {
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: chatUserName,
                tokenProvider: new TokenProvider({url: testToken}),
                connectionTimeout: 20000
            })
            chatManager
                .connect()
                .then(currentUser => {
                    this.setState({currentUser: currentUser})
                    return currentUser.subscribeToRoom({
                        roomId: this.roomId.toString(),
                        // messageLimit: 100,
                        hooks: {
                            onMessage: message => {
                                if (JSON.parse(message.text).classID === this.props.classID) {
                                    this.setState({
                                        messages: [...this.state.messages, message.text],
                                    })
                                }
                                this.props.newmessage(JSON.parse(message.text).hasOwnProperty('hwdate'));
                            },
                        }
                    })
                })
                .then(currentRoom => {
                    this.setState({
                        currentRoom,
                        users: currentRoom.userIds
                    })
                })
                .catch(error => console.log(error))

        }
    }
    prepareJSON=(txt, userSetup)=>{
        console.log("prepareJSON", this.state.selSubjkey)
        let {classID, userName, userID, studentId, studentName} = userSetup
        const {curDate, selSubjkey, selSubjname} = this.state
        let text = txt//this.state.curMessage
        let obj = {}
        switch (this.props.isnew) {
            case true :
                obj.id = 0;
                obj.class_id = classID;
                obj.message = text//this.inputMessage.value;
                obj.msg_date = toYYYYMMDD(new Date());
                obj.msg_time = (new Date()).toLocaleTimeString().slice(0, 5);
                if (!(this.state.selSubjkey === null)) {
                    obj.homework_date = toYYYYMMDD(this.state.curDate)
                    obj.homework_subj_key = this.state.selSubjkey
                    obj.homework_subj_name = this.state.selSubjname
                    this.addHomeWork(obj.text, selSubjkey, selSubjname, curDate, 0, userSetup)
                }
                obj.user_id = userID
                obj.user_name = userName
                obj.student_id = studentId
                obj.student_name = studentName
                obj.uniqid = new Date().getTime() + userName //uniqid()
                this.setState({messagesNew : [...this.state.messagesNew, obj.uniqid]})
                break;
            default :
                obj.senderId = chatUserName
                obj.text = text//this.inputMessage.value
                obj.time = (new Date()).toLocaleTimeString().slice(0, 5)
                obj.userID = userID
                obj.userName = userName
                if (!(this.state.selSubjkey === null)) {
                    obj.hwdate = toYYYYMMDD(this.state.curDate)
                    obj.subjkey = this.state.selSubjkey
                    obj.subjname = this.state.selSubjname
                    this.addHomeWork(obj.text, selSubjkey, selSubjname, curDate, 0, userSetup)
                }
                break;
        }
        console.log("prepareJSON", obj, JSON.stringify(obj))
        // this.inputMessage.value = ''
        this.setState({curMessage:""})
        this.setState({
            selSubject: false,
            selDate: false,
        })
        return JSON.stringify(obj)
    }
    prepareMessageToState=(objFrom)=>{
        console.log('418', objFrom)
        objFrom = JSON.parse(objFrom)
        let obj = {}
        obj.senderId = objFrom.user_name
        obj.text = objFrom.message
        obj.time = objFrom.msg_time
        obj.userID = objFrom.user_id
        obj.userName = objFrom.user_name
        obj.uniqid = objFrom.uniqid
        // obj.msg_date = (new Date())
        if (!(objFrom.homework_date === null)) {
            obj.hwdate = objFrom.homework_date
            obj.subjkey = objFrom.homework_subj_key
            obj.subjname = objFrom.homework_subj_name
            obj.subjid = objFrom.homework_subj_id
        }
        obj.id = 0
        //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
        // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
        console.log('prepareMessageToState', JSON.stringify(obj))
        return JSON.stringify(obj)
    }
    addMessage=(text)=>{

        // this._textarea.setNativeProps({'editable': false});
        // this._textarea.setNativeProps({'editable':true});

        const obj = this.prepareJSON(text, this.props.userSetup)

        if (JSON.parse(obj).message.length) {
            const objForState = this.prepareMessageToState(obj)
            objForState.msg_date = dateFromYYYYMMDD(toYYYYMMDD(new Date()))
            console.log("addMessage", objForState)
            if (this.props.isnew) {
                this.setState({messages: [...this.state.messages, objForState], isLastMsg : true})
            }
            this.sendMessage(obj, 0, false)
        }
    }
    _handleKeyDown = (e) => {
        // console.log("_handleKeyDown", e.nativeEvent.key, e.nativeEvent)
        const {classID, userName} = this.props.userSetup
        let key = e.nativeEvent.key
        if (this.props.isnew) {
            let channelName = 'class.'+classID
            this.Echo.join(channelName)
                .whisper('typing', {
                        name: userName
                    })
        }
        return
        if (key === 'Enter') {
            e.preventDefault();
            let obj = this.prepareJSON()
            let objForState = this.prepareMessageToState(obj)

            if (this.props.isnew)
            this.setState({messages : [...this.state.messages, objForState]})
            // console.log("handleKeyDown", obj, this.state.selSubjkey)

            this.sendMessage(obj, 0, false)
        }
        else {
            console.log('e', e.target.value, e.target.value.slice(-1), key, e.target.value.length>=6&&e.target.value.slice(-6))
            if ((e.target.value.slice(-1) === ':' && (!(e.target.value.length>=6&&e.target.value.slice(-6)==='http:/'))&&(!(e.target.value.length>=7&&e.target.value.slice(-7)==='https:/')) && (key.trim().length)) || key===')' || key==='(') {
                console.log('emojiIndex',
                emojiIndex
                    .search(e.target.value.slice(-1)+key)
                    .filter(item=>item.emoticons.indexOf(e.target.value.slice(-1)+key)>=0)
                    .map(o => ({
                        colons: o.colons,
                        native: o.native,
                        }))
                )
                let smile = emojiIndex
                    .search(e.target.value.slice(-1)+key)
                    .filter(item=>item.emoticons.indexOf(e.target.value.slice(-1)+key)>=0)
                    .map(o => ({
                        colons: o.colons,
                        native: o.native,
                    }))

                if (smile.length) {
                    // this.inputMessage.value = this.inputMessage.value.substring(0, this.inputMessage.value.length - 1) + smile[0].native
                    e.preventDefault();
                }
                console.log("smile", emojiIndex.search(key), e.target.value.slice(-1) + key)
            }
        }
    }
    addHomeWork=(txt, subj_key, subj_name_ua, ondate, chat_id, userSetup)=>{
        let {classID, userID, studentId} = userSetup
        let json = `{   "subj_key":"${subj_key}", 
                        "subj_name_ua": "${subj_name_ua}", 
                        "homework": "${txt}", 
                        "ondate": "${toYYYYMMDD(ondate)}", 
                        "user_id": "${userID}", 
                        "chat_id": ${chat_id}, 
                        "student_id":"${studentId}"}`;
        console.log(json);
        instanceAxios().post(HOMEWORK_ADD_URL + '/' + classID + '/hw/' + 0, json)
            .then(response => {
                console.log("HOMEWORK_ADD_URL", response.data)
            })
            .catch(response => {
                console.log(response);
            })
    }
    /*
    * Отправляем электронного письмо
    * (в данном случае в службу техподдержки
    * ToDO: Создать событие на добавлении данных в таблицу техподдержки и уже оттуда отправлять письмо
    * */
    sendMail=(mail, text)=>{
        // let header = {
        //     headers: {
        //         'Content-Type': "application/json",
        //         'Access-Control-Allow-Origin' : '*',
        //         'Access-Control-Allow-Methods' : 'POST',
        //     }
        // }
        let author = !this.inputName===undefined?this.inputName.value:"",
            mailAuthor = !this.inputEmail===undefined?this.inputEmail.value:""
        let json = `{   "session_id":"${this.props.userSetup.session_id}",
                        "mailService":"${mail}",
                        "author":"${author}",
                        "mailAuthor":"${mailAuthor}",
                        "text":"${text}",
                        "classID":${this.props.classID},
                        "userID":${this.props.userID}}`
        console.log("547", json)
        let data = JSON.parse(json);
         if (true) {
            instanceAxios().post(API_URL + 'mail', JSON.stringify(data))
                .then(response => {
                    console.log('SEND_MAIL', response)
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log("AXIOUS_ERROR", response);
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
        }
    }
    /*
    * Отправляем сообщение на сервер Pusher
    * или же просто в state в случае письма в техподдержку
    * ToDo: Вывести сообщение (сделать умный input) в случае незаполнения полей имени и электронки
    * */
    async sendMessage(text, id, fromChat) {
        console.log("sendMessage.1", id, text)
        let arr = this.state.addMsgs
        if (this.state.isServiceChat||!this.state.servicePlus) {
            console.log('Отправим электронку', this.state.addMsgs)
            if (!this.props.userID) {
                if (!this.inputName.value.toString().length) {
                    console.log("Введите имя")
                    return
                }
                if (!this.inputEmail.value.toString().length) {
                    console.log("Введите пожалуйста электронку")
                    return
                }
            }
            console.log('581', text)
            arr.push(JSON.parse(text).text)
            this.sendMail('paul.n.skiba@gmail.com', JSON.parse(text).text)
            this.setState({addMsgs : arr})
            return
        }
        if (fromChat&&id >0) this.editedMsgID = 0
        // console.log("Next message!", text)
        // Передаём сообщение с определёнными параметрами (ID-сессии + ClassID)
        // console.log("sendMessage.2", text, id, this.props.isnew)

        // console.log('595', id)

        switch (this.props.isnew) {
            case true :
                let arrChat = localChatMessages //this.props.localchatmessages//this.state.localChatMessages,
                let obj = {}
                console.log("601: Send message to server.1", "arr.before: ", arr)
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
                // console.log('616', id, arrChat, API_URL + 'chat/add' + (id?`/${id}`:''))
                this.setState({messages: arrChat})
                // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
                // console.log('816', `${API_URL}chat/add${id?'/'+id:''}`, text)
                // instanceAxios().post(API_URL + 'chat/add' + (id?`/${id}`:''), text)
                await axios2('post', `${API_URL}chat/add${id?'/'+id:''}`, text)
                    .then(response => {
                        console.log('ADD_MSG', response)
                        // this._textarea.setNativeProps({'editable':false});
                        // this._textarea.setNativeProps({'editable':true});
                        // this.props.setstate({showFooter : true})
                        this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                        this.setState({curMessage : ''})
                    })
                    .catch(response=> {
                            console.log("AXIOUS_ERROR", response, text)
                            let {offlineMsgs} = this.props.userSetup
                            offlineMsgs.push(JSON.parse(text))
                            this.props.onReduxUpdate("ADD_OFFLINE", offlineMsgs)
                            this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                            this.setState({curMessage: ''})
                        }
                    )
                console.log("sendMessage", text, id)
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

    subjList=()=>{
        console.log(this.props.subjs)
        return this.props.subjs.map((item, i)=><div key={i} onClick={()=>{this.setState({selSubjname : item.subj_name_ua, selSubjkey : item.subj_key, selSubject : true, subjUp: !this.state.subjUp})}} className="add-msg-homework-subject" id={item.subj_key}>{item.subj_name_ua}</div>)
    }
    handleKeyPress=(event)=> {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendMessageTextArea();
        }
    }
    handleInput=(event) =>{
        const { value, name } = event.target;

        this.setState({
            [name]: value,
        });
    }
    sendMessageTextArea=()=> {
        const { newMessage } = this.state;

        if (newMessage.trim() === '') return;

        this.setState({
            newMessage: '',
        });
    }
    onChangeText = (key, val) => {
        // console.log("onChangeText", this.state.curMessage, key, val,
        //     emojiIndex
        //     .search(val.slice(-2))
        //     .filter(item=>item.emoticons.indexOf(val.slice(-2))>=0)
        //     .map(o => ({
        //         colons: o.colons,
        //         native: o.native,
        //     })))

        // console.log("onChangeText", val.length>=6&&val.slice(-6))
        if (val.length > 1&&(!(val.length>=6&&val.slice(-6)==='http:/'))&&(!(val.length>=7&&val.slice(-7)==='https:/'))) {
            let smile = emojiIndex
                .search(val.slice(-2))
                .filter(item => item.emoticons.indexOf(val.slice(-2)) >= 0)
                .map(o => ({
                    colons: o.colons,
                    native: o.native,
                }))

            if (smile.length) {
                val = val.slice(0, val.length - 2) + smile[0].native
            }
        }
        this.setState({ [key]: val})

        if (this.props.isnew) {
            let channelName = 'class.'+this.props.userSetup.classID
            this.Echo.join(channelName)
                .whisper('typing', {
                    name: this.props.userSetup.userName
                })
        }
        // alert(key, val)
        // this.props.updateState()
    }
    updateLocalMessages=(messages)=>{
        this.setState({localChatMessages : messages})
        this.props.setstate({localChatMessages : messages})
        this.props.onReduxUpdate("ADD_CHAT_MESSAGES", messages)
    }
    onTextIput=()=>{
        this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', false);
    }
    updateChatState = (stateKey, stateValue) => {
        this.setState({[stateKey]: stateValue});
    }
    loadMessages=onDate=>{
        this.props.onStartLoading()
        const {classID, token} = this.props.userSetup
        axios2('get', `${API_URL}chat/getbyperiod/${classID}/${toYYYYMMDD(onDate)}/${toYYYYMMDD(new Date())}`)
            .then(resp => {
                this.setState({localChatMessages : resp.data})
                this.props.setstate({localChatMessages : resp.data})
                console.log("loadMessages : Загружено!", new Date().toLocaleTimeString(), `${API_URL}chat/getbyperiod/${classID}/${toYYYYMMDD(onDate)}/${toYYYYMMDD(new Date())}`)
                this.props.onReduxUpdate("UPDATE_HOMEWORK", resp.data.filter(item=>(item.homework_date!==null)))
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", resp.data)
                this.props.onStopLoading()
            })
            .catch(error => {
                console.log('getChatMessagesError', `${API_URL}chat/getbyperiod/${classID}/${toYYYYMMDD(onDate)}/${toYYYYMMDD(new Date())}`, error)
                this.props.onStopLoading()
            })
        this.props.onReduxUpdate("USER_LOGGEDIN_DONE")
    }
    uploadFile=url=>{
        //let url = "file://whatever/com.bla.bla/file.ext"; //The url you received from the DocumentPicker

// I STRONGLY RECOMMEND ADDING A SMALL SETTIMEOUT before uploading the url you just got.
        const split = url.split('/');
        const name = split.pop();
        const inbox = split.pop();
        const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;

        console.log("UPLOAD:", url, realPath)

        const uploadBegin = (response) => {
            const jobId = response.jobId;
            console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        };

        const uploadProgress = (response) => {
            const percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
            console.log('UPLOAD IS ' + percentage + '% DONE!');
        };

        RNFS.uploadFiles({
            toUrl: uploadUrl,
            files: [{
                name,
                filename:name,
                filepath: realPath,
            }],
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            begin: uploadBegin,
            beginCallback: uploadBegin, // Don't ask me, only way I made it work as of 1.5.1
            progressCallback: uploadProgress,
            progress: uploadProgress
        })
            .then((response) => {
                console.log(response,"<<< Response");
                if (response.statusCode === 200) { //You might not be getting a statusCode at all. Check
                    console.log('FILES UPLOADED!');
                } else {
                    console.log('SERVER ERROR');
                }
            })
            .catch((err) => {
                if (err.description) {
                    switch (err.description) {
                        case "cancelled":
                            console.log("Upload cancelled");
                            break;
                        case "empty":
                            console.log("Empty file");
                            break;
                        default:
                            break;
                        //Unknown
                    }
                } else {
                    //Weird
                }
                console.log(err);
            });
    }
    sendMessage(text) {
        const {localChatMessages} = this.props.tempdata
        const id = 0;
        console.log("sendMessage", API_URL + 'chat/add' + (id?`/${id}`:''), text)
        // const {userID} = this.props.userSetup

        axios2('post',`${API_URL}chat/add` + (id?`/${id}`:''), text)
            .then(res => {
                console.log('ADD_MSG', res)

                // if (this.props.isnew)
                    messages = localChatMessages
                // else
                //     messages = this.props.messages

                messages = messages.map(item=>{
                    if (res.data.id===item.id){
                        item = res.data
                    }
                    return item
                })
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", messages)
                // Toast.show({
                //     text: `Изменения сохранены`,
                //     buttonText: 'ОК',
                //     position : 'bottom',
                //     duration : 1500,
                //     style : {marginBottom : 100}
                //     // type : 'success'
                // })
            })
            .catch(response=> {
                    console.log("AXIOUS_ERROR", response)
                    let {offlineMsgs} = this.props.userSetup
                    offlineMsgs.push(JSON.parse(text))
                    this.props.onReduxUpdate("ADD_OFFLINE", offlineMsgs)
                }
            )
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
                                                        console.log("IMG_JSON", data, data100, prepareImageJSON(data, data100,classID, userName, userID, studentId, studentName))
                                                        // Toast.show({
                                                        //     text: `Сообщение добавлено: ${cnt} из ${results.length}`,
                                                        //     buttonText: 'ОК'
                                                        // })
                                                        Toast.show({
                                                            text: `Сообщение добавлено: ${cnt} из ${results.length}`,
                                                            buttonText: 'ОК',
                                                            position : 'bottom',
                                                            duration : 2500,
                                                            style : {marginBottom : 100}
                                                            // type : 'success'
                                                        })
                                                        this.sendMessage(prepareImageJSON(JSON.stringify(data), JSON.stringify(data100),classID, userName, userID, studentId, studentName))
                                                        this.props.onStopLoading()
                                                    })
                                                    .catch(err => {
                                                        console.log("readFile0:Err")
                                                        this.props.onStopLoading()
                                                        // this.setState({isSpinner : false})
                                                    });
                                            })
                                            .catch(err => {console.log("ImgToBase64:Err")
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
    render() {

        // console.log("CHATMOBILE", this.props)
        let { showEmojiPicker, shift, keyboardHeight, chatViewHeight, height } = this.state
        // let {localchatmessages : localChatMessages} = this.props
        // let {localChatMessages} = this.state

        const {langLibrary, offlineMsgs, classID } = this.props.userSetup
        let { localChatMessages } = this.props.tempdata

        const {theme, footerHeight, headerHeight } = this.props.interface
        // const {loading} = this.props.tempdata

        const offlineMsgsLocal = offlineMsgs.filter(item=>(!localChatMessages.filter(itemChat=>itemChat.uniqid===item.uniqid).length))

        if (offlineMsgsLocal.length){
            localChatMessages = localChatMessages.concat(offlineMsgsLocal)
        }
        // console.log("CHATMOBILE")

        // const msgBlockHeight = chatViewHeight - footerHeight - headerHeight - 25
        const msgBlockHeight = height - (50+70+20) - headerHeight - 25
        return (
            <View
                // ref={component => this._animatedView = component}
                // collapsable={false}
                // onLayout={(event) => {this.measureView(event)}}
                style={[this.props.hidden?styles.hidden:styles.chatContainerNew,
                    // {height: chatViewHeight}
                    {height: msgBlockHeight
                        // , borderWidth : 1, borderColor : "#00f"
                    }
                    ]}>
                <View style={{height: msgBlockHeight}}>
                     {showEmojiPicker ? (
                     <View className="picker-background">
                         <Picker set="emojione"
                         onSelect={this.addEmoji}
                         style={{ position: 'absolute', overflow : 'auto',
                         zIndex: '30', height : '400px', width : '340px',
                         marginTop : '10px', background : 'white'}}
                         emojiSize={20}
                         include={['people']}
                         i18n={{
                         search: 'Поиск',
                         categories: {
                         search: 'Результаты поиска',
                         recent: 'Недавние',
                         people: 'Смайлы & Люди',
                         }
                         }}
                        />
                     </View>
                     ) : null}
                    {/*<View className={this.props.isnew?"msg-title-new":"msg-title"} onClick={this.props.btnclose}>*/}
                        {/*<View>{this.state.isServiceChat?<Text>"My.Marks CHAT: Вопрос разработчику"</Text>:<Text>"My.Marks CHAT"</Text>}</View>*/}
                        {/*<View className="btn-close-chat" onClick={this.props.btnclose}>*/}
                            {/*<Text>X</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}

                     {/*{this.props.userSetup.classID&&false?<View style={styles.servicePlus} onClick={()=>{this.setState({servicePlus : !this.state.servicePlus})}}>*/}
                         {/*<Text>{this.state.servicePlus?"+":"-"} Вопрос разработчику</Text></View>:null}*/}

                    {/*{!this.roomId?*/}
                        {/*<View className="msg-title-userdata">*/}
                            {/*<Text>Имя</Text><Input type="text" className="msg-title-userdata-name" ref={input => {this.inputName = input}}></Input>*/}
                            {/*<Text>Email</Text><Input type="email" className="msg-title-userdata-email" ref={input => {this.inputEmail = input}}></Input>*/}
                        {/*</View> */}
                        {/*:null}*/}

                    <View style={styles.messageListContainer}>
                        <MessageList    hwdate={this.state.selDate?this.state.curDate:null}
                                        messages={this.state.messages} // For Pusher
                                        localmessages={localChatMessages} // For Laravel
                                        updatemessages={this.updateLocalMessages}
                                        username={chatUserName}
                                        isshortmsg={this.state.isServiceChat||!this.state.servicePlus}
                                        classID={this.props.classID}
                                        addmsgs={this.state.addMsgs}
                                        loadmessages={this.loadMessages}
                                        sendmessage={this.sendMessage} isnew={this.props.isnew}
                                        addhomework={this.addHomeWork}
                                        updateState={this.props.updateState}
                                        lastmsg={this.props.islastmsg}
                                        updateChatState={this.updateChatState}
                                        tags={this.state.tags}
                                        setstate={this.props.setstate}
                                    />
                    </View>

                </View>

                {/*<TouchableWithoutFeedback delayLongPress={500} onLongPress={()=>this.setState({showUserList : !this.state.showUserList})}>*/}
                    {/*<View style={styles.whoTyping}>*/}
                                {/*<Icon size={18} color={theme.primaryDarkColor} style={[{alighSelf : "flex-start"}]} name='person'/>*/}
                                {/*{this.state.showUserList&&this.state.users.length?<View*/}
                                    {/*style={{zIndex : 50, position : "absolute", left : 10, bottom : 30, borderRadius : 5, backgroundColor : theme.primaryLightColor, borderWidth : .5, borderColor : theme.primaryDarkColor}}*/}
                                    {/*onPress={()=>{this.setState({showUserList : false}), console.log("onUserPress")}}>*/}
                                    {/*{this.state.users.map((item,key)=>*/}
                                        {/*<View key={key} style={{marginLeft : 5, marginRight : 5}}>*/}
                                            {/*<Text style={{color : theme.primaryDarkColor}}>{item}</Text>*/}
                                        {/*</View>*/}
                                    {/*)}*/}
                                {/*</View>:null}*/}
                                {/*<Text style={{color : theme.primaryDarkColor, fontSize : 12}} >{this.state.users.length?`[${this.state.users.length}]:`:null}</Text>*/}
                                {/*<Text style={{color : theme.primaryDarkColor, fontSize : 12}}>{this.props.interface.typingUsers.size > 0?*/}
                                    {/*` ... ${Array.from(this.props.interface.typingUsers.keys()).length>2?(Array.from(this.props.interface.typingUsers.keys()).length + " человека"):Array.from(this.props.interface.typingUsers.keys()).join(', ')} ... `:null}</Text>*/}
                    {/*</View>*/}
                {/*</TouchableWithoutFeedback>*/}

                {/*<WhoTyping*/}
                    {/*isConnected={this.state.isChatConnected}*/}
                {/*/>*/}

                {/*<AddMsgContainer*/}
                    {/*Echo={this.Echo}*/}
                    {/*isnew={true}*/}
                    {/*addmessage={this.addMessage}*/}
                    {/*loadfile={this.loadFile}*/}
                {/*/>*/}

                {/* height = 50 + 20 = 70*/}
                {/*<View style={[styles.addMsgContainer, {display: "flex", flex : 1, bottom : (Platform.OS==="ios"?keyboardHeight:0)}]}>*/}
                            {/*/!*<Button*!/*/}
                                {/*/!*type="button"*!/*/}
                                {/*/!*className="toggle-emoji"*!/*/}
                                {/*/!*onClick={this.toggleEmojiPicker}*!/*/}
                            {/*/!*>*!/*/}
                                {/*/!*<Smile />*!/*/}
                            {/*/!*</Button>*!/*/}
                            {/*<View style={{flex: 7.5, position : "relative"}}>*/}
                                {/*{this.props.inputenabled?<Textarea style={styles.msgAddTextarea}*/}
                                          {/*onKeyPress={this.props.inputenabled?this._handleKeyDown:null}*/}
                                          {/*onChangeText={text=>this.onChangeText('curMessage', text)}*/}
                                          {/*onFocus={()=>{this.props.inputenabled?this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true):null}}*/}
                                          {/*onBlur={()=>{this.props.inputenabled?this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true):null}}*/}
                                          {/*placeholder={getLangWord("mobMsgHint", langLibrary)}  type="text"*/}
                                          {/*ref={component => this._textarea = component}*/}
                                          {/*value={this.state.curMessage}*/}
                                {/*/>:null}*/}
                                {/*<TouchableWithoutFeedback*/}
                                    {/*onLongPress={()=>this.loadFile()}*/}
                                {/*>*/}
                                    {/*<View  style={{right : 10, position : "absolute", zIndex : 50, top : 15}}>*/}
                                {/*<Icon name={'attach-file'}*/}
                                      {/*type='Material Icons'*/}
                                      {/*color={"#565656"}*/}
                                      {/*size={30}*/}
                                      {/*style={{transform: [{rotate: '30deg'}]}}*/}
                                {/*/>*/}
                                    {/*</View>*/}
                                {/*</TouchableWithoutFeedback>*/}
                            {/*</View>*/}
                            {/*<View style={styles.btnAddMessage}>*/}
                                {/*<Icon*/}
                                    {/*// raised*/}
                                    {/*name='rightcircle'*/}
                                    {/*type='antdesign'*/}
                                    {/*color={theme.primaryDarkColor}*/}
                                    {/*size={40}*/}
                                    {/*onPress={this.props.inputenabled?this.addMessage:null} />*/}
                            {/*</View>*/}
                {/*</View>*/}
            </View>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatMobile)