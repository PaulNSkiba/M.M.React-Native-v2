/**
 * Created by Paul on 08.10.2019.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Image, Dimensions, ScrollView, Spinner} from 'react-native';
import {
    Container, Header, Left, Body, Right, Button,
    Title, Content, Footer, FooterTab, TabHeading, Tabs, Tab,
    Form, Item, Input, Label, Textarea, CheckBox, List, ListItem, Thumbnail, Card, CardItem, Text
} from 'native-base';
import {Avatar, Badge, Icon, withBadge} from 'react-native-elements'
import {bindActionCreators} from 'redux';
import {instanceAxios, mapStateToProps, addMonths, toYYYYMMDD, dateFromTimestamp, localDateTime} from '../../js/helpersLight'
import {LOGINUSER_URL, version, API_URL} from '../../config/config'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo from '../../img/LogoMyMsmall.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
// import {Card} from "react-native-elements/src/index.d";
// import {ScrollView} from "react-native-af-video-player/components/ScrollView";
// import {Text} from "react-native-elements/src/index.d";
// import {Image} from "react-native-elements/src/index.d";
// import NetInfo from "@react-native-community/netinfo";
// import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from './js/helpersLight'

class Budget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            planIns: [],
            factIns: [],
            planOuts: [],
            factOuts: [],
            curYear: (new Date().getFullYear()),
            factInsHeader: [],
            years : [],
            isSpinner: false,
        }
        this.headArray = [
            {name: "Имя", width: 50, item : {id :-1}},
            {name: "Долг", width: 22, item : {id : -2}},
        ]
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
        this.onExit = this.onExit.bind(this)
    }

    componentDidMount() {
        this.initData()
    }

    initData() {
        const {classID} = this.props.userSetup
        this.setState({isSpinner : true})
        instanceAxios().get(`${API_URL}budgetpays/get/${classID}`)
            .then(res => {

                    const planIns = res.data.filter(item => item.debet === 1)
                    const planOuts = res.data.filter(item => item.debet !== 1)
                    console.log("getpays", res, planIns, planOuts)
                    let years = [...new Set(planIns.map(item=>(new Date(item.paydate).getFullYear())))]
                    year = [...years, (new Date()).getFullYear()]
                    this.setState({
                        planIns,
                        planOuts,
                        factInsHeader: this.prepPaymentsHeaderAndRowArray(planIns, this.state.curYear),
                        years,
                    })


                this.props.onReduxUpdate("BUDGETPAYS_UPDATE", res.data)
                    console.log("getbudgetpays", years, res)
                }
            )
            .catch(res => {
                console.log("getpaysError", res)
            })
        instanceAxios().get(`${API_URL}budget/get/${classID}`)
            .then(res => {
                    this.setState({
                        factIns: res.data
                    })
                    this.props.onReduxUpdate("BUDGET_UPDATE", res.data)
                    console.log("getbudget", res)
                    this.setState({isSpinner : false})
                }
            )
            .catch(res => {
                console.log("getbudgetError", res)
                this.setState({isSpinner : false})
            })
    }

    prepPaymentsHeaderAndRowArray = (planIns, year) => {
        let arr = []
        let headArray = [...this.headArray]
        // console.log("headArrayBef", headArray, year)
        planIns.forEach(item => {
            // console.log("paydate", item.paydate)
            if (item.sum > 0 || item.issaldo === 1) {
                if (item.isregular !== 1 || item.issaldo === 1) {
                    let start = (item.paydate.length === 8 ? dateFromYYYYMMDD(item.paydate) : new Date(item.paydate))
                    let shortdate = (((new Date(start)).getMonth() + 1) + '.' + ((new Date(start)).getFullYear().toString().slice(-2)))
                    if (Number(year) === Number(start.getFullYear())) {
                        arr.push({
                            numb: -1,
                            item: item,
                            name: item.short + ' ' + shortdate,
                        })
                        headArray.push({name: item.short + ' [' + shortdate + ']',
                                        width: 22,
                                        numb: -1,
                                        item: item,})
                    }
                }
                else {
                    // Вставить проверку на срок действия
                    for (let i = 0; i < 20; i++) {
                        let newStart = addMonths((item.paydate.length === 8 ? dateFromYYYYMMDD(item.paydate) : new Date(item.paydate)), i)
                        // console.log("newStart", toYYYYMMDD(newStart), item, i)
                        let shortdate = ((newStart).getMonth() + 1) + '.' + (newStart).getFullYear().toString().slice(-2)
                        if (Number(year) === Number(newStart.getFullYear())) {
                            if ((item.payend !== null && ((new Date(newStart)) < (new Date(item.payend)))) || item.payend === null) {
                                arr.push({
                                    numb: i + 1,
                                    item: item,
                                    name: item.short + ' ' + shortdate,
                                    realdate: newStart
                                })
                                headArray.push({name: item.short + ' [' + shortdate + ']',
                                                width: 22,
                                                numb: i + 1,
                                                item: item,
                                                realdate: newStart})
                            }
                        }
                    }
                }
            }
        })
        // console.log("headArrayAft", headArray)
        // this.setState({factInsHeader: headArray, factInsHeaderEx: arr})
        return headArray
    }
    onExit = () => {
        // console.log("exitBudget")
        this.props.onexit()
    }
    pcntOfPayments=(factInsHeader)=>{
        let studList = this.props.userSetup.students.filter(item => item.isout !== 1).map((item, key) => {
                return {
                    name: item.student_name,
                    id : item.id,
                    datein : item.datein
                }
            }
        )
        let cells = 0, payedcells = 0
        studList.map((itemStud, key) => {
            const budget = this.props.userSetup.budget.filter(item => item.student_id === itemStud.id)
            factInsHeader.map((itemHead, key) => {
                let curSum = null, id = 0, paydate = null
                if (budget !== undefined && budget.length) {
                    const arr = budget.filter(item => {
                            paydate = itemHead.item.isregular === 1 ? itemHead.realdate : itemHead.item.paydate
                            return item.student_id === itemStud.id
                                && item.payment_id === itemHead.item.id
                                && (toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(paydate))
                        }
                    )
                    if (arr.length) {
                        id = arr[0].id
                        curSum = arr[0].sum
                        // console.log("CURSUM", id, curSum)
                    }
                }

                if (!(new Date(itemStud.datein) > new Date(paydate)) && itemHead.item.id > 0 && !(itemHead.item.issaldo > 0) && (new Date(paydate)) <= new Date()) cells++
                if (curSum > 0) payedcells++
            })
        })
        return (cells > 0)?Math.round(payedcells / cells * 100):''
        }
    getStudentCredit=(id, year)=>{
        return null
    }
    cashLeaves=(curYear)=>{
        let leftSum = 0
        this.state.planOuts.filter(item=>{
            const inThisYear = (new Date(item.paydate)).getFullYear()===curYear
            const endYear = item.payend===null?curYear:(new Date(item.payend)).getFullYear()
            const regularNotFinished = (new Date(item.paydate)).getFullYear()<=curYear&&((endYear>=curYear)&&item.isregular===1)
            // console.log("PLANSIN", item, inThisYear, regularNotFinished, endYear)
            return item.sum>0 && (inThisYear|| regularNotFinished)
        }).forEach((item)=>{
                console.log("cashLeaves", item, leftSum)
              if (item.issaldo===null)
                  leftSum = leftSum - item.sum
              else
                  leftSum = leftSum + item.sum
        })
        return leftSum
    }
    render = () => {
        // let studList = [
        //     {name : "Иваненко", credit : 2, payment1 : 0, payment2 : 1, payment3 : 1, payment4 : 0, out:"Бумага"},
        //     {name : "Петренко", credit : 0, payment1 : 1, payment2 : 1, payment3 : 0, payment4 : 0, out:"Подарки учителям"},
        //     {name : "Сидоренко", credit : 1, payment1 : 0, payment2 : 1, payment3 : 0, payment4 : 0, out:"Подарки активным"},
        //     {name : "Григоренко", credit : 3, payment1 : 1, payment2 : 1, payment3 : 1, payment4 : 0, out:"Подарки ДР"},
        // ]
        let studList = this.props.userSetup.students.filter(item => item.isout !== 1).map((item, key) => {
                return {
                    name: item.student_name,
                    id : item.id,
                    datein : item.datein,
                    credit: 2,
                    payment1: 0,
                    payment2: 1,
                    payment3: 1,
                    payment4: 0,
                    out: "Бумага"
                }
            }
        )


        console.log("Budget")
        const {years} = this.state
        const {statsBudgetPays, statsBudget} = this.props.userSetup
        const {theme} = this.props.interface
        let index = 0
        years.forEach((item, key)=>item===(new Date()).getFullYear()?index=key:null)
        return (
            <View style={styles.modalView}>
                <View style={{height: (Dimensions.get('window').height - 100)}}>
                    {years.length?
                    <Tabs initialPage={0} page={0}>
                        {this.state.years.map((item, key)=>{
                            const curYear = item
                            console.log("YEAR", curYear)
                            let prcnt = 0, cells = 0, payedcells = 0
                            const factInsHeader = this.prepPaymentsHeaderAndRowArray(this.state.planIns, curYear)
                            console.log("FACTINSHEADER", factInsHeader)
                            // style={styles.tabHeaderWhen}
                          return <Tab key={"year"+key} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>{item}</Text></TabHeading>}>
                                <Tabs>
                                    <Tab heading={<TabHeading
                                        style={{color: "#387541", backgroundColor: '#C6EFCE'}}><Text
                                        style={{color: "#387541"}}>{`ВЗНОСЫ [${this.pcntOfPayments(factInsHeader)}%]`}</Text>
                                        <Text
                                            style={{color: "#387541", position: 'absolute', top : 0, right : 0, fontSize : 9.5}}>
                                            {(new Date(dateFromTimestamp(statsBudget)) instanceof Date)?localDateTime(dateFromTimestamp(statsBudget), "UA"):null}
                                        </Text>
                                    </TabHeading>}>
                                        {factInsHeader.length ?
                                            <View>
                                                <View style={{
                                                    flexDirection: "row",
                                                    height: 40,
                                                    marginTop: 4,
                                                    marginLeft: 4,
                                                    marginRight: 4
                                                }}>
                                                    {factInsHeader.map((item, key) => {
                                                        switch (key) {
                                                            case 0 :
                                                                return <View key={"st" + key} style={{
                                                                    backgroundColor: "rgba(64, 155, 230, 0.16)",
                                                                    width: 50, borderWidth: .5, borderColor: "#7DA8E6"
                                                                }}>
                                                                    <Text style={{
                                                                        textAlign: "center",
                                                                        fontSize: RFPercentage(1.3)
                                                                    }}>
                                                                        {item.name}
                                                                    </Text>
                                                                </View>
                                                                break;
                                                            case 1 :
                                                                return <View key={"st" + key} style={{
                                                                    backgroundColor: "rgba(64, 155, 230, 0.16)",
                                                                    width: 22, borderWidth: .5, borderColor: "#7DA8E6"
                                                                }}>
                                                                    <Text style={{
                                                                        textAlign: "center",
                                                                        fontSize: RFPercentage(1.3)
                                                                    }}>
                                                                        {item.name}
                                                                    </Text>
                                                                </View>
                                                                break;
                                                            default :
                                                                return <View style={{
                                                                    backgroundColor: "rgba(64, 155, 230, 0.16)",
                                                                    width: 22, borderWidth: .5, borderColor: "#7DA8E6"
                                                                }}>
                                                                    <Text style={{
                                                                        textAlign: "center",
                                                                        fontSize: RFPercentage(1.3)
                                                                    }}>{item.name}</Text>
                                                                </View>
                                                                break;
                                                        }
                                                    })}
                                                </View>
                                    <ScrollView style={{marginBottom: 60}} showsHorizontalScrollIndicator={true}>
                                    {studList.map((itemStud, key) =>{
                                    // console.log("studList", itemStud)
                                    const budget = this.props.userSetup.budget.filter(item=>item.student_id===itemStud.id)
                                    return <View style={{flexDirection: "row", marginLeft: 4, marginRight: 4}}>
                                    <View key={"st" + key} style={{width: 50, borderWidth: .5, borderColor: "#7DA8E6"}}>
                                        <Text style={{fontSize: RFPercentage(1.5), color : itemStud.id=== this.props.userSetup.studentId ? "#1890e6" : "#000"}}>{itemStud.name}</Text></View>
                                        <View key={"credit" + key} style={{width: 22, borderWidth: .5, borderColor: "#7DA8E6"}}>
                                            <Text style={{textAlign: "center", fontSize: RFPercentage(1.7)}}>{this.getStudentCredit(itemStud.id, curYear)}</Text></View>
                                            {factInsHeader.map((itemHead, key) => {
                                                let curSum = null, id = 0, paydate = null
                                                if (budget !== undefined && budget.length) {
                                                    const arr = budget.filter(item => {
                                                            // console.log("FILTER", item.student_id , itemStud.id, item.payment_id, itemHead.item.id,
                                                            paydate = itemHead.item.isregular === 1 ? itemHead.realdate : itemHead.item.paydate
                                                            return item.student_id === itemStud.id
                                                                && item.payment_id === itemHead.item.id
                                                                && (toYYYYMMDD(new Date(item.paydate))) === toYYYYMMDD(new Date(paydate))
                                                        }
                                                    )
                                                    if (arr.length) {
                                                        id = arr[0].id
                                                        curSum = arr[0].sum
                                                        // console.log("CURSUM", id, curSum)
                                                    }
                                                }

                                                if (!(new Date(itemStud.datein) > new Date(paydate))) cells++
                                                if (curSum > 0) payedcells++
                                                if (cells > 0) prcnt = Number(payedcells / cells * 100)

                                                return key > 1 ? <View style={{width: 22,borderWidth: .5,borderColor: "#7DA8E6",
                                                backgroundColor: new Date(itemStud.datein) > new Date(paydate) ?
                                                    "#C9C9C9" :
                                                    curSum > 0 ?
                                                        (itemHead.item.isregular === 1?
                                                            "#C6EFCE":
                                                            "#87DD97") :
                                                        "#fff"
                                                }}>
                                        </View> : null
                                    })

                                    }

                                    </View>})}
                                    <List>
                                    {this.state.planIns.filter(item=>{
                                        const inThisYear = (new Date(item.paydate)).getFullYear()===curYear
                                        const endYear = item.payend===null?curYear:(new Date(item.payend)).getFullYear()
                                        const regularNotFinished = (new Date(item.paydate)).getFullYear()<=curYear&&((endYear>=curYear)&&item.isregular===1)
                                        // console.log("PLANSIN", item, inThisYear, regularNotFinished, endYear)
                                        return item.sum>0 && (inThisYear|| regularNotFinished)
                                    }).filter(item=>item.issaldo===null).map((item, key)=>
                                    <ListItem>
                                        <View style={{width : 70, textAlign : "left"}}><Text>{item.short}</Text></View>
                                        <View style={{width : 160}}><Text>{item.name}</Text><Text style={{fontSize : RFPercentage(1.5)}} note>{`${item.isregular===1?"c":""} ${(new Date(item.paydate)).toLocaleDateString()} ${item.payend!==null?(" по "+ (new Date(item.payend)).toLocaleDateString()):''}`}</Text></View>
                                        <View style={{width : 70}}><Text>{item.sum}</Text><Text style={{fontSize : RFPercentage(1.5)}} note>{`${item.isregular===1?"раз/месяц":"разовый"}`}</Text></View>
                                        </ListItem>)}
                                    </List>
                                    </ScrollView>
                                             </View>
                                             : null}
                                     </Tab>
                                     <Tab heading={<TabHeading style={{color : "#b40530", backgroundColor : '#ffd3d1'}}>
                                        <Text style={{color: "#b40530"}}>{`РАСХОДЫ[${this.cashLeaves(curYear)}]`}</Text>
                                         <Text
                                             style={{color: "#b40530", position: 'absolute', top : 0, right : 0, fontSize : 9.5}}>
                                             {(new Date(dateFromTimestamp(statsBudgetPays)) instanceof Date)?localDateTime(dateFromTimestamp(statsBudgetPays), "UA"):null}
                                             </Text>
                                     </TabHeading>}>
                                         <List>
                                             {this.state.planOuts.filter(item=>{
                                                 const inThisYear = (new Date(item.paydate)).getFullYear()===curYear
                                                 const endYear = item.payend===null?curYear:(new Date(item.payend)).getFullYear()
                                                 const regularNotFinished = (new Date(item.paydate)).getFullYear()<=curYear&&((endYear>=curYear)&&item.isregular===1)
                                                 // console.log("PLANSIN", item, inThisYear, regularNotFinished, endYear)
                                                 return item.sum>0 && (inThisYear|| regularNotFinished)
                                             }).filter(item=>item.issaldo===null).map((item, key)=>
                                                 <ListItem>
                                                     <View style={{width : 230, textAlign : "left"}}><Text>{item.name}</Text><Text style={{fontSize : RFPercentage(1.5)}} note>{`${item.isregular===1?"c":""} ${(new Date(item.paydate)).toLocaleDateString()} ${item.payend!==null?(" по "+ (new Date(item.payend)).toLocaleDateString()):''}`}</Text></View>
                                                     <View style={{width : 70}}><Text>{item.sum}</Text><Text style={{fontSize : RFPercentage(1.5)}} note>{`${item.isregular===1?"раз/месяц":"разовый"}`}</Text></View>
                                                 </ListItem>)}
                                         </List>
                                     </Tab>
                                </Tabs>

                             </Tab>
                             })
                         }

                    </Tabs>:null}
                </View>
                <View style={{flex: 1}}>
                    <Footer style={styles.header}>
                        <FooterTab style={styles.header}>
                            <Button style={styles.btnClose} vertical /*active={this.state.selectedFooter===2}*/
                                    onPress={() => this.onExit()}>
                                {/*<Icon active name="ios-bookmarks" />*/}
                                <Text style={styles.btnCloseText}>ВЫХОД</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
            </View>

        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Budget)