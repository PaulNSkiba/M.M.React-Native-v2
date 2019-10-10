/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
         TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem } from 'native-base';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import { connect } from 'react-redux'
import ButtonWithBadge from '../../components/ButtonWithBadge/buttonwithbadge'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Budget from '../Budget/budget'
// import '../../ChatMobile/chatmobile.css'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class ETCBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBudget : false,
            // messages : this.props.messages,
            // editKey: -1,
            // modalVisible : false,
            // checkSchedule : true,
            // selSubject : {value : 0},
            // selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
            // currentHomeworkID : 0,
            // selDate : this.getNextStudyDay(daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;}))[1],
        };
        this.onExit=this.onExit.bind(this)
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
    onExit=()=> {
        console.log("Exit")
        this.setState({showBudget: false})
    }
    render () {
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        return (
            <Container>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showBudget}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View>
                        {/*{messages.length&&this.state.previd?*/}
                            {/*<SingleImage*/}
                                {/*uri={`data:image/png;base64,${JSON.parse(messages.filter(item=>item.id===this.state.previd)[0].attachment3).base64}`}*/}
                                {/*style={{position : "relative", height : "100%"}}*/}
                                {/*onClose={()=>this.setState({showPreview : false, previd : 0})}*/}
                            {/*/>:null}*/}

                        {/*<TouchableOpacity*/}
                            {/*style={{position : "absolute", top : 10, right : 10, zIndex:10}}*/}
                            {/*onPress={()=>this.setState({showPreview : false, previd : 0})}>*/}
                            {/*<View style={{*/}

                                {/*paddingTop : 5, paddingBottom : 5,*/}
                                {/*paddingLeft : 15, paddingRight : 15, borderRadius : 5,*/}
                                {/*borderWidth : 2, borderColor : "#33ccff", zIndex:10,*/}
                            {/*}}>*/}
                                {/*<Text style={{  fontSize : 20,*/}
                                    {/*color: "#33ccff",*/}
                                    {/*zIndex:10,*/}
                                {/*}}*/}
                                {/*>X</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        <Body>
                            <Budget onexit={this.onExit}/>
                        </Body>

                    </View>
                </Modal>
                <View style={styles.modalView}>
                    <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ПРИЛОЖЕНИЯ</Text></TabHeading>}>
                           <View style={{flex : 1, flexDirection : "column", justifyContent : "flex-start"}}>
                            <View style={{flex: 1, flexDirection : "row", padding : 10, justifyContent : "space-around", flexWrap : "wrap"}}>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'assignment'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Расписание"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{this.setState({showBudget: true})}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'payment'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Бюджет"}</Text>
                                    <Badge
                                           value={""}
                                           status={"success"}
                                           containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                                    </Badge>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'pool'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Кружки"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'school'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Репетиторы"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'equalizer'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Статистика"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'bookmark'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Метки чата"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'album'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Музыка"}</Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={"#4472C4"} active type={'material'} name={'build'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>{"Настройки"}</Text>
                                </Button>
                            </View>
                            <View style={{flex: 1, flexDirection : "row", padding : 10}}>
                            </View>
                           </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ВЫБРАННЫЕ</Text></TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                {/*<RadioForm*/}
                                    {/*// style={{ paddingBottom : 20 }}*/}
                                    {/*dataSource={daysArr}*/}
                                    {/*itemShowKey="label"*/}
                                    {/*itemRealKey="value"*/}
                                    {/*circleSize={16}*/}
                                    {/*initial={initialDay}*/}
                                    {/*formHorizontal={false}*/}
                                    {/*labelHorizontal={true}*/}
                                    {/*onPress={(item) => this.onSelectDay(item)}*/}
                                {/*/>*/}
                            </View>
                        </Tab>
                    </Tabs>
                </View>
            </Container>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ETCBlock)