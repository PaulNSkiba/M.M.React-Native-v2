/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions, TouchableOpacity} from 'react-native';
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { Icon } from 'react-native-elements'
import axios from 'axios';
import {instanceAxios, mapStateToProps} from '../../js/helpersLight'
import { version, AUTH_URL, API_URL} from '../../config/config'
import LoggingByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo150 from '../../img/logo150.png'
import Hamburger from 'react-native-hamburger';
import LogoBlack from '../../img/LogoMyMsmallBlack.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
import { QRCode } from 'react-native-custom-qr-codes';
// import Logo from '../../img/logo45.png'

class HeaderBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessages: [],
            selectedFooter: 0,
            showLogin: false,
            username: '',
            password: '',
            userID: 0,
            userName: '',
            netOnline: false,
            netType: '',
            showQR : false,
            geoObj : {city : "", country : "", iso_code : ""},
            showDrawer : false,
        }
    }
    componentDidMount() {
        this.getGeo2()
    }
    getGeo2 = () => {
        axios.get(`${API_URL}getgeo`)
            .then(response =>this.setState({geoObj : response.data}))
            .catch(response => {
                let obj = {}
                obj.city = "Kyiv"
                obj.country = "Ukraine"
                obj.iso_code = "UA"
                this.setState({getObj : obj})
            })
    }
    measureView(event : Object) {
        // console.log(`*** event: ${JSON.stringify(event.nativeEvent)}`);
        this.props.onReduxUpdate("HEADER_HEIGHT", event.nativeEvent.layout.height)
        // return JSON.stringify(event.nativeEvent)
        // you'll get something like this here:
        // {"target":1105,"layout":{"y":0,"width":256,"x":32,"height":54.5}}
    }
    render(){
        const {token, theme, userID, markscount, userName} = this.props.userSetup
        return (
            <View
                onLayout={(event) =>this.measureView(event)}>
            <Header style={[styles.header, {backgroundColor : theme.primaryDarkColor}]}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showQR}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{
                        width: Dimensions.get('window').width * 0.99,
                        height: Dimensions.get('window').height * 0.99,
                        display : "flex",
                        flext : 1,
                        justifyContent : "center",
                        alignItems : "center",
                    }}>
                        {/*{console.log("QR", `${AUTH_URL}/student/add/${this.props.userSetup.addUserToken}`)}*/}
                        <QRCode innerEyeStyle='square' logo={LogoBlack} ecl={"H"} content={`${AUTH_URL}/student/add/${this.props.userSetup.addUserToken}`}/>
                        <Text style={{marginTop : 40}}>Отсканируйте QR-код, чтобы присоединиться к</Text>
                        <Text>{this.props.userSetup.classNumber}-й класс, {this.state.geoObj.city}, {this.state.geoObj.country}, {this.state.geoObj.iso_code}</Text>
                        <TouchableOpacity
                            style={{position: "absolute", top: 10, right: 10, zIndex: 10}}
                            onPress={() => this.setState({showQR: false})}>
                            <View style={{
                                paddingTop: 5, paddingBottom: 5,
                                paddingLeft: 15, paddingRight: 15, borderRadius: 5,
                                borderWidth: 2, borderColor: "#33ccff", zIndex: 10,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: "#33ccff",
                                    zIndex: 10,
                                }}
                                >X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>

                {this.props.token.length ?
                    <LoggingByToken email={this.props.email} token={this.props.token} logout={false}/> :
                    null}
                {this.props.userSetup.token.length?this.props.updateState("userToken", token):null}
                {this.props.updateState("marksInBaseCount", markscount)}
                <View style={{flex : 1, justifyContent : "flex-start", paddingRight : 0, flexDirection : "row", alignItems : "center"}}>
                    <View style={{marginRight : 0}}>
                        <Hamburger
                            active={this.state.showDrawer}
                            type={"arrow"}
                            color={theme.primaryTextColor}
                            onPress={()=>{this.setState({showDrawer:!this.state.showDrawer});this.props.showdrawer()}}
                        />
                    </View>
                    <View style={{position: "relative", marginLeft : 0}}>
                        <TouchableOpacity onPress={()=>this.setState({showQR:true})}>
                            <Image style={{width: 45, height: 45}} source={Logo150}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{position: "relative", flexDirection: "row", marginLeft : 10}}>
                        <View>
                            <Title style={[styles.myTitle, {color : theme.primaryTextColor}]}>My.Marks</Title>
                        </View>
                        <OfflineNotice/>
                    </View>

                </View>


                <View>
                    <View style={{positon: "relative", flex : 1, justifyContent: "center", alignItems : "center"}}>
                        <Text style={[{
                            fontSize: RFPercentage(1),
                            position: "absolute",
                            right: 0,
                            top: 0,
                            color: theme.primaryTextColor
                        }]}>{version}</Text>
                        <View >
                            <Button transparent disabled={this.props.userSetup.showLogin}>
                                {userID?<Text style={{color: theme.primaryTextColor, fontWeight: "700"}}>{userName}</Text>:null}
                                <Icon size={36} color={userID ? theme.primaryTextColor : theme.primaryLightColor}
                                      style={styles.menuIcon} name='person'
                                      onPress={ () => {
                                          if (!this.props.userSetup.showLogin) {
                                              this.props.onReduxUpdate("USER_LOGGEDIN_DONE");
                                              this.props.onReduxUpdate("SHOW_LOGIN", true);
                                              this.props.updateState('selectedFooter', 0);
                                              this.props.updateState('showLogin')
                                          }
                                          else {
                                              this.props.onReduxUpdate("SHOW_LOGIN", false);
                                          }
                                      }}/>
                            </Button>
                        </View>
                    </View>
                </View>
            </Header>
            </View>
        )
    }
}
const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderBlock)