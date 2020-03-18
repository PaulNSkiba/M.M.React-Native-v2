/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
         TouchableHighlight, Modal, Radio, TouchableOpacity, Dimensions } from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem, Badge, Icon as IconBase } from 'native-base';
import { Avatar, Icon, withBadge } from 'react-native-elements'
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, addDay,
        toYYYYMMDD, daysList, getLangWord, axios2} from '../../js/helpersLight'
import { connect } from 'react-redux'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Budget from '../Budget/budget'
import StatBlock from '../StatBlock/statblock'
import Timetable from '../Timetable/timetable'
import Dishes from '../Dishes/dishes'
import {API_URL} from '../../config/config'

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
            showStat : false,
            showTimetable: false,
            showDishes : false,
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
    componentDidMount(){
        this.getDishesData()
    }
    getDishesData=()=>{
        const {school_id} = this.props.userSetup
        const ondate = '20200101'
        axios2('get', `${API_URL}dishes/get/${school_id}/${ondate}`)
            .then(res=>{
                console.log("DISHES:PLAN", school_id, res.data)
                this.props.onReduxUpdate("UPDATE_DISHES", res.data)
                // this.setState({dishesPlan: res.data})
            })
            .catch(err=>{
                console.log("DISHES:ERR", err)
            })
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
        this.setState({showBudget: false, showStat : false, showTimetable : false, showDishes : false})
    }
    render () {
        const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        const initialDay = this.getNextStudyDay(daysArr)[0];
        const {langLibrary} = this.props.userSetup
        const {theme} = this.props.interface
        console.log("ETC", this.state.showDishes)
        return (
            <Container style={{backgroundColor : theme.primaryLightColor, height : Dimensions.get('window').height}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showBudget}
                    onRequestClose={() => {
                    }}>
                    <View>
                        <Body>
                            <Budget onexit={this.onExit}/>
                        </Body>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showStat}
                    onRequestClose={() => {
                    }}>
                    <View>
                        <Body>
                            <StatBlock onexit={this.onExit}/>
                        </Body>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showDishes}
                    onRequestClose={() => {
                    }}>
                    <View>
                        <Body>
                            <Dishes onexit={this.onExit}/>
                        </Body>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showTimetable}
                    onRequestClose={() => {
                    }}>
                    <View>
                        <Body>
                            <Timetable onexit={this.onExit}/>
                        </Body>
                    </View>
                </Modal>
                <View style={[styles.modalView, {height : Dimensions.get('window').height}]}>
                    <Tabs>
                        <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>
                            {getLangWord("mobApps", langLibrary).toUpperCase()}
                        </Text></TabHeading>}>
                           <View style={{flex : 1, flexDirection : "column", justifyContent : "flex-start", height : Dimensions.get('window').height}}>
                            <View style={{flex: 1, flexDirection : "row", padding : 10, justifyContent : "space-around", flexWrap : "wrap", backgroundColor : theme.primaryLightColor, height : Dimensions.get('window').height}}>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{this.setState({showTimetable: true})}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'assignment'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobTimetable", langLibrary)}
                                    </Text>
                                    <IconBase name="checkmark-circle" style={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -14,
                                        fontSize: 20,
                                        color: theme.secondaryColor,
                                    }}/>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{this.props.userSetup.isadmin===4 ? null : this.setState({showBudget: true})}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'payment'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobBudget", langLibrary)}
                                    </Text>
                                    {this.props.userSetup.isadmin === 4 ? null :
                                        <IconBase name="checkmark-circle" style={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -14,
                                            fontSize: 20,
                                            color: theme.secondaryColor,
                                            }}/>
                                    }
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={true}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'pool'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobSociety", langLibrary)}
                                    </Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={true}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'school'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobTutors", langLibrary)}
                                    </Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{this.setState({showStat: true})}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'equalizer'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobStatistics", langLibrary)}
                                    </Text>
                                    <IconBase name="checkmark-circle" style={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -14,
                                        fontSize: 20,
                                        color: theme.secondaryColor,
                                    }}/>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={true}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'bookmark'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobTagList", langLibrary)}
                                    </Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={true}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'album'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobMusic", langLibrary)}
                                    </Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={true}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{}}>
                                    <Icon size={52} color={theme.primaryDarkColor} active type={'material'} name={'build'} inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobSettings", langLibrary)}
                                    </Text>
                                </Button>
                                <Button style={{backgroundColor : "#f0f0f0", color : "#fff", width : 80, height : 80, margin : 5}}
                                        disabled={false}
                                        badge vertical
                                        active={true}
                                        onPress={()=>{this.props.onStartLoading(); this.setState({showDishes: true})}}>
                                    <IconBase type="MaterialCommunityIcons"
                                          name="food"
                                          size={52}
                                          color={theme.primaryDarkColor} active
                                          style = {{fontSize:52, color: theme.primaryDarkColor}}
                                              inverse />
                                    <Text style={{fontSize: RFPercentage(1.6)}}>
                                        {getLangWord("mobDishes", langLibrary)}
                                    </Text>
                                </Button>
                            </View>
                            {/*<View style={{flex: 1, flexDirection : "row", padding : 10}}>*/}
                            {/*</View>*/}
                           </View>
                        </Tab>
                        <Tab heading={<TabHeading style={{backgroundColor : theme.primaryColor}}>
                            <Text style={{color: theme.primaryTextColor}}>
                                {getLangWord("mobAppsSelected", langLibrary).toUpperCase()}
                            </Text>
                            </TabHeading>}>
                            <View style={[styles.homeworkSubjectList, {height : Dimensions.get('window').height}]}>

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
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(ETCBlock)