/**
 * Created by Paul on 08.10.2019.
 */
/**
 * Created by Paul on 27.08.2019.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {    Container, Header, Left, Body, Right, Button,
            Title, Content,  Footer, FooterTab, TabHeading, Tabs, Tab,
            Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail } from 'native-base';
import {Avatar, Badge, Icon, withBadge} from 'react-native-elements'
import {bindActionCreators} from 'redux';
import {instanceAxios, mapStateToProps} from '../../js/helpersLight'
import {LOGINUSER_URL, version} from '../../config/config'
import {userLoggedIn, userLoggedInByToken, userLoggedOut} from '../../actions/userAuthActions'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Logo from '../../img/LogoMyMsmall.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
// import {Text} from "react-native-elements/src/index.d";
// import {Image} from "react-native-elements/src/index.d";
// import NetInfo from "@react-native-community/netinfo";
// import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from './js/helpersLight'

class Budget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        //     chatMessages: [],
        //     selectedFooter: 0,
        //     showLogin: false,
        //     username: '',
        //     password: '',
        //     userID: 0,
        //     userName: '',
        //     netOnline: false,
        //     netType: '',
         }
        // this.onLogin = this.onLogin.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
        this.onExit=this.onExit.bind(this)
    }

    componentDidMount() {
    }
    onExit=()=>{
        console.log("exitBudget")
        this.props.onexit()
    }
    render = () => {

        {/*<View  style={styles.chatContainerNewHW}>*/}
        {/*/!*<Container style={{flex : 5}}>*!/*/}
        {/*<View style={{height : 300, borderWidth : 2}}>*/}
        {/*<Header hasTabs/>*/}
        {/*<Tabs renderTabBar={()=> <ScrollableTab />}>*/}
        {/*<Tab heading="08.19">*/}
        {/*/!*<Tab5 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*<Tab heading="09.19">*/}
        {/*/!*<Tab1 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*<Tab heading="10.19">*/}
        {/*/!*<Tab2 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*<Tab heading="11.19">*/}
        {/*/!*<Tab3 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*<Tab heading="12.19">*/}
        {/*/!*<Tab4 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*<Tab heading="01.20">*/}
        {/*/!*<Tab5 />*!/*/}
        {/*<Text>{"Бюджет"}</Text>*/}
        {/*</Tab>*/}
        {/*</Tabs>*/}
        {/*</View>*/}
        {/*<View style={[{flex : 1}, styles.header]}>*/}
        {/*<Button style={[styles.btnClose, {borderWidth : 2}]} onPress={()=>this.onExit()}>*/}
        {/*/!*<Icon active name="ios-bookmarks" />*!/*/}
        {/*<Text style={styles.btnCloseText}>ВЫХОД</Text>*/}
        {/*</Button>*/}
        {/*</View>*/}
        {/*</View>*/}
        {/*<LogginByToken email={this.props.email} token={this.props.token} logout={true}/>*/
            let studList = [
                {name : "Иваненко", credit : 2, payment1 : 0, payment2 : 1, payment3 : 1, payment4 : 0, out:"Бумага"},
                {name : "Петренко", credit : 0, payment1 : 1, payment2 : 1, payment3 : 0, payment4 : 0, out:"Подарки учителям"},
                {name : "Сидоренко", credit : 1, payment1 : 0, payment2 : 1, payment3 : 0, payment4 : 0, out:"Подарки активным"},
                {name : "Григоренко", credit : 3, payment1 : 1, payment2 : 1, payment3 : 1, payment4 : 0, out:"Подарки ДР"},
            ]
            // Бумага
            // Подарки учителям
            // Подарки активным
            // Подарки ДР

            console.log("Budget")
            // const height =
            return (
                <View style={styles.modalView}>
                    <View style={{height :  (Dimensions.get('window').height - 100)}}>
                        <Tabs>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>{"08.19"}</Text></TabHeading>}>
                                {/*<Text>{"Бюджет"}</Text>*/}
                                <View style={{height : 400, margin : 8}}>
                                    <View style={{flexDirection : "column", justifyContent : "flex-start", alignItems : "flex-start", alignSelf : "flex-start"}}>
                                        <View style={{height : 22, flexDirection : "row"}}>
                                            <View style={{width : 100, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}><Text style={{textAlign : "center"}}>Студент</Text></View>
                                            <View style={{width : 20, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}><Text style={{textAlign : "center", fontSize : RFPercentage(1.2), alignItems: "center"}}>Долг</Text></View>
                                            <View style={{width : 100, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>+</Text></View>
                                            <View style={{width : 110, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#FFCFE2"}}><Text style={{textAlign : "center"}}>-</Text></View>
                                        </View>
                                        <View style={{height : 22, flexDirection : "row"}}>
                                            <View style={{width : 120, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}></View>
                                            <View style={{width : 25, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>1</Text></View>
                                            <View style={{width : 25, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>2</Text></View>
                                            <View style={{width : 25, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>3</Text></View>
                                            <View style={{width : 25, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>4</Text></View>
                                            <View style={{width : 110, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}></View>
                                        </View>
                                        {studList.map((item, key)=>
                                         <View style={{height : 22, flexDirection : "row"}}>
                                            <View key={"st"+key} style={{width : 100, height : 22, borderWidth : 1, borderColor : "#7DA8E6", fontSize : RFPercentage(1.4)}}><Text>{item.name}</Text></View>
                                            <View key={"credit"+key} style={{width : 20, height : 22, borderWidth : 1, borderColor : "#7DA8E6"}}><Text style={{textAlign : "center"}}>{item.credit}</Text></View>
                                            <View key={"pays"+key} style={{width : 100, height : 22, flexDirection : "row"}}>
                                                <View style={{width : 25, height : 22, borderWidth : 1, borderColor : "#7DA8E6", backgroundColor : item.payment1?"#C6EFCE":"#fff"}}></View>
                                                <View style={{width : 25, height : 22, borderWidth : 1, borderColor : "#7DA8E6", backgroundColor : item.payment2?"#C6EFCE":"#fff"}}></View>
                                                <View style={{width : 25, height : 22, borderWidth : 1, borderColor : "#7DA8E6", backgroundColor : item.payment3?"#C6EFCE":"#fff"}}></View>
                                                <View style={{width : 25, height : 22, borderWidth : 1, borderColor : "#7DA8E6", backgroundColor : item.payment4?"#C6EFCE":"#fff"}}></View>
                                            </View>
                                             <View key={"outs"+key} style={{width : 110, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#FFCFE2", fontSize : RFPercentage(1.3)}}><Text>{item.out}</Text></View>
                                         </View>)}
                                        <View style={{height : 22, flexDirection : "row"}}>
                                            <View style={{width : 120, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}><Text style={{textAlign : "center"}}>+1500</Text></View>
                                            {/*<View style={{width : 30, height : 22, borderWidth : .5, borderColor : "#7DA8E6"}}></View>*/}
                                            <View style={{width : 100, height : 22, backgroundColor : "#C6EFCE"}}><Text style={{textAlign : "center"}}>+3800</Text></View>
                                            <View style={{width : 110, height : 22, borderWidth : .5, borderColor : "#7DA8E6", backgroundColor : "#FFCFE2"}}><Text style={{textAlign : "center"}}>-3200</Text></View>
                                        </View>
                                        <View style={{width : 220, height : 22, backgroundColor : "#C6EFCE", fontSize : RFPercentage(1.4)}}><Text>1.Класс</Text></View>
                                        <View style={{width : 220, height : 22, backgroundColor : "#C6EFCE", fontSize : RFPercentage(1.4)}}><Text>2.Школа</Text></View>
                                        <View style={{width : 220, height : 22, backgroundColor : "#C6EFCE", fontSize : RFPercentage(1.4)}}><Text>3.День учителя</Text></View>
                                        <View style={{width : 220, height : 22, backgroundColor : "#C6EFCE", fontSize : RFPercentage(1.4)}}><Text>4.Хозтовары</Text></View>
                                    </View>
                                </View>
                                </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>{"09.19"}</Text></TabHeading>}>
                                <Text>{"Бюджет2"}</Text>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>{"10.19"}</Text></TabHeading>}>
                                <Text>{"Бюджет3"}</Text>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>{"11.19"}</Text></TabHeading>}>
                                <Text>{"Бюджет4"}</Text>
                            </Tab>
                            <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color : "#fff"}}>{"12.19"}</Text></TabHeading>}>
                                <Text>{"Бюджет5"}</Text>
                            </Tab>
                        </Tabs>
                    </View>
                    <View style={{flex : 1}}>
                        <Footer style={styles.header}>
                            <FooterTab style={styles.header}>
                                <Button style={styles.btnClose} vertical /*active={this.state.selectedFooter===2}*/ onPress={()=>this.onExit()}>
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
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Budget)