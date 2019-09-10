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
import { connect } from 'react-redux'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

// import '../../ChatMobile/chatmobile.css'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};
const tableStyles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff', borderWidth: 2, borderColor : "#8866aa" },
    head: { height: 40, backgroundColor: '#808B97', color : "#fff", textAlign: "center" },
    text: { margin: 6, textAlign : "center", backgroundColor: '#fff' },
    headtext : {  color : "#fff" },
    wrapper: { flexDirection: 'row' },
});

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
    render () {
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        return (
            <Container>
                <View style={styles.modalView}>
                    <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ОЦЕНКИ</Text></TabHeading>}>

                            <View style={styles.homeworkSubjectList}>
                                <View style={{marginTop : 15}}>
                                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                                        {/*<TableWrapper style={tableStyles.wrapper}>*/}
                                            {/*<Col data={['Предмет']} widthArr={[100]} style={tableStyles.title}  textStyle={tableStyles.text}/>*/}
                                            {/*<Row data={this.state.tableHead} flexArr={[1, 1, 1, 1, 1]} style={tableStyles.head} textStyle={tableStyles.head}/>*/}
                                        {/*</TableWrapper>*/}
                                        {/*<TableWrapper style={tableStyles.wrapper}>*/}
                                            {/*<Row data={this.state.tableHead} style={tableStyles.head} textStyle={tableStyles.text}/>*/}
                                            {/*<Col data={this.state.tableTitle} widthArr={[100]} style={tableStyles.title}  textStyle={tableStyles.text}/>*/}
                                            <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={tableStyles.head} textStyle={tableStyles.head}/>
                                            <Rows data={this.state.tableData} widthArr={this.state.widthArr} textStyle={tableStyles.text}/>
                                        {/*</TableWrapper>*/}
                                    </Table>
                                </View>
                                {/*<RadioForm*/}
                                    {/*dataSource={subjects}*/}
                                    {/*itemShowKey="label"*/}
                                    {/*itemRealKey="value"*/}
                                    {/*circleSize={16}*/}
                                    {/*initial={0}*/}
                                    {/*formHorizontal={false}*/}
                                    {/*labelHorizontal={true}*/}
                                    {/*onPress={(item) => this.onSelectSubject(item)}*/}
                                {/*/>*/}
                            </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ЗА ПЕРИОД</Text></TabHeading>}>
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
                </View>
            </Container>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MarksBlock)