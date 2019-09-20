/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar,} from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
// import HideableView from 'react-native-hideable-view';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab,
            Form, Item, Input, Label} from 'native-base';
import { AsyncStorage } from 'react-native';
import {Provider, connect} from 'react-redux';
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
import { store } from './store/configureStore'
import styles from './css/styles'

// import LogginByToken from './components/LoggingByToken/loggingbytoken'
// import { mapStateToProps, instanceAxios, toYYYYMMDD, langLibrary as langLibraryF } from './js/helpersLight'
// import { userLoggedIn, userLoggedInByToken, userLoggedOut } from './actions/userAuthActions'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatMessages : [],
            selectedFooter : 0,
            showLogin : false,
            username: '',
            password: '',
            userID: 0,
            userName : '',
            msgs : 0,
            homeworks : 0,
            showFooter : true,
            userEmail : '',
            userToken : '',
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
        // this.userEmail = '';
        // this.userToken = '';
        this.updateState = this.updateState.bind(this)
        this.setstate = this.setstate.bind(this)
    }

    componentDidMount() {
        // AsyncStorage.removeItem("myMarks.data");
        // const dataSaved = this._getStorageValue("myMarks.data")
        AsyncStorage.getItem("myMarks.data")
            .then(res=> {
                const dataSaved = JSON.parse(res)

                console.log("componentDidMount.0", dataSaved)
                // && !(AsyncStorage.getItem("userSetup") && AsyncStorage.getItem("userSetupDate") === toYYYYMMDD(new Date()))
                if (!(res === null)) {
                    console.log("componentDidMount.1", dataSaved)

                    // let localstorage = JSON.parse(AsyncStorage.getItem("myMarks.data"))
                    const langLibrary = {}
                    const {email, token} = dataSaved
                    this.setState({userEmail : email, userToken : token})
                    // console.log("componentDidMount", localstorage)
                    }
            }
    )
    }

    // RootContainer =(state)=>
    // ConnectedRoot = connect(mapStateToProps, mapDispatchToProps)(this.RootContainer(this.state));
    updateState=(stateKey, stateValue)=>{
        switch (stateKey) {
            case 'showLogin' :
            this.setState({[stateKey]: !this.state.showLogin})
        }
    }
    setstate=(obj)=>{
        this.setState(obj)
    }
    fireRender=(msgs, homeworks)=>{
        console.log("forceUpdate", homeworks)
        this.setState({msgs, homeworks})
        // this.forceUpdate()
    }
    render ()  {
        // console.log("RENDER_APP", this.state.userEmail, this.state.userToken)
        // const {homework} = this.props.userSetup
        // const tomorrowhomework =
        return (
            <Provider store={store}>
               <Container style={this.state.showFooter?{flex : 1 }:{flex : 1 /*, marginBottom : 40 */}}>
                    <StatusBar barStyle="dark-content" hidden={false} />
                    <HeaderBlock updateState={this.updateState} email={this.state.userEmail} token={this.state.userToken} footer={this.state.selectedFooter}/>
                    <Container >
                        {/*<View style={{flex : 1}}>*/}
                        {/*<HideableView visible={this.state.selectedFooter===1} noAnimation={true}>*/}
                        {/*<View style={this.state.selectedFooter!==0?styles.hidden:null}>*/}

                        <ChatBlock hidden={this.state.selectedFooter!==0}
                                   showLogin={this.state.showLogin}
                                   updateState={this.updateState}
                                   forceupdate={this.fireRender}
                                   setstate={this.setstate}
                        />

                        {this.state.selectedFooter===1?
                            <View style={styles.absoluteView}>
                                <HomeworkBlock hidden={this.state.selectedFooter!==1}
                                               showLogin={this.state.showLogin}
                                               forceupdate={this.fireRender}
                                               setstate={this.setstate}/>
                            </View>:null}

                            {/*<Display enable={this.state.selectedFooter===2}>*/}
                        {this.state.selectedFooter===2?
                            <View style={styles.absoluteView}>
                                <MarksBlock    hidden={this.state.selectedFooter!==2}
                                               showLogin={this.state.showLogin}
                                               forceupdate={this.fireRender}
                                               setstate={this.setstate}/>
                            </View>:null}

                        {this.state.selectedFooter===3?
                            <View style={styles.absoluteView}>
                                <HelpBlock     hidden={this.state.selectedFooter!==3}
                                               showLogin={this.state.showLogin}
                                               forceupdate={this.fireRender}
                                               setstate={this.setstate}/>
                            </View>:null}
                        {this.state.selectedFooter===4?
                            <View style={styles.absoluteView}>
                                <CameraBlock     hidden={this.state.selectedFooter!==4}
                                                 showLogin={this.state.showLogin}
                                                 forceupdate={this.fireRender}
                                                 setstate={this.setstate}/>
                            </View>:null}
                        {this.state.selectedFooter===5?
                            <View style={styles.absoluteView}>
                                <ETCBlock     hidden={this.state.selectedFooter!==5}
                                              showLogin={this.state.showLogin}
                                              forceupdate={this.fireRender}
                                              setstate={this.setstate}/>
                            </View>:null}
                    </Container>
                    {this.state.showFooter?
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
                                value={10}
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
                    </Footer>:null}
                    {/*<AppFooter/>*/}
                </Container>

            </Provider>
        )
    }
}


