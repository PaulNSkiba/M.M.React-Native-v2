/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import {    StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import {    Container, TabHeading, Tabs, Tab, ScrollableTab, Spinner} from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, addDay,
        toYYYYMMDD, daysList, toLocalDate, dateFromTimestamp,
        getNearestSeptFirst, getSubjFieldName, localDateTime, setStorageData} from '../../js/helpersLight'
import { connect } from 'react-redux'
import { Table, TableWrapper, Row, Rows, Cell, Col } from 'react-native-table-component';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonWithBadge from '../../components/ButtonWithBadge/buttonwithbadge'

// import { ListView } from 'deprecated-react-native-listview';

// import {Text} from "react-native-elements/src/index.d";
// import {Text} from "react-native-elements/src/index.d";
// import { DataTable, Cell, CheckableCell, EditableCell, Header, HeaderCell, Row as DataRow, TableButton } from 'react-native-data-table'
// import '../../ChatMobile/chatmobile.css'

// const insertTextAtIndices = (text, obj) => {
//     return text.replace(/./g, function(character, index) {
//         return obj[index] ? obj[index] + character : character;
//     });
// };
const windowRatio = Dimensions.get('window').width? Dimensions.get('window').height / Dimensions.get('window').width : 1.9

class MarksBlock extends Component {
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
            curPage : -1,
            dayPages : null,
            subjPages : [],
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            // tableHead: ['ПРЕДМЕТ', '2.9', '3.9', '4.9', '5.9', '6.9'],
            // tableData: [
            //     ['Англ.мова', '12', '6', '4', '10', '9'],
            //     ['Укр.мова', '9', '8', '8', '3', '4'],
            //     ['Математика', '7', '9', '10', '8', '5'],
            //     ['Химия', '8', '10', '9', '3', '6'],
            // ],
            // tableTitle: ['Англ.мова', 'Укр.мова', 'Математика', 'Химия'],
            widthArr: [100, 60, 60, 60, 60, 60],
            isSpinner : false,
            activeTab : 0,
        };
        this.markDaySteps = 6
        this.getTableGrids = this.getTableGrids.bind(this)
        // this.onMessageDblClick = this.onMessageDblClick.bind(this)
        // this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        // this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        // this.onDelMsgClick=this.onDelMsgClick.bind(this)
        // this.onLongPressMessage=this.onLongPressMessage.bind(this)
    }
    async componentDidMount(){
        await this.getTableGrids()
        // this.setActiveTab(0)
        this.props.onStopLoading()
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

    getTableGrids=()=>{
        let {marks, subjects} = this.props.userSetup
        let {langCode} = this.props.interface
        let dayPages = [], curItem = [], cnt = 0, periodNum = 0, subjPages = []
        let daysMap = new Map(), subjMap = new Map();
        const firstSept = getNearestSeptFirst()
        console.log("MARKS_ARRAY", toYYYYMMDD(getNearestSeptFirst()))
        marks = marks.filter(item=>(new Date(item.mark_date))>=(new Date(firstSept)))
        if (marks.length) {
            let markID = marks[marks.length - 1].id
            for (let i = marks.length - 1; i >= 0; i--) {
                // console.log(marks[i])
                if (!daysMap.has(marks[i].mark_date)) {
                    daysMap.set(marks[i].mark_date)
                    if ((cnt + 1) < (this.markDaySteps + 1)) {
                        cnt++
                        curItem.unshift(marks[i].mark_date)
                    }
                    else {
                        dayPages.unshift({i : periodNum, arr : curItem, markID : markID})
                        periodNum++
                        curItem = []
                        cnt = 0
                        cnt++
                        markID = marks[i].id
                        // if ((dayPages.length === 5)) break;
                        curItem.unshift(marks[i].mark_date)
                    }
                }
            }
            if (curItem.length) {
                dayPages.unshift({i : periodNum, arr : curItem, markID : markID})
            }
            // console.log("Mark_Periods0", dayPages, subjPages)
            // Теперь выберем предметы для периода
            for (let i = dayPages.length - 1; i >= 0; i--) {
                subjMap = new Map();
                curItem = []
                // console.log("dayPages0", dayPages[i].arr, marks.length)
                for (let j = 0; j < marks.length; j++) {
                    let elem = marks[j], values = Array.from(dayPages[i].arr.values())
                    // console.log("dayPages1", dayPages[i].arr.values(), elem.mark_date, dayPages[i].arr.values().includes(elem.mark_date))
                    if ((values.includes(elem.mark_date)) && (!(subjMap.has(elem.subj_key)))) {
                        curItem.unshift({"subj_key" : elem.subj_key, "subj_id" : elem.subj_id, "subj_name_ua" : elem[getSubjFieldName(langCode)]})
                        subjMap.set(elem.subj_key)
                    }
                }
                // console.log("dayPages", curItem)
                // Отсортируем предметы
                curItem.sort((a, b)=>{
                    if (a.subj_name_ua > b.subj_name_ua) return 1; // если первое значение больше второго
                    if (a.subj_name_ua === b.subj_name_ua) return 0; // если равны
                    if (a.subj_name_ua < b.subj_name_ua) return -1;
                })

                curItem = subjects.filter(item=>marks.filter(item2=>item.subj_key===item2.subj_key).length)

                subjPages.unshift({i : dayPages[i].i, arr : curItem})
                subjMap = new Map();
                curItem = []
            }
            // console.log("subjPages!!!", subjPages, subjects)
            if (curItem.length) {
                subjPages.unshift({i : subjPages.length, arr : curItem})
            }
        }
        this.setState({dayPages, subjPages, curPage : (dayPages.length-1), isSpinner : false})
        console.log("Mark_Periods")
    }
    markColor=mark=>{
// ToDO: Для разных систем оценивания указать разные подходы к отображению оценок
        let ret = "#fff"
        switch (this.props.userSetup.markBlank.id) {
            case "markblank_twelve":
                switch (mark) {
                    case "12" : ret = "#87DD97"; break;
                    case "11" : ret = "#87DD97"; break;
                    case "10" : ret = "#87DD97"; break;
                    case "9" : ret = "#C6EFCE"; break;
                    case "8" : ret = "#C6EFCE"; break;
                    case "7" : ret = "#C6EFCE"; break;
                    case "6" : ret = "#FFEB9C"; break;
                    case "5" : ret = "#FFEB9C"; break;
                    case "4" : ret = "#FFEB9C"; break;
                    case "3" : ret = "#FF8594"; break;
                    case "2" : ret = "#FF8594"; break;
                    case "1" : ret = "#FF8594"; break;
                    default : break;
                }
                break;
            case "markblank_five":
                switch (mark) {
                    case "5" : ret = "#87DD97"; break;
                    case "4" : ret = "#C6EFCE"; break;
                    case "3" : ret = "#FFEB9C"; break;
                    case "2" : ret = "#FF8594"; break;
                    case "1" : ret = "#FF8594"; break;
                    default : break;
                }
                break;
            case "markblank_AF":
                switch (mark) {
                    case "A" : ret = "#87DD97"; break;
                    case "B" : ret = "#C6EFCE"; break;
                    case "C" : ret = "#FFEB9C"; break;
                    case "D" : ret = "#FFEB9C"; break;
                    case "E" : ret = "#FF8594"; break;
                    case "F" : ret = "#FF8594"; break;
                    default : break;
                }
                break;
            default :
                break;
        }
        return ret
    }
    measureView(event) {
        console.log(`*** even/t: ${JSON.stringify(event.nativeEvent).height}`);
        return JSON.stringify(event.nativeEvent)
        // you'll get something like this here:
        // {"target":1105,"layout":{"y":0,"width":256,"x":32,"height":54.5}}
    }
    // updateReadedID=ID=>{
    //     const {classID} = this.props.userSetup
    //     let {stat} = this.props
    //     if (stat.markID < ID) {
    //         stat.markID = ID
    //         // console.log("updateReadedID", ID, stat.chatID, `${classID}chatID`, ID.toString())
    //         setStorageData(`${classID}markID`, ID.toString())
    //         this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
    //     }
    // }
    setActiveTab=i=>{
        // console.log("ACTIVE_TAB", i, this.state.dayPages[i]);
        const {classID, marks} = this.props.userSetup
        let {stat} = this.props
        const ID = this.state.dayPages[i].markID
        console.log("updateReadedID", stat.markID, ID)
        // stat.markID = Number(ID)
        // this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)

        if (stat.markID < ID) {
            stat.markID = Number(ID)
            stat.markCnt = marks.filter(item=>(new Date(item.mark_date) >= getNearestSeptFirst())).filter(item =>(Number(item.id) > ID)).length
            console.log("UPDATE_VIEWSTAT")
            this.props.updateState('markID', Number(ID))
            setStorageData(`${classID}labels`, JSON.stringify(stat))
            this.props.onReduxUpdate("UPDATE_VIEWSTAT", stat)
        }
        this.setState({activeTab:i})
    }
    render () {
        const {langLibrary} = this.props.userSetup
        const {tempdata, online} = this.props.tempdata
        let {langCode} = this.props.interface
        const {headerHeight, footerHeight, showFooter, showKeyboard, theme, themeColor} = this.props.interface

        const initialDay = this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[0];
        let viewSize = Number(Number(Dimensions.get("window").height) - 2 *(headerHeight + footerHeight))
            viewSize = Math.floor(viewSize / 40) * 40
        // console.log("MARKS_RENDER", Dimensions.get("window").height, viewSize, viewSize / 40)
        let {marks, stats3} = this.props.userSetup, mark = "", subjmarks = ""
        {/*<Container>*/}
        // style={styles.modalView}
         return (
                <Container>
                    {(this.state.dayPages!==null)&&this.state.dayPages.length?
                    <Tabs renderTabBar={()=> <ScrollableTab />}  onChangeTab={({ i, ref, from }) => this.setActiveTab(i)}>
                        {this.state.dayPages.map((rootItem, key) =>
                            <Tab key={"tab" + key} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor, fontSize: RFPercentage(1.5)}}>{toLocalDate(new Date(rootItem.arr.slice(-1)), "UA", false, false)}</Text>
                            </TabHeading>}>
                                <View>
                                    <View style={globalStyles.head}>
                                        <View key={1000}>
                                            <Text style={[globalStyles.headerCellFirst, {backgroundColor : theme.primaryLightColor, borderColor : theme.primaryDarkColor}]}>{`${langLibrary===undefined?'':langLibrary.mobSubject===undefined?'':langLibrary.mobSubject.toUpperCase()}`}</Text>
                                            <Text style={{position : "absolute", top : 0, left : 0, fontSize : 8.5, paddingLeft : 4, paddingRight : 4, borderBottomRightRadius : 3, color : theme.primaryTextColor, backgroundColor : theme.primaryDarkColor}}>
                                                {(new Date(dateFromTimestamp(stats3.max)) instanceof Date)?localDateTime(dateFromTimestamp(stats3.max), "UA"):null}
                                                </Text>
                                        </View>
                                        {  rootItem.arr.map((item, key) =>
                                            <View key={"header"+key}>
                                                <Text style={[globalStyles.headerCell, {backgroundColor : theme.primaryLightColor, borderColor : theme.primaryDarkColor}]}>{toLocalDate(new Date(item), "UA", false, true)}</Text>
                                            </View>
                                        )
                                        }
                                    </View>
                                    <View
                                        // onLayout={(event) => { this.measureView(event) }}
                                        style={{ height: viewSize, justifyContent : "flex-start", alignItems : "flex-start", alignSelf : "flex-start"}} >
                                        <ScrollView>
                                         {this.state.subjPages.filter(item=>item.i===rootItem.i)[0].arr.map(
                                            (subjItem, key)=> {
                                                subjmarks = marks.filter(item=>item.subj_key===subjItem.subj_key)
                                                return <View key={"viewKey"+key} style={{flexDirection: "row"}}>
                                                    <View key={"cellBody" + key + '.0@' + subjItem.subj_key + '@'+rootItem.arr.slice(-1)}>
                                                        <Text
                                                            style={[globalStyles.headerCellSubj, {backgroundColor : theme.primaryLightColor, borderColor : theme.primaryDarkColor, fontSize: subjItem[getSubjFieldName(langCode)].length >= 15?RFPercentage(1.7):RFPercentage(1.8)}]}>{subjItem[getSubjFieldName(langCode)]}
                                                        </Text>
                                                    </View>
                                                    {
                                                        rootItem.arr.map((dateItem, key2) => {
                                                                {
                                                                    mark = subjmarks.filter(item => {
                                                                        return ((item.subj_key === subjItem.subj_key) && (item.mark_date === dateItem))
                                                                    })
                                                                }
                                                                return <View key={"cellBodyMarks" + key2 + '.1@' + subjItem.subj_key + '@'+rootItem.arr.slice(-1)}>
                                                                    <Text
                                                                        style={[globalStyles.bodyCell, {backgroundColor: mark.length ? this.markColor(mark[0].mark) : "#fff", borderColor : theme.primaryDarkColor}]}>
                                                                        {mark.length ? mark[0].mark : null}
                                                                    </Text>
                                                                </View>
                                                            }
                                                        )
                                                    }
                                                </View>
                                            })}
                                        </ScrollView>
                                    </View>
                                    <View>

                                    </View>

                                </View>

                            </Tab>
                        )
                        }
                    </Tabs>
                        :
                        <View style={{width : Dimensions.get('window').width}}><Text></Text></View>
                    }
                </Container>
        )
    }
}
{/* </Container>*/}

