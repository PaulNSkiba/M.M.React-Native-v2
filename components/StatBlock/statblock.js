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
import {instanceAxios, mapStateToProps, addMonths, toYYYYMMDD, dateFromTimestamp, axios2} from '../../js/helpersLight'
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
        const {classID, studentId} = this.props.userSetup
        axios2('get',`${API_URL}class/getstatex/${classID}`,null)
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
                    best = best+`${item.student_nick} + ${item.val}`
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
                console.log(key, item)
                if (key===0)
                    best = best+`${item.student_nick} + ${item.val}`
                if (item.stud_id===studentId)
                    best = `${best}  [${key + 1}/${dynamictop6.length}]`
            })
        }
        console.log("Best2", best)
        return best
    }
    render() {
        return (
            <View style={styles.modalView}>
                <View style={{height: (Dimensions.get('window').height - 100)}}>
                        <Tabs initialPage={0} page={0}>
                            <Tab key={"tab1"} heading={<TabHeading style={styles.tabHeaderWhen}>
                                <Text style={{color: "#fff"}}>ОБЩАЯ</Text></TabHeading>}>
                                <View>
                                    <Item>
                                        <Body>
                                            <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Самый работоспособный ученик с максимальным количеством оценок > 6</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getQtyMarks()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Самый добросовестный (количество домашек)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getWorker()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Ученик с макимальным средним балом</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getMaxAvg()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Ученик со средним максимальным балом TOП-6(Алгебра, Геметрия, Физика, Химия, Английский, Укрмова)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getMaxAvgTop6()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Лучший по динамике (рост среднего бала за месяц)</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getDynamic()}</Text>
                                        </Right>
                                    </Item>
                                    <Item>
                                        <Body>
                                        <Text style={{color : "#4472C4", fontSize : RFPercentage(1.9)}}>Лучший по динамике (ТОП-6) рост среднего бала за месяц</Text>
                                        </Body>
                                        <Right>
                                            <Text style={{color : "#387541", fontSize : RFPercentage(2), marginRight : 10}}>{this.getDynamicTop6()}</Text>
                                        </Right>
                                    </Item>
                                </View>

                            </Tab>
                            <Tab key={"tab2"} heading={<TabHeading style={styles.tabHeaderWhen}>
                                <Text style={{color: "#fff"}}>ЛИЧНАЯ</Text></TabHeading>}>
                            </Tab>
                        </Tabs>
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
export default connect(mapStateToProps, mapDispatchToProps)(StatBlock)