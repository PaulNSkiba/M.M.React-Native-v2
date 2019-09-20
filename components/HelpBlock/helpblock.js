/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button, Card, CardItem,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, instanceAxios, toLocalDate, dateFromTimestamp} from '../../js/helpersLight'
import { API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD, HOMEWORK_ADD_URL,
    instanceLocator, testToken, chatUserName } from '../../config/config'
import { Icon } from 'react-native-elements'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class HelpBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // messages : this.props.messages,
            // editKey: -1,
            // modalVisible : false,
            // checkSchedule : true,
            // selSubject : {value : 0},
            // selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            // currentHomeworkID : 0,
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            isNews : false,
            questions : [],
            news : [],
            curMessage : '',
            showFooter : true,
        };

        // this.onMessageDblClick = this.onMessageDblClick.bind(this)
        // this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        // this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        // this.onDelMsgClick=this.onDelMsgClick.bind(this)
        // this.onLongPressMessage=this.onLongPressMessage.bind(this)
    }
    componentDidMount(){
        this.getNews()
    }
    onSelectDay=item=>{
        this.setState({selDate : item})
        // console.log(item.value)
    }
    getNextStudyDay=arr=>{
        let i = 0; obj = {};
        arr.forEach((item, index)=>{
            if (item.value > 0 && i===0) {
                i = index;
                obj = item;
            }
        })
        return [i, obj];
    }
    getNews=()=>{
        const {classID, userID} = this.props.userSetup
        // console.log('getChatMessages', this.props.userSetup.classID, classID)
        instanceAxios().get(API_URL +`chat/getserv/${classID}/${userID}`, [], null)
            .then(resp => {
                this.setState({ questions : resp.data.filter(item=>item.is_news===null),
                                news : resp.data.filter(item=>item.is_news===1)})

                console.log('getNews', resp.data)

                // this.props.onReduxUpdate("UPDATE_HOMEWORK", resp.data.filter(item=>(item.homework_date!==null)))
                // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", resp.data)
            })
            .catch(error => {
                console.log('getNewsError', error)
            })
    }
    addQuestionToService=()=>{
        // Если вопрос, то отправляем электронку на админский ящик
        // this.props.onReduxUpdate("ADD_CHAT_MESSAGES", arrChat)
        if (!this.state.curMessage.length) return
        const {studentId, userID, classID} = this.props.userSetup
        let text = `{
            "student_id" : ${studentId},
            "user_id" : ${userID},
            "class_id" : ${classID},
            "msg_date" : "${toYYYYMMDD(new Date())}",
            "msg_header" : "${this.state.isNews?"Внесены следующие изменения":""}",
            "question" : "${""}",
            "is_news" : ${this.state.isNews?1:null}
        }`
        console.log("addserv", text, JSON.stringify(text))
        text = JSON.parse(text)
        text.question = this.state.curMessage
        instanceAxios().post(API_URL + 'chat/addserv', JSON.parse(JSON.stringify(text)))
            .then(response => {
                console.log('ADD_MSG', response)
                if (this.state.isNews) {
                    let arr = this.state.news
                    arr.unshift(text)
                    // this.setState({news : arr})

                    if (!this.state.isNews)
                    this.sendMail('paul.n.skiba@gmail.com', this.state.curMessage)
                    this.refs.textarea.setNativeProps({'editable':false});
                    this.refs.textarea.setNativeProps({'editable':true});
                    this.props.setstate({showFooter : true})
                    this.setState({news : arr, curMessage : '', showFooter : true})
                }
                else {
                    let arr = this.state.questions
                    arr.unshift(text)
                    this.refs.textarea.setNativeProps({'editable':false});
                    this.refs.textarea.setNativeProps({'editable':true});
                    this.props.setstate({showFooter : true})
                    this.setState({questions : arr, curMessage : '', showFooter : true})
                }
            })
            .catch(response=>
                console.log("AXIOUS_ERROR", response)
            )
        // this.refs.textarea.blur()

        // this.refs.textarea.setNativeProps({'editable':true});
        console.log("sendMessage", text, API_URL + 'chat/addserv')
    }
    sendMail=(mail, text)=>{
        const {session_id, userName, classID, userID} = this.props.userSetup
        // let author = !this.inputName===undefined?this.inputName.value:"",
        //     mailAuthor = !this.inputEmail===undefined?this.inputEmail.value:""
        let json = `{   "session_id":"${session_id}",
                        "mailService":"${mail}",
                        "author":"${userName}",
                        "mailAuthor":"${userName}",
                        "text":"${text}",
                        "classID":${classID},
                        "userID":${userID}}`
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
    onChangeText = (key, val) => {
        this.setState({ [key]: val})
    }
    render () {
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        let arr = []
        console.log("HelpBlock", this.state.news, this.state.questions)
        return (
            <View>
                 <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>НОВОСТИ</Text></TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                <Container style={{flex: 1, width : "100%", flex : 1, flexDirection: 'column', position: "relative"}}>
                                    <View style={{flex: 3, borderWidth : 1, borderColor : "#4472C4"}}>
                                        <ScrollView>
                                            {/*<Text>Блок Новостей</Text>*/}
                                            {this.state.news.map((item, i)=>
                                            <Card key={i}>
                                                <CardItem>
                                                        <TouchableOpacity
                                                            onPress={() => console.log('onPressNews')/*this.addToChat(JSON.stringify(item.data))*/}>
                                                            <Body style={{
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                display : "flex",
                                                                alignItems: "flex-start",
                                                                justifyContent: "center",
                                                            }}>
                                                            <Text style={{fontWeight : "700", color : "#4472C4"}}>{item.msg_header}</Text>
                                                             {item.question.split("\n").map((item, key)=> {
                                                                    return <Text key={key}>{item}</Text>
                                                                }
                                                            )}
                                                                {/*<Text>Выведены картинки в сообщениях</Text>*/}
                                                                {/*<Text>По клику показывается большое изображение</Text>*/}
                                                                {/*<Text>Добавлены эмоджи</Text>*/}
                                                                {/*<Text>Откорректированы счётчики на бейджах</Text>*/}
                                                                {/*<Text>Откорректировано масшабирование поля ввода</Text>*/}
                                                                {/*<Text>Сделан прототип для вкладки "Прочее"</Text>*/}
                                                                {/*<Text>Сделан прототип для вкладки "Инфо"</Text>*/}
                                                                {/*<Text>Создана загрузка по Токену</Text>*/}
                                                                {/*<Text>Пустые сообщения теперь не отправляются</Text>*/}
                                                            </Body>
                                                        </TouchableOpacity>
                                                    <Right style={{ position : "absolute", right : 5, bottom : 2}}>
                                                        <Text style={{fontSize: RFPercentage(1.4), color : "#4472C4"}} note>{toLocalDate(dateFromTimestamp(item.created_at), "UA", true)}</Text>
                                                    </Right>
                                                </CardItem>
                                            </Card>)}
                                            </ScrollView>
                                    </View>
                                    <View style={{flex: 1}}>

                                    </View>
                                </Container>
                            </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ВОПРОС-ОТВЕТ</Text></TabHeading>}>
                            <Container style={{flex: 1, width : "100%", flex : 1, flexDirection: 'column', position: "relative"}}>
                                <View style={[styles.chatContainerNew, {flex: 1}]}>
                                            <View style={this.state.showFooter?{flex: 7}:{flex: 1.5}}>
                                                <ScrollView>
                                                {/*<Text>Блок вопросов</Text>*/}
                                                    {this.state.questions.map((item, i)=>
                                                    <Card key={i}>
                                                        {/*{console.log("question", (new Date(item.created_at)), item.created_at)}*/}
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
                                                                {/*<Text style={{fontWeight : "700", color : "#4472C4"}}>Внесены следущие изменения:</Text>*/}
                                                                {/*<Text>Когда будет доделан логин через социальные сети?</Text>*/}
                                                                    <Text>{item.question}</Text>
                                                                </Body>
                                                            </TouchableOpacity>
                                                            <Right style={{ position : "absolute", right : 5, bottom : 2}}>
                                                                <Text style={{fontSize: RFPercentage(1.4), color : "#4472C4"}} note>{toLocalDate(dateFromTimestamp(item.created_at), "UA", true)}</Text>
                                                            </Right>
                                                        </CardItem>
                                                    </Card>)}
                                                </ScrollView>
                                            </View>
                                            <View style={[styles.addMsgContainer, {flex: 4}]}>
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
                                                                <Textarea style={styles.msgAddTextarea}
                                                                    // onKeyPress={this._handleKeyDown}
                                                                    ref="textarea"
                                                                    onSubmitEditing={() => {
                                                                        this.refs.textarea.setNativeProps({'editable':false});
                                                                        this.refs.textarea.setNativeProps({'editable':true});
                                                                    }}
                                                                    onChangeText={text=>this.onChangeText('curMessage', text)}
                                                                    onFocus={()=>{this.props.setstate({showFooter : false}); this.setState({showFooter : false})}}
                                                                    onBlur={()=>{this.props.setstate({showFooter : true}); this.setState({showFooter : true})}}
                                                                    placeholder="Задать вопрос разработчику..."  type="text"
                                                                          // ref={input=>{this.inputMessage=input}}
                                                                    value={this.state.curMessage}
                                                                />
                                                </View>
                                                <View style={styles.btnAddMessage}>
                                                    <Icon
                                                        name='rightcircle'
                                                        type='antdesign'
                                                        color='#898989'
                                                        size={40}
                                                        onPress={this.addQuestionToService} />
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