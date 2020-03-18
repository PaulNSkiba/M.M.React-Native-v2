/**
 * Created by Paul on 13.05.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
        TouchableHighlight, Modal, Radio, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail, Spinner, Icon, Toast } from 'native-base';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, addDay, toYYYYMMDD,
        daysList, toLocalDate, instanceAxios, axios2, arrOfWeekDaysLocal,
        getStorageData, setStorageData, getSubjFieldName, dateDiff, getLangWord} from '../../js/helpersLight'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import LinkPreviewEx from '../LinkPreviewEx/linkpreviewex'
import { connect } from 'react-redux'
import ImageZoom from 'react-native-image-pan-zoom';
import { API_URL } from '../../config/config'
import { Viewport } from '@skele/components'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import UserAvatar from 'react-native-user-avatar'
import SwitchSelector from 'react-native-switch-selector'
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";

// import { Icon } from 'react-native-elements'
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
                                                                        newObj.date = item.date;
                                                                        // newObj.value2 = "wd"+item.id;
                                                                        return newObj;}))[1],
            daysList : daysList().map(item=>{let newObj = {};
                                                newObj.label = item.name;
                                                newObj.value = item.id;
                                                newObj.date = item.date;
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
            workType : 0,
            i : 0,
            currentMsgID : 0,
            selDateIndex : this.getNextStudyDay(daysList().map(item=>{   let newObj = {};
                newObj.label = item.name;
                newObj.value = item.id;
                return newObj;}))[0]
            };
        this.i = 0
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
        this.maxID = 0
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
        this.props.onStopLoading()
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shoudUpdate:MessageList", nextProps.stat.gotStats, nextProps.stat.chatID, this.msgsY, this.state.isDone, nextState.isDone, new Date().toLocaleTimeString())
        // if (nextProps.stat.gotStats!==this.props.stat.gotStats&&nextProps.stat.chatID!==this.props.stat.chatID&&this.msgsY.count&&this.state.isDone)
        //     this._scrollView.scrollTo({x: 0, y: this.msgsY[nextProps.stat.chatID], animated: false})

        if (nextProps.islastmsg||this.props.islastmsg) {
            console.log("shouldUpdate0", "toEnd")
            this._scrollView.scrollToEnd()
        }
        else
        if (nextState.isDone&&this.state.isDone!==nextState.isDone&&nextProps.stat.chatID&&this.msgsY.has(nextProps.stat.chatID)) {
            // console.log("shouldUpdate", this.maxID, nextProps.stat.chatID)
            if (this.maxID===nextProps.stat.chatID) {
                console.log("shouldUpdate", "toEnd")
                this._scrollView.scrollToEnd()
                // this._scrollView.scrollTo({x: 0, y: this.msgsY.get(nextProps.stat.chatID), animated: false})
            }
            else {
                console.log("shouldUpdate", "to")
                this._scrollView.scrollTo({x: 0, y: this.msgsY.get(nextProps.stat.chatID), animated: false})
            }
                // console.log("SCROLL", this.msgsY.get(nextProps.stat.chatID))
        }


        // if (!this.state.isDone)
        //     this.props.onStartLoading()
        // else
        //     this.props.onStopLoading()

        return true//nextState.isDone
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
    //ToDO : Убрать, сейчас не используется
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
    onLongPressMessage=(id, hwSubjID, hwOnDate, text, cwSubjID, cwOnDate)=>{
        const {selectedSubjects} = this.props.userSetup
        let {langCode} = this.props.interface
        if (!id){
            Toast.show({
                text: `Редактирование сообщения пока что невозможно. Оно не доставлено на сервер`,
                buttonText: 'ОК',
                position: 'bottom',
                duration: 2500,
                style: {marginBottom: 100, fontSize: RFPercentage(1.8)}
                // type : 'success'
            })
        }
        else {
            const subjects = selectedSubjects.map(item => {
                return {
                    label: item[getSubjFieldName(langCode)].toUpperCase(),
                    value: item.id
                }
            })
            const curSubjID = cwSubjID !== null && cwSubjID ? cwSubjID : hwSubjID
            const curOnDate = cwSubjID !== null && cwSubjID ? cwOnDate : hwOnDate

            let curSubjKey = -1, curSubjValue = 0
            for (let i = 0; i < subjects.length; i++) {
                if (curSubjID === subjects[i].value) {
                    curSubjKey = i;
                    curSubjValue = subjects[i].value
                    break;
                }
            }
            console.log("OnLongPress", curOnDate, moment(curOnDate).date(), this._calendarPicker)
            // const daysArr = this.state.daysList //daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id; newObj.value = "wd"+item.id;  return newObj;})

            this.setState({
                modalVisible: true,
                currentHomeworkID: id,
                curSubjKey: curSubjValue,
                curDateKey: (!(curOnDate === null)) ? curOnDate : null,
                selSubject: {value: curSubjValue},
                selDate: curOnDate !== null ? this.getCurStudyDay(this.state.daysList, new Date(curOnDate))[1] : this.state.selDate,
                curMessage: text,
                workType: cwSubjID !== null && cwSubjID ? 1 : 0,
                curOnDate
            })

            if (this._calendarPicker !== undefined && this._calendarPicker !== null)
                this._calendarPicker.handleOnPressDay(moment(curOnDate).date())
        }
    }
    setModalVisible(visible, setHomework, isDel) {
        let {selSubject, selDate, currentHomeworkID, curMessage} = this.state
        const {localChatMessages} = this.props.tempdata
        this.setState({modalVisible: visible});
        if (setHomework) {
            let messages = []
            if (this.props.isnew)
                messages = localChatMessages //this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
            else
                messages = this.props.messages

            if (this.props.isnew) {
                const subject = this.props.userSetup.selectedSubjects.filter(item=>item.id===selSubject.value)[0]
                // console.log("setModalVisible", selSubject, subject, this.props.userSetup.selectedSubjects)
                //    &&!(subject===undefined)
                let newmessages = messages.map(item=>{
                    if (item.id===currentHomeworkID) {
                        delete item.attachment2
                        delete item.attachment4
                        delete item.attachment5
                        item.message = curMessage
                        item.isdel = isDel?1:null
                        if (subject!==undefined) {
                            if (!this.state.workType) { // Если домашка
                                item.homework_subj_id = selSubject.value
                                item.homework_date = toYYYYMMDD(addDay(new Date(), selDate.value));
                                item.homework_subj_name = subject.subj_name_ua
                                item.homework_subj_key = subject.subj_key
                                item.classwork_subj_id = null
                                item.classwork_date = null
                                item.classwork_subj_name = null
                                item.classwork_subj_key = null
                            }
                            else {
                                item.homework_subj_id = null
                                item.homework_date = null
                                item.homework_subj_name = null
                                item.homework_subj_key = null
                                item.classwork_subj_id = selSubject.value
                                item.classwork_date = toYYYYMMDD(selDate.date);
                                item.classwork_subj_name = subject.subj_name_ua
                                item.classwork_subj_key = subject.subj_key
                            }
                        }
                    }
                    return item
                })
                console.log("newmessages", currentHomeworkID, isDel, newmessages)
                // ToDO: Проверить, что делает эта запись
                // this.props.updatemessages(newmessages)

                const homeworkMsg = newmessages.filter(item=>item.id===currentHomeworkID)[0]

                this.props.sendmessage(JSON.stringify(homeworkMsg), currentHomeworkID, true)

                // Здесь будем апдейтить базу домашки
                if (currentHomeworkID)
                this.props.addhomework(homeworkMsg.message, !(subject===undefined)?subject.subj_key:null, !(subject===undefined)?subject.subj_name_ua:null, new Date(addDay(new Date(), selDate.value)), currentHomeworkID, this.props.userSetup)
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
            curDateKey : null,
            workType : 0
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
        if (this.state.checkTimetable&&!this.state.workType) {
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
    onSelectDay=(item, isDate)=>{
        // console.log("onSelectDay0", item)
        let day = {
            label : toLocalDate(new Date(), "UA", false, false),
            i : 0,
            value : 0,
            date : new Date(),
        }
        if (!isDate) {
            day = this.state.daysList.filter((itemD, key) => itemD.value === item)[0]
            // console.log("onSelectDay", item, day)
        }
        else {
            day = {
                label : toLocalDate(new Date(item), "UA", false, false),
                i : 0,
                value : 0,
                date : new Date(item),
            }
            // console.log("classDate", new Date(item))
        }
        this.setState({selDate: day})
    }
    onSelectTag=item=>{
        const tag = {
            value : item
        }
        // console.log("onSelectTag", tag)
        // return
        // if (tag.value) {
            this.setState({selTag: tag})
            const json = `{
                        "id" : ${this.state.currentHomeworkID},
                        "tagid" : ${tag.value}
                    }`
            axios2('post', `${API_URL}chat/add/${this.state.currentHomeworkID}`, json)
        // }
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
        let i = dateDiff(date, new Date());
        obj = {value : dateDiff(date, new Date()), value2 : "wd1", label : new Date(date).toLocaleDateString(), date : date};

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
                        <Text style={[styles.mymMsgDateSeparatorText, {color : theme.primaryDarkColor, fontWeight : "900"}]}>
                            {toYYYYMMDD(new Date())===toYYYYMMDD(new Date(msgDate))?getLangWord("mobToday", langLibrary):toLocalDate(new Date(msgDate), "UA", false)}
                        </Text>
                    </View>
        }
    }
    onChangeText=(key, text)=>{
        console.log("onChangeText", text)
        this.setState({curMessage : text, isEdited : true})
    }
    updateMsg=(id, isDel)=>{
        // if (isDel) return
        // this.setState({isSpinner : true})
        const {localChatMessages} = this.props.tempdata
        console.log("updateMsg", this.state.curMessage)
        let json = ""
        if (!isDel)
        json = `{   "id":${id}, 
                        "message": ${JSON.stringify(this.state.curMessage)}
                        }`;
        else
        json = `{   "id":${id}, 
                        "attachment2" : null,
                        "attachment3" : null,
                        "attachment4" : null,
                        "attachment5" : null,
                        "isdel" : 1
                        }`;
        // instanceAxios().post(`${API_URL}chat/add/${id}`, json)
        axios2('post', `${API_URL}chat/add/${id}`, json)
            .then(res=>{
                this.setState({isEdited : false})
                Toast.show({
                    text: isDel?`Сообщение удалено`:`Изменения сохранены`,
                    buttonText: 'ОК',
                    position : 'bottom',
                    duration : 1500,
                    style : {marginBottom : 100}
                    // type : 'success'
                })
                console.log("Удачно записано", res.data)
                let messages = []
                if (this.props.isnew)
                    messages = localChatMessages
                else
                    messages = this.props.messages

                messages = messages.map(item=>{
                    if (res.data.id===item.id){
                        item = res.data
                    }
                    return item
                })
                this.props.onReduxUpdate("ADD_CHAT_MESSAGES", messages)
            })
            .catch(res=>{
                // this.setState({isSpinner : false})
                Toast.show({
                    text: `Ошибка записи`,
                    buttonText: 'ОК',
                    position : 'bottom',
                    duration : 1500,
                    style : {marginBottom : 100}
                    // type : 'success'
                })
                console.log("Ошибка записи", res)
            })

        console.log("UPDATE", this.state.curMessage)
    }
    updateReadedID=ID=>{
        const {classID, userID} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata

        let {stat} = this.props
        this.setState({currentMsgID : ID})
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
        // console.log('updateY:0', offsetY, chatMaxID)
        if (msgID!==null) {
            this.msgsY.set(msgID, Math.round(offsetY))
            if (chatMaxID)
                this.setState({isDone : true})
        }
        else {
            if (!chatMaxID) {
                console.log("updateY:1", offsetY, chatMaxID, msgID)
                this._scrollView.scrollTo({x: 0, y: offsetY, animated: false})
                this.setState({isDone : true})
            }
            else {
                // this._scrollView.scrollTo({x: 0, y: offsetY, animated: false})
                console.log("updateY:2", offsetY)
                this.setState({isDone: true})
                // this._scrollView.scrollTo({x: 0, y: offsetY, animated: false})

                this._scrollView.scrollToEnd()

                this.props.updateChatState('isLastMsg', false)
                this.props.setstate({isLastMsg : false})
                // this._scrollView.scrollToEnd()

            }
            this.unreadY = offsetY
            // alert("isDone")
            // this.setState({isDone: true, unreadYstate: offsetY})
        }
    }
    renderMsg=(message, i, chatMaxID, topMsgID)=>{
        const {userID, userName} = this.props.userSetup
        let {theme} = this.props.interface

        let msg = this.props.isnew?prepareMessageToFormat(message, true):JSON.parse(message)
        const urlMatches = msg.text.match(/\b(http|https)?:\/\/\S+/gi) || [];
        let { text } = msg;
        isImage = ((message.attachment3!==null)&&(message.attachment3!==undefined))

        this.i = i

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
            if ((Platform.OS === 'ios') || ((Platform.OS === 'android')&&(Platform.Version > 22))) // > 5.1
                LinkPreviews = urlMatches.map(link => <LinkPreviewEx key={"url" + i}  uri={link}/>)
            else
            LinkPreviews = null // urlMatches.map(link => <LinkPreviewEx key={"url" + i}  uri={link}/>)
        }
        let username = msg.hasOwnProperty('userID')?msg.userName:msg.senderId
        let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))&&(!(msg.hwdate===null))?msg.subjname+':'+(toLocalDate(msg.hwdate.lenght===8?dateFromYYYYMMDD(msg.hwdate):msg.hwdate, "UA", false, true)):''
        let cw = msg.hasOwnProperty('cwdate')&&(!(msg.cwdate===undefined))&&(!(msg.cwdate===null))?msg.subjname+':'+(toLocalDate(msg.cwdate.lenght===8?dateFromYYYYMMDD(msg.cwdate):msg.cwdate, "UA", false, true)):''
        let isClassWork = msg.hasOwnProperty('cwdate')
        let ownMsg = (username===userName)
        const isDel = (message.isdel===1)
        if (isDel){
            isImage = false
            hw=''
            isClassWork = false
            LinkPreview = null
        }
        // console.log("msg", i, (new Date()).toLocaleTimeString())
        const {user_id, msg_date, homework_subj_id, homework_date, classwork_subj_id, classwork_date} = message

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
                                      this.updateY((layout.y + layout.height), topMsgID===chatMaxID, null)
                                      // this.updateReadedID(msg.id)
                                  }
                                  else {
                                      // (msg.id===chatMaxID&&this.props.lastmsg)

                                          if (topMsgID===chatMaxID && chatMaxID && msg.id === chatMaxID) {
                                              // alert(3 & " " & topMsgID)
                                              console.log("topMsgID===chatMaxID: 3")
                                              if (!this.state.uploadedMessages)
                                              this.updateY((layout.y + layout.height), false, null)
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
                                            delayLongPress={300}
                                            onLongPress={user_id===userID?()=>this.onLongPressMessage(msg.id, homework_subj_id, (homework_date===undefined)?null:homework_date, msg.text, classwork_subj_id, classwork_date):null}
                >
                    <View style={{width : "100%"}}>
                    {!ownMsg?<View style={{position : "absolute", display : "flex", flexDirection : "column",
                        justifyContent : "space-around",
                        alignItems : "center",
                        width : "17%"}}>
                        <View style={{margin : 10}}>
                            <UserAvatar size="45" name={username} color={theme.secondaryColor} />
                        </View>
                        {/*<View style={{display : "flex", justifyContent : "center", marginTop : 5}}>*/}
                            {/*<Text style={msg.id?[styles.btnAddTimeDoneAvatar, {color : theme.primaryDarkColor}]:styles.btnAddTimeAvatar}>{msg.time}</Text>*/}
                        {/*</View>*/}
                    </View>:null}
                    <View key={msg.id}
                          style={!ownMsg?
                              (hw.length?[styles.msgRightSideChat, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor, backgroundColor : theme.navbarColor}]:[styles.msgRightSideChat, styles.homeworkNoBorder, {marginTop: 10, backgroundColor : theme.navbarColor}]):
                              (hw.length?[styles.msgLeftSide, {marginTop: 10, borderWidth : 2, borderColor : theme.primaryMsgColor, backgroundColor : theme.secondaryLightColor}]:[styles.msgLeftSide, {backgroundColor : theme.secondaryLightColor}, styles.homeworkNoBorder, {marginTop: 10}])}>

                        <View key={'id'+i} style={[!ownMsg?[styles.msgLeftAuthor, {borderColor : theme.primaryColor, backgroundColor : theme.primaryColor}]:{}, (msg.tagid?styles.authorBorder:'')]} >
                            {ownMsg?null:<Text style={{color : theme.primaryTextColor, fontSize : RFPercentage(2)}}>{username}
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
                                          {flex: 3, marginLeft : 20, marginTop : 5, alignItems : "center"}]}>
                                            {isDel?<View style={{display: "flex", flexDirection : "row", alignItems : "center"}}><Icon type="MaterialIcons" style={{fontSize: 20, color: theme.primaryMsgColor}} name="delete-forever"/><Text style={{color : theme.primaryMsgColor, fontSize : 12, marginTop: 0}}>{` Deleted`}</Text></View>:
                                                <Text style={{color : "#565656"}}>
                                                    {(msg.tagid&&(dateDiff(new Date(message.msg_date), new Date())>5))?msg.text.slice(0, 30)+'...':msg.text}
                                                </Text>}
                                </View>
                            </View>
                            :<View key={'msg'+i} id={"msg-text-"+i} style={[styles.msgText, {alignItems : "center"}]}>
                                {isDel?<View style={{display: "flex", flexDirection : "row", alignItems : "center"}}><Icon type="MaterialIcons" style={{fontSize: 20, color: theme.primaryMsgColor}} name="delete-forever"/><Text style={{color : theme.primaryMsgColor, fontSize : 12, marginTop: 0}}>{` Deleted`}</Text></View>:
                                    <Text style={{color : "#565656"}}>
                                        {(msg.tagid&&(dateDiff(new Date(message.msg_date), new Date())>5))?msg.text.slice(0, 30)+'...':msg.text}
                                    </Text>}
                            </View>}

                        {hw.length?<View key={'idhw'+i} style={!ownMsg?[styles.msgLeftIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]:[styles.msgLeftIshw, {color : theme.primaryTextColor, backgroundColor : theme.primaryMsgColor}]}>
                            <Text style={{color : theme.primaryTextColor, fontSize : RFPercentage(2)}}>{hw}</Text>
                        </View>:null}

                        {cw.length?<View key={'idcw'+i} style={!ownMsg?[styles.msgLeftIshw, {display : "flex", flexDirection : "row", color : theme.primaryMsgColor, backgroundColor : theme.primaryTextColor, borderWidth : 2, borderColor : theme.primaryMsgColor}]:[styles.msgLeftIshw, {display : "flex", flexDirection : "row", color : theme.primaryMsgColor, backgroundColor : theme.primaryTextColor, borderWidth : 2, borderColor : theme.primaryMsgColor}]}>
                            <Icon type="Entypo" style={{fontSize: 15, color: theme.primaryMsgColor}} name="open-book"/>
                            <Text style={{color : theme.primaryMsgColor, fontSize : RFPercentage(2)}}>{` ${cw}`}</Text>
                         </View>:null}

                        <View style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>
                            <Text style={msg.id?[styles.btnAddTimeDone, {color : theme.primaryDarkColor}]:styles.btnAddTime}>{msg.time}</Text>
                        </View>
                        {msg.tagid?<View style={{ position : "absolute", right : 3, top : -7, display : "flex", alignItems : "center"}}>
                            <View><Icon type="Entypo" style={{fontSize: 15, color: theme.primaryMsgColor}} name="pin"/>
                            </View>
                        </View>:null}
                        {/*{isClassWork?<View style={{ position : "absolute", right : 3, top : 5, display : "flex", alignItems : "center"}}>*/}
                            {/*<View><Icon type="Entypo" style={{fontSize: 15, color: theme.primaryMsgColor}} name="open-book"/>*/}
                            {/*</View>*/}
                        {/*</View>:null}*/}
                    </View>
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

        const {userID, chatTags, selectedSubjects, langLibrary, userName} = this.props.userSetup
        const {localChatMessages} = this.props.tempdata

        let {langCode, theme} = this.props.interface
        const {chatID, gotStats} = this.props.stat

        let questionText = "Здравствуйте. Оставьте, пожалуйста, своё сообщение в этом чате. " +
            "Оно автоматически будет доставлено в нашу службу поддержки и мы как можно скорее отправим Вам ответ на "
        questionText = questionText.concat(this.props.classID?"Вашу электронную почту.":"указанную Вами электронной почте.")

        let messages = []
        if (this.props.isnew) {
            messages = localChatMessages //this.props.localmessages
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
        let initialDate = this.getNextStudyDay(daysArr)[1].date;

        // Если уже готовая домашка
        if (!(this.state.curDateKey===null)) {
            initialDay = this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[1].value //'wd'+this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[0]; // this.getCurStudyDay(daysArr, new Date(this.state.curDateKey))[1].label //
            initialDate = new Date(this.state.curDateKey)
        }
        else {
            if (this.state.selDate!== null&&this.state.selDate) {
                initialDay = this.getCurStudyDay(daysArr, new Date(this.state.selDate.date))[1].value // this.state.selDate.value; // this.state.selDate.label //
                initialDate = new Date(this.state.selDate.date)
            }
        }

        // console.log("INITIALDAY", initialDay, initialDate, moment(initialDay).date())

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
            // console.log("write file", JSON.parse(this.state.previewImage).base64, JSON.parse(this.state.previewImage))
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

        // console.log("MSG_LIST", tagsArr, this.state.selTag)
        if (!messages.length) return null

        // Выберем первое непрочитанное чужое сообщение
        const chatMaxID = messages.slice(-1)[0].id
        this.maxID = chatMaxID
        const notOwnMsgs = messages.filter(item=>item.id>chatID&&item.user_id!==userID)

        const topMsgID = notOwnMsgs.length?notOwnMsgs[0].id:chatMaxID
        const today = Number((new Date()).getDay() === 0 ? 6 : ((new Date()).getDay() - 1));

        // console.log("TOP_MSG_CALC")

        // if (this.state.firstLoading&&this.state.isDone&&gotStats){
        //     this.firstLoaded(chatMaxID)
        // }
        //
        const workOptions=[
        { label: "Домашка", value: 0, imageIcon: null },
        { label: "Классная", value: 1, imageIcon: null } //images.masculino = require('./path_to/assets/img/masculino.png')
        ]
        //this.state.isDone&&gotStats?1:0
        // this.state.isDone?1:0
        // console.log("TOP_MSG_CALC", this.state.isDone, gotStats)
        // if (!this.state.isDone)
        //     return <View style={{   width : Dimensions.get("window").width,
        //                             height : Dimensions.get("window").height,
        //                             backgroundColor : theme.primaryTextColor,
        //                             display : "flex",
        //                             alignItems : "center",
        //                             justifyContent : "center"
        //     }}></View>
        return (
            <View style={{opacity : this.state.isDone?1:0}}>
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
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color : theme.primaryTextColor}}>
                                {getLangWord("mobSubject", langLibrary).toUpperCase()}
                                </Text></TabHeading>}>
                                <View style={{width : "90%", marginTop : 5, marginBottom : 5, marginLeft : "5%", marginRight : "5%"}}>
                                        <RadioForm
                                            formHorizontal={true}
                                            animation={false}
                                            style={{backgroundColor : "#fff", display : "flex",
                                                    flexDirection : "row", borderRadius : 15
                                                // , borderColor : "#00f", borderWidth : 1,

                                            }}
                                        >
                                            <View style={{backgroundColor : theme.primaryColor, display : "flex",
                                                flexDirection : "row", borderRadius : 15, width : "100%",
                                                alignItems : "center", justifyContent : "space-around"}}>
                                            {workOptions.map((obj, i)=>{
                                                return <RadioButton labelHorizontal={true} key={i}>
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={this.state.workType === i}
                                                        onPress={value => this.setState({ workType: value })}
                                                        borderWidth={1}
                                                        buttonInnerColor={theme.primaryTextColor}
                                                        buttonOuterColor={theme.primaryTextColor}
                                                        buttonSize={15}
                                                        buttonOuterSize={19}
                                                        buttonStyle={{}}
                                                        buttonWrapStyle={{marginLeft: 10, marginTop: 15, marginBottom : 10}}
                                                    />
                                                    <RadioButtonLabel
                                                        obj={obj}
                                                        index={i}
                                                        labelHorizontal={true}
                                                        onPress={value => this.setState({ workType: value })}
                                                        labelStyle={{
                                                            fontSize: RFPercentage(3),
                                                            color: theme.primaryTextColor
                                                        }}
                                                        labelWrapStyle={{marginTop: 15, marginBottom : 10}}
                                                    />
                                                </RadioButton>

                                            })}
                                            </View>
                                        </RadioForm>


                                    {/*<SwitchSelector*/}
                                    {/*initial={this.state.workType}*/}
                                    {/*onPress={value => this.setState({ workType: value })}*/}
                                    {/*textColor={theme.primaryColor} //'#7a44cf'*/}
                                    {/*selectedColor={theme.primaryDarkColor}*/}
                                    {/*buttonColor={theme.primaryColor}*/}
                                    {/*borderColor={theme.primaryColor}*/}
                                    {/*hasPadding*/}
                                    {/*options={[*/}
                                        {/*{ label: "Домашка", value: 0, imageIcon: null }, //images.feminino = require('./path_to/assets/img/feminino.png')*/}
                                        {/*{ label: "Классная", value: 1, imageIcon: <Icon type="Entypo" style={{fontSize: 15, color: theme.primaryMsgColor}} name="open-book"/> } //images.masculino = require('./path_to/assets/img/masculino.png')*/}
                                    {/*]}*/}
                                {/*/>*/}
                                </View>
                                <ScrollView style={styles.homeworkSubjectList}>
                                     <RadioForm
                                        formHorizontal={false}
                                        animation={false}
                                        style = {{backgroundColor : "#fff"}}
                                     >
                                        {
                                            subjects.map((obj, i) => {

                                                let nextDay = this.state.checkTimetable?this.getNextSubjDayInTimetable(obj.value, today):null
                                                if (nextDay!==null&&!this.state.workType){
                                                    obj.label = `${obj.label} ${getLangWord("mobTo", langLibrary)} ${nextDay.label}`
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
                                                        buttonOuterColor={theme.primaryDarkColor}
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
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color : theme.primaryTextColor}}>
                                {getLangWord("mobWhen", langLibrary).toUpperCase()}
                                </Text></TabHeading>}>
                                <ScrollView style={styles.homeworkSubjectList}>
                                    {this.state.workType?
                                        <CalendarPicker
                                            ref={ref => this._calendarPicker = ref}
                                            selectedStartDate={moment(initialDate)}
                                            startFromMonday={true}
                                            weekdays={arrOfWeekDaysLocal}
                                            months={["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"]}
                                            previousTitle={"Пред"}
                                            nextTitle={"След"}
                                            todayBackgroundColor={theme.primaryDarkColor}
                                            todayTextStyle={{color : theme.primaryTextColor}}
                                            selectedDayColor={theme.primaryColor}
                                            onDateChange={(item) => this.onSelectDay(item, true)}
                                        />
                                     :
                                    <RadioForm
                                        formHorizontal={false}
                                        animation={false}
                                        style = {{backgroundColor : "#fff"}}>
                                        {
                                            this.state.daysList.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} >
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={initialDay === i}
                                                        onPress={(item) => this.onSelectDay(item, false)}
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
                                                        onPress={(item) => this.onSelectDay(item, false)}
                                                        labelStyle={{fontSize: RFPercentage(2.5), color: theme.primaryDarkColor}}
                                                        labelWrapStyle={{marginTop : i===0? 20: 5}}
                                                    />
                                                </RadioButton>
                                            ))
                                         }
                                    </RadioForm>
                                     }
                                </ScrollView>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                                {getLangWord("mobChange", langLibrary).toUpperCase()}
                                </Text></TabHeading>}>
                                <View>
                                        <Textarea style={styles.msgUpdateTextarea}
                                                  onChangeText={text=>this.onChangeText('curMessage', text)}
                                                  placeholder={getLangWord("mobChangeText", langLibrary)}  type="text"
                                                  ref={input=>{this.inputMessage=input}}
                                                  value={this.state.curMessage}
                                        />
                                    <TouchableOpacity
                                        onPress={()=>{//this.updateMsg(this.state.currentHomeworkID, false);
                                        this.setModalVisible(!this.state.modalVisible, true, false);
                                        this.setState({activeSubTab : 0});}}>
                                        <View style={styles.updateMsg}>
                                            <Text style={this.state.isEdited?styles.updatedMsgText:styles.updateMsgText} >
                                                {this.state.isEdited?getLangWord("mobSaveChanges", langLibrary).toUpperCase():getLangWord("mobChangeTextUpper", langLibrary).toUpperCase()}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{marginTop : 50}}
                                        onPress={()=>{//this.updateMsg(this.state.currentHomeworkID, true);
                                        this.setModalVisible(!this.state.modalVisible, true, true);
                                        this.setState({activeSubTab : 0});}}>
                                        <View style={[styles.updateMsg, {backgroundColor : theme.primaryDarkColor, color : theme.primaryTextColor}]}>
                                            <Text style={[styles.deleteMsgText, {backgroundColor : theme.primaryDarkColor}]}>
                                                {getLangWord("mobDeleteMsg", langLibrary).toUpperCase()}
                                                </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                                {getLangWord("mobTags", langLibrary).toUpperCase()}
                                </Text></TabHeading>}>
                                <View style={styles.homeworkSubjectList}>
                                    {this.state.activeSubTab<2?
                                        <ListItem style={[styles.modalHeader, {margin : 0}]}>
                                            <Text style={[styles.modalHeaderText, {color : theme.secondaryDarkColor}]}>
                                                {this.state.selSubject.value?this.state.selSubject.label:null}
                                                {this.state.selDate.value>-3?` ${getLangWord("mobTo", langLibrary)} ${this.state.selDate.label!==undefined?this.state.selDate.label:(this.state.hwOnDate!==null?toLocalDate(new Date(this.state.hwOnDate), "UA", false, false):toLocalDate(new Date(), "UA", false, false))}`:null}
                                            </Text>
                                        </ListItem>:null}
                                    {/*<RadioForm*/}
                                        {/*dataSource={tagsArr}*/}
                                        {/*itemShowKey="label"*/}
                                        {/*itemRealKey="value"*/}
                                        {/*circleSize={16}*/}
                                        {/*formHorizontal={false}*/}
                                        {/*labelHorizontal={true}*/}
                                        {/*onPress={(item) => this.onSelectTag(item)}*/}
                                    {/*/>*/}
                                    <RadioForm
                                        formHorizontal={false}
                                        animation={false}>
                                        {
                                            tagsArr.map((obj, i) => (
                                                <RadioButton labelHorizontal={true} key={i} >
                                                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                                                    <RadioButtonInput
                                                        obj={obj}
                                                        index={i}
                                                        isSelected={obj.value===this.state.selTag.value}
                                                        onPress={(item) => this.onSelectTag(item)}
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
                                                        onPress={(item) => this.onSelectTag(item)}
                                                        labelStyle={{fontSize: RFPercentage(2.5), color: theme.primaryDarkColor}}
                                                        labelWrapStyle={{marginTop : i===0? 20: 5}}
                                                    />
                                                </RadioButton>
                                            ))
                                        }
                                    </RadioForm>
                                </View>
                            </Tab>
                        </Tabs>
                        {this.state.activeSubTab<2?
                        <ListItem style={[styles.modalHeader, {margin : 0, borderTopWidth : .5, borderTopColor : theme.primaryColor, borderBottomWidth : .5, borderBottomColor : theme.primaryColor}]}>
                            <Text style={[styles.modalHeaderText, {color : theme.primaryDarkColor}]}>
                                {this.state.selSubject.value?this.state.selSubject.label:null}
                                {this.state.selDate.value>-3?` ${getLangWord("mobTo", langLibrary)} ${this.state.selDate.label!==undefined?this.state.selDate.label:(this.state.hwOnDate!==null?toLocalDate(new Date(this.state.hwOnDate), "UA", false, false):toLocalDate(new Date(), "UA", false, false))}`:null}
                            </Text>
                        </ListItem>:null}
                        {this.state.activeSubTab<2?
                        <ListItem className={[styles.editHomeworkCheckbox, {margin : 0, borderTopWidth : .5, borderTopColor : theme.primaryColor}]}>
                            <CheckBox checked={this.state.checkTimetable} onPress={()=>{this.saveCredentials(!this.state.checkTimetable)}} color={theme.primaryDarkColor}/>
                            <Body>
                                <Text>{`  ${getLangWord("mobConsiderTimetable", langLibrary)}`}</Text>
                            </Body>
                        </ListItem>:null}
                        <Footer style={styles.header}>
                            <FooterTab style={styles.header}>
                                <Button style={this.state.selSubject.value&&this.state.selDate.value>-3?{backgroundColor : theme.primaryColor, padding : 20}:styles.btnHomeworkDisabled} vertical
                                        onPress={this.state.selSubject.value&&this.state.selDate.value>-3?()=>{this.setState({activeSubTab : 0});this.setModalVisible(!this.state.modalVisible, true)}:()=>this.setState({activeSubTab : 0})}>
                                    <Text style={{color : theme.primaryTextColor, height : "100%", marginTop : 12, flex : 1, alignItems: "center", justifyContent : "center"}}>
                                        {getLangWord("mobAdd", langLibrary).toUpperCase()}
                                        </Text>
                                </Button>
                                <Button style={[styles.btnClose, {backgroundColor : theme.primaryColor}]} vertical
                                        onPress={()=>{this.setModalVisible(!this.state.modalVisible, false);this.setState({activeSubTab : 0});}}>
                                    <Text style={{color : theme.primaryTextColor}}>{getLangWord("mobCancel", langLibrary).toUpperCase()}</Text>
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
                    {/*<Text>{`Done: ${this.i} from ${messages.length}`}</Text>*/}
                    <TouchableOpacity onPress={()=>{this.setState({firstMsgDate : addDay(this.state.firstMsgDate, -7), uploadedMessages : true}); this.props.loadmessages(addDay(this.state.firstMsgDate, -7))}}>
                        <View style={[styles.mymMsgAddSeparator, {backgroundColor : theme.primaryLightColor, borderWidth : 5, borderColor : theme.primaryLightColor, borderRadius: 20}]}>
                            <Text style={[styles.mymMsgDateSeparatorText, {color : theme.primaryTextColor, fontWeight : "900"}]}>
                                {getLangWord("mobAddMessages", langLibrary)}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {messages.length?
                        messages.map((message, i) =>{
                                return this.renderMsg(message, i, chatMaxID, topMsgID)
                            }
                        ):null}

                    {
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

                </ScrollView>
                </Viewport.Tracker>
                <TouchableOpacity
                    style={{ borderWidth:1,
                        borderColor:    theme.primaryColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width:50,
                        height:50,
                        backgroundColor: theme.primaryColor,
                        opacity : .6,
                        borderRadius: 50,
                        position : "absolute",
                        bottom : 80,
                        right : 20,
                        zIndex : 21,
                    }}
                    delayLongPress={300}
                    onLongPress={()=>{this._scrollView.scrollTo({x: 0, y: 0, animated: false})}}
                >
                    <Icon
                        name='ios-arrow-up'
                        type='Ionicons'
                        color={theme.primaryDarkColor}
                        size={50}
                    />
                    <View style={{position : "absolute", right : 7, top : 5, fontSize : RFPercentage(1.2), color : theme.secondaryColor}}>
                        <Text style={{fontSize : RFPercentage(1.7), fontWeight : "800", color : theme.primaryDarkColor, opacity : 1}}>{messages.filter(item=>item.id<this.state.currentMsgID).length}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ borderWidth:1,
                        borderColor:    theme.primaryColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width:50,
                        height:50,
                        backgroundColor: theme.primaryColor,
                        opacity : .6,
                        borderRadius: 50,
                        position : "absolute",
                        bottom : 20,
                        right : 20,
                        zIndex : 21,
                    }}
                    delayLongPress={300}
                    onLongPress={()=>{this._scrollView.scrollToEnd()}}
                >
                    <Icon
                        name='ios-arrow-down'
                        type='Ionicons'
                        color={theme.primaryDarkColor}
                        size={50}
                    />
                    <View style={{position : "absolute", right : 7, bottom : 7, fontSize : RFPercentage(1.2), color : theme.secondaryColor}}>
                        <Text style={{fontSize : RFPercentage(1.7), fontWeight : "800", color : theme.primaryDarkColor, opacity : 1}}>{messages.filter(item=>item.id>this.state.currentMsgID).length}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageList)