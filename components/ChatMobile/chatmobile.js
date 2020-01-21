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
import {    Container, Header, Left, Body, Right, Button,
    Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label, Textarea} from 'native-base';
import MessageList from '../MessageList/messagelist'
import { Picker, NimbleEmoji, getEmojiDataFromCustom, Emoji, emojiIndex  } from 'emoji-mart-native'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import arrow_down from '../../img/ARROW_DOWN.png'
import arrow_up from '../../img/ARROW_UP.png'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
        instanceLocator, testToken, chatUserName, arrLangs } from '../../config/config'
import {dateFromYYYYMMDD, addDay, arrOfWeekDays, dateDiff,
        toYYYYMMDD, instanceAxios, mapStateToProps, prepareMessageToFormat,
        echoClient, axios2, hasAPIConnection, getLangAsyncFunc} from '../../js/helpersLight'
import Pusher from 'pusher-js/react-native'
import Echo from 'laravel-echo'
import styles from '../../css/styles'
import Socketio from 'socket.io-client'
import { Smile } from 'react-feather';

// import addMsg from '../../img/addMsg.svg'
// import { Picker, emojiIndex } from 'emoji-mart';

window.Pusher = Pusher
// import { default as uniqid } from 'uniqid'

// import '../../css/colors.css'
// import './chatmobile.css'

