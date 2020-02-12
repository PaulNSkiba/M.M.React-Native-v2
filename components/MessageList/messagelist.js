/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
        TouchableHighlight, Modal, Radio, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail, Spinner } from 'native-base';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, addDay, toYYYYMMDD,
        daysList, toLocalDate, instanceAxios, axios2, arrOfWeekDaysLocal,
        getStorageData, setStorageData, getSubjFieldName, dateDiff} from '../../js/helpersLight'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import LinkPreviewEx from '../LinkPreviewEx/linkpreviewex'
import { connect } from 'react-redux'
import ImageZoom from 'react-native-image-pan-zoom';
import { API_URL } from '../../config/config'
import { Viewport } from '@skele/components'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";


// import VisibilitySensor from 'react-native-visibility-sensor'
// import InViewPort from 'react-native-inviewport'

// import {AsyncStorage} from 'react-native';
// import ScrollToBottom from 'react-scroll-to-bottom';
// import MicrolinkCard from '@microlink/react';
// import InvertibleScrollView from 'react-native-invertible-scroll-view';
// import { css } from 'glamor';


// import '../../ChatMobile/chatmobile.css'
const ViewportView = Viewport.Aware(View)

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
            checkTimetable : false,
            selSubject : {value : 0},
            selDate : this.getNextStudyDay(daysList().map(item=>{   let newObj = {};
                                                                        newObj.label = item.name;
                                                                        newObj.value = item.id;
                                                                        // newObj.value2 = "wd"+item.id;
                                                                        return newObj;}))[1],
            daysList : daysList().map(item=>{let newObj = {};
                                                newObj.label = item.name;
                                                newObj.value = item.id;
                                                // newObj.value2 = "wd"+item.id;
                                                return newObj;}),
            currentHomeworkID : 0,
            showPreview : false,
            previewID : 0,
            curSubjKey : -1,
            curDateKey : null,
            curMessage : null,
            previewImage : null,
            isSpinner : false,
            selTag : {value : 0},
            isEdited : false,
            activeSubTab : 0,
            isDone : false,
            firstLoading : true,
            unreadYstate : null,
            chatIDByEntered : false,
            firstMsgDate : addDay(new Date(), -5),
            uploadedMessages : false,
            hwOnDate : null,
            selDateIndex : this.getNextStudyDay(daysList().map(item=>{   let newObj = {};
                newObj.label = item.name;
                newObj.value = item.id;
                return newObj;}))[0]
            };
        this.curMsgDate = new Date('19000101')
        this.onMessageDblClick = this.onMessageDblClick.bind(this)
        this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        this.onDelMsgClick=this.onDelMsgClick.bind(this)
        this.onLongPressMessage=this.onLongPressMessage.bind(this)
        this.getImage = this.getImage.bind(this)
        this.unreadY = null
        this.isViewed = false
        this.msgsY = new Map()
        this.updateReadedID = this.updateReadedID.bind(this)
        this.updateY = this.updateY.bind(this)
        this.renderMsg = this.renderMsg.bind(this)
        this.firstLoaded = this.firstLoaded.bind(this)
    }
    componentDidMount(){
        this.getSavedCreds()
        // console.log('componentDidMount: messaglist', this.unreadY, this.props)
        // if (Number(this.props.stat.chatID)===Number(this.props.localmessages.slice[-1].id))
        //     this._scrollView.scrollToEnd()
        // else {
        //     this._scrollView.scrollTo({x: 0, y: this.unreadY, animated: true});
        // }

        // setTimeout(()=> {
        //     this._scrollView.scrollTo({x: 0, y: this.unreadY, animated: false})
        //     }, 1000)

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.isDone&&this.state.isDone!==nextState.isDone)
    //         this._scrollView.scrollTo({x: 0, y: this.unreadY, animated: false})
    //     return nextState.isDone
    // }
    getSavedCreds=async ()=>{
        const credents = await getStorageData("checkTimetable")
        if (credents.length){
            if (credents.slice(0, 1)==="1"){
                this.setState({checkTimetable : true})
            }
        }
    }
    saveCredentials=(save)=>{
        setStorageData('checkTimetable', `${save?"1":"0"}`)
        this.setState({checkTimetable : save})
        // console.log('checkTimetable', save)
    }
        /*
    getSavedCreds=()=>{
        let credents = ''
        AsyncStorage.getItem("checkTimetable")
            .then(res => {
                credents = res
                console.log("checkTimetable", credents)
                if (credents.length){
                    if (credents.slice(0,1)==="1"){
                        this.setState({checkTimetable : true})
                    }
                }

            })
            .catch(err => console.log("getSavedCreds:error", err));
    }
    */
    /*
    saveCredentials=(save)=>{
        AsyncStorage.setItem('checkTimetable', `${save?1:0}`)
        this.setState({checkTimetable : save})
        console.log('checkTimetable', save)
    }
    */
    getImage=async (id)=>{
        console.log("getImage", id)
        // this.setState({isSpinner : true})
        await instanceAxios().get(API_URL + `chat/getbigimg/${id}`)
            .then(response => {
                // console.log('getImage2', response.data.attachment2)
                this.setState({previewID: id, showPreview: true, previewImage : response.data.attachment2, isSpinner : false})
            })
            .catch(responce=>{
                this.setState({isSpinner : false})
                console.log("ErrorGetImage")
            })

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
    onLongPressMessage=(id, hwSubjID, hwOnDate, text)=>{
        const {selectedSubjects} = this.props.userSetup
        let {langCode} = this.props.interface
        const subjects = selectedSubjects.map(item=>{
            return {
                label : item[getSubjFieldName(langCode)].toUpperCase(),
                value : item.id
            }
        })
        let curSubjKey = -1, curSubjValue = 0
            for (let i = 0; i < subjects.length; i++){
                // console.log("Cicle", hwSubjID, subjects[i].value, i, subjects)
                if (hwSubjID===subjects[i].value) {
                    curSubjKey = i;
                    curSubjValue = subjects[i].value
                    break;
                }
            }
            console.log("OnLongPress", curSubjKey, hwOnDate)

        const daysArr = this.state.daysList //daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id; newObj.value = "wd"+item.id;  return newObj;})
        this.setState({ modalVisible : true,
                        currentHomeworkID : id,
                        curSubjKey : curSubjValue,
                        curDateKey : (!(hwOnDate===null))?hwOnDate:null,
                        selSubject : { value : curSubjValue} ,
                        selDate : (!(hwOnDate===null))?this.getCurStudyDay(daysArr, new Date(hwOnDate))[1]:this.state.selDate,
                        curMessage : text,
                        hwOnDate})

    }
    setModalVisible(visible, setHomework) {
        let {selSubject, selDate, currentHomeworkID} = this.state
        const {localChatMessages} = this.props.userSetup
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
                        item.homework_date = toYYYYMMDD(addDay(new Date(), selDate.value));
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
                if (currentHomeworkID)
                this.props.addhomework(homeworkMsg.message, subject.subj_key, subject.subj_name_ua, new Date(addDay(new Date(), selDate.value)), currentHomeworkID)
                //  daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id; newObj.value = "wd" + item.id;  return newObj;})

                const todayMessages = localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                const homeworks = localChatMessages.filter(item=>(item.homework_date!==null))
            }
            console.log("messages", messages)
        }
        this.setState({
            currentHomeworkID : 0,
            selSubject : 0,
            selDate : this.getNextStudyDay(this.state.daysList)[1],
            curDateKey : null
        }
        )
    }
    getNextSubjDayInTimetable=(subjID, today)=>{
        const {timetable} = this.props.userSetup
        let checkDays = []
        let nextDate = null;
        if (timetable.length) {
            for (let i = 1; i < 7; i++){
                if ((today + i) < 7){
                    checkDays.push({weekday : today + i, diff : i, dayname : arrOfWeekDaysLocal[(today + i)]})
                }
                else {
                    checkDays.push({weekday : (today + i) - 7, diff : i, dayname : arrOfWeekDaysLocal[((today + i) - 7)]})
                }
            }
        }
        else {
            return null;
        }
        for (let i = 0; i < checkDays.length; i++){
            let tt = timetable.filter(item=>item!==null).filter(item=>item.weekday===checkDays[i].weekday&&item.subj_id===subjID)
            checkDays[i].subj=!!tt.length
        }
        const daysArr = this.state.daysList
        //     daysList().map(item => {
        //     let newObj = {};
        //     newObj.label = item.name;
        //     newObj.value = item.id;
        //     newObj.value2 = "wd" + item.id;
        //     return newObj;
        // })

        for (let i = 0; i < daysArr.length; i++){
            if (daysArr[i].value&&nextDate===null) {
                let tt = checkDays.filter(item=>item.diff===daysArr[i].value&&item.subj)
                // console.log("nextDate", tt)
                if (tt.length) {
                    nextDate=daysArr[i];
                }
            }
        }
        // console.log("getNextSubjDayInTimetable", checkDays, subjID, nextDate, daysArr)
        return nextDate;
    }
    onSelectSubject=item=>{
        const {selectedSubjects} = this.props.userSetup
        const {langCode} = this.props.interface
        console.log("onSelectSubject", item)
        const subjects = selectedSubjects.filter(item=>item.subj_key!=="#xxxxxx").map(item=>{
            return {
                label : item[getSubjFieldName(langCode)].toUpperCase(),
                value : item.id
            }
        })
        const key = item
        item = subjects.filter(itemSubj=>itemSubj.value===item)[0]
        let nextDay = null
            nextStudyDay = null;
        if (this.state.checkTimetable) {
            const {timetable} = this.props.userSetup
            if (timetable.length) {
                const today = Number((new Date()).getDay() === 0 ? 6 : ((new Date()).getDay() - 1));

                nextDay = this.getNextSubjDayInTimetable(item.value, today) // item.value

                // daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  newObj.value2 = "wd"+item.id;  return newObj;})
                if (nextDay===null)
                nextStudyDay = this.getNextStudyDay(this.state.daysList)[1]

                // console.log("onSelectSubject2", item, today, nextDay, nextStudyDay)

                this.setState({
                                selSubject: item,
                                selDate : (nextDay===null?nextStudyDay:nextDay),
                                curSubjKey : key,
                                curDateKey : null
                })
            }
            else {
                // daysList().map(item=>{   let newObj = {};
                //     newObj.label = item.name;
                //     newObj.value = item.id;
                //     newObj.value2 = "wd"+item.id;
                //     return newObj;})
                this.setState({
                    selSubject: item,
                    selDate : this.getNextStudyDay(this.state.daysList)[1],
                    curSubjKey : key,
                    curDateKey : null
                })
            }
        }
        else {
            // daysList().map(item=>{       let newObj = {};
            //     newObj.label = item.name;
            //     newObj.value = item.id;
            //     newObj.value2 = "wd"+item.id;
            //     return newObj;})
            this.setState({
                selSubject: item,
                selDate : this.getNextStudyDay(this.state.daysList)[1],
                curSubjKey : key,
                curDateKey : null
            })
        }
        // this.forceUpdate()
        // console.log(item.value)
    }
    onSelectDay=item=>{
        const day = this.state.daysList.filter((itemD, key)=>itemD.value===item)[0]
        console.log("onSelectDay", item, day)
        this.setState({selDate : day})
    }
    onSelectTag=item=>{
        if (item.value) {
            this.setState({selTag: item})
            const json = `{
                        "id" : ${this.state.currentHomeworkID},
                        "tagid" : ${item.value}
                    }`
            instanceAxios().post(`${API_URL}chat/add/${this.state.currentHomeworkID}`, json)
        }
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
            }
        })
        return [i, obj];
    }
    getCurStudyDay=(arr, date)=>{
        let i = 0; obj = {value : 1, value2 : "wd1"};
        arr.forEach((item, index)=>{
            let arrDate = dateFromYYYYMMDD(toYYYYMMDD(addDay(new Date(), item.value)))
            // console.log("getCurStudyDay", arrDate, item.value, date)
            if (toYYYYMMDD(arrDate) === toYYYYMMDD(date)) {
                i = index;
                obj = item;
            }
        })

        return [i, obj];
    }
    getDateSeparator=(msgDate)=>{
        // console.log("getDateSeparator", msgDate, this.curMsgDate,
        //                                 toYYYYMMDD(new Date(msgDate)), toYYYYMMDD(new Date(this.curMsgDate)))
        const {theme} = this.props.interface
        const {langLibrary} = this.props.userSetup

        if (toYYYYMMDD(new Date(msgDate)) !== toYYYYMMDD(new Date(this.curMsgDate))) {
            // console.log("DATE_SEPAR", msgDate, this.curMsgDate, toYYYYMMDD(new Date(msgDate)), toYYYYMMDD(new Date(this.curMsgDate)))
            this.curMsgDate = new Date(msgDate)
            return  <View style={[styles.mymMsgDateSeparator, {color : theme.primaryDarkColor, borderWidth : 5, borderColor : theme.primaryLightColor, borderRadius: 20}]}>
                        <Text style={[styles.mymMsgDateSeparatorText, {color : theme.primaryDarkColor, fontWeight : "900"}]}>{toYYYYMMDD(new Date())===toYYYYMMDD(new Date(msgDate))?langLibrary.mobToday:toLocalDate(new Date(msgDate), "UA", false)}</Text>
                    </View>
        }
    }
    onChangeText=(key, text)=>{
        this.setState({curMessage : text, isEdited : true})
    }
    updateMsg=(id)=>{
        this.setState({isSpinner : true})
        let json = `{   "id":${id}, 
                        "message": ${JSON.stringify(this.state.curMessage)}
                        }`;
        // instanceAxios().post(`${API_URL}chat/add/${id}`, json)
        axios2('post', `${API_URL}chat/add/${id}`, json)
            .then(res=>{
                this.setState({isEdited : false, isSpinner : false})
                console.log("Удачно записано")
            })
            .catch(res=>{
                this.setState({isSpinner : false})
                console.log("Ошибка записи")
            })

        console.log("UPDATE", this.state.curMessage)
    }
    updateReadedID=ID=>{
        const {classID, localChatMessages, userID} = this.props.userSetup
        let {stat} = this.props

        if (stat.chatID < ID) {
            stat.chatID = ID
            stat.chatCnt = localChatMessages.filter(item => (item.id > ID && item.user_id !== userID)).length
            // console.log("updateReadedID", ID, stat.chatID, `${classID}chatID`, ID.toString())

            this.props.updateState('chatID', Number(ID))

            setStorageData(`${classID}labels`, JSON.stringify(stat))
            this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
        }
    }
    updateY=(offsetY, chatMaxID, msgID)=> {
        // console.log('updateY', offsetY, chatMaxID)
        if (msgID!==null) {
            this.msgsY.set(msgID, offsetY)
        }
        else {
            if (!chatMaxID) {
                console.log("updateY:1", offsetY)

                // if (!this.state.chatIDByEntered) {
                    this._scrollView.scrollTo({x: 0, y: offsetY, animated: false})
                    // this.setState({chatIDByEntered : true})
                // }
                this.setState({isDone: true})
            }
            else {
                // this._scrollView.scrollTo({x: 0, y: offsetY, animated: false})
                console.log("updateY:2", offsetY)

                this.props.updateChatState('isLastMsg', false)

                // if (!this.state.chatIDByEntered) {
                //     this.setState({chatIDByEntered : true})
                    this._scrollView.scrollToEnd()
                // }
                this.setState({isDone: true})
                // alert("chatMaxID")
            }
            this.unreadY = offsetY
            // alert("isDone")
            // this.setState({isDone: true, unreadYstate: offsetY})
        }
    }
    renderMsg=(message, i, chatMaxID, topMsgID)=>{
        const {userID, chatTags, selectedSubjects, langLibrary, localChatMessages, userName} = this.props.userSetup
        let {langCode, theme} = this.props.interface
        const {chatID, gotStats} = this.props.stat

        let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
        const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
        let { text } = msg;
        isImage = ((message.attachment3!==null)&&(message.attachment3!==undefined))

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
            LinkPreviews = urlMatches.map(link => <LinkPreviewEx key={"url" + i}  uri={link}/>)
        }
        let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
        let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))?(toLocalDate(msg.hwdate.lenght===8?dateFromYYYYMMDD(msg.hwdate):msg.hwdate, "UA", false, false))+':'+msg.subjname:''
        let ownMsg = (username===userName)

        // console.log("msg", (new Date()).toLocaleTimeString())
        const {user_id, msg_date, homework_subj_id, homework_date} = message

        return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?
            <ViewportView key={i}
                          id={"msg-"+msg.id}
                          className={"message-block"}
                          onViewportEnter={() =>{
                              // console.log('Entered!', this.state.isDone, msg.id);
                              // this.setState({chatIDByEntered : true})
                              this.updateReadedID(msg.id)}}
                // onViewportLeave={() =>null /* console.log('Left!', msg.id)*/}
                          onLayout={event => {
                              const layout = event.nativeEvent.layout;
                              // console.log('height:', layout.height, 'width:', layout.width'x:', layout.x);
                              // console.log('y:', layout.y);
                              this.updateY((layout.y + layout.height), false, msg.id)

                              // (topMsgID&&msg.id===topMsgID&&!this.state.isDone&&!this.props.lastMsg)
                              // console.log("isLastMsg", msg.id === chatMaxID, this.props.lastmsg)
                              if (this.props.lastmsg) {
                                  // alert(2)
                                  console.log("lastMsg: 2", chatMaxID, this.props.lastmsg)
                                  if (!this.state.uploadedMessages)
                                  this.updateY((layout.y + layout.height), true, null)
                                  // this.updateReadedID(msg.id)
                              }
                              else {
                                  if (topMsgID&&msg.id===topMsgID) {
                                      //alert(1 & " " & topMsgID)
                                      console.log("topMsgID: 1", topMsgID)
                                      if (!this.state.uploadedMessages)
                                      this.updateY((layout.y), topMsgID===chatMaxID, null)
                                      // this.updateReadedID(msg.id)
                                  }
                                  else {
                                      // (msg.id===chatMaxID&&this.props.lastmsg)

                                          if (topMsgID===chatMaxID && chatMaxID && msg.id === chatMaxID) {
                                              // alert(3 & " " & topMsgID)
                                              console.log("topMsgID===chatMaxID: 3")
                                              if (!this.state.uploadedMessages)
                                              this.updateY((layout.y), false, null)
                                              // this.updateReadedID(msg.id)
                                          }
                                      }
                              }

                              // if (this.props.bottommsg)
                              //     this.updateY((layout.y + layout.height), true)

                          }}
            >
                {this.getDateSeparator(msg_date.length===8?dateFromYYYYMMDD(msg_date):new Date(msg_date))}
                {/*{console.log("MSG_TAG", msg.tagid, dateDiff(new Date(message.msg_date), new Date()), message.msg_date, msg, message)}*/}

                <TouchableWithoutFeedback   key={i} id={"msgarea-"+msg.id}
                                            delayLongPress={500}
                                            onLongPress={user_id===userID?()=>this.onLongPressMessage(msg.id, homework_subj_id, (homework_date===undefined)?null:homework_date, msg.text):null}
                >
                    <View key={msg.id}
                          style={ownMsg?
                              (hw.length?[styles.msgRightSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor, backgroundColor : theme.secondaryLightColor}]:[styles.msgRightSide, styles.homeworkNoBorder, {marginTop: 10, backgroundColor : theme.secondaryLightColor}]):
                              (hw.length?[styles.msgLeftSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor}]:[styles.msgLeftSide, styles.homeworkNoBorder, {marginTop: 10}])}>

                        <View key={'id'+i} style={[ownMsg?{}:[styles.msgLeftAuthor, {borderColor : theme.primaryColor, backgroundColor : theme.primaryColor}], msg.tagid?styles.authorBorder:'']} >
                            {ownMsg?null:<Text style={{color : theme.primaryTextColor}}>{username}
                            </Text>}
                        </View>
                        {urlMatches.length > 0?(
                            <View key={'msgpreview'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                {LinkPreviews}
                            </View>)
                            :null}
                        {isImage?
                            <View style={{display : "flex", flex : 1, flexDirection: "row"}}>
                                <TouchableOpacity onPress={()=>{ this.getImage(msg.id)}}>
                                    <View style={{flex : 1}}>
                                        <Image
                                            source={{uri: `data:image/png;base64,${JSON.parse(message.attachment3).base64}`}}
                                            style={{ width: 70, height: 70,
                                                borderRadius: 15,
                                                overflow: "hidden", margin : 1 }}/>
                                    </View>
                                </TouchableOpacity>
                                <View key={'msg'+i} id={"msg-text-"+i}
                                      style={[styles.msgText,
                                          {flex: 3, marginLeft : 20, marginTop : 5}]}>
                                    <Text style={{color : "#565656"}}>{(msg.tagid&&(dateDiff(new Date(message.msg_date), new Date())>5))?msg.text.slice(0, 30)+'...':msg.text}</Text>
                                </View>
                            </View>
                            :<View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                <Text style={{color : "#565656"}}>{(msg.tagid&&(dateDiff(new Date(message.msg_date), new Date())>5))?msg.text.slice(0, 30)+'...':msg.text}</Text>
                            </View>}

                        <View style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>
                            <Text style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>{msg.time}</Text>
                        </View>
                        {hw.length?<View key={'idhw'+i} style={ownMsg?[styles.msgRightIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]:[styles.msgLeftIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]}>
                            <Text style={{color : theme.primaryTextColor}}>{hw}</Text>
                        </View>:null}
                        {msg.tagid?<View style={{ position : "absolute", right : 3, top : -7, display : "flex", alignItems : "center"}}>
                            <View><Icon style={{fontSize: 15, color: theme.primaryMsgColor}} name="medical"/></View>
                        </View>:null}
                    </View>
                </TouchableWithoutFeedback>

            </ViewportView>

            :null
    }
    firstLoaded=(chatMaxID)=>{
        const {chatID} = this.props.stat
        // alert(chatMaxID===chatID)
        // alert(this.msgsY.size)
        // alert(this.msgsY.get(chatID))
        // console.log("firstLoaded", chatID, this.msgsY.size , this.msgsY.get(chatID))

        if (chatMaxID===chatID)
            this._scrollView.scrollToEnd()
        else {
            if (this.msgsY.get(chatID)!==undefined)
                this._scrollView.scrollTo({x: 0, y: this.msgsY.get(chatID), animated: false})
        }
        this.setState({firstLoading : false})
        // alert(this.msgsY.get(chatID))
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

        const {userID, chatTags, selectedSubjects, langLibrary, localChatMessages, userName} = this.props.userSetup
        let {langCode, theme} = this.props.interface
        const {chatID, gotStats} = this.props.stat

        let questionText = "Здравствуйте. Оставьте, пожалуйста, своё сообщение в этом чате. " +
            "Оно автоматически будет доставлено в нашу службу поддержки и мы как можно скорее отправим Вам ответ на "
        questionText = questionText.concat(this.props.classID?"Вашу электронную почту.":"указанную Вами электронной почте.")

        let messages = []
        if (this.props.isnew) {
            messages = this.props.localmessages
        }
        else
            messages = this.props.messages

        const subjects = selectedSubjects.filter(item=>item.subj_key!=="#xxxxxx").map(item=>{
            return {
                    label : item[getSubjFieldName(langCode)].toUpperCase(),
                    value : item.id
            }
        })

        const daysArr = this.state.daysList
            // daysList().map(item=>{let   newObj = {};
            //                                         newObj.label = item.name;
            //                                         newObj.value = item.id;
            //                                         newObj.value2 = ("wd"+ item.id).toString();
            //                                         return newObj;})

        let initialDay = this.getNextStudyDay(daysArr)[1].value; // this.getNextStudyDay(daysArr)[1].label //

        // Если уже готовая домашка
        if (!(this.state.curDateKey===null))
            initialDay = this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[1].value //'wd'+this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[0]; // this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[1].label //
        else {
            if (this.state.selDate!== null&&this.state.selDate)
                initialDay = this.state.selDate.value; // this.state.selDate.label //
        }

        // console.log("INITIALDAY", initialDay, this.state.curDateKey, this.state.selDate)

        let realDateIndex = null

        this.state.daysList.forEach((item, key)=>item.value===initialDay?realDateIndex=key:null)
        initialDay = realDateIndex!==null?realDateIndex:initialDay

        // initialDay = 4

        let isImage = false

        let tagsArr = []
        tagsArr = chatTags.map(item=> {
            return {value: item.id, label: `${item.name}[${item.short}]` }
        })
        tagsArr.unshift({value: 0, label: "нет"})
        //     [{value : 1,label : "Родительский комитет"},
        //     {value : 2,label : "Реквизиты оплат"},
        //     {value : 3,label : "Инфа от классного"},
        //     {value : 4,label : "Инфа от школы"},]
        // console.log("RENDER", this.state, messages)

        let img = ''
        if (this.state.previewID) {
            console.log("write file", JSON.parse(this.state.previewImage).base64, JSON.parse(this.state.previewImage))
            // img = `data:image/png;base64,${JSON.parse(homework.filter(item => item.id === this.state.previewID)[0].attachment3).base64}`
            img = `data:image/png;base64,${JSON.parse(this.state.previewImage).base64}`
            // console.log("write.2", img)
            // const Base64Code = JSON.parse(this.state.previewImage).base64 //base64Image is my image base64 string
            // const dirs = RNFetchBlob.fs.dirs;
            // imgPath = dirs.DCIMDir + "/image64.png";
            // RNFetchBlob.fs.writeFile(imgPath, Base64Code, 'base64')
            //     .then(res => {console.log("File : ", res)})
            //     .catch(res => console.log("FileWrite: Error", res))
        }

        // const ViewportView = Viewport.Aware(View)

        // console.log("MSG_LIST", this.props.bottommsg)
        if (!messages.length) return null

        // Выберем первое непрочитанное чужое сообщение
        const chatMaxID = messages.slice(-1)[0].id
        const notOwnMsgs = messages.filter(item=>item.id>chatID&&item.user_id!==userID)

        const topMsgID = notOwnMsgs.length?notOwnMsgs[0].id:chatMaxID
        const today = Number((new Date()).getDay() === 0 ? 6 : ((new Date()).getDay() - 1));

        // console.log("TOP_MSG_CALC", chatID, topMsgID, gotStats, messages.length)

        // if (this.state.firstLoading&&this.state.isDone&&gotStats){
        //     this.firstLoaded(chatMaxID)
        // }
        //
        return (
            <View style={{opacity : this.state.isDone&&gotStats?1:0}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showPreview}
                    onRequestClose={() => {}}>
                    <View>
                        {messages.length && this.state.previewID ?
                            <ImageZoom cropWidth={Dimensions.get('window').width}
                                       cropHeight={Dimensions.get('window').height}
                                       imageWidth={Dimensions.get('window').width}
                                       imageHeight={Dimensions.get('window').height}>
                                    <Image style={{
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height,
                                    }} source={{uri: img}}/>
                            </ImageZoom> : null}
                            <TouchableOpacity
                                style={{position : "absolute", top : 10, right : 10, zIndex:10}}
                                onPress={()=>this.setState({showPreview : false, previewID : 0})}>
                                <View style={{
                                    paddingTop : 5, paddingBottom : 5,
                                    paddingLeft : 15, paddingRight : 15, borderRadius : 5,
                                    borderWidth : 2, borderColor : theme.photoButtonColor, zIndex:10}}>
                                    <Text style={{  fontSize : 20,
                                        color: theme.photoButtonColor,
                                        zIndex:10,
                                    }}>X</Text>
                                </View>
                            </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}>
                    <View style={styles.modalView}>
                        <Tabs onChangeTab={({ i, ref, from }) => this.setState({activeSubTab : i})}>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color : theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobSubject===undefined?'':langLibrary.mobSubject.toUpperCase()}</Text></TabHeading>}>
                                <ScrollView style={styles.homeworkSubjectList}>

                                     <RadioForm
                                        formHorizontal={false}
                                        animation={false}>
                                        {
                                            subjects.map((obj, i) => {


                                                let nextDay = this.state.checkTimetable?this.getNextSubjDayInTimetable(obj.value, today):null
                                                if (nextDay!==null){
                                                    obj.label = `${obj.label} ${langLibrary.mobTo} ${nextDay.label}`
                                                }
                                                // console.log("RadioSubjs", obj, nextDay)

                                                return <RadioButton labelHorizontal={true} key={i}>
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={this.state.curSubjKey === obj.value}
                                                        onPress={(item) => this.onSelectSubject(item)}
                                                        borderWidth={1}
                                                        buttonInnerColor={theme.primaryDarkColor}
                                                        buttonOuterColor={initialDay === i ? theme.primaryDarkColor : theme.primaryDarkColor}
                                                        buttonSize={15}
                                                        buttonOuterSize={19}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{marginLeft: 10, marginTop: i === 0 ? 20 : 4}}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={(item) => this.onSelectSubject(item)}
                                                        labelStyle={{
                                                            fontSize: RFPercentage(2),
                                                            color: theme.primaryDarkColor
                                                        }}
                                                        labelWrapStyle={{marginTop: i === 0 ? 20 : 2}}
                                                    />
                                                </RadioButton>
                                            })
                                        }
                                    </RadioForm>

                                </ScrollView>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color : theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobWhen===undefined?'':langLibrary.mobWhen.toUpperCase()}</Text></TabHeading>}>
                                <ScrollView style={styles.homeworkSubjectList}>

                                    <RadioForm
                                        formHorizontal={false}
                                        animation={false}>
                                        {
                                            this.state.daysList.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} >
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={initialDay === i}
                                                        onPress={(item) => this.onSelectDay(item)}
                                                        borderWidth={1}
                                                        buttonInnerColor={theme.primaryDarkColor}
                                                        buttonOuterColor={initialDay === i ? theme.primaryDarkColor : theme.primaryDarkColor}
                                                        buttonSize={15}
                                                        buttonOuterSize={20}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{marginLeft: 10, marginTop : i===0? 20: 5}}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={(item) => this.onSelectDay(item)}
                                                        labelStyle={{fontSize: RFPercentage(2.5), color: theme.primaryDarkColor}}
                                                        labelWrapStyle={{marginTop : i===0? 20: 5}}
                                                    />
                                                </RadioButton>
                                            ))
                                        }
                                    </RadioForm>
                                </ScrollView>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobChange===undefined?'':langLibrary.mobChange.toUpperCase()}</Text></TabHeading>}>
                                <View>
                                        <Textarea style={styles.msgUpdateTextarea}
                                                  onChangeText={text=>this.onChangeText('curMessage', text)}
                                                  placeholder={langLibrary===undefined?'':langLibrary.mobChangeText===undefined?'':langLibrary.mobChangeText}  type="text"
                                                  ref={input=>{this.inputMessage=input}}
                                                  value={this.state.curMessage}
                                        />
                                    <TouchableOpacity
                                        onPress={()=>this.updateMsg(this.state.currentHomeworkID)}>
                                        <View style={styles.updateMsg}>
                                            <Text style={this.state.isEdited?styles.updatedMsgText:styles.updateMsgText} >{this.state.isEdited?langLibrary===undefined?'':langLibrary.mobSaveChanges===undefined?'':langLibrary.mobSaveChanges.toUpperCase():langLibrary===undefined?'':langLibrary.mobChangeTextUpper===undefined?'':langLibrary.mobChangeTextUpper.toUpperCase()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobTags===undefined?'':langLibrary.mobTags.toUpperCase()}</Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        dataSource={tagsArr}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        formHorizontal={false}
                                        labelHorizontal={true}
                                        onPress={(item) => this.onSelectTag(item)}
                                    />
                                </View>
                            </Tab>
                        </Tabs>
                        {this.state.activeSubTab!==2?
                        <ListItem style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>
                                {this.state.selSubject.value?this.state.selSubject.label:null}
                                {this.state.selDate.value>-3?` ${langLibrary===undefined?'':langLibrary.mobTo===undefined?'':langLibrary.mobTo} ${this.state.selDate.label!==undefined?this.state.selDate.label:(this.state.hwOnDate!==null?toLocalDate(new Date(this.state.hwOnDate), "UA", false, false):toLocalDate(new Date(), "UA", false, false))}`:null}
                            </Text>
                        </ListItem>:null}
                        {this.state.activeSubTab!==2?
                        <ListItem className={styles.editHomeworkCheckbox}>
                            <CheckBox checked={this.state.checkTimetable} onPress={()=>{this.saveCredentials(!this.state.checkTimetable)}} color={theme.primaryDarkColor}/>
                            <Body>
                                <Text>{`  ${langLibrary===undefined?'':langLibrary.mobConsiderTimetable===undefined?'':langLibrary.mobConsiderTimetable}`}</Text>
                            </Body>
                        </ListItem>:null}
                        <Footer style={styles.header}>
                            <FooterTab style={styles.header}>
                                <Button style={this.state.selSubject.value&&this.state.selDate.value>-3?{backgroundColor : theme.primaryColor, padding : 20}:styles.btnHomeworkDisabled} vertical
                                        onPress={this.state.selSubject.value&&this.state.selDate.value>-3?()=>{this.setState({activeSubTab : 0});this.setModalVisible(!this.state.modalVisible, true)}:()=>this.setState({activeSubTab : 0})}>
                                    <Text style={{color : theme.primaryTextColor, height : "100%", marginTop : 12, flex : 1, alignItems: "center", justifyContent : "center"}}>{langLibrary===undefined?'':langLibrary.mobAdd===undefined?'':langLibrary.mobAdd.toUpperCase()}</Text>
                                </Button>
                                <Button style={styles.btnClose} vertical
                                        onPress={()=>{this.setModalVisible(!this.state.modalVisible, false);this.setState({activeSubTab : 0});}}>
                                    <Text style={{color : theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobCancel===undefined?'':langLibrary.mobCancel.toUpperCase()}</Text>
                                </Button>
                            </FooterTab>
                        </Footer>
                    </View>
                </Modal>
                <Viewport.Tracker>
                <ScrollView
                    // ref="_scrollViewMain"
                    ref={ref => this._scrollView = ref}
                    decelerationRate={0.6}
                    // onContentSizeChange={(contentWidth, contentHeight)=>this.state.isDone?this._scrollView.scrollTo({x: 0, y: this.unreadY, animated : false}):null}

                    // style={{backgroundColor : theme.primaryLightColor}}
                    // onContentSizeChange={(contentWidth, contentHeight)=>this.state.isDone&&this.props.stat.gotStats?this._scrollView.scrollToEnd():null}
                    // onContentSizeChange={(contentWidth, contentHeight)=>{this._scrollView.scrollResponderScrollToEnd({animated: true})}
                >

                    <TouchableOpacity onPress={()=>{this.setState({firstMsgDate : addDay(this.state.firstMsgDate, -7), uploadedMessages : true}); this.props.loadmessages(addDay(this.state.firstMsgDate, -7))}}>
                        <View style={[styles.mymMsgAddSeparator, {backgroundColor : theme.primaryLightColor, borderWidth : 5, borderColor : theme.primaryLightColor, borderRadius: 20}]}>
                            <Text style={[styles.mymMsgDateSeparatorText, {color : theme.primaryTextColor, fontWeight : "900"}]}>
                                {langLibrary.mobAddMessages}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {messages.length?
                        messages.map((message, i) =>{
                                return this.renderMsg(message, i, chatMaxID, topMsgID)
                                // let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
                                // const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
                                // let { text } = msg;
                                // isImage = false
                                // if ((message.attachment3!==null)&&(message.attachment3!==undefined)) {
                                //     isImage = true
                                // }
                                // urlMatches.forEach(link => {
                                //     const startIndex = text.indexOf(link);
                                //     const endIndex = startIndex + link.length;
                                //     text = insertTextAtIndices(text, {
                                //         [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
                                //         [endIndex]: '</a>',
                                //     });
                                // });
                                // let LinkPreviews = null;
                                // if (urlMatches.length) {
                                //      LinkPreviews = urlMatches.map(link => <LinkPreviewEx key={"url" + i}  uri={link}/>)
                                // }
                                // let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
                                // let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))?(toLocalDate(msg.hwdate.lenght===8?dateFromYYYYMMDD(msg.hwdate):msg.hwdate, "UA", false, false))+':'+msg.subjname:''
                                // let ownMsg = (username===userName)
                                //
                                // console.log("msg", (new Date()).toLocaleTimeString())
                                // const {user_id, msg_date, homework_subj_id, homework_date} = message
                                //
                                //     return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?
                                //         <ViewportView key={i}
                                //                       id={"msg-"+msg.id}
                                //                       className={"message-block"}
                                //                       onViewportEnter={() =>{ /*console.log('Entered!', msg.id);*/ this.updateReadedID(msg.id) }}
                                //                       // onViewportLeave={() =>null /* console.log('Left!', msg.id)*/}
                                //                       onLayout={event => {
                                //                           const layout = event.nativeEvent.layout;
                                //                           // console.log('height:', layout.height, 'width:', layout.width'x:', layout.x);
                                //                           // console.log('y:', layout.y);
                                //                           if (msg.id===topMsgID&&!this.state.isDone&&!this.props.lastMsg)
                                //                               this.updateY(layout.y, topMsgID===chatMaxID, msg.id)
                                //
                                //                           if (msg.id===chatMaxID&&this.props.lastmsg)
                                //                               this.updateY((layout.y + layout.height), true)
                                //                       }}
                                //         >
                                //             {this.getDateSeparator(msg_date.length===8?dateFromYYYYMMDD(msg_date):new Date(msg_date))}
                                //             {/*{this.renderMsgEx(msg, i, chatMaxID, topMsgID, message)}*/}
                                //             <TouchableWithoutFeedback   key={i} id={"msgarea-"+msg.id}
                                //                                         delayLongPress={500}
                                //                                         onLongPress={user_id===userID?()=>this.onLongPressMessage(msg.id, homework_subj_id, (homework_date===undefined)?null:homework_date, msg.text):null}
                                //             >
                                //                 <View key={msg.id}
                                //                       style={ownMsg?
                                //                           (hw.length?[styles.msgRightSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor, backgroundColor : "#D8FBFF"}]:[styles.msgRightSide, styles.homeworkNoBorder, {marginTop: 10, backgroundColor : "#D8FBFF"}]):
                                //                           (hw.length?[styles.msgLeftSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor}]:[styles.msgLeftSide, styles.homeworkNoBorder, {marginTop: 10}])}>
                                //
                                //                     <View key={'id'+i} style={[ownMsg?{}:[styles.msgLeftAuthor, {borderColor : theme.primaryColor, backgroundColor : theme.primaryColor}], msg.tagid?styles.authorBorder:'']} >
                                //                         {ownMsg?null:<Text style={{color : theme.primaryTextColor}}>{username}
                                //                         </Text>}
                                //                     </View>
                                //                     {urlMatches.length > 0?(
                                //                         <View key={'msgpreview'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                //                             {LinkPreviews}
                                //                         </View>)
                                //                         :null}
                                //                     {isImage?
                                //                         <View style={{display : "flex", flex : 1, flexDirection: "row"}}>
                                //                             <TouchableOpacity onPress={()=>{ this.getImage(msg.id)}}>
                                //                                 <View style={{flex : 1}}>
                                //                                     <Image
                                //                                         source={{uri: `data:image/png;base64,${JSON.parse(message.attachment3).base64}`}}
                                //                                         style={{ width: 70, height: 70,
                                //                                             borderRadius: 15,
                                //                                             overflow: "hidden", margin : 1 }}/>
                                //                                 </View>
                                //                             </TouchableOpacity>
                                //                             <View key={'msg'+i} id={"msg-text-"+i}
                                //                                   style={[styles.msgText,
                                //                                       {flex: 3, marginLeft : 20, marginTop : 5}]}>
                                //                                 <Text style={{color : "#565656"}}>{msg.text}</Text>
                                //                             </View>
                                //                         </View>
                                //                         :<View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                //                             <Text style={{color : "#565656"}}>{msg.text}</Text>
                                //                         </View>}
                                //
                                //                     <View style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>
                                //                         <Text style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>{msg.time}</Text>
                                //                     </View>
                                //                     {hw.length?<View key={'idhw'+i} style={ownMsg?[styles.msgRightIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]:[styles.msgLeftIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]}>
                                //                         <Text style={{color : theme.primaryTextColor}}>{hw}</Text>
                                //                     </View>:null}
                                //                     {msg.tagid?<View style={{ position : "absolute", right : 3, top : -7, display : "flex", alignItems : "center"}}>
                                //                         <View><Icon style={{fontSize: 15, color: theme.primaryMsgColor}} name="medical"/></View>
                                //                     </View>:null}
                                //                 </View>
                                //             </TouchableWithoutFeedback>
                                //          </ViewportView>
                                //
                                //      :null
                            }
                        ):null}


                </ScrollView>
                </Viewport.Tracker>
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