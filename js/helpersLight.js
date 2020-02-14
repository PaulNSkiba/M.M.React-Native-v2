/**
 * Created by Paul on 27.08.2019.
 */
import store from '../store/configureStore'
import axios from 'axios';
import {Platform} from 'react-native'
import {AUTH_URL, API_URL, BASE_HOST, WEBSOCKETPORT, LOCALPUSHERPWD} from '../config/config'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js/react-native'
import AsyncStorage from '@react-native-community/async-storage';
import SInfo from "react-native-sensitive-info";

window.Pusher = Pusher

export let arrOfWeekDays = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
export let arrOfWeekDaysLocal = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
export const msgTimeOut = 4000

export const addDay=(strDate, intNum)=>{
    let sdate =  new Date(strDate);
    sdate.setDate(sdate.getDate()+intNum);
    return new Date(sdate.getFullYear(), sdate.getMonth(), sdate.getDate());
}

export const setStorageData = async (key, value) => {
    try {
        if (Platform.OS !== 'ios')
        await AsyncStorage.setItem(key, JSON.stringify(value))
        // await SInfo.setItem(key, value, {})
    } catch (e) {
        console.log("StorageSet:Error", e)
        // saving error
    }
}
export const getStorageData = async (key) => {
    try {
        // if (Platform.OS !== 'ios') {
            const value = await AsyncStorage.getItem(key)
            // const value = await SInfo.getItem(key, {})
            if (value !== null) {
                return JSON.parse(value)
            }
            // else
            //     return null
        // }
    } catch(e) {
        console.log("StorageGet:Error", e)
    }
}
export const instanceAxios=()=>{
    let {token} = store.getState().userSetup
    token = token===null?'':token
    // console.log("instanceAxios", token.length, store.getState())
    return (axios.create({
        baseURL: AUTH_URL + '/api/',
        timeout: 0,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
        }
    }));
};
export const axios2=(method, url, data)=>{
    let {token} = store.getState().userSetup
    token = token===null?'':token
    return (axios({
        method: `${method}`,
        url: `${url}`,
        data : `${data}`,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
        }
    }))
}
export const mapStateToProps = ({user, userSetup, chat, network, stat, interFace, saveddata, tempdata})=>
    ({ user : user, userSetup : userSetup, chat : chat, network : network,
        stat : stat, interface : interFace, saveddata : saveddata, tempdata : tempdata });

// export const mapStateToProps = store => {
//     console.log("STORE", store) // посмотрим, что же у нас в store?
//     return {
//         user:       store.user,
//         userSetup:  store.userSetup,
//         chat :      store.chat,
//     }
// }
export const getNextStudyDay = arr => {
    let i = 0;
    obj = {index : 0};
    arr.forEach((item, index) => {
        if (item.value > 0 && i === 0) {
            i = index;
            obj = item;
            obj.index = i
        }
    })
    return [i, obj]
}

export function dateFromYYYYMMDD(str) {
    str = str.replace('-','')
    const   yyyy = str.substr(0, 4),
        mm = str.substr(4, 2),
        dd = str.substr(6, 2)
    // console.log("dateFromYYYYMMDD", yyyy, mm, dd)
    return new Date(Number(yyyy), Number(mm) -1, Number(dd))
}

