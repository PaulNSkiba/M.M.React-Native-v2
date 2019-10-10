/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import {    StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import {    Container, TabHeading, Tabs, Tab, } from 'native-base';
// import { ListView } from 'deprecated-react-native-listview';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, toLocalDate} from '../../js/helpersLight'
import { connect } from 'react-redux'
import { Table, TableWrapper, Row, Rows, Cell, Col } from 'react-native-table-component';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ButtonWithBadge from '../../components/ButtonWithBadge/buttonwithbadge'
// import {Text} from "react-native-elements/src/index.d";
// import {Text} from "react-native-elements/src/index.d";
// import { DataTable, Cell, CheckableCell, EditableCell, Header, HeaderCell, Row as DataRow, TableButton } from 'react-native-data-table'
// import '../../ChatMobile/chatmobile.css'

// const insertTextAtIndices = (text, obj) => {
//     return text.replace(/./g, function(character, index) {
//         return obj[index] ? obj[index] + character : character;
//     });
// };
// const tableStyles = StyleSheet.create({
//     container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff', borderWidth: 2, borderColor : "#8866aa" },
//     head: { height: 40, backgroundColor: '#808B97', color : "#fff", textAlign: "center" },
//     text: { margin: 6, textAlign : "center", backgroundColor: '#fff' },
//     headtext : {  color : "#fff" },
//     wrapper: { flexDirection: 'row' },
// });
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
            tableHead: ['ПРЕДМЕТ', '2.9', '3.9', '4.9', '5.9', '6.9'],
            tableData: [
                ['Англ.мова', '12', '6', '4', '10', '9'],
                ['Укр.мова', '9', '8', '8', '3', '4'],
                ['Математика', '7', '9', '10', '8', '5'],
                ['Химия', '8', '10', '9', '3', '6'],
            ],
            tableTitle: ['Англ.мова', 'Укр.мова', 'Математика', 'Химия'],
            widthArr: [100, 60, 60, 60, 60, 60],
        };
        this.markDaySteps = 6
        this.getTableGrids = this.getTableGrids.bind(this)
        // this.onMessageDblClick = this.onMessageDblClick.bind(this)
        // this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        // this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        // this.onDelMsgClick=this.onDelMsgClick.bind(this)
        // this.onLongPressMessage=this.onLongPressMessage.bind(this)
    }
    componentDidMount(){
        this.getTableGrids()
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
        let {marks} = this.props.userSetup
        let dayPages = [], curItem = [], cnt = 0, periodNum = 0, subjPages = []
        let daysMap = new Map(), subjMap = new Map();
        console.log("MARKS_ARRAY", marks)
        if (marks.length) {
            for (let i = marks.length - 1; i >= 0; i--) {
                // console.log(marks[i])
                if (!daysMap.has(marks[i].mark_date)) {
                    daysMap.set(marks[i].mark_date)
                    if ((cnt + 1) < (this.markDaySteps + 1)) {
                        cnt++
                        curItem.unshift(marks[i].mark_date)
                    }
                    else {
                        dayPages.unshift({i : periodNum, arr : curItem})
                        periodNum++
                        curItem = []
                        cnt = 0
                        cnt++
                        if ((dayPages.length === 5)) break;
                        curItem.unshift(marks[i].mark_date)
                    }
                }
            }
            if (curItem.length) {
                dayPages.unshift({i : periodNum, arr : curItem})
            }
            console.log("Mark_Periods0", dayPages, subjPages)
            // Теперь выберем предметы для периода
            for (let i = dayPages.length - 1; i >= 0; i--) {
                subjMap = new Map();
                curItem = []
                console.log("dayPages0", dayPages[i].arr, marks.length)
                for (let j = 0; j < marks.length; j++) {

                    let elem = marks[j], values = Array.from(dayPages[i].arr.values())
                    // console.log("elem2", dayPages[i], Array.from(dayPages[i].arr.values()))
                    // console.log("dayPages1", dayPages[i].arr.values(), elem.mark_date, dayPages[i].arr.values().includes(elem.mark_date))
                    if ((values.includes(elem.mark_date)) && (!(subjMap.has(elem.subj_key)))) {
                        curItem.unshift({"subj_key" : elem.subj_key, "subj_id" : elem.subj_id, "subj_name_ua" : elem.subj_name_ua})
                        subjMap.set(elem.subj_key)
                    }
                    //
                }
                console.log("dayPages", curItem)
                // Отсортируем предметы
                curItem.sort((a, b)=>{
                    // a.subj_name_ua>b.subj_name_ua
                    if (a.subj_name_ua > b.subj_name_ua) return 1; // если первое значение больше второго
                    if (a.subj_name_ua === b.subj_name_ua) return 0; // если равны
                    if (a.subj_name_ua < b.subj_name_ua) return -1;
                })
                
                subjPages.unshift({i : dayPages[i].i, arr : curItem})
                subjMap = new Map();
                curItem = []
            }
            console.log("subjPages!!!", subjPages, subjPages.length, curItem.length, curItem)
            if (curItem.length) {
                subjPages.unshift({i : subjPages.length, arr : curItem})
            }

        }

        // Пробуем разобраться с ЛистВью
        // const dataSource = new FlatList.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // let datasource = dataSource.cloneWithRows(['row 1', 'row 2'])
        this.setState({dayPages, subjPages, curPage : (dayPages.length-1)})
        console.log("Mark_Periods", dayPages, subjPages)

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
    render () {
        // const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[0];

        console.log("MARKS_RENDER")
        let {marks} = this.props.userSetup, mark = "", subjmarks = ""
         return (

            <Container>
                <View style={styles.modalView}>
                    {(this.state.dayPages!==null)&&this.state.dayPages.length?
                    <Tabs  >
                        {this.state.dayPages.map((rootItem, key) =>
                            <Tab key={"tab" + key} heading={<TabHeading style={styles.tabHeaderWhen}>
                                {/*{console.log("TAB", rootItem, rootItem.arr[0], rootItem.arr.slice(-1))}*/}
                                <Text style={{
                                    color: "#fff",
                                    fontSize: RFPercentage(1.5)
                                }}>{toLocalDate(new Date(rootItem.arr.slice(-1)), "UA", false, false)}</Text>
                            </TabHeading>}>
                                <View style={{flex : 1, flexDirection : "column"}}>
                                    <View style={globalStyles.head}>
                                        <View key={1000}>
                                            <Text style={globalStyles.headerCellFirst}>{"Предмет"}</Text>
                                        </View>
                                        {  rootItem.arr.map((item, key) =>
                                        // console.log("Cell", item, key)
                                            <View key={"header"+key}>
                                                <Text style={globalStyles.headerCell}>{toLocalDate(new Date(item), "UA", false, true)}</Text>
                                            </View>
                                        )
                                        }
                                    </View>
                                    <View style={globalStyles.body}>
                                         {this.state.subjPages.filter(item=>item.i===rootItem.i)[0].arr.map(
                                            (subjItem, key)=> {
                                                subjmarks = marks.filter(item=>item.subj_key===subjItem.subj_key)
                                                return <View style={{flexDirection: "row"}}>
                                                    <View key={"cellBody" + key}>
                                                        <Text
                                                            style={globalStyles.headerCellSubj}>{subjItem.subj_name_ua}</Text>
                                                    </View>
                                                    {
                                                        rootItem.arr.map((dateItem, key) => {
                                                                // console.log("Cell", item, key)
                                                                {
                                                                    mark = subjmarks.filter(item => {
                                                                        // console.log("CELL", item, item.subj_key, subjItem.subj_key, item.mark_date, dateItem)
                                                                        return ((item.subj_key === subjItem.subj_key) && (item.mark_date === dateItem))
                                                                    })
                                                                    // console.log("CELL22", mark)
                                                                }
                                                                return <View key={"cellBodyMarks" + key}>
                                                                    <Text
                                                                        style={[globalStyles.bodyCell, {backgroundColor: mark.length ? this.markColor(mark[0].mark) : "#fff"}]}>
                                                                        {mark.length ? mark[0].mark : null}
                                                                    </Text>
                                                                </View>
                                                            }
                                                        )
                                                    }
                                                </View>
                                            })}
                                    </View>

                                </View>

                            </Tab>
                        )
                        }
                    </Tabs>
                        :null}
                </View>
            </Container>)
    }
}
const globalStyles = StyleSheet.create({
    bodyCell : {
        width: 40,
        height: 40,
        // justifyContent : "center",
        paddingTop: 11,
        paddingBottom: 4,
        paddingLeft : 14,
        fontSize : RFPercentage(2),
        borderWidth : 0.5,
        borderColor : "#4472C4",
    },
    headerCellFirst : {
        backgroundColor: "rgba(64, 155, 230, 0.16)",
        width: windowRatio<1.8? 120: 120,
        height: 40,
        paddingTop: 12,
        paddingBottom: 4,
        paddingLeft : 40,
        fontSize: RFPercentage(1.8),
        borderWidth : 0.5,
        borderColor : "#4472C4",
    },
    headerCellSubj : {
        // display : "flex",
        // flex : 1,
        backgroundColor: "#fff",
        width: windowRatio<1.8? 120: 120,
        height: 40,
        // justifyContent : "center",
        paddingTop: 6,
        // paddingBottom: 4,
        paddingLeft : 8,
        fontSize: RFPercentage(1.8),
        fontWeight : "600",
        borderWidth : 0.5,
        borderColor : "#4472C4",
    },
    headerCell : {
        backgroundColor: "rgba(64, 155, 230, 0.16)",
        width: 40,
        height: 40,
        // justifyContent : "center",
        paddingTop: 12,
        paddingBottom: 4,
        paddingLeft : 4,
        fontSize : RFPercentage(1.4),
        borderWidth : 0.5,
        borderColor : "#4472C4",
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
        // height : 40,
    },
    body : {
        // flexDirection : "row",
        justifyContent : "flex-start",
        alignItems : "flex-start",
        alignSelf : "flex-start",
    }

})
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MarksBlock)