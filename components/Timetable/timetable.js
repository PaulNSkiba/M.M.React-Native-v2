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
import {instanceAxios, mapStateToProps, addMonths, toYYYYMMDD, dateFromTimestamp,
        arrOfWeekDaysLocal, getSubjFieldName, getLangWord} from '../../js/helpersLight'
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
            subjArr : this.getSubjArr(),
            subjItems : this.getSubjItems(),
        }
        this.onExit = this.onExit.bind(this)
    }
    componentDidMount() {
        this.initData()
    }
    initData=()=>{

    }
    onExit = () => {
        console.log("exitTimetable")
        this.props.onexit()
    }
    getDaysArr=()=>{
        // console.log("getChatTagsObj")
        const   {timetable, langLibrary} = this.props.userSetup
        let     daysArr = []
        const arrOfWeekDaysLocalLang = [getLangWord("wdMonday", langLibrary), getLangWord("wdTuesday", langLibrary),
            getLangWord("wdWednesday", langLibrary), getLangWord("wdThursday", langLibrary),
            getLangWord("wdFriday", langLibrary), getLangWord("wdSaturday", langLibrary),
            getLangWord("wdSunday", langLibrary)]
        for (let i = 0; i < arrOfWeekDaysLocalLang.length; i++){
                let newObj = {};
                newObj.label = `${arrOfWeekDaysLocalLang[i]}`;
                newObj.value = i;
                const tt =  timetable.filter(item=>item!==null).filter(item=>item.weekday===i)
                let cnt = 0
                tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
                newObj.count = cnt
                daysArr.push(newObj);
        }
        return daysArr
    }
    getSubjArr=()=>{
        const   {timetable, selectedSubjects} = this.props.userSetup
        let {langCode} = this.props.interface
        let     subjArr = []

        for (let i = 0; i < selectedSubjects.length; i++){
            let newObj = {};
            newObj.label = `${selectedSubjects[i][getSubjFieldName(langCode)]}`;
            newObj.value = i;
            const tt = timetable.filter(item=>item!==null).filter(item=>item.subj_key===selectedSubjects[i].subj_key)
            // let cnt = tt.length
            // tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
            newObj.count = tt.length
            subjArr.push(newObj);
        }
        return subjArr
    }
    getDayItems=()=>{
        const   {timetable, langLibrary} = this.props.userSetup
        const {theme} = this.props.interface
        const arrOfWeekDaysLocalLang = [getLangWord("wdMonday", langLibrary), getLangWord("wdTuesday", langLibrary),
            getLangWord("wdWednesday", langLibrary), getLangWord("wdThursday", langLibrary),
            getLangWord("wdFriday", langLibrary), getLangWord("wdSaturday", langLibrary),
            getLangWord("wdSunday", langLibrary)]
        let     daysArr = []
        for (let i = 0; i < arrOfWeekDaysLocalLang.length; i++){
            let newObj = {};
            newObj.label = `${arrOfWeekDaysLocalLang[i]}`;
            newObj.value = i;
            const tt =  timetable.filter(item=>item!==null).filter(item=>item.weekday===i)
            let cnt = 0
            tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
            newObj.count = cnt
            daysArr.push(newObj);
        }

        return daysArr.map((itemDay, key)=>{
            const subjs = timetable.length?(timetable.filter(item=>item!==null).filter(item=>itemDay.value===item.weekday)):[]
            // console.log("getDayItems", subjs, timetable, itemDay.weekday)
            return   <View key={key} style={{flex: 1}}>
                <View style={{flex: 7, marginBottom: 5, leftMargin : 10, rightMargin : 10}}>
                    {subjs.length ? <ScrollView>
                        {subjs.length?subjs.map((itemSubj, key)=>
                            <Item key={key}>
                                <Left><Text style={{color : "#565656", paddingLeft : 10}}>{itemSubj.position}</Text></Left>
                                <Body><Text style={{color : theme.primaryDarkColor}}>{itemSubj.subj_name_ua}</Text></Body>
                            </Item>
                        ):null}
                    </ScrollView> : null}
                </View>
            </View>
        })
    }
    getSubjItems=()=>{
        const   {timetable, langLibrary, selectedSubjects} = this.props.userSetup
        const {theme, langCode} = this.props.interface
        const arrOfWeekDaysLocalLang = [getLangWord("wdMonday", langLibrary), getLangWord("wdTuesday", langLibrary),
            getLangWord("wdWednesday", langLibrary), getLangWord("wdThursday", langLibrary),
            getLangWord("wdFriday", langLibrary), getLangWord("wdSaturday", langLibrary),
            getLangWord("wdSunday", langLibrary)]
        let     subjArr = []
        for (let i = 0; i < selectedSubjects.length; i++){
            let newObj = {};
            newObj.label = `${selectedSubjects[i][getSubjFieldName(langCode)]}`;
            newObj.value = i;
            newObj.subj_key = selectedSubjects[i].subj_key;
            const tt = timetable.filter(item=>item!==null).filter(item=>item.subj_key===selectedSubjects[i].subj_key)
            // let cnt = tt.length
            // tt.forEach(item=>cnt=cnt+(item===null?0:(item!==null&&item.position.length===1?1:2)))
            newObj.count = tt.length
            subjArr.push(newObj);
        }

        return subjArr.map((itemDay, key)=>{
            const subjs = timetable.length?(timetable.filter(item=>item!==null).filter(item=>itemDay.subj_key===item.subj_key)):[]
            // console.log("getDayItems", subjs, timetable, itemDay.weekday)
            return   <View key={key} style={{flex: 1}}>
                <View style={{flex: 7, marginBottom: 5, leftMargin : 10, rightMargin : 10}}>
                    {subjs.length ? <ScrollView>
                        {subjs.length?subjs.map((itemSubj, key)=>
                            <Item key={key}>
                                <Left><Text style={{color : "#565656", paddingLeft : 10}}>{itemSubj.position}</Text></Left>
                                <Body><Text style={{color : theme.primaryDarkColor}}>{arrOfWeekDaysLocalLang[itemSubj.weekday]}</Text></Body>
                            </Item>
                        ):null}
                    </ScrollView> : null}
                </View>
            </View>
        })
    }
    setActiveTab=i=>{

    }
    render() {
        const {daysArr, dayItems, subjArr, subjItems} = this.state
        const {headerHeight, footerHeight, showFooter, showKeyboard, theme, themeColor} = this.props.interface
        const {langLibrary} = this.props.userSetup
        const {online} = this.props.tempdata
        console.log("TIMETABLE", this.props.userSetup)
        return (
            <View style={styles.modalView}>
                <View style={{height: (Dimensions.get('window').height - 100)}}>
                <Tabs onChangeTab={({ i, ref, from }) => this.setActiveTab(i)}>
                    <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                        {getLangWord("mobByWeekDays", langLibrary).toUpperCase()}
                        </Text></TabHeading>}
                         onPress={()=>console.log("Tab1_Clicked")}>
                        <View style={[styles.modalView, {backgroundColor : theme.primaryLightColor, height : Dimensions.get('window').height}]}>
                            {/*<View style={{height : headerHeight, backgroundColor : theme.primaryLightColor}}>*/}
                            {/*</View>*/}
                            <View style={{height: (Dimensions.get('window').height - 100 - headerHeight), width : Dimensions.get('window').width}}>
                                <AccordionCustom data={daysArr} data2={dayItems} ishomework={true}/>
                            </View>
                        </View>
                    </Tab>
                    <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                        {getLangWord("mobBySubjects", langLibrary).toUpperCase()}
                        </Text></TabHeading>}
                         onPress={()=>console.log("Tab2_Clicked")}>
                        <View style={[styles.modalView, {backgroundColor : theme.primaryLightColor, height : Dimensions.get('window').height}]}>
                            {/*<View style={{height : headerHeight, backgroundColor : theme.primaryLightColor}}>*/}
                            {/*</View>*/}
                            <View style={{height: (Dimensions.get('window').height - 100 - headerHeight), width : Dimensions.get('window').width}}>
                                <AccordionCustom data={subjArr} data2={subjItems} ishomework={true}/>
                            </View>
                        </View>
                    </Tab>
                </Tabs>
                </View>
                <View style={{flex: 1}}>
                    <Footer style={styles.header}>
                        <FooterTab style={styles.header}>
                            <Button style={[styles.btnClose, {width : "100%", backgroundColor : theme.primaryColor}]} vertical
                                    onPress={() => this.onExit()}>
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
export default connect(mapStateToProps, mapDispatchToProps)(Timetable)