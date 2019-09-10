/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar,} from 'react-native';

// import { LearnMoreLinks,  Colors,  DebugInstructions,  ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
import {    Container, Header, Left, Body, Right, Button,
            Icon, Title, Content,  Footer, FooterTab, Badge,
            Form, Item, Input, Label} from 'native-base';
import {Provider, connect} from 'react-redux';
import LoginBlock from './components/LoginBlock/loginBlock'
import HeaderBlock from './components/HeaderBlock/headerBlock'
import ChatMobile from './components/ChatMobile/chatmobile'
import ChatBlock from './components/ChatBlock/chatblock'

import { store } from './store/configureStore'
import styles from './css/styles'

// const App = () => newContent()
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
        }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
        this.updateState = this.updateState.bind(this)
    }

    // RootContainer =(state)=>
    // ConnectedRoot = connect(mapStateToProps, mapDispatchToProps)(this.RootContainer(this.state));
    updateState=(stateKey, stateValue)=>{
        switch (stateKey) {
            case 'showLogin' :
            this.setState({[stateKey]: !this.state.showLogin})
        }
    }
    render ()  {
        console.log("SelectedFooter", this.state.selectedFooter)
        return (
            <Provider store={store}>
                <Container style={{flex : 1}}>
                    <StatusBar barStyle="dark-content" hidden={false} />
                        <HeaderBlock updateState={this.updateState}/>
                    <Container >
                        {/*<View style={{flex : 1}}>*/}
                        {this.state.selectedFooter===0?
                            <ChatBlock showLogin={this.state.showLogin} updateState={this.updateState}/>
                                :
                            <ChatBlock showLogin={this.state.showLogin} updateState={this.updateState}/>
                            }

                        {this.state.selectedFooter===1?<View><Text>Домашка</Text></View>:null}
                        {this.state.selectedFooter===2?<View><Text>Оценки</Text></View>:null}
                        {this.state.selectedFooter===3?<View><Text>Помощь</Text></View>:null}
                        {this.state.selectedFooter===4?<View><Text>Камера</Text></View>:null}
                        {this.state.selectedFooter===5?<View><Text>Прочее</Text></View>:null}
                        {/*</View>*/}
                    </Container>
                    <Footer style={styles.header}>
                        <FooterTab style={styles.header}>
                            <Button disabled={this.state.showLogin} badge vertical active={this.state.selectedFooter===0&&(!this.state.showLogin)} onPress={()=>this.setState({selectedFooter : 0})}>
                                <Badge><Text>2</Text></Badge>
                                <Icon name="ios-chatboxes" />
                                <Text style={this.state.selectedFooter===0?styles.tabColorSelected:styles.tabColor}>Чат</Text>
                            </Button>
                            <Button disabled={this.state.showLogin} vertical active={this.state.selectedFooter===1} onPress={()=>this.setState({selectedFooter : 1})}>
                                <Icon active name="ios-bookmarks" />
                                <Text style={styles.tabHomework}>Домашка</Text>
                            </Button>
                            <Button disabled={this.state.showLogin} vertical active={this.state.selectedFooter===2} onPress={()=>this.setState({selectedFooter : 2})}>
                                <Icon active name="md-analytics" />
                                <Text style={this.state.selectedFooter===2?styles.tabColorSelected:styles.tabColor}>Оценки</Text>
                            </Button>
                            <Button disabled={this.state.showLogin} vertical active={this.state.selectedFooter===3} onPress={()=>this.setState({selectedFooter : 3})}>
                                <Icon name="md-alert" />
                                <Text style={this.state.selectedFooter===3?styles.tabColorSelected:styles.tabColor}>Help</Text>
                            </Button>
                            <Button disabled={this.state.showLogin} vertical active={this.state.selectedFooter===4} onPress={()=>this.setState({selectedFooter : 4})}>
                                <Icon name="camera" />
                                <Text style={this.state.selectedFooter===4?styles.tabColorSelected:styles.tabColor}>Камера</Text>
                            </Button>
                            <Button disabled={this.state.showLogin} vertical active={this.state.selectedFooter===5} onPress={()=>this.setState({selectedFooter : 5})}>
                                <Icon name="apps" />
                                <Text style={this.state.selectedFooter===5?styles.tabColorSelected:styles.tabColor}>etc</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
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