const globalStyles = StyleSheet.create({
    bodyCell : {
        width: 40,
        height: 40,
        justifyContent : "center",
        paddingTop: 11,
        paddingBottom: 4,
        // paddingLeft : 14,
        fontSize : RFPercentage(2),
        borderWidth : 0.5,
        textAlign : "center"
        // borderColor : "#4472C4",
    },
    headerCellFirst : {
        // backgroundColor: "rgba(64, 155, 230, 0.16)",
        width: windowRatio<1.8? 120: 120,
        height: 40,
        paddingTop: 12,
        paddingBottom: 4,
        paddingLeft : 40,
        fontSize: RFPercentage(1.8),
        borderWidth : 0.5,
        // borderColor : "#4472C4",
    },
    headerCellSubj : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
        // backgroundColor: "#fff",
        width: windowRatio<1.8? 120: 120,
        height: 40,
        paddingTop: 12,
        paddingLeft : 8,

        fontWeight : "600",
        borderWidth : 0.5,
        // borderColor : "#4472C4",
    },
    headerCell : {
        // backgroundColor: "rgba(64, 155, 230, 0.16)",
        width: 40,
        height: 40,
        justifyContent : "center",
        paddingTop: 12,
        paddingBottom: 4,
        // paddingLeft : 4,
        fontSize : RFPercentage(1.4),
        borderWidth : 0.5,
        textAlign : "center",
        // borderColor : "#4472C4",
    },
    text : {
        margin: 6,
        backgroundColor : "#C6EFCE",
    },
    row : {
        flex : 1,
        flexDirection: "row",
        height : 40,
    },
    head : {
        flexDirection: "row",
    },
    body : {
        justifyContent : "flex-start",
        alignItems : "flex-start",
        alignSelf : "flex-start",
    }

})
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MarksBlock)