export const prepareMessageToFormat=(msg, returnObject)=>{
    let obj = {}
    obj.senderId = msg.user_name
    obj.text = msg.message
    obj.time = msg.msg_time
    obj.userID = msg.user_id
    obj.userName = msg.user_name
    obj.uniqid = msg.uniqid
    // obj.msg_date = new Date(msg.msg_date)
    obj.attachment1 = msg.attachment1
    obj.attachment2 = msg.attachment2
    obj.attachment3 = msg.attachment3
    obj.attachment4 = msg.attachment4
    obj.attachment5 = msg.attachment5
    obj.tagid = msg.tagid
    if (msg.hasOwnProperty('homework_date')) {
        if (!(msg.homework_date === null)) {
            obj.hwdate = new Date(msg.homework_date.length===8?dateFromYYYYMMDD(msg.homework_date):msg.homework_date)
            obj.subjkey = msg.homework_subj_key
            obj.subjname = msg.homework_subj_name
            obj.subjid = msg.homework_subj_id
        }
    }
    if (msg.hasOwnProperty('classwork_date')) {
        if (!(msg.classwork_date === null)) {
            obj.cwdate = new Date(msg.classwork_date.length===8?dateFromYYYYMMDD(msg.classwork_date):msg.classwork_date)
            obj.subjkey = msg.classwork_subj_key
            obj.subjname = msg.classwork_subj_name
            obj.subjid = msg.classwork_subj_id
        }
    }
    obj.id = msg.id
    //"{"senderId":"my-marks","text":"выучить параграф 12","time":"14:59","userID":209,"userName":"Menen",
    // "hwdate":"2019-07-16T21:00:00.000Z","subjkey":"#lngukr","subjname":"Українська мова"}"
    // console.log('obj', JSON.stringify(obj))
    return returnObject?obj:JSON.stringify(obj)
}
export function toYYYYMMDD(d) {
    const   yyyy = d.getFullYear().toString(),
        mm = (d.getMonth() + 101).toString().slice(-2),
        dd = (d.getDate() + 100).toString().slice(-2)
    return yyyy + mm + dd;
}
export function dateFromTimestamp(timestamp) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    let t = timestamp.split(/[- :]/);
// Apply each element to the Date function
    return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));


// -> Wed Jun 09 2010 14:12:01 GMT+0100 (BST)
}
export const getGeo2 = () => {
        axios.get(`${API_URL}getgeo`)
            .then(response =>response.data)
            .catch(response => {
                let obj = {}
                obj.city = "Kyiv"
                obj.country = "Ukraine"
                obj.iso_code = "UA"
                return obj
            })
    }

