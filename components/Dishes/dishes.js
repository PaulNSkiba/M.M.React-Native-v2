/**
 * Created by Paul on 27.02.2020.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions,
        TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import {axios2, mapStateToProps, getLangWord} from '../../js/helpersLight'
import { Header, Left, Body, Right, Button, Title, TabHeading, Tabs, Tab, Footer, FooterTab } from 'native-base';
import { Icon } from 'react-native-elements'
import styles from '../../css/styles'
import {API_URL, AUTH_URL} from '../../config/config'
import AccordionCustom from '../AccordionCustom/accordioncustom'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { QRCode } from 'react-native-custom-qr-codes';
import LogoBlack from '../../img/LogoMyMsmallBlack.png'

class Dishes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dishesPlan : this.props.userSetup.dishes===undefined?[]:this.props.userSetup.dishes,
            dishesFact : [],
        }
        this.onExit = this.onExit.bind(this)
    }
    componentDidMount() {
        this.props.onStopLoading()
    }
    componentWillUnmount(){

    }
    onExit = () => {
        // console.log("exitBudget")
        this.props.onexit()
    }
    getDishes=(dw, thisweek)=>{
        let mp = new Map()
        let dishes = []
        let cnt = 0
        this.state.dishesPlan.filter(item=>item.weekday===dw).forEach(item=>{
            if (!mp.has(item.dish_type)){
                cnt = 1
                mp.set(item.dish_type, cnt)
                dishes.push(item)
            }
            else {
                cnt = cnt + 1
                mp.set(item.dish_type, cnt)
            }
        })
        console.log("getDishes", mp, dishes)
        return dishes.map(item => {
            let newObj = {};
            newObj.label = `${item.dish_type_name}`;
            newObj.value = item.dish_type;
            newObj.count = mp.get(item.dish_type)//toLocalDate(new Date(item.msg_date.length===8?dateFromYYYYMMDD(item.msg_date):item.msg_date), "UA", false, false);
            return newObj;
        })
    }
    onSelectDish=()=>{

    }
    getDishesForAccordion=(dw, thisweek)=>{
        const {theme} = this.props.interface
        let mp = new Map()
        let dishes = []
        let cnt = 0
        this.state.dishesPlan.filter(item=>item.weekday===dw).forEach(item=>{
            if (!mp.has(item.dish_type)){
                cnt = 1
                mp.set(item.dish_type, cnt)
                dishes.push(item)
            }
            else {
                cnt = cnt + 1
                mp.set(item.dish_type, cnt)
            }
        })

        // console.log("getDishes", mp, dishes)
        let dishesPlan = []
        return dishes.map((item, key) => {
            return <RadioForm
                formHorizontal={false}
                animation={false}
                style={{backgroundColor: "#fff"}}
                key={key}
            >
                {


                    this.state.dishesPlan.filter(itemplan => itemplan.weekday===dw&&itemplan.dish_type===item.dish_type).map(item=>{
                        return {
                            label : `${item.name.toUpperCase()} ${item.weight_str} [${item.price}грн]`,
                            value : item.id
                        }
                    }).map((obj, i) => {

                        // let nextDay = this.state.checkTimetable ? this.getNextSubjDayInTimetable(obj.value, today) : null
                        // if (nextDay !== null && !this.state.workType) {
                        //     obj.label = `${obj.label} ${getLangWord("mobTo", langLibrary)} ${nextDay.label}`
                        // }
                        // // console.log("RadioSubjs", obj, nextDay)

                        return <RadioButton labelHorizontal={true} key={i}>
                            {/*  You can set RadioButtonLabel before RadioButtonInput */}
                            <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={null}
                                onPress={(item) => this.onSelectDish(item)}
                                borderWidth={1}
                                buttonInnerColor={theme.primaryDarkColor}
                                buttonOuterColor={theme.primaryDarkColor}
                                buttonSize={12}
                                buttonOuterSize={16}
                                buttonStyle={{}}
                                buttonWrapStyle={{marginLeft: 5, marginTop: 5}}
                            />
                            <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={(item) => this.onSelectDish(item)}
                                labelStyle={{
                                    fontSize: RFPercentage(1.7),
                                    color: theme.primaryDarkColor
                                }}
                                labelWrapStyle={{marginTop: 5}}
                            />
                        </RadioButton>
                    })
                }
            </RadioForm>
        })
    }
    render(){
        const {theme, headerHeight} = this.props.interface
        const {langLibrary} = this.props.userSetup
        console.log("RENDER:DISHES", this.props.userSetup.dishes)
        return (
            <View style={{height: (Dimensions.get('window').height - 100)}}>
                <View>
                    <Tabs>
                    <Tab key={"tab0.0"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Эта неделя</Text></TabHeading>}>
                            <Tabs>
                                <Tab key={"tab1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Пн</Text></TabHeading>}>
                                    <View style={{height : Dimensions.get("window").height - 2*headerHeight - 70, display : "flex", justifyContent: "center"}}>
                                        <AccordionCustom data={this.getDishes(1, true)}  data2={this.getDishesForAccordion(1, true)} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                        <View style={{display: "flex", width : Dimensions.get("window").width, justifyContent : "center", alignItems : "center", position : "absolute", bottom : 70, backgroundColor : theme.primaryLightColor}}>
                                            <QRCode size={100} color={theme.primaryDarkColor} innerEyeStyle='square' logo={LogoBlack} logoSize={40} ecl={"H"} content={`${AUTH_URL}/student/add/${this.props.userSetup.addUserToken}`}/>
                                        </View>
                                    </View>
                                </Tab>
                                <Tab key={"tab2"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Вт</Text></TabHeading>}>
                                    <View style={{height : Dimensions.get("window").height - 2*headerHeight - 70, display : "flex", justifyContent: "center"}}>
                                        <AccordionCustom data={this.getDishes(2, true)}  data2={this.getDishesForAccordion(2, true)} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                    </View>
                                </Tab>
                                <Tab key={"tab3"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Ср</Text></TabHeading>}>
                                    <View style={{height : Dimensions.get("window").height - 2*headerHeight - 70, display : "flex", justifyContent: "center"}}>
                                        <AccordionCustom data={this.getDishes(3, true)}  data2={this.getDishesForAccordion(3, true)} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                    </View>
                                </Tab>
                                <Tab key={"tab4"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Чт</Text></TabHeading>}>
                                    <View style={{height : Dimensions.get("window").height - 2*headerHeight - 70, display : "flex", justifyContent: "center"}}>
                                        <AccordionCustom data={this.getDishes(4, true)}  data2={this.getDishesForAccordion(4, true)} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                    </View>
                                </Tab>
                                <Tab key={"tab5"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Пт</Text></TabHeading>}>
                                    <View style={{height : Dimensions.get("window").height - 2*headerHeight - 70, display : "flex", justifyContent: "center"}}>
                                        <AccordionCustom data={this.getDishes(5, true)}  data2={this.getDishesForAccordion(5, true)} usersetup={this.props.userSetup} ishomework={true} index={0}/>
                                    </View>
                                </Tab>
                            </Tabs>
                    </Tab>
                    <Tab key={"tab0.1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>След неделя</Text></TabHeading>}>
                            <Tabs>
                                <Tab key={"tab1"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Пн</Text></TabHeading>}>
                                    <View style={{marginLeft : 10, marginRight : 10}}>
                                    </View>
                                </Tab>
                                <Tab key={"tab2"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Вт</Text></TabHeading>}>
                                    <View style={{marginLeft : 10, marginRight : 10}}>
                                    </View>
                                </Tab>
                                <Tab key={"tab3"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Ср</Text></TabHeading>}>
                                    <View style={{marginLeft : 10, marginRight : 10}}>
                                    </View>
                                </Tab>
                                <Tab key={"tab4"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Чт</Text></TabHeading>}>
                                    <View style={{marginLeft : 10, marginRight : 10}}>
                                    </View>
                                </Tab>
                                <Tab key={"tab5"} heading={<TabHeading style={{backgroundColor : theme.primaryColor}}><Text style={{color: theme.primaryTextColor}}>Пт</Text></TabHeading>}>
                                    <View style={{marginLeft : 10, marginRight : 10}}>
                                    </View>
                                </Tab>
                            </Tabs>
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
            </View>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishes)
