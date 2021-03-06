/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import {    StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity, Animated, Dimensions, Keyboard } from 'react-native';
import {    Container, Header, Left, Body, Right, Button, Card, CardItem,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
            Form, Item, Input, Label, Textarea, CheckBox, Spinner } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat,
        addDay, toYYYYMMDD, daysList, instanceAxios, toLocalDate,
        dateFromTimestamp, setStorageData, getStorageData, getLangWord} from '../../js/helpersLight'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
    instanceLocator, testToken, chatUserName } from '../../config/config'
import { Icon } from 'react-native-elements'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux'
import AccordionCustom from '../AccordionCustom/accordioncustom'
import Dialog, {DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';
// import { AsyncStorage } from 'react-native';


const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class HelpBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            isNews : false,
            questions : [],
            updates : this.getUpdateForAccordion(),
            news : this.getNewsForAccordion(),
            curMessage : '',
            // showFooter : true,
            isSpinner : false,
            showMsg : false,
            height : Dimensions.get('window').height,
            activeTab : 0,
            keyboardHeight : 0,
            newsArr : this.props.userSetup.classNews.filter(item=>item.is_news===2).map(item => {
                let newObj = {};
                newObj.label = `${item.msg_header}`;
                newObj.value = item.id;
                newObj.count = toLocalDate(new Date(item.msg_date), "UA", false, false);
                return newObj;
            }),
            updatesArr : this.props.userSetup.classNews.filter(item=>item.is_news===1).map(item => {
                let newObj = {};
                newObj.label = `${item.build_number}`;
                newObj.value = item.id;
                newObj.count = toLocalDate(new Date(item.msg_date), "UA", false, false);
                return newObj;
            })
        };
        this.session_id = ''//getStorageData('chatSessionID')//AsyncStorage.getItem('chatSessionID')

    }
    async componentDidMount(){
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        this.session_id = await getStorageData('chatSessionID')
        this.props.onStopLoading()
        // console.log("session_id", this.session_id)
    }
    componentWillUnmount() {
        this.keyboardDidShowSub&&this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub&&this.keyboardDidHideSub.remove();
    }
    measureView(event: Object) {
        // console.log(`*** event: ${JSON.stringify(event.nativeEvent)}`);
        // you'll get something like this here:
        // {"target":1105,"layout":{"y":0,"width":256,"x":32,"height":54.5}}
    }
    addQuestionToService=()=>{
        // Если вопрос, то отправляем электронку на админский ящик
        this._textarea.setNativeProps({'editable': false});
        this._textarea.setNativeProps({'editable':true});
        if (!this.state.curMessage.length) return
        // this.setState({isSpinner : true})
        const {studentId, userID, classID} = this.props.userSetup

        let text = `{
            "student_id" : ${studentId},
            "user_id" : ${userID?userID:1},
            "class_id" : ${classID?classID:1},
            "msg_date" : "${toYYYYMMDD(new Date())}",
            "msg_header" : "${userID?(this.state.isNews?"Внесены следующие изменения":""):"Вопрос от незарегистрированного пользователя"}",
            "question" : "${""}",
            "answer" : "${""}",
            "is_news" : ${this.state.isNews?2:null}
        }`

        text = JSON.parse(text)
        text.question = this.state.curMessage
        console.log("addserv", JSON.parse(JSON.stringify(text)))
        instanceAxios().post(API_URL + 'chat/addserv', JSON.parse(JSON.stringify(text)))
            .then(response => {
                // console.log('ADD_MSG', response)
                if (this.state.isNews) {
                    let arr = this.props.userSetup.classNews//this.state.news
                    // console.log("NEWS", text)
                    arr.unshift(response.data)
                    this.props.onReduxUpdate("UPDATE_NEWS", arr)

                    this._textarea.setNativeProps({'editable': false});
                    this._textarea.setNativeProps({'editable':true});
                    // this.props.setstate({showFooter : true})
                    this.setState({news : arr, curMessage : '',
                        // showFooter : true,
                        isSpinner : false})
                    this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                }
                else {
                    // console.log("QUESTION", text)
                    let arr = this.props.userSetup.classNews //this.state.questions
                    arr.unshift(response.data)
                    this.props.onReduxUpdate("UPDATE_NEWS", arr)

                    this.sendMail('paul.n.skiba@gmail.com', this.state.curMessage)

                    this._textarea.setNativeProps({'editable': false});
                    this._textarea.setNativeProps({'editable':true});
                    console.log("SETSTATE", arr)

                    // this.props.setstate({showFooter : true})
                    this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
                    this.setState({questions : arr, curMessage : '',
                        // showFooter : true
                    })
                }
            })
            .catch(response=> {
                    console.log("AXIOUS_ERROR", response)
                    this.setState({isSpinner : false})
            }
            )
        // this.refs.textarea.blur()

        // this.refs.textarea.setNativeProps({'editable':true});
        console.log("sendMessage", text, API_URL + 'chat/addserv')
    }
    sendMail=(mail, text)=>{
        console.log("mailSent")
        const {chatSessionID, userName, classID, userID} = this.props.userSetup
        // let author = !this.inputName===undefined?this.inputName.value:"",
        //     mailAuthor = !this.inputEmail===undefined?this.inputEmail.value:""
        let json = `{   "session_id":"${this.props.session_id}",
                        "mailService":"${mail}",
                        "author":"${userID?userName:"Незарегистрированный пользователь"}",
                        "mailAuthor":"${userID?userName:"Незарегистрированный пользователь"}",
                        "text":"${text}",
                        "classID":${classID?classID:1},
                        "userID":${userID?userID:1}}`

        let data = JSON.parse(json);
        console.log("547", JSON.stringify(data), API_URL + 'mail')
            instanceAxios().post(API_URL + 'mail', JSON.stringify(data))
                .then(response => {
                    console.log('SEND_MAIL', response)
                    this.setState({showMsg : true, isSpinner : false})
                    // dispatch({type: 'UPDATE_STUDENTS_REMOTE', payload: response.data})
                })
                .catch(response => {
                    console.log("SEND_MAIL_ERROR", response);
                    this.setState({isSpinner : false})
                    // dispatch({type: 'UPDATE_STUDENTS_FAILED', payload: response.data})
                })
    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val})
    }
    // getNewsList=(newsList)=>{
    //
    // }
    getNewsForAccordion=()=>{
        // return []
        const news = this.props.userSetup.classNews.filter(item=>item.is_news===2).map(item => {
            let newObj = {};
            newObj.label = `${item.msg_header}`;
            newObj.value = item.id;
            newObj.itembody = item;
            return newObj;
        })
        // По умолчанию выбираем домашку на завтра...
        // console.log("getNewsForAccordion", news)
        return news.map((itemNews, key)=>{
            // console.log("getNewsForAccordion", itemNews, itemNews.itembody.question)
            // contentContainerStyle={{ flexGrow: 1 }}
            return   <View key={key} style={{height: "auto", marginLeft : 10}}>
                        {/*<ScrollView>*/}
                            <Text>{itemNews.itembody.question}</Text>
                        {/*</ScrollView>*/}
                    </View>
        })
    }
    getUpdateForAccordion=()=>{
        // return []
        const updates = this.props.userSetup.classNews.filter(item=>item.is_news===1).map(item => {
            let newObj = {};
            newObj.label = `${item.msg_header}`;
            newObj.value = item.id;
            newObj.itembody = item;
            return newObj;
        })
        // По умолчанию выбираем домашку на завтра...
        // console.log("getNewsForAccordion", news)
        return updates.map((itemNews, key)=>{
            // console.log("getNewsForAccordion", itemNews, itemNews.itembody.question)
            return   <View key={key} style={{height: "auto", marginLeft : 10}}>
                {/*<ScrollView>*/}
                    {itemNews.itembody.question.split("\n").map((item, key)=> {
                        if (item.length) return <Text key={key}>{`${key+1}. ${item}`}</Text>
                    }
                    )}
                {/*</ScrollView>*/}
            </View>
        })
    }
    getQuestionsForAccordion=()=>{

    }
    handleKeyboardDidShow = (event) => {
        // const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        console.log("keyboardHeight", keyboardHeight)
        // const currentlyFocusedField = TextInputState.currentlyFocusedField();
        // const currentlyFocusedField = this._animatedView;
        this.setState({keyboardHeight})
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", true)
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", keyboardHeight)

        console.log("handleKeyboardDidShow")
    }

    handleKeyboardDidHide = () => {
        // const { height: windowHeight } = Dimensions.get('window');
        this.setState({keyboardHeight : 0})
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_SHOW", false)
        // this.props.onReduxUpdate("UPDATE_KEYBOARD_HEIGHT", 0)
        console.log("handleKeyboardDidHide")
    }

    setActiveTab=i=>{
        // console.log("ACTIVE_TAB", i, this.state.dayPages[i]);
        const {classID, classNews} = this.props.userSetup
        this.props.setstate({helpChat : i===2?true:false})
        let {stat} = this.props
        const {newsID, buildsID} = stat
        // const ID = this.state.dayPages[i].markID
        const unreadNewsCount = classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID)).length
        const unreadBuildsCount = classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID)).length
        let ID = 0

        if (i===0&&unreadNewsCount&&classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID)).length)
            ID = classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID))[0].id
        if (i===1&&unreadBuildsCount&&classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID)).length)
            ID = classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID))[0].id

        console.log("updateReadedID", ID, newsID, unreadNewsCount, classNews)

        if (ID) {
            if (i===0) {
                if (newsID < ID) {
                    stat.newsID = Number(ID)
                    stat.newsCnt = 0
                    console.log("UPDATE_VIEWSTAT: news")
                    setStorageData(`${classID}labels`, JSON.stringify(stat))
                    this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
                }
            }
            if (i===1) {
                if (buildsID < ID) {
                    stat.buildsID = Number(ID)
                    stat.buildsCnt = 0
                    console.log("UPDATE_VIEWSTAT: builds")
                    setStorageData(`${classID}labels`, JSON.stringify(stat))
                    this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
                }
            }
        }
        this.setState({activeTab:i})
    }
    getNewsArr=()=>
        this.props.userSetup.classNews.filter(item=>item.is_news===2).map(item => {
            let newObj = {};
            newObj.label = `${item.msg_header}`;
            newObj.value = item.id;
            newObj.count = toLocalDate(new Date(item.msg_date.length===8?dateFromYYYYMMDD(item.msg_date):item.msg_date), "UA", false, false);
            return newObj;
        })
    getUpdatesArr=()=>
        this.props.userSetup.classNews.filter(item=>item.is_news===1).map(item => {
        let newObj = {};
        newObj.label = `${item.build_number}`;
        newObj.value = item.id;
        newObj.count = toLocalDate(new Date(item.msg_date.length===8?dateFromYYYYMMDD(item.msg_date):item.msg_date), "UA", false, false);
        return newObj;
    })

    render () {
        // const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        console.log("helpBlock", this.props.userSetup.classNews)
        let {height, keyboardHeight} = this.state
        const {langLibrary, classNews, userID} = this.props.userSetup
        const {theme, headerHeight} = this.props.interface

        // const newsArr = classNews.filter(item=>item.is_news===2).map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.msg_header}`;
        //     newObj.value = item.id;
        //     newObj.count = toLocalDate(new Date(item.msg_date.length===8?dateFromYYYYMMDD(item.msg_date):item.msg_date), "UA", false, false);
        //     return newObj;
        // })
        // const updatesArr = classNews.filter(item=>item.is_news===1).map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.build_number}`;
        //     newObj.value = item.id;
        //     newObj.count = toLocalDate(new Date(item.msg_date.length===8?dateFromYYYYMMDD(item.msg_date):item.msg_date), "UA", false, false);
        //     return newObj;
        // })
        //
        // const updates = this.getUpdateForAccordion()
        // const news = this.getNewsForAccordion()

        let unreadNewsCount = 0, unreadBuildsCount = 0
        if (this.props.kind==='info') {
            let {newsID, buildsID} = this.props.stat
            unreadNewsCount = classNews.filter(item =>(item.is_news===2&&Number(item.id) > newsID)).length
            unreadBuildsCount = classNews.filter(item =>(item.is_news===1&&Number(item.id) > buildsID)).length
            // console.log("button", this.props.kind, markID, unreadMarksCount, marks)
        }
        const msgBlockHeight = height - headerHeight - 120
        return (
            <View >
                 <Tabs onChangeTab={({ i, ref, from }) => this.setActiveTab(i)} style={this.state.activeTab===2?{height: (height)}:null}>
                         <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                             {getLangWord("mobNews", langLibrary).toUpperCase()}
                             </Text></TabHeading>}
                                onPress={()=>console.log("Tab1_Clicked")}>
                             <View style={styles.homeworkSubjectList}>
                                 <Container style={{flex: 1, width : "100%", flexDirection: 'column', position: "relative"}}>
                                     <View style={{height : Dimensions.get('window').height - 2*headerHeight - 70}}>
                                        <AccordionCustom data={this.getNewsArr()}  data2={this.getNewsForAccordion()} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                     </View>
                                 </Container>
                             </View>
                        </Tab>
                        <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                            {getLangWord("mobBuilds", langLibrary).toUpperCase()}
                            </Text></TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                <Container style={{flex: 1, width : "100%", flexDirection: 'column', position: "relative"}}>
                                    <View style={{height : Dimensions.get('window').height - 2*headerHeight - 70}}>
                                        <AccordionCustom data={this.getUpdatesArr()}  data2={this.getUpdateForAccordion()} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                    </View>
                                </Container>
                            </View>
                        </Tab>
                        <Tab style={{height: (height - keyboardHeight)}} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                            {getLangWord("mobQandA", langLibrary).toUpperCase()}
                            </Text></TabHeading>}>
                            {/*<Container style={{width : "100%", flexDirection: 'column', position: "relative"}}>*/}
                                {/*<View style={[styles.chatContainerNew, {flex: 1}]}>*/}
                                <View
                                    ref={component => this._animatedView = component}
                                    collapsable={false}
                                    onLayout={(event) => {this.measureView(event)}}
                                    style={[styles.chatContainerNew, {flex: 1}, {height: (height  - 2*headerHeight - 70)}]}>
                                    {this.state.isSpinner ? <View
                                        style={{position: "absolute", flex: 1, alignSelf: 'center', marginTop: 240, zIndex: 100}}>
                                        <Spinner color={theme.secondaryColor}/>
                                    </View> : null}
                                            <View style={{height : msgBlockHeight}}>
                                                <ScrollView>
                                                {/*<Text>Блок вопросов</Text>*/}
                                                    {this.props.userSetup.classNews.filter(item=>item.is_news===null).map((item, i)=>
                                                    <Card key={i}>
                                                        {/*{console.log("RENDER_QUESTIONS", item, item.question, this.state.questions)}*/}
                                                        <CardItem>
                                                            <TouchableOpacity
                                                                onPress={() => console.log("onPressQuestion")/*this.addToChat(JSON.stringify(item.data)*/}>
                                                                <Body style={{
                                                                    paddingLeft: 5,
                                                                    paddingRight: 5,
                                                                    display : "flex",
                                                                    alignItems: "flex-start",
                                                                    justifyContent: "center",
                                                                }}>
                                                                    <Text>{item.question}</Text>
                                                                    {item.answer!==null?
                                                                        <View style={styles.answer}>
                                                                            <Text>{item.answer}</Text>
                                                                        </View>
                                                                        :null}
                                                                </Body>
                                                            </TouchableOpacity>
                                                            <Right style={{ position : "absolute", right : 5, bottom : 2}}>
                                                                <Text style={{fontSize: RFPercentage(1.4), color : "#4472C4"}} note>{toLocalDate(dateFromTimestamp(item.created_at), "UA", true, false)}</Text>
                                                            </Right>
                                                        </CardItem>
                                                    </Card>)}
                                                </ScrollView>
                                            </View>
                                            <View style={[styles.addMsgContainer, {display: "flex", flex : 1, bottom : Platform.OS==="ios"?keyboardHeight:0}]}>
                                                <View>
                                                    <Dialog
                                                        visible={this.state.showMsg}
                                                        dialogStyle={{backgroundColor: "#1890e6", color: "#fff"}}
                                                        footer={
                                                            <DialogFooter>
                                                                <DialogButton
                                                                    text="OK"
                                                                    onPress={()=>this.setState({showMsg : false, isSpinner  : false})}
                                                                />
                                                            </DialogFooter>
                                                        }
                                                    >
                                                        <DialogContent style={{paddingTop: 20, paddingBottom: 20}}>
                                                            <Text style={{color: "#fff"}}>{"Сообщение отправлено. Мы напишем Вам на указанный email"}</Text>
                                                        </DialogContent>
                                                    </Dialog>
                                                </View>
                                                {/*{this.props.userSetup.isadmin?*/}
                                                    {/*<View className={styles.isNewsCheckbox}>*/}
                                                        {/*<CheckBox style={{marginTop : 20}}*/}
                                                                  {/*checked={this.state.isNews}*/}
                                                                  {/*onPress={()=>{this.setState({isNews:!this.state.isNews})}} color={theme.primaryDarkColor}/>*/}
                                                        {/*<Body>*/}
                                                        {/*<Text style={{ color : theme.primaryDarkColor, fontSize: RFPercentage(2)}}> News</Text>*/}
                                                        {/*</Body>*/}
                                                    {/*</View>*/}
                                                    {/*:null}*/}
                                                {/*<View style={{flex : 6.5}}>*/}
                                                                {/*<Textarea*/}
                                                                    {/*style={styles.msgAddTextarea}*/}
                                                                    {/*ref={component => this._textarea = component}*/}
                                                                    {/*onSubmitEditing={() => {*/}
                                                                        {/*this._textarea.setNativeProps({'editable':false});*/}
                                                                        {/*this._textarea.setNativeProps({'editable':true});*/}
                                                                    {/*}}*/}
                                                                    {/*onChangeText={text=>this.onChangeText('curMessage', text)}*/}
                                                                    {/*onFocus={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', false);*/}
                                                                    {/*// this.props.setstate({showFooter : false}); this.setState({showFooter : false})*/}
                                                                    {/*}}*/}
                                                                    {/*onBlur={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);*/}
                                                                    {/*// this.props.setstate({showFooter : true}); this.setState({showFooter : true})*/}
                                                                    {/*}}*/}
                                                                    {/*placeholder={userID?"Задать вопрос разработчику..." : "Задавая вопрос без логина, пожалуйста, укажите в сообщении контактный email для связи)..."} type="text"*/}
                                                                    {/*rowSpan={userID?3:5}*/}
                                                                    {/*value={this.state.curMessage}*/}
                                                                {/*/>*/}
                                                {/*</View>*/}
                                                {/*<View style={styles.btnAddMessage}>*/}
                                                    {/*<Icon*/}
                                                        {/*name='rightcircle'*/}
                                                        {/*type='antdesign'*/}
                                                        {/*color={theme.primaryDarkColor}*/}
                                                        {/*size={40}*/}
                                                        {/*onPress={()=>{this.setState({isSpinner : true}); this.addQuestionToService()}} />*/}
                                                {/*</View>*/}
                                                {/*<View style={{width : 4}}></View>*/}
                                            </View>
                                </View>

                            {/*</Container>*/}

                        </Tab>
                    </Tabs>
                </View>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HelpBlock)