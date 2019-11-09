/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import {    StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button, Card, CardItem,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
            Form, Item, Input, Label, Textarea, CheckBox, Spinner } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, instanceAxios, toLocalDate, dateFromTimestamp} from '../../js/helpersLight'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
    instanceLocator, testToken, chatUserName } from '../../config/config'
import { Icon } from 'react-native-elements'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux'
import { AsyncStorage } from 'react-native';
import AccordionCustom from '../AccordionCustom/accordioncustom'
import Dialog, {DialogFooter, DialogButton, DialogContent} from 'react-native-popup-dialog';

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
            showFooter : true,
            isSpinner : false,
            showMsg : false,
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
        this.session_id =  AsyncStorage.getItem('chatSessionID')
    }
    componentDidMount(){
        // this.getNews()
    }
    // getNextStudyDay=arr=>{
    //     let i = 0; obj = {};
    //     arr.forEach((item, index)=>{
    //         if (item.value > 0 && i===0) {
    //             i = index;
    //             obj = item;
    //         }
    //     })
    //     return [i, obj];
    // }
    // getNews=()=>{
    //     const {classID, userID} = this.props.userSetup
    //     // console.log('getChatMessages', this.props.userSetup.classID, classID)
    //     instanceAxios().get(API_URL +`chat/getserv/${classID}/${userID}`, [], null)
    //         .then(resp => {
    //             console.log('getNews', resp.data)
    //             this.setState({ questions : resp.data.filter(item=>item.is_news===null),
    //                             updates : resp.data.filter(item=>item.is_news===1),
    //                             news : resp.data.filter(item=>item.is_news===2)})
    //             this.props.onReduxUpdate("UPDATE_NEWS", resp.data)
    //         })
    //         .catch(error => {
    //             console.log('getNewsError', error)
    //         })
    // }
    addQuestionToService=()=>{
        // Если вопрос, то отправляем электронку на админский ящик
        // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
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
            "is_news" : ${this.state.isNews?1:null}
        }`

        text = JSON.parse(text)
        text.question = this.state.curMessage
        console.log("addserv", JSON.parse(JSON.stringify(text)))
        instanceAxios().post(API_URL + 'chat/addserv', JSON.parse(JSON.stringify(text)))
            .then(response => {
                // console.log('ADD_MSG', response)
                if (this.state.isNews) {
                    let arr = this.state.news
                    // console.log("NEWS", text)
                    arr.unshift(response.data)

                    this.refs.textarea.setNativeProps({'editable':false});
                    this.refs.textarea.setNativeProps({'editable':true});
                    this.props.setstate({showFooter : true})
                    this.setState({news : arr, curMessage : '', showFooter : true, isSpinner : false})
                }
                else {
                    // console.log("QUESTION", text)
                    let arr = this.state.questions

                    arr.unshift(response.data)

                    this.sendMail('paul.n.skiba@gmail.com', this.state.curMessage)

                    this.refs.textarea.setNativeProps({'editable':false});
                    this.refs.textarea.setNativeProps({'editable':true});

                    console.log("SETSTATE", arr)
                    this.props.setstate({showFooter : true})
                    this.setState({questions : arr, curMessage : '', showFooter : true})
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
        console.log("sentMail", this.props.userSetup)
        const {chatSessionID, userName, classID, userID} = this.props.userSetup
        // const session_id = AsyncStorage.getItem('chatSessionID')
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
            return   <View key={key} style={{height: 150}}>
                    <ScrollView>
                        <Text>{itemNews.itembody.question}</Text>
                    </ScrollView>
            </View>
        })
    }
    getUpdateForAccordion=()=>{
        // return []
        const news = this.props.userSetup.classNews.filter(item=>item.is_news===1).map(item => {
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
            return   <View key={key} style={{height: 150}}>
                <ScrollView>
                        {itemNews.itembody.question.split("\n").map((item, key)=> {
                            if (item.length) return <Text key={key}>{`${key+1}. ${item}`}</Text>
                        }
                    )}
                </ScrollView>
            </View>
        })
    }
    getQuestionsForAccordion=()=>{

    }
    render () {
        // const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const {newsArr, updatesArr, updates, news} = this.state
        // let newsArr = this.props.userSetup.classNews.filter(item=>item.is_news===2).map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.msg_header}`;
        //     newObj.value = item.id;
        //     newObj.count = toLocalDate(new Date(item.msg_date), "UA", false, false);
        //     return newObj;
        // })
        // let updatesArr = this.props.userSetup.classNews.filter(item=>item.is_news===1).map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.build_number}`;
        //     newObj.value = item.id;
        //     newObj.count = toLocalDate(new Date(item.msg_date), "UA", false, false);
        //     return newObj;
        // })
        // const updates = this.getUpdateForAccordion()
        // const news = this.getNewsForAccordion()
        // console.log("HelpBlock", newsArr, this.props.userSetup.classNews)
        return (
            <View>
                 <Tabs>
                         <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>НОВОСТИ</Text></TabHeading>}>
                             <View style={styles.homeworkSubjectList}>
                                 <Container style={{flex: 1, width : "100%", flexDirection: 'column', position: "relative"}}>
                                     {/*<View style={{flex: 3, borderWidth : 1, borderColor : "#4472C4"}}>*/}
                                         {/*<ScrollView>*/}
                                             <AccordionCustom data={newsArr}  data2={news} ishomework={true} index={0}/>
                                         {/*</ScrollView>*/}
                                     {/*</View>*/}
                                 </Container>
                             </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ОБНОВЛЕНИЯ</Text></TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                <Container style={{flex: 1, width : "100%", flexDirection: 'column', position: "relative"}}>
                                    <AccordionCustom data={updatesArr}  data2={updates} ishomework={true} index={0}/>

                                    {/*<View style={{flex: 3, borderWidth : 1, borderColor : "#4472C4"}}>*/}
                                        {/*<ScrollView>*/}
                                            {/*{this.state.updates.map((item, i)=>*/}
                                            {/*<Card key={i}>*/}
                                                {/*<CardItem>*/}
                                                        {/*<TouchableOpacity*/}
                                                            {/*onPress={() => console.log('onPressUpdates')}>*/}
                                                            {/*<Body style={{*/}
                                                                {/*paddingLeft: 5,*/}
                                                                {/*paddingRight: 5,*/}
                                                                {/*display : "flex",*/}
                                                                {/*alignItems: "flex-start",*/}
                                                                {/*justifyContent: "center",*/}
                                                            {/*}}>*/}
                                                            {/*<Text style={{fontWeight : "700", color : "#4472C4"}}>{item.msg_header}</Text>*/}
                                                              {/*{item.question.split("\n").map((item, key)=> {*/}
                                                                    {/*return <Text key={key}>{item}</Text>*/}
                                                                {/*}*/}
                                                            {/*)}*/}
                                                            {/*</Body>*/}
                                                        {/*</TouchableOpacity>*/}
                                                    {/*<Right style={{ position : "absolute", right : 5, top : 2}}>*/}
                                                        {/*<Text style={{fontSize: RFPercentage(1.4), color : "#4472C4"}} note>{item.build_number!==null?item.build_number:null}</Text>*/}
                                                    {/*</Right>*/}
                                                    {/*<Right style={{ position : "absolute", right : 5, bottom : 2}}>*/}
                                                        {/*<Text style={{fontSize: RFPercentage(1.4), color : "#4472C4"}} note>{toLocalDate(dateFromTimestamp(item.created_at), "UA", true, false)}</Text>*/}
                                                    {/*</Right>*/}
                                                {/*</CardItem>*/}
                                            {/*</Card>)}*/}
                                            {/*</ScrollView>*/}
                                    {/*</View>*/}
                                    {/*<View style={{flex: 1}}>*/}

                                    {/*</View>*/}
                                </Container>
                            </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ВОПРОС-ОТВЕТ</Text></TabHeading>}>
                            <Container style={{flex: 1, width : "100%", flex : 1, flexDirection: 'column', position: "relative"}}>
                                <View style={[styles.chatContainerNew, {flex: 1}]}>
                                    {this.state.isSpinner ? <View
                                        style={{position: "absolute", flex: 1, alignSelf: 'center', marginTop: 240, zIndex: 100}}>
                                        <Spinner color="#33ccff"/>
                                    </View> : null}

                                            <View style={this.state.showFooter?{flex: 7}:{flex: 1.5}}>
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
                                            <View style={[styles.addMsgContainer, {flex: 4}]}>
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
                                                {this.props.userSetup.isadmin?
                                                    <View className={styles.isNewsCheckbox}>
                                                        <CheckBox style={{marginTop : 20}}
                                                                  checked={this.state.isNews}
                                                                  onPress={()=>{this.setState({isNews:!this.state.isNews})}} color="#4472C4"/>
                                                        <Body>
                                                        <Text style={{ color : "#4472C4", fontSize: RFPercentage(2)}}> News</Text>
                                                        </Body>
                                                    </View>
                                                    :null}
                                                <View style={{flex: 7}}>
                                                                <Textarea
                                                                    style={styles.msgAddTextarea}
                                                                    // onKeyPress={this._handleKeyDown}
                                                                    ref="textarea"
                                                                    onSubmitEditing={() => {
                                                                        this.refs.textarea.setNativeProps({'editable':false});
                                                                        this.refs.textarea.setNativeProps({'editable':true});
                                                                    }}
                                                                    onChangeText={text=>this.onChangeText('curMessage', text)}
                                                                    onFocus={()=>{this.props.setstate({showFooter : false}); this.setState({showFooter : false})}}
                                                                    onBlur={()=>{this.props.setstate({showFooter : true}); this.setState({showFooter : true})}}
                                                                    placeholder={this.props.userSetup.userID?"Задать вопрос разработчику..." : "Задавая вопрос без логина, пожалуста, укажите в сообщении контактный email для связи)..."} type="text"
                                                                    rowSpan={this.props.userSetup.userID?3:5}
                                                                    value={this.state.curMessage}
                                                                />
                                                </View>
                                                <View style={styles.btnAddMessage}>
                                                    <Icon
                                                        name='rightcircle'
                                                        type='antdesign'
                                                        color='#898989'
                                                        size={40}
                                                        onPress={()=>{this.setState({isSpinner : true}); this.addQuestionToService()}} />
                                                </View>
                                                <View style={{width : 10}}></View>
                                            </View>
                                        {/*</Footer>*/}
                                            {/*<View style={{flex : 1, width: "100%", borderWidth : 1, backgroundColor : "#008"}}>*/}
                                                {/*<Textarea style={styles.msgAddTextarea}*/}
                                                    {/*// onKeyPress={this._handleKeyDown}*/}
                                                    {/*// onChangeText={text=>this.onChangeText('curMessage', text)}*/}
                                                    {/*// onFocus={()=>{this.props.setstate({showFooter : false})}}*/}
                                                    {/*// onBlur={()=>{this.props.setstate({showFooter : true})}}*/}
                                                          {/*placeholder="Задать вопрос разработчику..."  type="text"*/}
                                                          {/*ref={input=>{this.inputMessage=input}}*/}
                                                          {/*value={this.state.curMessage}*/}
                                                {/*/>*/}
                                                {/*<TouchableOpacity*/}
                                                    {/*onPress={this.updateMsg}>*/}
                                                    {/*<View style={styles.updateMsg}>*/}
                                                        {/*<Text style={styles.updateMsgText} >ОТПРАВИТЬ ВОПРОС</Text>*/}
                                                    {/*</View>*/}
                                                {/*</TouchableOpacity>*/}
                                             {/*</View>*/}
                                     {/*</View>*/}
                                </View>

                            </Container>

                        </Tab>
                    </Tabs>
                </View>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HelpBlock)