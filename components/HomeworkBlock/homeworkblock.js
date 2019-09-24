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
import {toLocalDate, dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import LoginBlock from '../LoginBlock/loginBlock'
import { connect } from 'react-redux'
// import MessageList from '../MessageList/messagelist'
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
            selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            previd : 0,
            showPreview : false,
        };
        this.getHomeworkItems = this.getHomeworkItems.bind(this)
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
        return ( arr.map((item, key)=> {
            let msg = prepareMessageToFormat(item, true)
            let hw = msg.hasOwnProperty('hwdate')&&(!(msg.hwdate===undefined))?(toLocalDate(msg.hwdate, "UA"))+':'+msg.subjname:''
            let i = key
            let isImage = false
            if (item.attachment3!==null) {
                isImage = true
            }
            console.log("homeWork", msg.text)
            return (
                <View key={key} id={"msg-"+msg.id} style={{marginTop : 10}}>
                     <View key={msg.id} style={(hw.length?[styles.msgRightSide, styles.homeworkBorder]:[styles.msgRightSide, styles.homeworkNoBorder])}>
                        <View key={'id'+i} style={styles.msgRightAuthor} ><Text style={styles.msgAuthorText}>{item.student_name?item.student_name:this.props.userSetup.userName}</Text></View>
                         {isImage?
                             <View style={{display : "flex", flex : 1, flexDirection: "row"}}>
                                 <TouchableOpacity onPress={()=>{this.setState({previd : msg.id, showPreview : true})}}>
                                     <View style={{flex : 1}}>
                                         <Image
                                             source={{uri: `data:image/png;base64,${JSON.parse(item.attachment3).base64}`}}
                                             style={{ width: 100, height: 100,
                                                 // marginBottom : 15,
                                                 borderRadius: 15,
                                                 overflow: "hidden", margin : 7 }}/>
                                     </View>
                                 </TouchableOpacity>
                                 <View key={'msg'+i} id={"msg-text-"+i}
                                       style={[styles.msgText,
                                           {flex: 3, marginLeft : 20, marginTop : 10}]}>
                                     <Text>{msg.text}</Text>
                                 </View>
                             </View>
                             :<View key={'msg'+i} id={"msg-text-"+i} style={styles.msgText}>
                                 <Text>{msg.text}</Text>
                             </View>}
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
        )
    }
    updateMsg=()=>{

    }
    render () {
        let messages = []
        // if (this.props.isnew)
        //     messages = this.props.localmessages //this.props.chat.localChatMessages.map(item=>prepareMessageToFormat(item))
        // else
        //     messages = this.props.messages

        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        const {userName, localChatMessages : homeworkorig, classID} = this.props.userSetup
        console.log("getHomeworkItems", homework, this.props.userSetup)
        // По умолчанию выбираем домашку на завтра...


        const homeworks = homeworkorig
        console.log("homework", homeworks)
        const homework = homeworkorig.length?homeworkorig.filter(
            item=>{
                console.log("HOMEWORK", item)
                if (!(item.hasOwnProperty("homework_date"))) return false
                if (item.homework_date===null) return false
                if (item.homework_date.length===8) {
                    return (toYYYYMMDD(dateFromYYYYMMDD(item.homework_date)) === toYYYYMMDD(AddDay((new Date()), this.state.selDate.value)))
                }
                else
                    return (toYYYYMMDD(new Date(item.homework_date))===toYYYYMMDD(AddDay((new Date()), this.state.selDate.value)))
            }):0

        // В счётчике обновления делаем на завтра
        return (
            <View>
            {/*{this.props.showLogin?<LoginBlock updateState={this.props.updateState}/>:null}*/}
            <View style={this.props.hidden?styles.hidden:styles.chatContainerNewHW}>
                <View style={styles.msgList}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.showPreview}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                        }}>
                        <View>
                            {homework.length&&this.state.previd?
                                <SingleImage
                                    uri={`data:image/png;base64,${JSON.parse(homework.filter(item=>item.id===this.state.previd)[0].attachment3).base64}`}
                                    style={{position : "relative", height : "100%"}}
                                    onClose={()=>this.setState({showPreview : false, previd : 0})}
                                />:null}

                            <TouchableOpacity
                                style={{position : "absolute", top : 10, right : 10, zIndex:10}}
                                onPress={()=>this.setState({showPreview : false, previd : 0})}>
                                <View style={{

                                    paddingTop : 5, paddingBottom : 5,
                                    paddingLeft : 15, paddingRight : 15, borderRadius : 5,
                                    borderWidth : 2, borderColor : "#33ccff", zIndex:10,
                                }}>
                                    <Text style={{  fontSize : 20,
                                        color: "#33ccff",
                                        zIndex:10,
                                    }}
                                    >X</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </Modal>
                    <Container>
                            <Tabs>
                                <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ЗАДАНИЯ</Text></TabHeading>}>
                                    <View style={{flex : 1}}>
                                        <View style={[styles.msgList, {flex: 7}, {marginBottom : 70}]}>
                                            <ScrollView
                                                ref="scrollViewHW"
                                                onContentSizeChange={( contentWidth, contentHeight ) => {
                                                    console.log("onContentSizeChange", contentHeight)
                                                    this.refs.scrollViewHW.scrollToEnd()
                                                }}>
                                                {this.getHomeworkItems(homework)}
                                            </ScrollView>
                                        </View>
                                        <View style={{flex : 1}}>

                                        </View>
                                    </View>
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
                    </Container>
                </View>
            </View>
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