export function toLocalDate(d, countryCode, withTime, withOutYear) {
    const   yyyy = d.getFullYear().toString().slice(-2),
            mm = (d.getMonth() + 101).toString().slice(-2),
            dd = (d.getDate() + 100).toString().slice(-2),
            hh = (d.getHours() + 100).toString().slice(-2),
            mi = (d.getMinutes() + 100).toString().slice(-2)
    let date = '', time = ''

    // console.log("toLocalDate", `${dd}/${mm}/${yyyy}${withTime?(' ' +hh+':'+mi):""}`)
    switch (countryCode) {
        case 'UA':
            date = withOutYear?`${dd}/${mm}`:`${dd}/${mm}/${yyyy}`
            if (withTime)
                return date + ' ' + `${hh}:${mi}`
            else
                return date
            break;
        default :
            date = withOutYear?`${dd}/${mm}`:`${dd}/${mm}/${yyyy}`
            if (withTime)
                return date + ' ' + `${hh}:${mi}`
            else
                return date
            break;
    }
}
export function dateDiff(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
export const echoClient = (token, chatSSL) => {
    return new Echo(
        {
            broadcaster: 'pusher',
            key: LOCALPUSHERPWD,
            cluster: 'mt1',
            wsHost: BASE_HOST,
            wsPort: WEBSOCKETPORT,
            wssPort: WEBSOCKETPORT,
            disableStats: true,
            enabledTransports: chatSSL ? ['ws', 'wss'] : ['ws'],
            encrypted: chatSSL,
            authEndpoint: AUTH_URL + '/broadcasting/auth',
            namespace: "App.Events",
            auth: {
                headers: {
                    'V-Auth': true,
                    Authorization: `Bearer ${token}`,
                }
            }
        }
    )
}
export const daysList=()=>{
    let daysArr = []
    for (let i = -2; i < 8; i++) {
        let obj = {}
        obj.id = i
        obj.name = dateString(addDay(new Date(), i)) + ' (' + ('0'+ addDay(new Date(), i).getDate()).slice(-2) +'.' + ('0' + (addDay(new Date(), i).getMonth() + 1)).slice(-2) + ')'
        obj.nameEx = dateString(addDay(new Date(), i))
        obj.dateEx = ('0'+ addDay(new Date(), i).getDate()).slice(-2) +'.' + ('0' + (addDay(new Date(), i).getMonth() + 1)).slice(-2)
        obj.date = addDay(new Date(), i)
        if (addDay(new Date(), i).getDay()) {
            daysArr.push(obj)
        }
    }
    return daysArr
    // console.log("daysArr", daysArr)
}
const dateString = curDate => {
    let datediff = dateDiff((new Date()), curDate)+2;
    let daysArr = ["Позавчера","Вчера","Сегодня","Завтра","Послезавтра"]
    // Date.prototype.getWeek = function() {
    //     let onejan = new Date(this.getFullYear(),0,1);
    //     return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
    // }
    // console.log("datediff", datediff, curDate);
    if (datediff>=0&&datediff<5)
        return daysArr[datediff].toUpperCase();
    else {
        // console.log("getWeek", curDate, getWeek(curDate), getWeek(new Date()))

        if ((getWeek(curDate) - getWeek(new Date()))>=0)
        {
            if (getWeek(new Date()) === getWeek(curDate)) {
                return arrOfWeekDays[curDate.getDay()].toUpperCase() + ' [эта.нед.]'
            }
            else {
                if ((getWeek(new Date()) + 1) === getWeek(curDate)) {
                    return arrOfWeekDays[curDate.getDay()].toUpperCase() + ' [след.нед.]'
                }
                else {
                    return arrOfWeekDays[curDate.getDay()].toUpperCase() + '  +' + (getWeek(curDate) - getWeek(new Date())) +' нед.'
                }
            }
        }
        else {
            return arrOfWeekDays[curDate.getDay()].toUpperCase() + '  ' + (getWeek(curDate) - getWeek(new Date())) +'нед.'
        }

    }
}
const getWeek = (curDate) => {
    const now = new Date(curDate)
    const firstJan = new Date(now.getFullYear(),0,1)
    return Math.ceil((((now - firstJan) / 86400000) + firstJan.getDay())/7)
}
export const addMonths= (dateObject, numberMonths) => {
    let day = dateObject.getDate(); // returns day of the month number

    // avoid date calculation errors
    dateObject.setHours(20);

    // add months and set date to last day of the correct month
    dateObject.setMonth(dateObject.getMonth() + numberMonths + 1, 0);

    // set day number to min of either the original one or last day of month
    dateObject.setDate(Math.min(day, dateObject.getDate()));

    return dateObject;
};
export const getNearestSeptFirst=()=>{
    let now = new Date()
    for (let i = 0; i < 367; i++){
        now = addDay(now, -1)
        if (now.getMonth() === 8 && now.getDate() === 1) {
            return now;
            }
        }
}
export const themeOptions = {
    '#46b5be' : {
        primaryColor : '#47b5be',
        primaryLightColor : '#9bd7dc',
        primaryDarkColor : '#007ba4',
        primaryBorderColor : '#6ddce5',
        secondaryColor : '#ffc909',
        secondaryLightColor : '#fff674',
        secondaryDarkColor : '#faa41b',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#007ba4',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#007ba4',
        googleColor : '#fff674',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#4f83cc' : {
        primaryColor : '#01579b',
        primaryLightColor : '#4f83cc',
        primaryDarkColor : '#002f6c',
        primaryBorderColor : '#609EF7',
        secondaryColor : '#d4d4d4',
        secondaryLightColor : '#EEEEEE',
        secondaryDarkColor : '#b1b1b1',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#002f6c',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1d75ce',
        googleColor : '#70dffb',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#a3afbf' : {
        primaryColor : '#a3afbf',
        primaryLightColor : '#c4ddf2',
        primaryDarkColor : '#3f4d59',
        primaryBorderColor : '#3f4d59',
        secondaryColor : '#f2ddd0',
        secondaryLightColor : '#FFF3E7',
        secondaryDarkColor : '#d9c0da',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#3f4d59',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#3f4d59',
        googleColor : '#f2ddd0',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#1f7363' : {
        primaryColor : '#1f7363',
        primaryLightColor : '#8fbf8e',
        primaryDarkColor : '#1e5959',
        primaryBorderColor : '#8fbf8e',
        secondaryColor : '#5fb491',
        secondaryLightColor : '#cbe4e5',
        secondaryDarkColor : '#889f9f',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#1e5959',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1e5959',
        googleColor : '#cbe4e5',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#8fbf8e' : {
        primaryColor : '#8fbf8e',
        primaryLightColor : '#bad9d9',
        primaryDarkColor : '#1e5959',
        primaryBorderColor : '#1e5959',
        secondaryColor : '#1f7363',
        secondaryLightColor : '#c8e4e5',
        secondaryDarkColor : '#889f9f',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#1e5959',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1e5959',
        googleColor : '#cbe4e5',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#a2bfbe' : {
        primaryColor : '#a2bfbe',
        primaryLightColor : '#dae6e4',
        primaryDarkColor : '#425c59',
        primaryBorderColor : '#425c59',
        secondaryColor : '#ffcea3',
        secondaryLightColor : '#ffeec6',
        secondaryDarkColor : '#555c5a',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#555c5a',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#555c5a',
        googleColor : '#ffcea3',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#7DA8E6' : {
        primaryColor : '#7DA8E6',
        primaryLightColor : '#DEEAF2',
        primaryDarkColor : '#4472C4',
        primaryBorderColor : '#BEEBF2',
        secondaryColor : '#33ccff',
        secondaryLightColor : '#d5fdfc',
        secondaryDarkColor : '#1890e6',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#0084ff',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1d75ce',
        googleColor : '#70dffb',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
};
export const themeOptionsEx = {
    'marks' : {
        excelMarkTextColor : '#387541',
            excelMarkColor : '#87DD97',
            goodMarkColor : '#C6EFCE',
            normMarkTextColor : '#d87b38',
            normMarkColor : '#FFEB9C',
            badMarkTextColor : '#C00000',
            badMarkColor : '#FF8594',
            eraseMarkColor : '#d4d4d4',
    },
    '#2fbe74': {
        pri50: '#e4f6eb',
            pri500: '#00b25c',
            pri700: '#009145',
            pri800: '#007f39',
            sec700: '#be2f79',
            sec900: '#802764',
    },
    '#8b50da': {
        pri50: '#f0e7fa',
            pri500: '#752dd3',
            pri700: '#5d1ec4',
            pri800: '#4f17bd',
            sec700: '#679f00',
            sec900: '#256b00',
    },
    '#f69400': {
        pri50: '#fef2e0',
            pri500: '#f28800',
            pri700: '#e66900',
            pri800: '#dd4f00',
            sec700: '#0062f6',
            sec900: '#203ed7',
    },
    '#000000': {
        pri50: '#f5f5f5',
            pri500: '#555555',
            pri700: '#262626',
            pri800: '#000000',
            sec700: '#434343',
            sec900: '#000000',
    },
    '#46b5be' : {
        primaryColor : '#46b5be',
        primaryLightColor : '#9dd7db',
        primaryDarkColor : '#006699',
        primaryBorderColor : '#6ddce5',
        secondaryColor : '#ffcd57',
        secondaryLightColor : '#fff674',
        secondaryDarkColor : '#e3c177',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#0084ff',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1d75ce',
        googleColor : '#70dffb',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#01579b' : {
        primaryColor : '#01579b',
        primaryLightColor : '#4f83cc',
        primaryDarkColor : '#002f6c',
        primaryBorderColor : '#609EF7',
        secondaryColor : '#ffeb3b',
        secondaryLightColor : '#fffcd2',
        secondaryDarkColor : '#c8b900',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#0084ff',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1d75ce',
        googleColor : '#70dffb',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#7DA8E6' : {
        primaryColor : '#7DA8E6',
        primaryLightColor : '#DEEAF2',
        primaryDarkColor : '#4472C4',
        primaryBorderColor : '#BEEBF2',
        secondaryColor : '#33ccff',
        secondaryLightColor : '#d5fdfc',
        secondaryDarkColor : '#1890e6',
        primaryTextColor : '#ffffff',
        secondaryTextColor : '#000000',
        primaryMsgColor : '#0084ff',
        borderColor : "#A9A9A9",
        navbarColor : "#f0f0f0",
        facebookColor : '#1d75ce',
        googleColor : '#70dffb',
        photoButtonColor : '#33ccff',
        errorColor : "#b40530",
    },
    '#425c59' : {
        primaryColor: '#425c59',
        primaryLightColor: '#a2bfbe',
        primaryDarkColor: '#555c5a',
        primaryBorderColor: '#a2bfbe',
        secondaryColor: '#ffcea3',
        secondaryLightColor: '#ffffff',
        secondaryDarkColor: '#555c5a',
        primaryTextColor: '#ffffff',
        secondaryTextColor: '#000000',
        primaryMsgColor: '#555c5a',
        borderColor: "#A9A9A9",
        navbarColor: "#f0f0f0",
        facebookColor: '#555c5a',
        googleColor: '#ffcea3',
        photoButtonColor: '#33ccff',
        errorColor: "#b40530",
    }
}

export async function hasAPIConnection() {
    const timeout = 2500
    try {
            return await new Promise((resolve, reject) => {
                setTimeout(() => {reject(false)}, timeout)
                fetch(`${AUTH_URL}/ping`, {method: 'GET'})
                    .then((response) => {resolve(true)})
                    .catch(() => {reject(false)})
            })
    } catch (e) {
        // console.log('error', e)
        return false
    }
}
export function getViewStat(classID){
    // await setStorageData(`${classID}chatID`,"0")
    // await setStorageData(`${classID}tagID`,"0")
    // setStorageData(`${classID}markID`,"0")
    // setStorageData(`${classID}newsID`,"0")
    // setStorageData(`${classID}buildsID`,"0")
    // setStorageData(`${classID}QandAID`,"0")
    // setStorageData(`${classID}budgetID`,"0")
    // setStorageData(`${classID}statID`,"0")

    getStorageData(`${classID}labels`)
        .then(labels=> {
            let obj = {}
            try {
                obj = JSON.parse(labels)
            }
            catch (res) {
                obj = {}
            }
            let chatID = 0, tagID = 0, markID = 0, newsID = 0, buildsID = 0, QandAID = 0, budgetID = 0,
                statID = 0, chats = [], tags = [], marks = [], news = [], builds = [], QandAs = []

            console.log("LABELS", labels, Object.keys(obj).length)
            if (Object.keys(obj).length) {
                chatID = obj.chatID
                tagID = obj.tagID
                markID = obj.markID
                newsID = obj.newsID
                buildsID = obj.buildsID
                QandAID = obj.QandAID
                budgetID = obj.budgetID
                statID = obj.statID
                chats = obj.chats
                tags = obj.tags
                marks = obj.marks
                news = obj.news
                builds = obj.builds
                QandAs = obj.QandAs
            }
            // else {
            //     const chatID = 0
            //     const tagID = 0
            //     const markID = 0
            //     const newsID = 0
            //     const buildsID = 0
            //     const QandAID = 0
            //     const budgetID = 0
            //     const statID = 0
            //     const chats = []
            //     const tags = []
            //     const marks = []
            //     const news = []
            //     const builds = []
            //     const QandAs = []
            //  }

            // Promise
            //     .all(getStorageData(`${classID}chatID`),
            // getStorageData(`${classID}tagID`),
            // getStorageData(`${classID}markID`),
            // getStorageData(`${classID}newsID`),
            // getStorageData(`${classID}buildsID`),
            // getStorageData(`${classID}QandAID`),
            // getStorageData(`${classID}budgetID`),
            // getStorageData(`${classID}statID`),
            // getStorageData(`${classID}chats`),
            // getStorageData(`${classID}tags`),
            // getStorageData(`${classID}marks`),
            // getStorageData(`${classID}news`),
            // getStorageData(`${classID}builds`),
            // getStorageData(`${classID}QandAs`))
            //     .then(res=>console.log("GetStatData", res))

            // const chatID = getStorageData(`${classID}chatID`)
            // const tagID = getStorageData(`${classID}tagID`)
            // const markID = getStorageData(`${classID}markID`)
            // const newsID = getStorageData(`${classID}newsID`)
            // const buildsID = getStorageData(`${classID}buildsID`)
            // const QandAID = getStorageData(`${classID}QandAID`)
            // const budgetID = getStorageData(`${classID}budgetID`)
            // const statID = getStorageData(`${classID}statID`)
            // const chats = getStorageData(`${classID}chats`)
            // const tags = getStorageData(`${classID}tags`)
            // const marks = getStorageData(`${classID}marks`)
            // const news = getStorageData(`${classID}news`)
            // const builds = getStorageData(`${classID}builds`)
            // const QandAs = getStorageData(`${classID}QandAs`)

            // console.log("getViewStat", chatID, tagID, markID, newsID, buildsID)

            console.log("getViewStat2", Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
                Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
                Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
                Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
                Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID))

            return {
                chatID: Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
                tagID: Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
                markID: Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
                newsID: Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
                buildsID: Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID),
                QandAID: Number(Number.isNaN(Number(QandAID)) ? 0 : QandAID === null ? 0 : QandAID),
                chats: chats, tags: tags, marks: marks, news: news,
                builds: builds, QandAs: QandAs, gotStats : true
            }
        })
    .catch(res=>{
            const chatID = 0
            const tagID = 0
            const markID = 0
            const newsID = 0
            const buildsID = 0
            const QandAID = 0
            const budgetID = 0
            const statID = 0
            const chats = []
            const tags = []
            const marks = []
            const news = []
            const builds = []
            const QandAs = []
        return {
            chatID: Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
            tagID: Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
            markID: Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
            newsID: Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
            buildsID: Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID),
            QandAID: Number(Number.isNaN(Number(QandAID)) ? 0 : QandAID === null ? 0 : QandAID),
            chats: chats, tags: tags, marks: marks, news: news,
            builds: builds, QandAs: QandAs
        }
    })
}

