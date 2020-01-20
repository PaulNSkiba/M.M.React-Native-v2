/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity, Image, Dimensions, AppState, Platform } from 'react-native';
import {setStorageData, getStorageData, getNextStudyDay, daysList, toYYYYMMDD,
        themeOptions, hasAPIConnection, axios2, getViewStat, getNearestSeptFirst} from './js/helpersLight'
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
// import { checkInternetConnection, offlineActionCreators } from 'react-native-offline';
// import {AsyncStorage} from 'react-native';
// import {AsyncStorage} from '@react-native-community/async-storage';

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
            daysArr : daysList().map(item => { let o = {}; o.label = item.name; o.value = item.id; o.date = item.date; return o; }),
        }
        let {langCode} = this.props.interface
        this.defLang = langCode && arrLangs.includes(this.props.userSetup.langCode)?langCode : "UA"
        this.session_id = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
        this.showDrawer = this.showDrawer.bind(this)
        this.connectivityCheck = this.connectivityCheck.bind(this)
        this.firstSeptember = getNearestSeptFirst()
        this.thisYearMarks = this.props.userSetup.marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst()))
    }
    componentWillMount(){
        (async ()=> {
            let {langCode} = this.props.interface
            const {classID} = this.props.userSetup
            if (classID > 0) {
                console.log("GETSTAT")
                this.props.onReduxUpdate("UPDATE_VIEWSTAT", await getViewStat(classID))
            }
            if (this.props.userSetup.langLibrary===undefined) {
                this.props.onStartLoading()
                await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
                this.props.onStopLoading()
            }
            else {
                if (!Object.keys(this.props.userSetup.langLibrary).length) {
                    this.props.onStartLoading()
                    await this.getLangAsync(langCode && arrLangs.includes(langCode) ? langCode : this.defLang)
                    this.props.onStopLoading()
                }
            }

        })()
    }
    async componentDidMount() {
        // console.log("COMPONENT_DID_MOUNT", this.props.userSetup.langLibrary)
        if ((Platform.OS === 'ios') || ((Platform.OS === 'android')&&(Platform.Version > 22))) // > 5.1
        {
            MaterialIcons.loadFont()
            Ionicons.loadFont()
            AntDesign.loadFont()
            Foundation.loadFont()
            AppState.addEventListener('change', this._handleAppStateChange);

            this.getSessionID();

            this.connectivityCheck();

            const dataSaved = JSON.parse(await getStorageData("myMarks.data"))
            const {email, token} = dataSaved

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
    shouldComponentUpdate(nextProps, nextState) {
        return true
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
            // ToDO: Проверим изменения в перечне данных (на будущее попробуем подгружать новое)...
            if (classID) {
                // instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
                axios2('get', `${API_URL}class/getstat/${classID}/${studentId}/0`)
                    .then(response => {
                        // console.log('_handleAppStateChange', response)
                    })
                    .catch(response=> {
                        // console.log("_handleAppStateChange_ERROR", response)
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
        this.setState(obj)
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
        const colorOptions = Object.keys(themeOptions);

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
                            const stat = {
                            chatID : 0, tagID : 0, markID : 0, newsID : 0, buildsID : 0, QandAID : 0,
                            budgetID : 0, statID : 0, chats : [], tags : [], marks : [], news : [],
                            builds : [], QandAs : []
                        }
                            this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
                            setStorageData(`${classID}markID`, "0")
                            setStorageData(`${classID}chatID`, "0")
                            setStorageData(`${classID}newsID`, "0")
                            setStorageData(`${classID}buildsID`, "0")
                        }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{fontSize : RFPercentage(3), color : theme.primaryDarkColor, width : "100%", fontWeight : "800"}}>Очистить счётчики</Text>
                    </View>
                </Button>
                :null}
        </View>
    }
    render() {

        let marksReadCount = 0
        const {marks, localChatMessages, userID, token, langLibrary} = this.props.userSetup
        const {showFooter, showKeyboard, theme, themeColor, showLogin} = this.props.interface
        const {online, loading} = this.props.tempdata

        const {markID, chatID} = this.state
        // const thisYearMarks = marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst()))


        const unreadMsgsCount = localChatMessages.filter(item => (item.id > chatID && item.user_id !== userID)).length
        const unreadMarksCount = this.thisYearMarks.filter(item =>(Number(item.id) > markID)).length

        console.log("App:render")

        const hwarray = localChatMessages.filter(item=>(item.homework_date!==null))

        // let unreadMsgsCount = this.state.msgs
        // const unreadMsgsCount = localChatMessages.filter(item=>(item.id>chatID&&item.user_id!==userID)).length

        let {daysArr, initialDay} = this.state
        initialDay = initialDay?initialDay: getNextStudyDay(daysArr)[0]

        const homework =
            (hwarray.length&&daysArr.length&&initialDay?hwarray.filter(item=>{
                    if (item.hasOwnProperty('ondate')) item.homework_date = new Date(item.ondate)
                    return toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(new Date((daysArr[initialDay]).date))
                }
            ).length:0)



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
                        <View
                            onLayout={(event) =>this.measureView(event)}>
                        <Footer style={{elevation: 0, borderWidth : .5, borderColor : theme.secondaryColor}}>
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
                                    value={unreadMsgsCount}
                                    setstate={this.setstate}
                                    stateid={0}/>

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
                                    stateid={1}/>

                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 2}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={langLibrary===undefined?'':langLibrary.mobMarks===undefined?'':langLibrary.mobMarks}
                                    icontype={'material'}
                                    iconname={'timeline'}
                                    badgestatus={'success'}
                                    kind={'marks'}
                                    value={unreadMarksCount}
                                    setstate={this.setstate}
                                    stateid={2}/>

                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 3}
                                    disabled={this.state.showLogin} //  || (this.props.userSetup.userID === 0)
                                    onpress={this.setstate} // this.props.userSetup.userID?this.setstate:null
                                    name={"Info"}
                                    icontype={'material'}
                                    iconname={'info'}
                                    badgestatus={'warning'}
                                    kind={'info'}
                                    value={this.props.userSetup.classNews.filter(item=>item.is_news===2).length}
                                    setstate={this.setstate}
                                    stateid={3}/>

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
                                    stateid={4}/>

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
                                    stateid={5}/>
                            </FooterTab>
                        </Footer></View> : null}

                </Container>
        )
    }
}

export default App;
