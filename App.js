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
        this.session_id = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
    }
    componentDidMount() {
        // console.log("COMPONENT_DID_MOUNT")
        AppState.addEventListener('change', this._handleAppStateChange);
        this.getSessionID();
        AsyncStorage.getItem("myMarks.data")
            .then(res => {
                    const dataSaved = JSON.parse(res)
                    if (!(res === null)) {
                        // console.log("componentDidMount.1", dataSaved)
                        const langLibrary = {}
                        const {email, token} = dataSaved
                        this.setState({userEmail: email, userToken: token})
                    }
                }
            )
     }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        const {classID, studentId} = this.props.userSetup
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('AppState: ', 'App has come to the foreground!');
            // ToDO: Проверим изменения в перечне данных (на будущее попробуем подгружать новое)...
            if (classID) {
                instanceAxios().get(API_URL + `class/getstat/${classID}/${studentId}'/0`)
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
        axios.get(API_URL + 'session', [], header)
            .then(response => {
                // console.log("session", response.data.session_id);
                session_id = response.data.session_id
                this.session_id = session_id;
                AsyncStorage.setItem('chatSessionID', session_id)
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
    }
    fireRender = (msgs, homeworks) => {
        console.log("forceUpdate", homeworks)
        this.setState({msgs, homeworks})
    }

    render() {
        let marksReadCount = 0
        const {marks, localChatMessages} = this.props.userSetup
        // const homeworks = localChatMessages.filter(item=>(item.homework_date!==null)).filter(item=>toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(AddDay((new Date()), 1)))
        // console.log("RENDER_APP", marks.length, this.props.userSetup, Dimensions.get('window').width, Dimensions.get('window').height)
        // console.log("RENDER_APP")

        AsyncStorage.getItem("myMarks.marksReadCount")
            .then(res => {
                marksReadCount = res
            })
            .catch(err => marksReadCount = 0);

        return (
                <Container style={this.state.showFooter ? {flex: 1} : {flex: 1 }}>
                    <StatusBar barStyle="dark-content" hidden={false}/>
                    <HeaderBlock updateState={this.updateState} email={this.state.userEmail}
                                 token={this.state.userToken} footer={this.state.selectedFooter}/>
                    {this.state.isSpinner ? <Spinner color="#7DA8E6"/> : null}
                    <Container >

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

                            </FooterTab>
                        </Footer> : null}

                </Container>
        )
    }
}


export default App;
