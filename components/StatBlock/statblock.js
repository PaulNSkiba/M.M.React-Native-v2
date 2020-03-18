/**
 * Created by Paul on 30.11.2019.
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
import {instanceAxios, mapStateToProps, addMonths, toYYYYMMDD,
        dateFromTimestamp, axios2, getLangWord} from '../../js/helpersLight'
import {LOGINUSER_URL, version, API_URL} from '../../config/config'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo from '../../img/LogoMyMsmall.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'


class StatBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reportData : [],
        }
        this.onExit = this.onExit.bind(this)
    }
    componentDidMount() {
        this.initData()
    }
    initData=()=>{
        const {classID, studentId, token} = this.props.userSetup
        // console.log('initData', `${API_URL}class/getstatmob/${classID}/${studentId}`, token)
        axios2('post',`${API_URL}class/getstatmob/${classID}/${studentId}`,null)
            .then(res=>this.setState({reportData:res.data}))
            .catch(res=>console.log("GETSTAT:ERROR", res))
    }
    onExit = () => {
        // console.log("exitBudget")
        this.props.onexit()
    }
    getQtyMarks=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {qtymarks} = reportData
        console.log("Best", reportData, qtymarks)
        let best = ''
        if (reportData&&qtymarks) {
            qtymarks.forEach((item, key)=>{
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}:  ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${qtymarks.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getWorker=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {worker} = reportData
        console.log("Best", reportData, worker)
        let best = ''
        if (reportData&&worker) {
            worker.forEach((item, key)=>{
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}:  ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${worker.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getMaxAvg=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {maxavg} = reportData
        console.log("Best", reportData, maxavg)
        let best = ''
        if (reportData&&maxavg) {
            maxavg.forEach((item, key)=>{
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}:  ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${maxavg.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getMaxAvgTop6=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {maxavgtop6} = reportData
        console.log("Best", reportData, maxavgtop6)
        let best = ''
        if (reportData&&maxavgtop6) {
            maxavgtop6.forEach((item, key)=>{
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}:  ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${maxavgtop6.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getDynamic=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {dynamic} = reportData
        console.log("Best", reportData, dynamic)
        let best = ''
        if (reportData&&dynamic) {
            dynamic.forEach((item, key)=>{
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}: + ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${dynamic.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getDynamicTop6=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {dynamictop6} = reportData
        console.log("Best", reportData, dynamictop6)
        let best = ''
        if (reportData&&dynamictop6) {
            dynamictop6.forEach((item, key)=>{
                // console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick}: + ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${dynamictop6.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    getCommonDynamic=()=>{
        const {reportData} = this.state
        const {commondynamic} = reportData
        console.log("Best", reportData, commondynamic)
        let dynall = 0
        let dynalltop = 0
        if (reportData&&commondynamic) {
            console.log("commondynamic", commondynamic)
            if (commondynamic[0].baseall > 0)
                dynall = Number(commondynamic[0].avgall/commondynamic[0].baseall * 100).toPrecision(2)
            if (commondynamic[0].basetop > 0)
                dynalltop = Number(commondynamic[0].avgalltop/commondynamic[0].basetop * 100).toPrecision(2)
            // dynamictop6.forEach((item, key)=>{
            //     console.log(key, item)
            //     if (key===0)
            //         best = best+`${item.student_nick} + ${item.val}`
            //     if (item.stud_id===studentId)
            //         best = `${best}  [${key + 1}/${commondynamic.length}]`
            // })
        }
        return [dynall>=0?`+${dynall}%`:`-${dynall}%`, dynalltop>=0?`+${dynalltop}%`:`-${dynalltop}%`]
    }
    getPrivateStat=()=>{
        const {reportData} = this.state
        const {studentId, students} = this.props.userSetup
        const {places} = reportData
        let ret = null
        if (reportData&&places) {
            console.log("commondynamic", places)
            ret = places.filter(item=>item!==null).map((item, key)=> {
                console.log(places, item)
                return   <Item key={key}>
                        <Left>
                            <Text style={{color: "#4472C4", fontSize: RFPercentage(1.9)}}>{item.subj_name}</Text>
                        </Left>
                        <Body>
                        <Text style={{color: "#387541", fontSize: RFPercentage(2)}}>{`Место: ${item.myplace.rank}`}</Text>
                        </Body>
                        <Right>
                            <Text style={{
                                color: "#387541",
                                fontSize: RFPercentage(2)
                            }}>{`Ср.оценка: ${item.myplace.mark}`}</Text>
                        </Right>
                    </Item>
                }
            )
            // if (commondynamic[0].baseall > 0)
            //     dynall = Number(commondynamic[0].avgall/commondynamic[0].baseall * 100).toPrecision(2)
            // if (commondynamic[0].basetop > 0)
            //     dynalltop = Number(commondynamic[0].avgalltop/commondynamic[0].basetop * 100).toPrecision(2)
            // // dynamictop6.forEach((item, key)=>{
            // //     console.log(key, item)
            // //     if (key===0)
            // //         best = best+`${item.student_nick} + ${item.val}`
            // //     if (item.stud_id===studentId)
            // //         best = `${best}  [${key + 1}/${commondynamic.length}]`
            // // })
        }
        return ret
    }
    render() {
        const {showFooter, showKeyboard, theme, themeColor, online} = this.props.interface
        const {langLibrary} = this.props.userSetup
        return (
            <View style={styles.modalView}>
                <View style={{height: (Dimensions.get('window').height - 100)}}>
                        <Tabs initialPage={0} page={0}>
                            <Tab key={"tab1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>ОБЩАЯ</Text></TabHeading>}>
                                <View style={{marginLeft : 10, marginRight : 10}}>
                                    <Item>
                                        <Left><Text style={{color : "#4472C4", fontWeight : "800", fontSize : RFPercentage(2.2)}}>ОБЩАЯ УСПЕВАЕМОСТЬ:</Text></Left>
                                        <Body><Text style={{color : "#387541", fontWeight : "800", fontSize : RFPercentage(2)}}>{this.getCommonDynamic()[0]}</Text></Body>
                                        <Right><Text style={{color : "#387541", fontWeight : "800", fontSize : RFPercentage(2)}}>{`TOП-6: ${this.getCommonDynamic()[1]}`}</Text></Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                            <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Самый работоспособный ученик с максимальным количеством оценок > 6</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getQtyMarks()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Самый добросовестный (количество домашек)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getWorker()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Ученик с макимальным средним балом</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getMaxAvg()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Ученик со средним максимальным балом TOП-6(Алгебра, Геометрия, Физика, Химия, Английский, Укрмова)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getMaxAvgTop6()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Лучший по динамике (рост среднего бала за месяц)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getDynamic()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Лучший по динамике (ТОП-6) рост среднего бала за месяц</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2)}}>{this.getDynamicTop6()}</Text>
                                        </Right>
                                    </Item>
                                </View>

                            </Tab>
                            <Tab key={"tab2"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>ЛИЧНАЯ[30дней]</Text></TabHeading>}>
                                <View  style={{marginLeft : 10, marginRight : 10}}>
                                    {this.getPrivateStat()}
                                </View>
                            </Tab>
                        </Tabs>
                </View>
                <View style={{flex: 1}}>
                    <Footer style={styles.header}>
                        <FooterTab style={styles.header}>
                            <Button style={[styles.btnClose, {backgroundColor : theme.primaryColor}]} vertical onPress={() => this.onExit()}>
                                <Text style={{color : theme.primaryTextColor}}>
                                    {getLangWord("mobCancel", langLibrary).toUpperCase()}
                                </Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(StatBlock)