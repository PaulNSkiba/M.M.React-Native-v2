/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Dimensions, AppState} from 'react-native';
import axios from 'axios';
import {API_URL}        from './config/config'
import { Container, Footer, FooterTab, Spinner, } from 'native-base';
import {AsyncStorage} from 'react-native';
import LoginBlock from './components/LoginBlock/loginBlock'
import HeaderBlock from './components/HeaderBlock/headerBlock'
import ChatMobile from './components/ChatMobile/chatmobile'
import ChatBlock from './components/ChatBlock/chatblock'
import HomeworkBlock from './components/HomeworkBlock/homeworkblock'
import MarksBlock from './components/MarksBlock/marksblock'
import HelpBlock from './components/HelpBlock/helpblock'
import CameraBlock from './components/CameraBlock/camerablock'
import ETCBlock from './components/ETCBlock/etcblock'
import ButtonWithBadge from './components/ButtonWithBadge/buttonwithbadge'
import styles from './css/styles'
import {instanceAxios, toYYYYMMDD, AddDay} from './js/helpersLight'

// import HideableView from 'react-native-hideable-view';
// import LogginByToken from './components/LoggingByToken/loggingbytoken'
// import { mapStateToProps, instanceAxios, toYYYYMMDD, langLibrary as langLibraryF } from './js/helpersLight'
// import { userLoggedIn, userLoggedInByToken, userLoggedOut } from './actions/userAuthActions'

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
            showFooter: true,
            userEmail: '',
            userToken: '',
            isSpinner: false,
            marksInBaseCount: 0,
            appState : AppState.currentState,
            appStateChanged : false,
            appNetWorkChanget : false,
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
        // this.userEmail = '';
        // this.userToken = '';
        this.session_id = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
    }

    componentDidMount() {

        // console.log("COMPONENT_DID_MOUNT")
        AppState.addEventListener('change', this._handleAppStateChange);
        // AsyncStorage.removeItem("myMarks.data");
        // const dataSaved = this._getStorageValue("myMarks.data")
        this.getSessionID();
        AsyncStorage.getItem("myMarks.data")
            .then(res => {
                    const dataSaved = JSON.parse(res)

                    // console.log("componentDidMount.0", dataSaved)
                    // && !(AsyncStorage.getItem("userSetup") && AsyncStorage.getItem("userSetupDate") === toYYYYMMDD(new Date()))
                    if (!(res === null)) {
                        // console.log("componentDidMount.1", dataSaved)
                        // let localstorage = JSON.parse(AsyncStorage.getItem("myMarks.data"))
                        const langLibrary = {}
                        const {email, token} = dataSaved
                        this.setState({userEmail: email, userToken: token})
                        // console.log("componentDidMount", localstorage)
                    }
                }
            )
        // ToDO: Проверяем на наличие новых сообщений, оценок и новостей
        // setTimer(()=>{},
        // 10000
        // )
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        const {classID, studentId} = this.props.userSetup
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('AppState: ', 'App has come to the foreground!');
            // Проверим изменения в перечне данных...
            if (classID) {
                instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
                    .then(response => {
                        console.log('_handleAppStateChange', response)
                        // this.refs.textarea.setNativeProps({'editable':false});
                        // this.refs.textarea.setNativeProps({'editable':true});
                        // this.props.setstate({showFooter : true})
                        // this.setState({curMessage : ''})
                    })
                    .catch(response=> {
                        console.log("_handleAppStateChange_ERROR", response)
                    })
            }
        }
        else {
            console.log('AppState: ', nextAppState);
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
        axios.get(API_URL + 'session', [], header)
            .then(response => {
                session_id = response.data.session_id
                this.session_id = session_id;
                // this.props.onReduxUpdate('CHAT_SESSION_ID', session_id)
                AsyncStorage.setItem('chatSessionID', session_id)
                // console.log("session", session_id);
            })
            .catch(response => {
                console.log("session_error", response);
            })
        return session_id
    }

    // RootContainer =(state)=>
    // ConnectedRoot = connect(mapStateToProps, mapDispatchToProps)(this.RootContainer(this.state));
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
    }
    fireRender = (msgs, homeworks) => {
        console.log("forceUpdate", homeworks)
        this.setState({msgs, homeworks})
        // this.forceUpdate()
    }

    render() {

        // const {homework} = this.props.userSetup
        // const tomorrowhomework =
        let marksReadCount = 0
        const {marks, localChatMessages} = this.props.userSetup
        const homeworks = localChatMessages.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(AddDay((new Date()), 1)))

        // console.log("RENDER_APP", marks.length, this.props.userSetup, Dimensions.get('window').width, Dimensions.get('window').height)
        console.log("RENDER_APP")

        AsyncStorage.getItem("myMarks.marksReadCount")
            .then(res => {
                marksReadCount = res
            })
            .catch(err => marksReadCount = 0);

        return (
                <Container style={this.state.showFooter ? {flex: 1} : {flex: 1 /*, marginBottom : 40 */}}>
                    <StatusBar barStyle="dark-content" hidden={false}/>
                    <HeaderBlock updateState={this.updateState} email={this.state.userEmail}
                                 token={this.state.userToken} footer={this.state.selectedFooter}/>
                    {this.state.isSpinner ? <Spinner color="#7DA8E6"/> : null}
                    <Container >
                        {/*<View style={{flex : 1}}>*/}
                        {/*<HideableView visible={this.state.selectedFooter===1} noAnimation={true}>*/}
                        {/*<View style={this.state.selectedFooter!==0?styles.hidden:null}>*/}

                        <ChatBlock hidden={this.state.selectedFooter !== 0}
                                   showLogin={this.state.showLogin || (!this.state.userToken.length)}
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

                        {/*<Display enable={this.state.selectedFooter===2}>*/}
                        {this.state.selectedFooter === 2 ?
                            <View style={styles.absoluteView}>
                                <MarksBlock hidden={this.state.selectedFooter !== 2}
                                            showLogin={this.state.showLogin}
                                            forceupdate={this.fireRender}
                                            setstate={this.setstate}/>
                            </View> : null}

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
                    {this.state.showFooter ?
                        <Footer style={styles.header}>
                            <FooterTab style={styles.header}>
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 0}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"Чат"}
                                    icontype={'material'}
                                    iconname={'message'}
                                    badgestatus={'primary'}
                                    kind={'chat'}
                                    value={this.state.msgs}
                                    setstate={this.setstate}
                                    stateid={0}/>
                                {/*<Button style={this.state.selectedFooter === 0?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}}
                                 disabled={this.state.showLogin} badge vertical
                                 active={this.state.selectedFooter===0&&(!this.state.showLogin)} onPress={()=>this.setState({selectedFooter : 0})}>*/}
                                {/*<Badge value={22} status={"primary"} containerStyle={{ position: 'absolute', top: -8, right: 2 }}></Badge>*/}
                                {/*<Icon active type='material' name='message' inverse />*/}
                                {/*<Text style={this.state.selectedFooter===0?styles.tabColorSelected:styles.tabColor}>Чат</Text>*/}
                                {/*</Button>*/}

                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 1}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"Домашка"}
                                    icontype={'material'}
                                    iconname={'notifications'}
                                    badgestatus={'error'}
                                    kind={'homework'}
                                    value={this.state.homeworks}
                                    setstate={this.setstate}
                                    stateid={1}/>

                                {/*<Button style={this.state.selectedFooter === 1?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}} disabled={this.state.showLogin} vertical active={this.state.selectedFooter===1} onPress={()=>this.setState({selectedFooter : 1})}>*/}
                                {/*<Badge value={5} status={"error"} containerStyle={{ position: 'absolute', top: -8, right: 2 }}></Badge>*/}
                                {/*<Icon active name="notifications" />*/}
                                {/*<Text style={this.state.selectedFooter===1?styles.tabColorSelected:styles.tabHomework}>Домашка</Text>*/}
                                {/*</Button>*/}

                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 2}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"Оценки"}
                                    icontype={'material'}
                                    iconname={'timeline'}
                                    badgestatus={'success'}
                                    kind={'marks'}
                                    value={(marks.length - marksReadCount)}
                                    setstate={this.setstate}
                                    stateid={2}/>

                                {/*<Button style={this.state.selectedFooter === 2?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}} disabled={this.state.showLogin} vertical active={this.state.selectedFooter===2} onPress={()=>this.setState({selectedFooter : 2})}>*/}
                                {/*<Icon active name="timeline" />*/}
                                {/*<Text style={this.state.selectedFooter===2?styles.tabColorSelected:styles.tabColor}>Оценки</Text>*/}
                                {/*</Button>*/}
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 3}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"Info"}
                                    icontype={'material'}
                                    iconname={'info'}
                                    badgestatus={'warning'}
                                    kind={'info'}
                                    value={1}
                                    setstate={this.setstate}
                                    stateid={3}/>
                                {/*<Button style={this.state.selectedFooter === 3?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}} disabled={this.state.showLogin} vertical active={this.state.selectedFooter===3} onPress={()=>this.setState({selectedFooter : 3})}>*/}
                                {/*<Icon name="info" />*/}
                                {/*<Text style={this.state.selectedFooter===3?styles.tabColorSelected:styles.tabColor}>Help</Text>*/}
                                {/*</Button>*/}
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 4}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"Камера"}
                                    icontype={'material'}
                                    iconname={'camera'}
                                    badgestatus={'error'}
                                    kind={''}
                                    value={0}
                                    setstate={this.setstate}
                                    stateid={4}/>

                                {/*<Button style={this.state.selectedFooter === 4?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}} disabled={this.state.showLogin} vertical active={this.state.selectedFooter===4} onPress={()=>this.setState({selectedFooter : 4})}>*/}
                                {/*<Icon name="camera" />*/}
                                {/*<Text style={this.state.selectedFooter===4?styles.tabColorSelected:styles.tabColor}>Камера</Text>*/}
                                {/*</Button>*/}
                                <ButtonWithBadge
                                    enabled={this.state.selectedFooter === 5}
                                    disabled={this.state.showLogin}
                                    onpress={this.setstate}
                                    name={"etc"}
                                    icontype={'material'}
                                    iconname={'apps'}
                                    badgestatus={'error'}
                                    kind={''}
                                    value={0}
                                    setstate={this.setstate}
                                    stateid={5}/>

                                {/*<Button style={this.state.selectedFooter === 5?{backgroundColor : "#A9A9A9", color : "#fff"}:{backgroundColor : "#f0f0f0", color : "#fff"}} disabled={this.state.showLogin} vertical active={this.state.selectedFooter===5} onPress={()=>this.setState({selectedFooter : 5})}>*/}
                                {/*<Icon name="apps" />*/}
                                {/*<Text style={this.state.selectedFooter===5?styles.tabColorSelected:styles.tabColor}>etc</Text>*/}
                                {/*</Button>*/}
                            </FooterTab>
                        </Footer> : null}
                    {/*<AppFooter/>*/}
                </Container>
        )
    }
}


export default App;
