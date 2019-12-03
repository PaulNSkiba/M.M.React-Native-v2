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
import {instanceAxios, mapStateToProps, addMonths, toYYYYMMDD, dateFromTimestamp, arrOfWeekDaysLocal} from '../../js/helpersLight'
import {LOGINUSER_URL, version, API_URL} from '../../config/config'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo from '../../img/LogoMyMsmall.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
import AccordionCustom from '../AccordionCustom/accordioncustom'

class Timetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            daysArr : this.getDaysArr(),
            dayItems : this.getDayItems(),
        }
        this.onExit = this.onExit.bind(this)
    }
    componentDidMount() {
        this.initData()
    }
    initData=()=>{

    }
    onExit = () => {
        // console.log("exitBudget")
        this.props.onexit()
    }
    getDaysArr=()=>{
        // console.log("getChatTagsObj", this.props.userSetup.localChatMessages.filter(item=>(item.tagid!==null)))
        const   {timetable} = this.props.userSetup
        let     daysArr = []

        // console.log("TIMETABLE2", timetable)

        for (let i = 0; i < arrOfWeekDaysLocal.length; i++){
                let newObj = {};
                newObj.label = `${arrOfWeekDaysLocal[i]}`;
                newObj.value = i;
                const tt =  timetable.filter(item=>item!==null).filter(item=>item.weekday===i)
                let cnt = 0
                tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
                newObj.count = cnt
                // newObj.count = timetable.filter(item=>item!==null).filter(item=>item.weekday===i).reduce(function(sum, current) {
                //     //return sum + current;
                //     return sum + current===null?0:(current!==null&&current.position.length===1?1:2)
                // }, 0);
                // console.log("newObj", newObj)
                daysArr.push(newObj);
        }
        return daysArr
    }
    getDayItems=()=>{
        // const origChat = this.props.userSetup.localChatMessages.filter(item=>item.tagid!==null)
        // const chatTags = this.props.userSetup.chatTags.map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.name}[${item.short}]`;
        //     newObj.value = item.id;
        //     return newObj;
        // })

        const   {timetable} = this.props.userSetup
        let     daysArr = []
        for (let i = 0; i < arrOfWeekDaysLocal.length; i++){
            let newObj = {};
            newObj.label = `${arrOfWeekDaysLocal[i]}`;
            newObj.value = i;
            const tt =  timetable.filter(item=>item!==null).filter(item=>item.weekday===i)
            let cnt = 0
            tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
            newObj.count = cnt
            daysArr.push(newObj);
        }

        return daysArr.map((itemDay, key)=>{
            const subjs = timetable.length?(timetable.filter(item=>item!==null).filter(item=>itemDay.value===item.weekday)):[]
            console.log("getDayItems", subjs, timetable, itemDay.weekday)
            return   <View key={key} style={{flex: 1}}>
                <View style={[styles.msgList, {flex: 7}, {marginBottom: 5}]}>
                    {subjs.length ? <ScrollView>
                        {subjs.length?subjs.map(itemSubj=>
                            <Item>
                                <Left><Text style={{color : "#4472C4"}}>{itemSubj.position}</Text></Left>
                                <Body><Text style={{color : "#4472C4"}}>{itemSubj.subj_name_ua}</Text></Body>
                            </Item>
                        ):null}
                    </ScrollView> : null}
                </View>
            </View>
        })
    }
    render() {
        const {daysArr, dayItems} = this.state
        console.log("TIMETABLE", this.props.userSetup)
        return (

            <View style={styles.modalView}>
                <View style={{height: (Dimensions.get('window').height - 100), width : Dimensions.get('window').width}}>
                    {/*<Text style={{color: "#fff"}}>Расписание</Text>*/}
                    <AccordionCustom data={daysArr} data2={dayItems} ishomework={true}/>
                </View>
                <View style={{flex: 1}}>
                    <Footer style={styles.header}>
                        <FooterTab style={styles.header}>
                            <Button style={[styles.btnClose, {width : "100%"}]} vertical /*active={this.state.selectedFooter===2}*/
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
export default connect(mapStateToProps, mapDispatchToProps)(Timetable)