export function getViewStatStart(classID){
    return new Promise((resolve, reject) => {
        // console.log("LABELS:start", (new Date()).toLocaleTimeString())
        getStorageData(`${classID}labels`)
            .then(labels => {
                let obj = {}
                try {
                    obj = JSON.parse(labels)
                }
                catch (res) {
                    obj = {}
                }
                let chatID = 0, tagID = 0, markID = 0, newsID = 0, buildsID = 0, QandAID = 0, budgetID = 0,
                    statID = 0, chats = [], tags = [], marks = [], news = [], builds = [], QandAs = []

                // console.log("LABELS:end", (new Date()).toLocaleTimeString())
                if (Object.keys(obj).length) {
                    chatID = obj.chatID
                    tagID = obj.tagID
                    markID = obj.markID
                    newsID = obj.newsID
                    buildsID = obj.buildsID
                    QandAID = obj.QandAID
                    budgetID = obj.budgetID
                    statID = obj.statID
                    chats = obj.chats
                    tags = obj.tags
                    marks = obj.marks
                    news = obj.news
                    builds = obj.builds
                    QandAs = obj.QandAs
                }

                console.log("getViewStat2", Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
                    Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
                    Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
                    Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
                    Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID))

                resolve ( {
                    chatID: Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
                    tagID: Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
                    markID: Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
                    newsID: Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
                    buildsID: Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID),
                    QandAID: Number(Number.isNaN(Number(QandAID)) ? 0 : QandAID === null ? 0 : QandAID),
                    chats: chats, tags: tags, marks: marks, news: news, builds: builds, QandAs: QandAs, gotStats: true,
                    chatCnt : 0, tagCnt : 0, markCnt : 0, newsCnt : 0, buildsCnt : 0, QandACnt : 0
                })
            })
            .catch(res => {
                const chatID = 0
                const tagID = 0
                const markID = 0
                const newsID = 0
                const buildsID = 0
                const QandAID = 0
                const budgetID = 0
                const statID = 0
                const chats = []
                const tags = []
                const marks = []
                const news = []
                const builds = []
                const QandAs = []
                reject( {
                    chatID: Number(Number.isNaN(Number(chatID)) ? 0 : chatID === null ? 0 : chatID),
                    tagID: Number(Number.isNaN(Number(tagID)) ? 0 : tagID === null ? 0 : tagID),
                    markID: Number(Number.isNaN(Number(markID)) ? 0 : markID === null ? 0 : markID),
                    newsID: Number(Number.isNaN(Number(newsID)) ? 0 : newsID === null ? 0 : newsID),
                    buildsID: Number(Number.isNaN(Number(buildsID)) ? 0 : buildsID === null ? 0 : buildsID),
                    QandAID: Number(Number.isNaN(Number(QandAID)) ? 0 : QandAID === null ? 0 : QandAID),
                    chats: chats, tags: tags, marks: marks, news: news, builds: builds, QandAs: QandAs,
                    chatCnt : 0, tagCnt : 0, markCnt : 0, newsCnt : 0, buildsCnt : 0, QandACnt : 0
                })
            })

    })
}
export async function getLangAsyncFunc(lang){
    let langObj = {}
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }
    await axios.get(`${API_URL}langs/get${lang?('/'+lang):''}`, null, headers)
        .then(res => {
                console.log("LANG_RES", res)
                res.data.forEach(item => langObj[item.alias] = item.word)
                // this.props.onReduxUpdate("LANG_LIBRARY", langObj)
            }
        )
        .catch(res => {
            console.log("ERROR_LANG", res)
        })
    return langObj
}
export const getSubjFieldName=lang=>{
    let field_name = "ua"
    switch (lang) {
        case "RU" :
            field_name = "ru"
            break
        case "EN" :
            field_name = "en"
            break
        case "GB" :
            field_name = "gb"
            break
        default :
            break;
    }
    return "subj_name_"+field_name
}
export const localDateTime=(ondate, countryCode)=>{
  return  toLocalDate((new Date(ondate)), countryCode, false, false) + ' ' +  (new Date(ondate)).toLocaleTimeString().slice(0, 5)
}

export const prepareImageJSON=(data, data100, classID, userName, userID, studentId, studentName)=>{
    console.log("prepareImageJSON")
    // let {classID, userName, userID, studentId, studentName} = this.props.userSetup
    // let text = this.state.curMessage
    let obj = {}

    obj.id = 0;
    obj.class_id = classID;
    obj.message = "ФОТО";
    obj.msg_date = toYYYYMMDD(new Date());
    obj.msg_time = (new Date()).toLocaleTimeString().slice(0, 5);
    obj.attachment2 = data
    obj.attachment3 = data100
    obj.user_id = userID
    obj.user_name = userName
    obj.student_id = studentId
    obj.student_name = studentName
    obj.uniqid = new Date().getTime() + userName//this.props.userSetup.userName //uniqid()

    // console.log("prepareJSON", obj, JSON.stringify(obj))
    return JSON.stringify(obj)
}