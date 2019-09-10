/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
    TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import MessageList from '../MessageList/messagelist'
import { connect } from 'react-redux'
// import '../../ChatMobile/chatmobile.css'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class HomeworkBlock extends Component {
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
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
        };

        // this.onMessageDblClick = this.onMessageDblClick.bind(this)
        // this.onSaveMsgClick=this.onSaveMsgClick.bind(this)
        // this.onCancelMsgClick=this.onCancelMsgClick.bind(this)
        // this.onDelMsgClick=this.onDelMsgClick.bind(this)
        // this.onLongPressMessage=this.onLongPressMessage.bind(this)
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
    getHomeworkItems=arr=>{
        let newarr = arr.map((item, key)=> {
            let msg = prepareMessageToFormat(item, true)
            let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))?(dateFromYYYYMMDD(msg.hwdate)).toLocaleDateString()+':'+msg.subjname:''
            let i = key
            console.log("homeWOrk", msg.text)
            return (
                <View key={key} id={"msg-"+msg.id} style={{marginTop : 10}}>
                     <View key={msg.id} style={(hw.length?[styles.msgRightSide, styles.homeworkBorder]:[styles.msgRightSide, styles.homeworkNoBorder])}>
                        <View key={'id'+i} style={styles.msgRightAuthor} ><Text style={styles.msgAuthorText}>{item.student_name?item.student_name:this.props.userSetup.userName}</Text></View>
                            <View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                <Text>{msg.text}</Text>
                            </View>
                            <View style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>
                                <Text style={msg.id?styles.btnAddTimeDone:styles.btnAddTime}>{msg.time}</Text>
                            </View>
                            {hw.length?
                                <View key={'idhw'+i} style={[styles.msgRightIshw, {color : 'white'}]}>
                                    <Text style={{color : 'white'}}>{hw}</Text>
                                </View>:null}
                    </View>
                </View>
            )
            // return <View key={key}><Text>{msg.text}</Text></View>
        })
        return newarr
    }
    render () {
        let messages = []
        // if (this.props.isnew)
        //     messages = this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
        // else
        //     messages = this.props.messages

        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        const {userName, homework, classID} = this.props.userSetup
        console.log("getHomeworkItems", homework, this.props.userSetup)
        return (
            <View style={styles.msgList}>
            <Container>
                {/*<View style={styles.modalView}>*/}
                    <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ЗАДАНИЯ</Text></TabHeading>}>
                            {/*<View style={styles.homeworkSubjectList}>*/}
                                <ScrollView
                                    ref="scrollView"
                                    onContentSizeChange={( contentWidth, contentHeight ) => {
                                        this.refs.scrollView.scrollToEnd()
                                    }}>
                                    {this.getHomeworkItems(homework)}
                                </ScrollView>
                            {/*</View>*/}
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>НА КОГДА</Text></TabHeading>}>
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
                    </Tabs>
                {/*</View>*/}
            </Container>
            </View>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeworkBlock)