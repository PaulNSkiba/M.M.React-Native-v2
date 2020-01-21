/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
        TouchableHighlight, Modal, Radio, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail, Spinner } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, addDay, toYYYYMMDD,
        daysList, toLocalDate, instanceAxios, axios2, arrOfWeekDaysLocal,
        getStorageData, setStorageData, getSubjFieldName} from '../../js/helpersLight'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import LinkPreviewEx from '../LinkPreviewEx/linkpreviewex'
import { connect } from 'react-redux'
import ImageZoom from 'react-native-image-pan-zoom';
import { API_URL } from '../../config/config'
import { Viewport } from '@skele/components'

// import VisibilitySensor from 'react-native-visibility-sensor'
// import InViewPort from 'react-native-inviewport'

// import {AsyncStorage} from 'react-native';
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
            checkTimetable : false,
            selSubject : {value : 0},
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
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
        this.updateReadedID = this.updateReadedID.bind(this)
        this.updateY = this.updateY.bind(this)
    }
    componentDidMount(){
        this.getSavedCreds()
        console.log('componentDidMount: messaglist', this.unreadY, this.props)
        // if (Number(this.props.stat.chatID)===Number(this.props.localmessages.slice[-1].id))
        //     this._scrollView.scrollToEnd()
        // else {
        //     this._scrollView.scrollTo({x: 0, y: this.unreadY, animated: true});
        // }
    }
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
        // alert(curSubjKey)
        // curSubjKey = curSubjKey.length?curSubjKey[0]:-1
        // curSubjKey = -1
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        this.setState({ modalVisible : true, currentHomeworkID : id, curSubjKey,
                        curDateKey : (!(hwOnDate===null))?hwOnDate:null, selSubject : { value : curSubjValue} ,
                        selDate : (!(hwOnDate===null))?this.getCurStudyDay(daysArr, new Date(hwOnDate))[1]:this.state.selDate,
                        curMessage : text})

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

                this.setState({ currentHomeworkID : 0,
                                selSubject : 0,
                                selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1]})

                const todayMessages = localChatMessages.filter(item=>(new Date(item.msg_date).toLocaleDateString())===(new Date().toLocaleDateString()))
                const homeworks = localChatMessages.filter(item=>(item.homework_date!==null))
            }
            console.log("messages", messages)
        }
    }
    getNextSubjDayInTimetable=(subjID, today)=>{
        const {timetable} = this.props.userSetup
        let checkDays = []
        let nextDate = null;
        if (timetable) {
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
        const daysArr = daysList().map(item => {
            let newObj = {};
            newObj.label = item.name;
            newObj.value = item.id;
            return newObj;
        })

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
        console.log("onSelectSubject", item)
        let nextDay = null;
        if (this.state.checkTimetable) {
            const {timetable} = this.props.userSetup
            if (timetable) {
                const today = Number((new Date()).getDay() === 0 ? 6 : ((new Date()).getDay() - 1));
                nextDay = this.getNextSubjDayInTimetable(item.value, today)
                this.setState({selSubject: item, selDate : nextDay===null?this.state.selDate:nextDay})
            }
        }
        else {
            this.setState({selSubject: item})
        }
        // console.log(item.value)
    }
    onSelectDay=item=>{
        this.setState({selDate : item})
        // console.log(item.value)
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
        let i = 0; obj = {};
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
        if (toYYYYMMDD(new Date(msgDate)) !== toYYYYMMDD(new Date(this.curMsgDate))) {
            // console.log("DATE_SEPAR", msgDate, this.curMsgDate, toYYYYMMDD(new Date(msgDate)), toYYYYMMDD(new Date(this.curMsgDate)))
            this.curMsgDate = new Date(msgDate)
            return  <View style={styles.mymMsgDateSeparator}>
                        <Text style={styles.mymMsgDateSeparatorText}>{toLocalDate(new Date(msgDate), "UA", false)}</Text>
                    </View>
        }
    }
    onChangeText=(key, text)=>{
        this.setState({curMessage : text, isEdited : true})
    }
    updateMsg=(id)=>{
        this.setState({isSpinner : true})
        let json = `{   "id":${id}, 
                        "message": "${this.state.curMessage}"
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
        console.log('updateY', offsetY, chatMaxID)
        if (!chatMaxID)
            this._scrollView.scrollTo({x: 0, y: offsetY, animated: true})
        else {
            this._scrollView.scrollToEnd()
            this.props.updateChatState('isLastMsg',0)
        }
        this.unreadY = offsetY
        this.setState({isDone : true})
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

        const {chatID} = this.props.stat
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

        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        let initialDay = this.getNextStudyDay(daysArr)[0];
        if (!(this.state.curDateKey===null))
            initialDay = this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[0];

        let isImage = false

        let tagsArr = []
        tagsArr = chatTags.map(item=> {
            return {value: item.id, label: `${item.name}[${item.short}]` }
        })
        tagsArr.unshift({value: 0, label: "нет"})
        //     [
        //     {
        //         value : 1,
        //         label : "Родительский комитет"
        //     },
        //     {
        //         value : 2,
        //         label : "Реквизиты оплат"
        //     },
        //     {
        //         value : 3,
        //         label : "Инфа от классного"
        //     },
        //     {
        //         value : 4,
        //         label : "Инфа от школы"
        //     },
        // ]
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
        const ViewportView = Viewport.Aware(View)
        // console.log("MSG_LIST")
        if (!messages.length) return null
        // console.log("MESSAGES", messages, messages.slice(-1), messages.slice(-1)[0], messages.slice(-1)[0].id)

        let topMsgID = messages.slice(-1)[0].id
        // Выберем первое непрочитанное чужое сообщение
        const notOwnMsgs = messages.filter(item=>item.id>chatID&&item.user_id!==userID)
        const chatMaxID = messages.slice(-1)[0].id
        if (notOwnMsgs.length) topMsgID = notOwnMsgs[0].id

        return (
            <View style={{opacity : this.state.isDone?1:0}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showPreview}
                    onRequestClose={() => {}}>
                    <View>
                        {/*{this.state.isSpinner ? <View*/}
                            {/*style={{position: "absolute", flex: 1, alignSelf: 'center', marginTop: 240, zIndex: 100}}>*/}
                            {/*<Spinner color={theme.secondaryColor}/>*/}
                        {/*</View> : null}*/}
                        {/*{messages.length&&this.state.previewID?*/}
                        {/*<SingleImage*/}
                            {/*uri={`data:image/png;base64,${JSON.parse(messages.filter(item=>item.id===this.state.previewID)[0].attachment3).base64}`}*/}
                            {/*style={{position : "relative", height : "100%"}}*/}
                            {/*onClose={()=>this.setState({showPreview : false, previewID : 0})}*/}
                        {/*/>:null}*/}
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
                                <View style={styles.homeworkSubjectList}>
                                    <RadioForm
                                        // style={{ paddingBottom : 20 }}
                                        dataSource={subjects}
                                        itemShowKey="label"
                                        itemRealKey="value"
                                        circleSize={16}
                                        initial={this.state.curSubjKey}
                                        formHorizontal={false}
                                        labelHorizontal={true}
                                        onPress={(item) => this.onSelectSubject(item)}
                                    />
                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color : theme.primaryTextColor}}>{langLibrary===undefined?'':langLibrary.mobWhen===undefined?'':langLibrary.mobWhen.toUpperCase()}</Text></TabHeading>}>
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
                                {this.state.selDate.value>-3?` ${langLibrary===undefined?'':langLibrary.mobTo===undefined?'':langLibrary.mobTo} ${this.state.selDate.label}`:null}
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
                                <Button style={styles.btnClose} vertical onPress={()=>{this.setModalVisible(!this.state.modalVisible, false);this.setState({activeSubTab : 0});}}>
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
                    // style={{backgroundColor : theme.primaryLightColor}}
                    // onContentSizeChange={(contentWidth, contentHeight)=>this.state.isDone?this._scrollView.scrollToEnd():null}

                    // onContentSizeChange={(contentWidth, contentHeight)=>{this._scrollView.scrollResponderScrollToEnd({animated: true})}
                >
                    {messages.length?
                        messages.map((message, i) =>{
                                let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
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
                                let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
                                let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))?(toLocalDate(msg.hwdate.lenght===8?dateFromYYYYMMDD(msg.hwdate):msg.hwdate, "UA", false, false))+':'+msg.subjname:''
                                let ownMsg = (username===userName)

                                // console.log("RENDER MESSAGE_LIST")
                                const {user_id, msg_date, homework_subj_id, homework_date} = message
                                // <VisibilitySensor intervalDelay={3000} onChange={()=>console.log("visibility", msg.id)}>
                                    return (this.props.hwdate===null||(!(this.props.hwdate===null)&&((new Date(this.props.hwdate)).toLocaleDateString()===(new Date(msg.hwdate)).toLocaleDateString())))?
                                        <ViewportView key={i}
                                                      id={"msg-"+msg.id}
                                                      className={"message-block"}
                                                      onViewportEnter={() =>{ /*console.log('Entered!', msg.id);*/ this.updateReadedID(msg.id) }}
                                                      onViewportLeave={() =>null /* console.log('Left!', msg.id)*/}
                                                      onLayout={event => {
                                                          const layout = event.nativeEvent.layout;
                                                          // console.log('height:', layout.height);
                                                          // console.log('width:', layout.width);
                                                          // console.log('x:', layout.x);
                                                          // console.log('y:', layout.y);
                                                          // this.msgsY[msg.id] = layout.y
                                                          // console.log("layout", layout.y, this.unreadY, user_id, userID, msg.id, chatID)
                                                          // Если начальная позиция ещё null и текущий ID больше максимального

                                                          // if (this.unreadY!==null&&user_id!==userID&&this.isViewed===false&&Number(msg.id) >=Number(chatID)) this.isViewed = true
                                                          // if ((this.unreadY===null&&user_id!==userID&&Number(msg.id) >=Number(chatID))||(user_id===userID&&this.isViewed===false)) this.updateY(layout.y + layout.height, false)

                                                          // if ((this.unreadY===null&&user_id!==userID&&Number(msg.id) >=Number(chatID))||(user_id===userID&&this.isViewed===false)) this.updateY(layout.y + layout.height, false)
                                                          // console.log("onLayout", msg.id, this.state.isDone, topMsgID, chatMaxID, this.props.lastmsg)
                                                          if (msg.id===topMsgID&&!this.state.isDone&&!this.props.lastMsg) this.updateY(layout.y, topMsgID===chatMaxID, msg.id)
                                                          // if (msg.id===0&&this.state.isDone) this.updateY(layout.y, true)
                                                          // if (this.state.isDone) this.updateY(null, true)

                                                          if (msg.id===chatMaxID&&this.props.lastmsg) this.updateY(null, true)

                                                      }}
                                        >
                                             {this.getDateSeparator(msg_date.length===8?dateFromYYYYMMDD(msg_date):new Date(msg_date))}
                                            <TouchableWithoutFeedback   key={i} id={"msgarea-"+msg.id}
                                                                        delayLongPress={500}
                                                                        onLongPress={user_id===userID?()=>this.onLongPressMessage(msg.id, homework_subj_id, (homework_date===undefined)?null:homework_date, msg.text):null}
                                                                        >
                                            <View key={msg.id}
                                                style={ownMsg?
                                                (hw.length?[styles.msgRightSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor, backgroundColor : "#D8FBFF"}]:[styles.msgRightSide, styles.homeworkNoBorder, {marginTop: 10, backgroundColor : "#D8FBFF"}]):
                                                (hw.length?[styles.msgLeftSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor}]:[styles.msgLeftSide, styles.homeworkNoBorder, {marginTop: 10}])}>
                                                <View key={'id'+i} style={[ownMsg?{}:[styles.msgLeftAuthor, {borderColor : theme.primaryColor, backgroundColor : theme.primaryColor}], msg.tagid?styles.authorBorder:'']} >
                                                    {ownMsg?null:<Text style={{color : theme.primaryTextColor}}>{username}
                                                    </Text>}
                                                </View>
                                                {urlMatches.length > 0?(
                                                    <View key={'msgpreview'+i} id={"msg-text-"+i} style={this.state.editKey===i?{visibility:"hidden"}:null} className="msg-text">
                                                        {/*<span*/}
                                                            {/*dangerouslySetInnerHTML={{*/}
                                                                {/*__html: text, }}*/}
                                                        {/*/>*/}
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
                                                                <Text style={{color : "#565656"}}>{msg.text}</Text>
                                                        </View>
                                                    </View>
                                                    :<View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                                        <Text style={{color : "#565656"}}>{msg.text}</Text>
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