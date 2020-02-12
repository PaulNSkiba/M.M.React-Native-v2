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
        AppState, Platform, Animated } from 'react-native';
import {setStorageData, getStorageData, getNextStudyDay, daysList, toYYYYMMDD,
        themeOptions, hasAPIConnection, axios2, getViewStat, getViewStatStart, getNearestSeptFirst} from './js/helpersLight'
import axios from 'axios';
import {API_URL, AUTH_URL, arrLangs}        from './config/config'
import { Container, Content, Footer, FooterTab, Spinner, Button } from 'native-base';
import HeaderBlock from './components/HeaderBlock/headerBlock'
import ChatBlock from './components/ChatBlock/chatblock'
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
            chatMessages: [],
            selectedFooter: 0,
            showLogin: false,
            username: '',
            password: '',
            userID: 0,
            userName: '',
            msgs: 0,
            homeworks: 0,
            // showFooter: true,
            userEmail: '',
            userToken: '',
            isSpinner: false,
            marksInBaseCount: 0,
            appState : AppState.currentState,
            appStateChanged : false,
            appNetWorkChanget : false,
            initialDay : 0,
            showDrawer : false,
            langLibrary : {},
            chatID : this.props.stat.chatID,
            markID : this.props.stat.markID,
            calcStat : false,
            bounceValue: new Animated.Value(100),  //This is the initial position of the subview
            isHidden : true,
            animation: new Animated.Value(0),
            daysArr : daysList().map(item => { let o = {}; o.label = item.name; o.value = item.id; o.date = item.date; return o; }),
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

            this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
            this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);

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
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }
    _toggleSubview() {
        // this.setState({
        //     buttonText: !isHidden ? "Show Subview" : "Hide Subview"
        // });
        let toValue = 100;
        if(this.state.isHidden)
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
        this.setState({isHidden : !this.state.isHidden})
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        console.log("keyboardHeight", keyboardHeight)
        const currentlyFocusedField = this._animatedView;

        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", true)
        // this.setState({viewHeight : (windowHeight - keyboardHeight), keyboardHeight})

        console.log("handleKeyboardDidShow")
    }

    handleKeyboardDidHide = () => {
        const { height: windowHeight } = Dimensions.get('window');
        // this.setState({viewHeight : (windowHeight), keyboardHeight : 0})

        this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        console.log("handleKeyboardDidHide")

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
        console.log("setstate")
        this.setState(obj)
        this.setState({isHidden : true})
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
        return <View style={{
            backgroundColor : theme.primaryColor,
            height : Dimensions.get('window').height,
            width : Dimensions.get('window').width,
            flex: 1,
            flexDirection : 'column',
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

            this.setState({isHidden : !this.state.isHidden})
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
    render() {

        let marksReadCount = 0
        const {marks, localChatMessages, userID, token, langLibrary, classID, classNews} = this.props.userSetup
        const {showFooter, showKeyboard, theme, themeColor, showLogin, footerHeight} = this.props.interface
        const {online, loading} = this.props.tempdata
        const {markID, markCnt, chatCnt, newsID} = this.props.stat

        // console.log("App:render")
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
        if (this.state.selectedFooter===3) {
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

        const screenHeight = Dimensions.get("window").height;
        const backdrop = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0, 0.01],
                        outputRange: [screenHeight, 0],
                        extrapolate: "clamp",
                    }),
                },
            ],
            opacity: this.state.animation.interpolate({
                inputRange: [0.01, 0.5],
                outputRange: [0, 1],
                extrapolate: "clamp",
            }),
        };
        const slideUp = {
            transform: [
                {
                    translateY: this.state.animation.interpolate({
                        inputRange: [0.01, 1],
                        outputRange: [0, -1 * screenHeight],
                        extrapolate: "clamp",
                    }),
                },
            ],
        };

        // if (!this.state.calcStat&&classID>0&&!this.props.stat.gotStats) this.renewStat(classID)
        const buttonWidth = Dimensions.get('window').width/6

        if (!classID&&this.props.stat.gotStats) this.props.onReduxUpdate("INIT_STATDATA")

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
                        open={this.state.showDrawer}
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
                        <ChatBlock hidden={this.state.selectedFooter !== 0}
                                   showLogin={showLogin || (!token.length)}
                                   updateState={this.updateState}
                                   forceupdate={this.fireRender}
                                   setstate={this.setstate}
                                   inputenabled={true}
                        />
                        {this.state.selectedFooter === 1 ?
                            <View style={styles.absoluteView}>
                                <HomeworkBlock hidden={this.state.selectedFooter !== 1}
                                               showLogin={this.state.showLogin}
                                               forceupdate={this.fireRender}
                                               setstate={this.setstate}/>
                            </View> : null}
                        {this.state.selectedFooter === 2 ?
                            <View style={styles.absoluteView}>
                                     <MarksBlock hidden={this.state.selectedFooter !== 2}
                                                showLogin={this.state.showLogin}
                                                // forceupdate={this.fireRender}
                                                // setstate={this.setstate}
                                                updateState={this.updateState}
                                     />
                            </View>
                            : null}
                        {this.state.selectedFooter === 3 ?
                            <View style={styles.absoluteView}>
                                <HelpBlock hidden={this.state.selectedFooter !== 3}
                                           showLogin={this.state.showLogin}
                                           forceupdate={this.fireRender}
                                           setstate={this.setstate}
                                           session_id={this.session_id}
                                />
                            </View> : null}
                        {this.state.selectedFooter === 4 ?
                            <View style={styles.absoluteView}>
                                <CameraBlock hidden={this.state.selectedFooter !== 4}
                                             showLogin={this.state.showLogin}
                                             forceupdate={this.fireRender}
                                             setstate={this.setstate}/>
                            </View> : null}
                        {this.state.selectedFooter === 5 ?
                            <View style={styles.absoluteView}>
                                <ETCBlock hidden={this.state.selectedFooter !== 5}
                                          showLogin={this.state.showLogin}
                                          forceupdate={this.fireRender}
                                          setstate={this.setstate}/>
                            </View> : null}
                    </Container>
                    </Drawer>
                    {showFooter ?
                        <View style={{position : "relative"}} onLayout={(event) =>this.measureView(event)}>
                        <Footer style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor, zIndex : 51}}>
                            <FooterTab style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor}}>
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 0}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'':langLibrary.mobChat}
                                    icontype={'material'}
                                    iconname={'message'}
                                    badgestatus={'primary'}
                                    kind={'chat'}
                                    value={chatCnt}
                                    setstate={this.setstate}
                                    stateid={0}
                                    longpress={this.onLongPress}
                                />
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 1}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={langLibrary===undefined?'':langLibrary.mobHomework===undefined?'':langLibrary.mobHomework}
                                    icontype={'material'}
                                    iconname={'notifications'}
                                    badgestatus={'error'}
                                    kind={'homework'}
                                    value={homework}
                                    setstate={this.setstate}
                                    stateid={1}
                                    longpress={this.onLongPress}
                                />
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 2}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={langLibrary===undefined?'':langLibrary.mobMarks===undefined?'':langLibrary.mobMarks}
                                    icontype={'material'}
                                    iconname={'timeline'}
                                    badgestatus={'success'}
                                    kind={'marks'}
                                    value={markCnt}
                                    setstate={this.setstate}
                                    stateid={2}
                                    longpress={this.onLongPress}
                                />
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 3}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={"Info"}
                                    icontype={'material'}
                                    iconname={'info'}
                                    badgestatus={'warning'}
                                    kind={'info'}
                                    value={0}
                                    setstate={this.setstate}
                                    stateid={3}
                                    longpress={this.onLongPress}
                                />
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 4}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={langLibrary===undefined?'':langLibrary.mobCamera===undefined?'':langLibrary.mobCamera}
                                    icontype={'material'}
                                    iconname={'camera'}
                                    badgestatus={'error'}
                                    kind={''}
                                    value={0}
                                    setstate={this.setstate}
                                    stateid={4}
                                    longpress={this.onLongPress}
                                />
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 5}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={"etc"}
                                    icontype={'material'}
                                    iconname={'apps'}
                                    badgestatus={'error'}
                                    kind={''}
                                    value={0}
                                    setstate={this.setstate}
                                    stateid={5}
                                    longpress={this.onLongPress}
                                />
                            </FooterTab>
                        </Footer>

                                <Modal
                                    isVisible={!this.state.isHidden}
                                    backdropOpacity={0.1}
                                    style={{position : "absolute", height : 65, margin : 0,
                                            padding : 0, bottom : footerHeight + 5,
                                            width : buttonWidth * 4,
                                            marginLeft : 5, marginRight : 5,
                                            // borderWidth : .5, borderColor : theme.primaryDarkColor, borderRadius : 10,
                                            backgroundColor : theme.secondaryColor}}
                                    onBackdropPress={() => this.setState({ isHidden : true })}>
                                    <TouchableWithoutFeedback  onPress={()=>this.setState({isHidden : true})}>
                                        <View style={{  height : 60,
                                                        // borderWidth : .5, borderColor : theme.primaryDarkColor, borderRadius : 10,
                                                        backgroundColor : theme.secondaryColor,
                                                        bottom : 0, margin : 0,
                                                        flex : 1,
                                                        justifyContent : "space-between",
                                                        flexDirection : "row",
                                                        alignItems : "center",
                                            }}>
                                            <ButtonWithBadge
                                                enabled={this.state.selectedFooter === 0}
                                                disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                                onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                                name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'ДЗ чат':'ДЗ чат'}
                                                icontype={'material'}
                                                iconname={'message'}
                                                badgestatus={'primary'}
                                                kind={'chat'}
                                                value={chatCnt}
                                                setstate={this.setstate}
                                                stateid={0}
                                                longpress={null}
                                            />
                                            <ButtonWithBadge
                                                enabled={false}
                                                disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                                onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                                name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'Родители':'Родители'}
                                                icontype={'material'}
                                                iconname={'message'}
                                                badgestatus={'primary'}
                                                kind={'chat'}
                                                value={chatCnt}
                                                setstate={this.setstate}
                                                stateid={0}
                                                longpress={null}
                                            />
                                            <ButtonWithBadge
                                                enabled={false}
                                                disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                                onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                                name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'+Учитель':'+Учитель'}
                                                icontype={'material'}
                                                iconname={'message'}
                                                badgestatus={'primary'}
                                                kind={'chat'}
                                                value={chatCnt}
                                                setstate={this.setstate}
                                                stateid={0}
                                                longpress={null}
                                            />
                                            <ButtonWithBadge
                                                enabled={false}
                                                disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                                onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                                name={langLibrary===undefined?'':langLibrary.mobChat===undefined?'Workflow':'Workflow'}
                                                icontype={'material'}
                                                iconname={'message'}
                                                badgestatus={'primary'}
                                                kind={'chat'}
                                                value={chatCnt}
                                                setstate={this.setstate}
                                                stateid={0}
                                                longpress={null}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            {/*<TouchableWithoutFeedback onPress={() =>{this.handledView.transitionTo({ bottom : 100 })}}>*/}
                                {/*<Animatable.View style={{position : "absolute", backgroundColor : theme.primaryLightColor,*/}
                                                            {/*width : 100, height : 100, bottom : 100}}*/}
                                                 {/*ref={ref => this.handledView = ref}><Text>Handled view!</Text></Animatable.View>*/}
                            {/*</TouchableWithoutFeedback>*/}

                            {/*<View style={[styles.avSheet]}>*/}
                                {/*<Animated.View style={[styles.avPopup, slideUp]}>*/}
                                    {/*<TouchableOpacity onPress={this.handleClose}>*/}
                                        {/*<Text>Close</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</Animated.View>*/}
                            {/*</View>*/}
                            {/*<BottomDrawer*/}
                                {/*containerHeight={200}*/}
                                {/*offset={footerHeight+100}*/}
                                {/*downDisplay={200}*/}
                            {/*>*/}
                                {/*{this.renderContent()}*/}
                            {/*</BottomDrawer>*/}
                            {/*<SlidingUpPanel ref={c => this._panel = c}*/}
                                    {/*// draggableRange={{top: this.state.isHidden?footerHeight + 75:(footerHeight + 75 + 75), bottom: footerHeight}}*/}
                                    {/*// height={this.state.isHidden?footerHeight:(footerHeight + 75)}*/}
                                    {/*// allowDragging={false}*/}
                                    {/*// friction={5}*/}
                                    {/*// showBackdrop={false}*/}
                                    {/*// visible={!this.state.isHidden}*/}
                                {/*>*/}
                                {/*<View style={{*/}
                                    {/*flex: 1,*/}
                                    {/*backgroundColor: theme.primaryLightColor,*/}
                                    {/*alignItems: 'center',*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*height : 250,*/}
                                    {/*width : 200}}>*/}
                                    {/*<Text>Here is the content inside panel</Text>*/}
                                    {/*<Button title='Hide' onPress={() => {this._panel.hide(), this.setState({isHidden : true})}} />*/}
                                {/*</View>*/}
                            {/*</SlidingUpPanel>*/}
                            {/*<TouchableOpacity*/}
                                {/*onPress={()=>{*/}
                                    {/*console.log("ONPRESS333!!!")*/}
                                    {/*this._toggleSubview()*/}
                                {/*}}*/}
                            {/*>*/}
                            {/*<View style={{height : 100, width : 100, zIndex : 100, borderWidth : 2, borderColor :"#000", position : "absolute"}}>*/}
                                {/*<Text>TEST</Text>*/}
                            {/*</View>*/}
                            {/*</TouchableOpacity>*/}

                            {/*<AnimatedTouchable*/}
                                {/*style={[styles.subView,*/}
                                {/*{transform: [{translateY: this.state.bounceValue}]}]}*/}
                                {/*onPress={()=>{console.log("AnimatedView")}}>*/}
                                {/*<TouchableWithoutFeedback*/}
                                    {/*style={{*/}
                                    {/*width : Dimensions.get('window').width, height : 75,*/}
                                    {/*borderWidth : 2, borderColor : "#000",*/}
                                    {/*backgroundColor : theme.primaryLightColor}}*/}
                                    {/*onPress={()=>{*/}
                                    {/*console.log("ONPRESS!!!")*/}
                                    {/*this._toggleSubview()*/}
                                    {/*}}*/}
                                    {/*>*/}
                                    {/*<Text></Text>*/}
                                {/*</TouchableWithoutFeedback>*/}
                            {/*</AnimatedTouchable>*/}

                            {/*<Animated.View*/}
                                    {/*pointerEvents={this.props.visible ? 'auto' : 'none'}*/}
                                    {/*accessibilityViewIsModal*/}
                                    {/*accessibilityLiveRegion="polite"*/}
                                    {/*style={[styles.subView,*/}
                                        {/*{transform: [{translateY: this.state.bounceValue}]}]}*/}
                            {/*>*/}
                                {/*<TouchableWithoutFeedback*/}
                                    {/*style={{*/}
                                        {/*width : Dimensions.get('window').width, height : 75,*/}
                                        {/*borderWidth : 2, borderColor : "#000",*/}
                                        {/*backgroundColor : theme.primaryLightColor}}*/}
                                    {/*onPress={()=>{*/}
                                        {/*console.log("ONPRESS!!!")*/}
                                        {/*this._toggleSubview()*/}
                                    {/*}}*/}
                                {/*>*/}
                                {/*</TouchableWithoutFeedback>*/}
                            {/*</Animated.View>*/}

                        </View> : null}

                </Container>
        )
    }
}

export default App;