// const newContent = ()=>
// <Container>
//     <StatusBar barStyle="dark-content" hidden={false} />
//     <Header style={styles.header}>
//         <Left>
//             <Button transparent>
//                 <Icon style={styles.leftArrow} name='arrow-back' />
//             </Button>
//         </Left>
//         <Body>
//             <Title style={styles.myTitle}>My.Marks</Title>
//         </Body>
//         <Right>
//             <Button transparent>
//                 <Icon style={styles.menuIcon} name='menu' />
//             </Button>
//         </Right>
//     </Header>
//     <Content>
//         <View style={styles.container}>
//             <Text>
//                 Lorem ipsum...
//             </Text>
//             {/*<Chat*/}
//                 {/*isnew = {false} updatemessage={this.updateMessages}*/}
//                 {/*session_id={this.props.userSetup.chatSessionID} homeworkarray={this.props.userSetup.homework}*/}
//                 {/*chatroomID={this.props.userSetup.classObj.chatroom_id}*/}
//                 {/*messages={this.state.chatMessages}*/}
//                 {/*subjs={selectedSubjects} btnclose={()=>{this.setState({displayChat:!this.state.displayChat})}}*/}
//                 {/*display={this.state.displayChat} newmessage={this.newChatMessage}*/}
//             {/*/>*/}
//         </View>
//     </Content>
//     <Footer style={styles.header}>
//         <FooterTab style={styles.header}>
//             <Button vertical active>
//                 <Icon name="ios-chatboxes" />
//                 <Text style={styles.tabColorSelected}>Чат</Text>
//             </Button>
//             <Button vertical>
//                 <Icon active name="ios-bookmarks" />
//                 <Text style={styles.tabHomework}>Домашка</Text>
//             </Button>
//             <Button vertical>
//                 <Icon active name="md-analytics" />
//                 <Text style={styles.tabColor}>Оценки</Text>
//             </Button>
//             <Button vertical>
//                 <Icon name="camera" />
//                 <Text style={styles.tabColor}>Камера</Text>
//             </Button>
//             <Button vertical>
//                 <Icon name="apps" />
//                 <Text style={styles.tabColor}>Apps</Text>
//             </Button>
//         </FooterTab>
//     </Footer>
//     {/*<AppFooter/>*/}
// </Container>
//
// const oldContent=()=>
//     <Fragment>
//         <StatusBar barStyle="dark-content" />
//         <SafeAreaView>
//             <ScrollView
//                 contentInsetAdjustmentBehavior="automatic"
//                 style={styles.scrollView}>
//                 <Header />
//                 {global.HermesInternal == null ? null : (
//                     <View style={styles.engine}>
//                         <Text style={styles.footer}>Engine: Hermes</Text>
//                     </View>
//                 )}
//                 <View style={styles.body}>
//                     <View style={styles.sectionContainer}>
//                         <Text style={styles.sectionTitle}>MyMarks TOP333</Text>
//                     </View>
//                     {/*<Text>Проверка</Text>*/}
//                     {/*<LearnMoreLinks />*/}
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     </Fragment>



export default App;