// export default
class ChatMobile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curDate: addDay(new Date(), 1),
            currentUser: null,
            currentRoom: {users:[]},
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
            addMsgs : [],
            isServiceChat : this.props.isservice,
            showEmojiPicker : false,
            newMessage: '',
            messagesNew : [],
            typingUsers : new Map(),
            localChatMessages : this.props.userSetup.localChatMessages,
            curMessage : '',
            modalVisible: false,
            isConnected: true,
            appState : AppState.currentState,
            appStateChanged : false,
            shift: new Animated.Value(0),
            viewHeight : Dimensions.get('window').height,
            keyboardHeight : 0,
            isLastMsg : 0,
        }
        this.Echo = null
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
        // console.log("componentDidMount:chatmobile")
        let {langLibrary} = this.props.userSetup
        let {langCode} = this.props.interface
        // Print component dimensions to console
        // console.log("chatMobile", langLibrary)
        const defLang = langCode && arrLangs.includes(langCode)?langCode : "UA"
        if (!langLibrary) {
            this.props.onReduxUpdate("LANG_LIBRARY", getLangAsyncFunc(langCode ? langCode : defLang))
        }

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

        AppState.addEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);

        this.props.onStartLoading()
        if (this.props.isnew)
            this.initLocalPusher()
        else {
            this.initNetPusher()
        }

        await this.initChatMessages()

        // if (this.typingTimer) clearTimeout(this.typingTimer)
        this.typingTimer = setInterval(()=>{
            // console.log("setInterval-tag")
            let mp = this.state.typingUsers,
                now = (new Date())
            for (let user of mp.keys()) {
                console.log("setInterval", user, now, mp.get(user),
                    Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()),
                    Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(mp.get(user).getFullYear(), mp.get(user).getMonth(), mp.get(user).getDate()) ) /(1000)))

                if (Math.abs(now.getUTCSeconds() - mp.get(user).getUTCSeconds()) > 2) {
                    mp.delete(user)
                    this.setState({typingUsers: mp})
                }

            }
        }, 2000)

    }
    componentWillUnmount() {
        if (this.typingTimer) clearInterval(this.typingTimer)
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate:chatMobile")
        if (nextProps.userSetup.userID&&this.Echo===null) {
            if (this.props.isnew) {
                console.log("shouldUpdateEcho", nextProps.userSetup.userID, this.Echo)
                this.initLocalPusher()
            }
            else {
                this.initNetPusher()
            }
        }
        else {
            if ((!nextProps.userSetup.userID) && this.Echo!==null) {
                this.Echo.disconnect()
                this.Echo = null
            }
        }
        return true
    }
    measureView(event: Object) {
        // console.log(`*** event: ${JSON.stringify(event.nativeEvent)}`);
    }
    getTags=async ()=>{
        await instanceAxios().get(`${API_URL}chat/tags/${this.props.userSetup.classID}`)
            .then(res=>this.props.onReduxUpdate("CHAT_TAGS", res.data))
            .catch(res=>console.log("tagError"))
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        console.log("keyboardHeight", keyboardHeight)
        // const currentlyFocusedField = TextInputState.currentlyFocusedField();
        const currentlyFocusedField = this._animatedView;
        this.setState({viewHeight : (windowHeight - keyboardHeight), keyboardHeight})
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
        const { height: windowHeight } = Dimensions.get('window');
        this.setState({viewHeight : (windowHeight), keyboardHeight : 0})
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
        const {classID, studentId, localChatMessages, markscount} = this.props.userSetup
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

            if (classID) {
                instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
                    .then(response => {
                        // homeworks: 13
                        // marks: 0
                        // msgs: 250
                        // news: 3
                        // ToDO: News исправим позже
                        const today = toYYYYMMDD(new Date())
                        const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today)))
                        if ((response.data.msgs!==localChatMessages.slice(-1).id)||(markscount!==response.data.marks)||(homeworks_count!==response.data.homeworks)) {
                            instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/1`)
                                .then(response => {
                                    const msgs = response.data.msgs
                                    let arr = this.state.localChatMessages
                                    // console.log("GetStatMsgs", msgs)
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
                                    // console.log("Загружено по оффлайну!")
                                    this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
                                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
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
        else {
            // console.log('AppState: ', nextAppState);
        }
        this.setState({appState: nextAppState});
    };

    handleConnectivityChange = isConnected => {
        const {classID, studentId, localChatMessages, markscount} = this.props.userSetup
        if ((this.state.isConnected!==isConnected)&&isConnected) {
            if (classID) {
                instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
                    .then(response => {
                        console.log('handleConnectivityChange', response, this.props.userSetup)
                        // homeworks: 13
                        // marks: 0
                        // msgs: 250
                        // news: 3
                        // ToDO: News исправим позже
                        const today = toYYYYMMDD(new Date())
                        const homeworks_count = localChatMessages.filter(item=>(item.homework_date!==null&&(toYYYYMMDD(new Date(item.homework_date))>=today)))
                        if ((response.data.msgs!==localChatMessages.slice(-1).id)||(markscount!==response.data.marks)||(homeworks_count!==response.data.homeworks)) {
                            instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/1`)
                                .then(response => {
                                     // this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
                                    // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
                                    const msgs = response.data.msgs
                                    let arr = this.state.localChatMessages
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
                                    console.log("Загружено по оффлайну!")
                                    this.props.onReduxUpdate("UPDATE_HOMEWORK", response.data.msgs.filter(item=>(item.homework_date!==null)))
                                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", response.data.msgs)
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
        console.log('getChatMessages', classID)
        // instanceAxios().get(API_URL +`chat/get/${classID}`, [], null)
           axios2('get', `${API_URL}chat/get/${classID}`)
            .then(resp => {
                this.setState({localChatMessages : resp.data})
                // console.log("getChatMessages : Загружено!", resp.data)
                this.props.onReduxUpdate("UPDATE_HOMEWORK", resp.data.filter(item=>(item.homework_date!==null)))
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", resp.data)
                this.props.onStopLoading()
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
        const {chatSSL, token} = this.props.userSetup
        // console.log("initLocalPusher")
        // const larasocket = pusherClient(store.getState().user.token, chatSSL)
        const echo = echoClient(token, chatSSL)

        echo.connector.pusher.logToConsole = true
        echo.connector.pusher.log = (msg) => {console.log(msg);};
        echo.connect()
        let channelName = 'class.'+this.props.userSetup.classID

        // this.setState({Echo: echo})
        this.Echo = echo
        console.log('websocket', echo, channelName, chatSSL)
        if (chatSSL) {
            console.log('websocket-listening', echo)
            echo.join(channelName)
                .listen('ChatMessageSSL', (e) => {
                    console.log("FILTER-SSL")

                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.state.localChatMessages,
                        arrChat = []
                    console.log("FILTER-SSL")
                    arrChat = localChat.map(
                        item => {
                            // console.log("181", item)
                            if (this.state.messagesNew.includes(item.uniqid)) {
                                // Для своих новых
                                if (JSON.parse(msg).uniqid === item.uniqid) {
                                    // console.log("MSGORIG", msgorig, msgorig.id)
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
                    // Если новое и стороннее!!!
                    if (isSideMsg) {
                        arrChat.push(msgorig)
                    }

                    this.setState({
                        localChatMessages: arrChat,
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid)),
                        isLastMsg : msgorig.id,
                    })
                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listen('ChatMessageSSLHomework', (e) => {
                    // ToDO: Обновлять таблицу домашек и пересчитывать Label
                    console.log("FILTER-SSL-HOMEWORK", e.message, e)
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.state.localChatMessages,
                        arrChat = []
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

                    this.setState({
                        localChatMessages: arrChat,
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listen('ChatMessageSSLUpdated', (e) => {
                    console.log("FILTER-SSL-UPDATED")
                    // return
                    let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                    let localChat = this.state.localChatMessages,
                        arrChat = []
                    // console.log("FILTER-NOT-SSL", this.state.localChatMessages)
                    arrChat = localChat.map(
                        item => {
                            console.log("254", item)
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

                    this.setState({
                        localChatMessages: arrChat,
                        messages: [...arrChat, msg],
                        messagesNew: this.state.messagesNew.filter(item => !(item.uniqid === JSON.parse(msg).uniqid))
                    })
                    const todayMessages = arrChat.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                    const homeworks = arrChat.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(addDay((new Date()), 1)))

                    this.props.forceupdate(todayMessages.length, homeworks.length)
                })
                .listenForWhisper('typing', (e) => {
                    if (!this.state.typingUsers.has(e.name)) {
                        let mp = this.state.typingUsers
                        mp.set(e.name, new Date())
                        console.log('SetTypingState', e.name);
                        this.setState({typingUsers: mp})
                    }
                    console.log('typing', e.name);
                })
                .here((users) => {
                    this.setState({users : users});
                    console.log("USERS", users)
                })
                .joining((user) => {
                    console.log("USERS.JOIN", this.state.users, user)
                    this.setState({users : [...this.state.users, user]})
               })
                .leaving((person) => {
                    // this.users = this.users.filter(item=>item !== person);
                    console.log("USERS.LEAVE", this.state.users, person)
                    this.setState({users : this.state.users.filter(item=>item !== person)})
                });
        }
        else
            echo.channel(channelName)
                .listen('ChatMessage', (e) => {
                let msg = prepareMessageToFormat(e.message), msgorig = e.message, isSideMsg = true
                let arr =   this.state.localChatMessages,
                            newArr = []
                    console.log("FILTER-NOT-SSL")
                    // console.log("FILTER-NOT-SSL: this.props", this.props)
                    newArr = arr.map(
                    item=>
                    {
                        console.log("298", item)

                        if (this.state.messagesNew.includes(item.uniqid)) {
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

                this.setState({
                    localChatMessages : newArr,
                    messages: [...arr, msg],
                    messagesNew : this.state.messagesNew.filter(item=>!(item.uniqid===JSON.parse(msg).uniqid))
                })
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
    prepareJSON=()=>{
        console.log("prepareJSON", this.state.selSubjkey)
        let {classID, userName, userID, studentId, studentName} = this.props.userSetup
        let text = this.state.curMessage
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
                    this.addHomeWork(obj.text)
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
                    this.addHomeWork(obj.text)
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
    addMessage=()=>{

        this._textarea.setNativeProps({'editable': false});
        this._textarea.setNativeProps({'editable':true});

        const obj = this.prepareJSON()

        if (JSON.parse(obj).message.length) {
            const objForState = this.prepareMessageToState(obj)
            objForState.msg_date = dateFromYYYYMMDD(toYYYYMMDD(new Date()))
            console.log("addMessage", objForState)
            if (this.props.isnew) {
                this.setState({messages: [...this.state.messages, objForState]})
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
    addHomeWork=(txt, subj_key, subj_name_ua, ondate, chat_id)=>{
        let {classID, userID, studentId} = this.props.userSetup
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
                // this.props.onHomeWorkChanged(response.data)
                // this.setState({
                //     emails : response.data//response.data.map((item, i) => (<div className="itemInEmailList" key={item.id}>{item.email}<button id={item.id} onClick={this.deleteItemInList.bind(this)}>-</button></div>))
                // })
                // dispatch({type: 'UPDATE_SETUP_REMOTE', payload: response.data})
                // this.props.onInitState(response.data.subjects_list, response.data.subjects_count);
            })
            .catch(response => {
                console.log(response);
            })
        // this.setState({sideListLeft: true, editId : 0})
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

        console.log('595', id)

        switch (this.props.isnew) {
            case true :
                let arrChat = this.state.localChatMessages, obj = {}
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
                console.log('816', `${API_URL}chat/add${id?'/'+id:''}`, text)
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
        this.props.onReduxUpdate("ADD_CHAT_MESSAGES", messages)
    }
    onTextIput=()=>{
        this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', false);
    }
    updateChatState = (stateKey, stateValue) => {
        this.setState({[stateKey]: stateValue});
    }
    render() {
        let { showEmojiPicker, shift, localChatMessages } = this.state
        const {langLibrary, offlineMsgs } = this.props.userSetup
        const {theme} = this.props.interface
        const {loading} = this.props.tempdata

        const offlineMsgsLocal = offlineMsgs.filter(item=>(!localChatMessages.filter(itemChat=>itemChat.uniqid===item.uniqid).length))
        // console.log("CHATMOBILE")
        if (offlineMsgsLocal.length){
            localChatMessages = localChatMessages.concat(offlineMsgsLocal)
        }
        // { transform: [{translateY: shift}]} ,
        // console.log("RENDER_CHAT")
        return (
            <View
                ref={component => this._animatedView = component}
                collapsable={false}
                onLayout={(event) => {this.measureView(event)}}
                style={[this.props.hidden?styles.hidden:styles.chatContainerNew, {height: this.state.viewHeight}]}>
                <View style={{flex : 7, height: this.state.viewHeight - 70}}>
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
                                        messages={this.state.messages}
                                        localmessages={localChatMessages}
                                        updatemessages={this.updateLocalMessages}
                                        username={chatUserName}
                                        isshortmsg={this.state.isServiceChat||!this.state.servicePlus}
                                        classID={this.props.classID}
                                        addmsgs={this.state.addMsgs}
                                        sendmessage={this.sendMessage} isnew={this.props.isnew}
                                        addhomework={this.addHomeWork}
                                        updateState={this.props.updateState}
                                        lastmsg={this.state.isLastMsg}
                                        updateChatState={this.updateChatState}
                                        tags={this.state.tags}/>
                    </View>
                    <View style={styles.whoTyping}>
                        {/*<Text>{this.state.typingUsers.size > 0?"Сообщение набира" + ((this.state.typingUsers.size===1?"е":"ю") + "т: ") + Array.from(this.state.typingUsers.keys()).join(', '):""}</Text>*/}
                        <Icon size={18} color={theme.primaryDarkColor} style={[{alighSelf : "flex-start"}]} name='person'/>
                        <Text style={{color : theme.primaryDarkColor, fontSize : 12}} >{this.state.users.length?`[${this.state.users.length}]:`:null}</Text>
                        <Text style={{color : theme.primaryDarkColor, fontSize : 12}}>{this.state.typingUsers.size > 0?
                            ` ... ${Array.from(this.state.typingUsers.keys()).length>2?(Array.from(this.state.typingUsers.keys()).length + " человека"):Array.from(this.state.typingUsers.keys()).join(', ')} ... `:null}</Text>
                    </View>
                </View>
                <View style={[styles.addMsgContainer, {bottom : Platform.OS==="ios"?this.state.keyboardHeight:0}]}>
                            {/*<Button*/}
                                {/*type="button"*/}
                                {/*className="toggle-emoji"*/}
                                {/*onClick={this.toggleEmojiPicker}*/}
                            {/*>*/}
                                {/*<Smile />*/}
                            {/*</Button>*/}
                            <View style={{flex: 7.5}}>
                                <Textarea style={styles.msgAddTextarea}
                                          onKeyPress={this._handleKeyDown}
                                          onChangeText={text=>this.onChangeText('curMessage', text)}
                                          onFocus={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);}}
                                          // this.props.setstate({showFooter : false})

                                          onBlur={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);}}
                                          // this.props.setstate({showFooter : true})

                                          placeholder={langLibrary===undefined?'':(langLibrary.mobMsgHint===undefined?'':langLibrary.mobMsgHint)}  type="text"
                                          ref={component => this._textarea = component}
                                          value={this.state.curMessage}
                                />
                            </View>
                            <View style={styles.btnAddMessage}>
                                <Icon
                                    // raised
                                    name='rightcircle'
                                    type='antdesign'
                                    color={theme.primaryDarkColor}
                                    size={40}
                                    onPress={this.addMessage} />
                            </View>
                </View>

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