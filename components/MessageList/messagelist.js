/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
        TouchableHighlight, Modal, Radio, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, toLocalDate} from '../../js/helpersLight'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import LinkPreviewEx from '../LinkPreviewEx/linkpreviewex'
import { connect } from 'react-redux'
// import ScrollToBottom from 'react-scroll-to-bottom';
// import MicrolinkCard from '@microlink/react';
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
            messages : this.props.isnew?this.props.localmessages:this.props.messages,
            editKey: -1,
            modalVisible : false,
            checkSchedule : true,
            selSubject : {value : 0},
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            currentHomeworkID : 0,
            showPreview : false,
            previd : 0,
            };
        this.curMsgDate = new Date('19000101')
        this.onMessageDblClick = this.onMessageDblClick.bind(this)
        this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        this.onDelMsgClick=this.onDelMsgClick.bind(this)
        this.onLongPressMessage=this.onLongPressMessage.bind(this)
    }
    componentWillMount(){
        // if (this.props.isnew&&this.props.localmessages.length)
        //     this.curMsgDate = new Date(this.props.localmessages.slice(-1)[0].msg_date)
        // else
        //     this.curMsgDate = dateFromYYYYMMDD(toYYYYMMDD(new Date()))
        //
        // console.log("WILLMOUNT", this.curMsgDate, this.props.localmessages, this.props.localmessages.slice(-1)[0])
        }
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
                // ToDO: Проверить, что делает эта запись
                this.props.updatemessages(newmessages)
                const homeworkMsg = newmessages.filter(item=>item.id===currentHomeworkID)[0]
                this.props.sendmessage(JSON.stringify(homeworkMsg), currentHomeworkID, true)

                // Здесь будем апдейтить базу домашки
                // txt, subj_key, subj_name_ua, ondate, chat_id
                if (currentHomeworkID)
                this.props.addhomework(homeworkMsg.message, subject.subj_key, subject.subj_name_ua, new Date(AddDay(new Date(), selDate.value)), currentHomeworkID)

                this.setState({ currentHomeworkID : 0,
                                selSubject : 0,
                                selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1]})

                const todayMessages = this.props.userSetup.localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                const homeworks = this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null))

                this.props.forceupdate(todayMessages.length, homeworks.length)
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
    getDateSeparator=(msgDate)=>{
        // console.log("getDateSeparator", msgDate, this.curMsgDate,
        //                                 toYYYYMMDD(new Date(msgDate)), toYYYYMMDD(new Date(this.curMsgDate)))

        if (toYYYYMMDD(new Date(msgDate)) !== toYYYYMMDD(new Date(this.curMsgDate))) {
            // console.log("DATE_SEPAR", msgDate, this.curMsgDate, toYYYYMMDD(new Date(msgDate)), toYYYYMMDD(new Date(this.curMsgDate)))
            this.curMsgDate = new Date(msgDate)
            return  <View style={styles.mymMsgDateSeparator}>
                        <Text style={styles.mymMsgDateSeparatorText}>{toLocalDate(new Date(msgDate), "UA", false)}</Text>
                    </View>
        }
    }
    render() {

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
        const subjects = this.props.userSetup.selectedSubjects.map(item=>{
            return {
                    label : item.subj_name_ua.toUpperCase(),
                    value : item.id
            }
        })
        // console.log("RENDER", this.state, messages)
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})

        const initialDay = this.getNextStudyDay(daysArr)[0];
        const {userID} = this.props.userSetup
        let isImage = false

        const tagsArr = [
            {
                value : 1,
                label : "Родительский комитет"
            },
            {
                value : 2,
                label : "Реквизиты оплат"
            },
            {
                value : 3,
                label : "Инфа от классного"
            },
            {
                value : 4,
                label : "Инфа от школы"
            },

        ]
        return (

            <View style={styles.msgList}>
                {/*{console.log("273: RENDER_MESSAGELIST", messages.length, this.state.previd)}*/}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showPreview}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View>
                        {messages.length&&this.state.previd?
                        <SingleImage
                            uri={`data:image/png;base64,${JSON.parse(messages.filter(item=>item.id===this.state.previd)[0].attachment3).base64}`}
                            style={{position : "relative", height : "100%"}}
                            onClose={()=>this.setState({showPreview : false, previd : 0})}
                        />:null}

                        <TouchableOpacity
                            style={{position : "absolute", top : 10, right : 10, zIndex:10}}
                            onPress={()=>this.setState({showPreview : false, previd : 0})}>
                            <View style={{

                                paddingTop : 5, paddingBottom : 5,
                                paddingLeft : 15, paddingRight : 15, borderRadius : 5,
                                borderWidth : 2, borderColor : "#33ccff", zIndex:10,
                            }}>
                                <Text style={{  fontSize : 20,
                                    color: "#33ccff",
                                    zIndex:10,
                                }}
                                >X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.modalView}>
                        <Tabs>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>ПРЕДМЕТ</Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        // style={{ paddingBottom : 20 }}
                                        dataSource={subjects}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        initial={-1}
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
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ИЗМЕНИТЬ</Text></TabHeading>}>
                                <View>
                                        <Textarea style={styles.msgUpdateTextarea}
                                            // onKeyPress={this._handleKeyDown}
                                            // onChangeText={text=>this.onChangeText('curMessage', text)}
                                            // onFocus={()=>{this.props.setstate({showFooter : false})}}
                                            // onBlur={()=>{this.props.setstate({showFooter : true})}}
                                                  placeholder="Внесите изменения..."  type="text"
                                                  ref={input=>{this.inputMessage=input}}
                                                  value={this.state.curMessage}
                                        />
                                    <TouchableOpacity
                                        onPress={this.updateMsg}>
                                        <View style={styles.updateMsg}>
                                            <Text style={styles.updateMsgText} >СОХРАНИТЬ ИЗМЕНЕНИЯ</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ЗАКЛАДКИ</Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        // style={{ paddingBottom : 20 }}
                                        dataSource={tagsArr}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        // initial={initialDay}
                                        formHorizontal={false}
                                        labelHorizontal={true}
                                        onPress={(item) => this.onSelectDay(item)}
                                    />
                                </View>
                            </Tab>
                        </Tabs>
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
                    </View>
                </Modal>
                <ScrollView
                    ref="scrollView"
                    onContentSizeChange={( contentWidth, contentHeight ) => {
                        // this._contentHeight = contentHeight
                        // console.log("onContentSizeChange", contentHeight)
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
                                // console.log("395: MESSAGE", message)
                                // console.log("396_1: MESSAGE", message, this.props.isnew, prepareMessageToFormat(message, true))
                                let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
                                // console.log("449: MESSAGE", message, msg,msg.hwdate)
                                // msg.hwdate = this.props.isnew&&(!(message.homework_date===null))?(new Date(message.homework_date)):null
                                // console.log("451: MESSAGE", message, msg,msg.hwdate)
                                const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
                                let { text } = msg;
                                isImage = false
                                if ((message.attachment3!==null)&&(message.attachment3!==undefined)) {
                                    isImage = true
                                }
                                urlMatches.forEach(link => {
                                    const startIndex = text.indexOf(link);
                                    const endIndex = startIndex + link.length;
                                    text = insertTextAtIndices(text, {
                                        [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
                                        [endIndex]: '</a>',
                                    });
                                });
                                let LinkPreviews = null;
                                if (urlMatches.length) {
                                    // console.log("urlMatches", urlMatches)
                                     LinkPreviews = urlMatches.map(link => <LinkPreviewEx key={"url" + i}  uri={link}/>)
                                }
                                // const LinkPreviews = urlMatches.map(link => <MicrolinkCard  key={"url"+i} url={link} />);
                                // console.log("464: MESSAGE", message,
                                //     msg,
                                //     msg.hasOwnProperty('hwdate'),
                                //     msg.hwdate===undefined,
                                //     msg.hwdate===null,
                                //     msg.hwdate)
                                let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
                                // if (msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))) {
                                //     console.log("HWDATE", msg, msg.hwdate)
                                // }
                                let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))?(toLocalDate(msg.hwdate.lenght===8?dateFromYYYYMMDD(msg.hwdate):msg.hwdate, "UA", false, false))+':'+msg.subjname:''
                                let ownMsg = (username===this.props.userSetup.userName)
                                // console.log("469: MESSAGE", this.curMsgDate, message)

                                return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?

                                        <View key={i} id={"msg-"+msg.id} className={"message-block"}
                                              // onClick={()=>i!==this.state.editKey?this.setState({editKey:-1}):null}
                                              // onDoubleClick={(e)=>this.onMessageDblClick(e)}
                                        >
                                            {/*{console.log("MESSAGE_DATE", message, message.msg_date, new Date(message.msg_date))}*/}
                                            {this.getDateSeparator(message.msg_date.length===8?dateFromYYYYMMDD(message.msg_date):new Date(message.msg_date))}

                                            <TouchableWithoutFeedback   key={i} id={"msgarea-"+msg.id}
                                                                        delayLongPress={1000}
                                                                        onLongPress={(message.user_id===userID)?()=>this.onLongPressMessage(msg.id):null}
                                            >
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

                                                {urlMatches.length > 0?(
                                                    <View key={'msgpreview'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                                        {/*<span*/}
                                                            {/*dangerouslySetInnerHTML={{*/}
                                                                {/*__html: text, }}*/}
                                                        {/*/>*/}
                                                        {LinkPreviews}
                                                    </View>)
                                                    :null}

                                                {/* style={this.state.editKey===i?{visibility:"hidden"}:null} */}
                                                {/*{console.log('460', message, isImage, message.attachment3)}*/}
                                                {isImage?
                                                    <View style={{display : "flex", flex : 1, flexDirection: "row"}}>
                                                        <TouchableOpacity onPress={()=>{this.setState({previd : msg.id, showPreview : true})}}>
                                                         <View style={{flex : 1}}>
                                                            <Image
                                                            source={{uri: `data:image/png;base64,${JSON.parse(message.attachment3).base64}`}}
                                                            style={{ width: 100, height: 100,
                                                                    borderRadius: 15,
                                                                    overflow: "hidden", margin : 7 }}/>
                                                        </View>
                                                        </TouchableOpacity>
                                                        <View key={'msg'+i} id={"msg-text-"+i}
                                                                style={[styles.msgText,
                                                                        {flex: 3, marginLeft : 20, marginTop : 10}]}>
                                                                <Text>{msg.text}</Text>
                                                        </View>
                                                    </View>
                                                    :<View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                                        <Text>{msg.text}</Text>
                                                     </View>}

                                                {/*style={this.state.editKey===i?{visibility:"hidden"}:null}*/}
                                                <View style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>
                                                    <Text style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>{msg.time}</Text>
                                                </View>

                                                {/*style={this.state.editKey===i?{visibility:"hidden"}:null}*/}
                                                {hw.length?<View key={'idhw'+i} style={ownMsg?[styles.msgRightIshw, {color : 'white'}]:[styles.msgLeftIshw, {color : 'white'}]}>
                                                    <Text style={{color : 'white'}}>{hw}</Text>
                                                </View>:null}

                                            </View>
                                            </TouchableWithoutFeedback>
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