/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
            TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import {    Container, Header, Left, Body, Right, Button, Card, CardItem,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab, Badge,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem } from 'native-base';
import RadioForm from 'react-native-radio-form';
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList} from '../../js/helpersLight'
import { Icon } from 'react-native-elements'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { connect } from 'react-redux'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class HelpBlock extends Component {
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
    addQuestionToService=()=>{

    }
    render () {
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        return (
            <View>
                 <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>НОВОСТИ</Text></TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                <Container style={{flex: 1, width : "100%", flex : 1, flexDirection: 'column', position: "relative"}}>
                                    <View style={{flex: 3, borderWidth : 1, borderColor : "#4472C4"}}>
                                        <ScrollView>
                                            {/*<Text>Блок Новостей</Text>*/}
                                            <Card key={1}>
                                                <CardItem>
                                                        <TouchableOpacity
                                                            onPress={() => this.addToChat(JSON.stringify(item.data))}>
                                                            <Body style={{
                                                                paddingLeft: 5,
                                                                paddingRight: 5,
                                                                display : "flex",
                                                                alignItems: "flex-start",
                                                                justifyContent: "center",
                                                            }}>
                                                            <Text style={{fontWeight : "700", color : "#4472C4"}}>Внесены следущие изменения:</Text>
                                                                <Text>Выведены картинки в сообщениях</Text>
                                                                <Text>По клику показывается большое изображение</Text>
                                                                <Text>Добавлены эмоджи</Text>
                                                                <Text>Откорректированы счётчики на бейджах</Text>
                                                                <Text>Откорректировано масшабирование поля ввода</Text>
                                                                <Text>Сделан прототип для вкладки "Прочее"</Text>
                                                                <Text>Сделан прототип для вкладки "Инфо"</Text>
                                                                <Text>Создана загрузка по Токену</Text>
                                                                <Text>Пустые сообщения теперь не отправляются</Text>
                                                            </Body>
                                                        </TouchableOpacity>
                                                    <Right style={{ position : "absolute", right : 5, bottom : 2}}>
                                                        <Text style={{fontSize: RFPercentage(1.3), color : "#4472C4"}} note>{"16/09/19 22:07"}</Text>
                                                    </Right>
                                                </CardItem>
                                            </Card>
                                            </ScrollView>
                                    </View>
                                    <View style={{flex: 1}}>

                                    </View>
                                </Container>
                            </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ВОПРОС-ОТВЕТ</Text></TabHeading>}>
                            <Container style={{flex: 1, width : "100%", flex : 1, flexDirection: 'column', position: "relative"}}>
                                            <View style={{flex: 75}}>
                                                <ScrollView>
                                                {/*<Text>Блок вопросов</Text>*/}
                                                    <Card key={1}>
                                                        <CardItem>
                                                            <TouchableOpacity
                                                                onPress={() => this.addToChat(JSON.stringify(item.data))}>
                                                                <Body style={{
                                                                    paddingLeft: 5,
                                                                    paddingRight: 5,
                                                                    display : "flex",
                                                                    alignItems: "flex-start",
                                                                    justifyContent: "center",
                                                                }}>
                                                                {/*<Text style={{fontWeight : "700", color : "#4472C4"}}>Внесены следущие изменения:</Text>*/}
                                                                <Text>Когда будет доделан логин через социальные сети?</Text>
                                                                </Body>
                                                            </TouchableOpacity>
                                                            <Right style={{ position : "absolute", right : 5, bottom : 2}}>
                                                                <Text style={{fontSize: RFPercentage(1.3), color : "#4472C4"}} note>{"16/09/19 22:07"}</Text>
                                                            </Right>
                                                        </CardItem>
                                                    </Card>
                                                </ScrollView>
                                            </View>

                                        {/*</Body>*/}
                                        {/*<Footer>*/}
                                            <View style={[styles.addMsgContainer, {flex : 40}]}>
                                                <View style={{flex: 7}}>
                                                                <Textarea style={styles.msgAddTextarea}
                                                                    // onKeyPress={this._handleKeyDown}
                                                                    // onChangeText={text=>this.onChangeText('curMessage', text)}
                                                                    // onFocus={()=>{this.props.setstate({showFooter : false})}}
                                                                    // onBlur={()=>{this.props.setstate({showFooter : true})}}
                                                                          placeholder="Задать вопрос разработчику..."  type="text"
                                                                          ref={input=>{this.inputMessage=input}}
                                                                          value={this.state.curMessage}
                                                                />
                                                </View>
                                                <View style={styles.btnAddMessage}>
                                                    <Icon
                                                        name='rightcircle'
                                                        type='antdesign'
                                                        color='#898989'
                                                        size={40}
                                                        onPress={this.addQuestionToService} />
                                                </View>
                                                <View style={{width : 10}}></View>
                                            </View>
                                        {/*</Footer>*/}
                                            {/*<View style={{flex : 1, width: "100%", borderWidth : 1, backgroundColor : "#008"}}>*/}
                                                {/*<Textarea style={styles.msgAddTextarea}*/}
                                                    {/*// onKeyPress={this._handleKeyDown}*/}
                                                    {/*// onChangeText={text=>this.onChangeText('curMessage', text)}*/}
                                                    {/*// onFocus={()=>{this.props.setstate({showFooter : false})}}*/}
                                                    {/*// onBlur={()=>{this.props.setstate({showFooter : true})}}*/}
                                                          {/*placeholder="Задать вопрос разработчику..."  type="text"*/}
                                                          {/*ref={input=>{this.inputMessage=input}}*/}
                                                          {/*value={this.state.curMessage}*/}
                                                {/*/>*/}
                                                {/*<TouchableOpacity*/}
                                                    {/*onPress={this.updateMsg}>*/}
                                                    {/*<View style={styles.updateMsg}>*/}
                                                        {/*<Text style={styles.updateMsgText} >ОТПРАВИТЬ ВОПРОС</Text>*/}
                                                    {/*</View>*/}
                                                {/*</TouchableOpacity>*/}
                                             {/*</View>*/}
                                     {/*</View>*/}
                                {/*</View>*/}
                            {/*</Container>*/}
                            </Container>
                            {/*<Footer>*/}

                            {/*</Footer>*/}
                        </Tab>
                    </Tabs>
                </View>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HelpBlock)