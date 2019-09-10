/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
// import ScrollToBottom from 'react-scroll-to-bottom';
import { StyleSheet, Text, View, Image, ScrollView,
        TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem } from 'native-base';
import RadioForm from 'react-native-radio-form';
// import MicrolinkCard from '@microlink/react';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import { connect } from 'react-redux'
// import InvertibleScrollView from 'react-native-invertible-scroll-view';
// import { css } from 'glamor';


// import '../../ChatMobile/chatmobile.css'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages : this.props.messages,
            editKey: -1,
            modalVisible : false,
            checkSchedule : true,
            selSubject : {value : 0},
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            currentHomeworkID : 0,
            };

        this.onMessageDblClick = this.onMessageDblClick.bind(this)
        this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        this.onDelMsgClick=this.onDelMsgClick.bind(this)
        this.onLongPressMessage=this.onLongPressMessage.bind(this)
    }
    // componentDidMount() {
    //
    //     console.log("componentDidMount")
    //     // this.refs.scrollView.scrollToEnd({animated: false})
    // }
    onSaveMsgClick=async (e)=>{
        console.log("onSaveMsgClick", this.textareaValue.value, Number(e.target.id.replace("btn-save-", '')), this.props.isnew)
        if (this.props.isnew) {
            let obj = {}, id
            obj.message = this.textareaValue.value
            id = Number(e.target.id.replace("btn-save-", ''))
            try {
                await this.props.sendmessage(JSON.stringify(obj), id)
            }
            catch (err){
            }
        }
        this.setState({editKey : -1})
    }
    onDelMsgClick=(e)=>{
        this.setState({editKey : -1})
    }
    onCancelMsgClick=(e)=>{
        this.setState({editKey : -1})
    }
    onMessageDblClick=e=>{
        console.log(e.target.id, e.target, e.target, e.target.nodeName)
        const key = e.target.id.replace("msg-text-", '')
        if (e.target.nodeName!=="DIV") return
        // console.log("onMessageDblClick", "e.target.id:", e.target.id, "key", key, "this.state.editKey", this.state.editKey)
        if (Number(key)!==this.state.editKey) this.setState({editKey : Number(key)})
    }
    onLongPressMessage=(id)=>{
        // console.log(e, e.nativeEvent)
        this.setState({modalVisible : true, currentHomeworkID : id})
        //alert(id)
        // alert(e.nativeEvent.id)
    }
    setModalVisible(visible, setHomework) {
        let {selSubject, selDate, currentHomeworkID} = this.state
        this.setState({modalVisible: visible});
        if (setHomework) {
            let messages = []
            if (this.props.isnew)
                messages = this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
            else
                messages = this.props.messages

            if (this.props.isnew) {
                let subject = this.props.userSetup.selectedSubjects.filter(item=>item.id===selSubject.value)[0]
                // console.log("setModalVisible", selSubject, subject, this.props.userSetup.selectedSubjects)
                let newmessages = messages.map(item=>{
                    if (item.id===currentHomeworkID) {
                        item.homework_subj_id = selSubject.value
                        item.homework_date = toYYYYMMDD(AddDay(new Date(), selDate.value));
                        item.homework_subj_name = subject.subj_name_ua
                        item.homework_subj_key = subject.subj_key
                    }
                    return item
                })
                // ToDO: Записать в БД изменение домашки
                console.log("newmessages", newmessages)
                this.props.updatemessages(newmessages)
                this.setState({ currentHomeworkID : 0,
                                selSubject : 0,
                                selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1]})
                this.props.sendmessage(JSON.stringify(newmessages.filter(item=>item.id===currentHomeworkID)[0]), currentHomeworkID, true)
                // this.props.onReduxUpdate(, newmessages)
            }
            console.log("messages", messages)
        }
    }
    onSelectSubject=item=>{
        this.setState({selSubject : item})
        // console.log(item.value)
    }
    onSelectDay=item=>{
        this.setState({selDate : item})
        // console.log(item.value)
    }
    getNextStudyDay=arr=>{
        let i = 0; obj = {};
        // for (let i = 0; i++; i < arr.length) {
        //     if arr
        // }
        arr.forEach((item, index)=>{
            // console.log("getNextStudyDay", item, index, i)
            if (item.value > 0 && i===0) {
                i = index;
                obj = item;
                // this.setState({selDate : item})
            }
        })
        return [i, obj];
    }
    render() {

        // const ROOT_CSS = css({
        //     borderRadius: "10px",
        //     margin : "12px 10px",
        //     height : "60vh",
        //     maxHeight : "510px",
        //     overflow: "auto",
        // });
        // console.log("addmsgs", this.props.addmsgs)
        {/*{!this.props.isshortmsg?*/}
        // :
        // <ScrollToBottom className={"" /*ROOT_CSS*/ }>
        //     <div key={1} className="message-block">
        //         <div className={"msg-left-side"} key={1}>
        //             <div key={'id'+1} className={"msg-left-author"}>{"Команда My.Marks"}</div>
        //             <div key={'msg'+1} className="msg-text">{questionText}</div>
        //         </div>
        //         {this.props.addmsgs.map((item,i)=>
        //         <div className={"msg-right-side"} key={i+100}>
        //             <div key={'id'+i+100} className={"msg-right-author"}>{"Вопрос"}</div>
        //             <div key={'msg'+i+100} className="msg-text">{item}</div>
        //         </div>)}
        //         {this.props.addmsgs.length?<div className={"msg-left-side"} key={2}>
        //             <div key={'id'+2} className={"msg-left-author"}>{"Команда My.Marks"}</div>
        //             <div key={'msg'+2} className="msg-text">{"Благодарим за обращение. Проверьте, пожалуйста, указанную электронную почту и " +
        //             " и подтвердите получение письма-заявки."}</div>
        //         </div>:""}
        //     </div>
        // </ScrollToBottom>        }


        // {messages.length?messages.map((message, i) =>{
        //     let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
        //     // console.log("MESSAGELIST-MSG", msg)
        //     const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
        //     let { text } = msg;
        //     urlMatches.forEach(link => {
        //         const startIndex = text.indexOf(link);
        //         const endIndex = startIndex + link.length;
        //         text = insertTextAtIndices(text, {
        //             [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
        //             [endIndex]: '</a>',
        //         });
        //     });
        //     const LinkPreviews = urlMatches.map(link => <MicrolinkCard  key={"url"+i} url={link} />);
        //     let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
        //
        //     let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))?(dateFromYYYYMMDD(msg.hwdate)).toLocaleDateString()+':'+msg.subjname:''
        //     let ownMsg = (username===this.props.username)
        //     return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?
        //         <div key={i} id={"msg-"+msg.id} className={"message-block"} onClick={()=>i!==this.state.editKey?this.setState({editKey:-1}):null} onDoubleClick={(e)=>this.onMessageDblClick(e)}
        //         >
        //             <div className={ownMsg?(hw.length?"msg-right-side homework-border":"msg-right-side  homework-no-border"):(hw.length?"msg-left-side homework-border":"msg-left-side homework-no-border")}
        //                  style={this.state.editKey===i?{color:"white", backgroundColor : "white", border: "white 2px solid"}:null} key={msg.id}>
        //
        //                 {this.state.editKey===i?<textarea className={ownMsg?"message-block-edit-right":"message-block-edit-left"} ref={input=>{this.textareaValue=input}} defaultValue={msg.text}
        //                                                   onKeyPress={this.OnKeyPressTextArea} onChange={this.OnChangeTextArea}>
        //                                 </textarea>:null}
        //                 {this.state.editKey === i ?
        //                     <div className="mym-msg-block-buttons">
        //                         <div id={"btn-hw-"+msg.id} onClick={this.onAddHomwworkMsgClick} className="mym-msg-block-hw">Домашка</div>
        //                         <div id={"btn-save-"+msg.id} onClick={this.onSaveMsgClick} className="mym-msg-block-save">Сохранить</div>
        //                         <div id={"btn-cancel-"+msg.id} onClick={this.onCancelMsgClick} className="mym-msg-block-cancel">Отмена </div >
        //                         <div id={"btn-del-"+msg.id} onClick={this.onDelMsgClick} className="mym-msg-block-delete">Удалить</div>
        //                     </div>
        //                     :null}
        //
        //                 <div key={'id'+i} className={ownMsg?"msg-right-author":"msg-left-author"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{username}</div>
        //                 {urlMatches.length > 0 ? (
        //                     <div key={'msg'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
        //                                         <span
        //                                             dangerouslySetInnerHTML={{
        //                                                 __html: text,
        //                                             }}
        //                                         />
        //
        //                         {LinkPreviews}
        //                     </div>
        //                 ) : (
        //                     <div key={'msg'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
        //                         {msg.text}
        //                     </div>
        //                 )}
        //                 <div className={msg.id?"btn-add-time-done":"btn-add-time"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{msg.time}</div>
        //                 {hw.length?<div key={'idhw'+i} className={ownMsg?"msg-right-ishw":"msg-left-ishw"} style={this.state.editKey===i?{visibility:"hidden"}:null}>{hw}</div>:""}
        //             </div>
        //         </div>:null}
        // ):null}



        let questionText = "Здравствуйте. Оставьте, пожалуйста, своё сообщение в этом чате. " +
            "Оно автоматически будет доставлено в нашу службу поддержки и мы как можно скорее отправим Вам ответ на "

        questionText = questionText.concat(this.props.classID?"Вашу электронную почту.":"указанную Вами электронной почте.")
        // console.log("RENDERMESSAGES", this.props.isnew, this.state.messages, this.props.userSetup)
        let messages = []
        if (this.props.isnew)
            messages = this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
        else
            messages = this.props.messages
        // console.log('MESSAGES', this.props.localmessages, messages)

        // const mockData = [
        //     {
        //         label: 'label1',
        //         value: 'fi'
        //     },
        //     {
        //         label: 'label2',
        //         value: 'se'
        //     },
        //     {
        //         label: 'label3',
        //         value: 'th'
        //     }
        // ];
        const subjects = this.props.userSetup.selectedSubjects.map(item=>{
            return {
                    label : item.subj_name_ua.toUpperCase(),
                    value : item.id
            }
        })
        // let daysArr = [
        //     {   label : "Позавчера", value : -2},
        //     {   label : "Вчера", value : -1},
        //     {   label : "Сегодня", value : 0},
        //     {   label : "Завтра", value : 1},
        //     {   label : "Послезавтра", value : 2}]
        // console.log("dayList", daysArr)
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        // console.log("dayList", daysArr, )
        const initialDay = this.getNextStudyDay(daysArr)[0];
        return (

            <View style={styles.msgList}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.modalView}>
                        {/*<Header hasTabs/>*/}
                        {/*<Header>*/}

                            {/*</Header>*/}
                        {/*style={styles.tabHeader}*/}
                        <Tabs>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>ПРЕДМЕТ</Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        // style={{ paddingBottom : 20 }}
                                        dataSource={subjects}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        initial={0}
                                        formHorizontal={false}
                                        labelHorizontal={true}
                                        onPress={(item) => this.onSelectSubject(item)}
                                    />
                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>НА КОГДА</Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        // style={{ paddingBottom : 20 }}
                                        dataSource={daysArr}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        initial={initialDay}
                                        formHorizontal={false}
                                        labelHorizontal={true}
                                        onPress={(item) => this.onSelectDay(item)}
                                    />
                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>ЧТО ЗАДАЛИ</Text></TabHeading>}>
                                <View /* style={styles.homeworkDayList} */ >
                                </View>
                            </Tab>
                        </Tabs>
                        {/*<Container style={styles.homeworkContainer}>*/}

                            {/**/}
                            {/*/!*<Text>List of days and subjects</Text>*!/*/}
                            {/*/!*<View style={{flex : 1}}>*!/*/}
                            {/*/!*<ChatBlock showLogin={this.state.showLogin} updateState={this.updateState}/>*!/*/}
                            {/*/!*</View>*!/*/}
                        {/*</Container>*/}
                        <ListItem style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>
                                {this.state.selSubject.value?this.state.selSubject.label:null}
                                {this.state.selDate.value>-3?` на ${this.state.selDate.label}`:null}
                            </Text>
                        </ListItem>
                        <ListItem className={styles.editHomeworkCheckbox}>
                            <CheckBox checked={this.state.checkSchedule} onPress={()=>{this.setState({checkSchedule:!this.state.checkSchedule})}} color="#b40530"/>
                            <Body>
                                <Text>  Учитывать расписание при выборе даты</Text>
                            </Body>
                        </ListItem>
                        <Footer style={styles.header}>

                            <FooterTab style={styles.header}>
                                <Button style={this.state.selSubject.value&&this.state.selDate.value>-3?styles.btnHomework:styles.btnHomeworkDisabled} vertical
                                        onPress={this.state.selSubject.value&&this.state.selDate.value>-3?()=>this.setModalVisible(!this.state.modalVisible, true):null}>
                                    {/*<Icon active name="ios-bookmarks" />*/}
                                    <Text style={styles.btnHomeworkText}>ДОБАВИТЬ</Text>
                                </Button>
                                <Button style={styles.btnClose} vertical /*active={this.state.selectedFooter===2}*/ onPress={()=>this.setModalVisible(!this.state.modalVisible, false)}>
                                    {/*<Icon active name="ios-bookmarks" />*/}
                                    <Text style={styles.btnCloseText}>ВЫХОД</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                        {/*<View style={styles.homeworkSettings}>*/}

                            {/*/!*<Text>Hello World!</Text>*!/*/}
                            {/*/!*<TouchableHighlight*!/*/}
                                {/*/!*onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>*!/*/}
                                {/*/!*<Text>Hide Modal</Text>*!/*/}
                            {/*/!*</TouchableHighlight>*!/*/}
                        {/*</View>*/}
                        {/*<View style={styles.doneButtons}>*/}
                            {/*<Button onPress={()=>{this.setModalVisible(!this.state.modalVisible);}}>*/}
                                {/*<Text>Закрыть</Text>*/}
                            {/*</Button>*/}
                        {/*</View>*/}
                    </View>
                </Modal>
                <ScrollView
                    ref="scrollView"
                    onContentSizeChange={( contentWidth, contentHeight ) => {
                        // this._contentHeight = contentHeight
                        console.log("onContentSizeChange", contentHeight)
                        this.refs.scrollView.scrollToEnd()
                    }}
                >
                {/*<InvertibleScrollView inverted*/}
                                      {/*ref={ref => { this.scrollView = ref; }}*/}
                                      {/*onContentSizeChange={() => {*/}
                                          {/*this.scrollView.scrollTo({y: 0, animated: true});*/}
                                      {/*}}>*/}
                    {messages.length?
                        messages.map((message, i) =>{
                                // console.log("MESSAGE", message)
                                let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
                                const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
                                let { text } = msg;
                                // urlMatches.forEach(link => {
                                //     const startIndex = text.indexOf(link);
                                //     const endIndex = startIndex + link.length;
                                //     text = insertTextAtIndices(text, {
                                //         [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
                                //         [endIndex]: '</a>',
                                //     });
                                // });
                                // const LinkPreviews = urlMatches.map(link => <MicrolinkCard  key={"url"+i} url={link} />);

                                let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
                                let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))?(dateFromYYYYMMDD(msg.hwdate)).toLocaleDateString()+':'+msg.subjname:''
                                let ownMsg = (username===this.props.userSetup.userName)

                                return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?

                                        <View key={i} id={"msg-"+msg.id} className={"message-block"}
                                              onClick={()=>i!==this.state.editKey?this.setState({editKey:-1}):null}
                                              onDoubleClick={(e)=>this.onMessageDblClick(e)}>
                                            <TouchableHighlight key={i} id={"msgarea-"+msg.id} onLongPress={()=>this.onLongPressMessage(msg.id)}>
                                            {/*style={this.state.editKey===i?{color:"white", backgroundColor : "white", border: "white 2px solid"}:null}*/}
                                            <View key={msg.id}
                                                style={ownMsg?
                                                (hw.length?[styles.msgRightSide, styles.homeworkBorder]:[styles.msgRightSide, styles.homeworkNoBorder]):
                                                (hw.length?[styles.msgLeftSide, styles.homeworkBorder]:[styles.msgLeftSide, styles.homeworkNoBorder])}>

                                                {/*{this.state.editKey===i?<Textarea className={ownMsg?"message-block-edit-right":"message-block-edit-left"} ref={input=>{this.textareaValue=input}} defaultValue={msg.text}*/}
                                                {/*onKeyPress={this.OnKeyPressTextArea} onChange={this.OnChangeTextArea}>*/}
                                                {/*</Textarea>:null}*/}
                                                {/*{this.state.editKey === i ?*/}
                                                {/*<View className="mym-msg-block-buttons">*/}
                                                {/*<View id={"btn-hw-"+msg.id} onClick={this.onAddHomwworkMsgClick} className="mym-msg-block-hw">Домашка</View>*/}
                                                {/*<View id={"btn-save-"+msg.id} onClick={this.onSaveMsgClick} className="mym-msg-block-save">Сохранить</View>*/}
                                                {/*<View id={"btn-cancel-"+msg.id} onClick={this.onCancelMsgClick} className="mym-msg-block-cancel">Отмена </View >*/}
                                                {/*<View id={"btn-del-"+msg.id} onClick={this.onDelMsgClick} className="mym-msg-block-delete">Удалить</View>*/}
                                                {/*</View>*/}
                                                {/*:null}*/}

                                                {/*style={this.state.editKey===i?{visibility:"hidden"}:null}*/}
                                                <View key={'id'+i} style={ownMsg?styles.msgRightAuthor:styles.msgLeftAuthor} ><Text style={styles.msgAuthorText}>{username}</Text></View>

                                                {/*{urlMatches.length > 0 ? (*/}
                                                {/*<View key={'msg'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">*/}
                                                {/*<span*/}
                                                {/*dangerouslySetInnerHTML={{*/}
                                                {/*__html: text,*/}
                                                {/*}}*/}
                                                {/*/>*/}

                                                {/*{LinkPreviews}*/}
                                                {/*</View>*/}
                                                {/*) : (*/}

                                                {/* style={this.state.editKey===i?{visibility:"hidden"}:null} */}
                                                    <View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                                        <Text>{msg.text}</Text>
                                                    </View>
                                                {/*    )} */}
                                                {/*style={this.state.editKey===i?{visibility:"hidden"}:null}*/}
                                                <View style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>
                                                    <Text style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>{msg.time}</Text>
                                                </View>

                                                {/*style={this.state.editKey===i?{visibility:"hidden"}:null}*/}
                                                {hw.length?<View key={'idhw'+i} style={ownMsg?[styles.msgRightIshw, {color : 'white'}]:[styles.msgLeftIshw, {color : 'white'}]}>
                                                    <Text style={{color : 'white'}}>{hw}</Text>
                                                </View>:null}

                                            </View>
                                            </TouchableHighlight>
                                        </View>
                                    :null


                            }
                        ):null}
                </ScrollView>

                {/*</InvertibleScrollView>*/}
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageList)