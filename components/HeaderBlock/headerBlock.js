/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions, TouchableOpacity} from 'react-native';
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { Icon } from 'react-native-elements'
import store from '../../store/configureStore'
import axios from 'axios';
import {instanceAxios, mapStateToProps, hasAPIConnection} from '../../js/helpersLight'
import { version, AUTH_URL, API_URL} from '../../config/config'
import LoggingByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo150 from '../../img/logo150.png'
import Hamburger from 'react-native-hamburger';
import LogoBlack from '../../img/LogoMyMsmallBlack.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
import { QRCode } from 'react-native-custom-qr-codes';
import { checkInternetConnection, offlineActionCreators } from 'react-native-offline';

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
            onlineTimer : {},
        }
        this.connectivityCheck = this.connectivityCheck.bind(this)
    }
    componentDidMount() {
        this.getGeo2()
        const timer = setInterval( this.connectivityCheck, 60000)
        this.setState({onlineTimer : timer})
    }
    componentWillUnmount(){
        clearInterval(this.state.onlineTimer)
    }
    connectivityCheck(){
        const {online} = this.props.tempdata
        hasAPIConnection()
            .then(res=> {
                if (res !== online)
                    this.props.onReduxUpdate('UPDATE_ONLINE', res)
            })

            // hasAPIConnection()
            // const { connectionChange } = offlineActionCreators;
            // console.log("connectivtiyCheck.1")
            // // const isConnected = await checkInternetConnection(AUTH_URL, 3000, true);
            // Promise.resolve(
            // Promise.resolve(axios.get(`${API_URL}ping`, null, {timeout : 2000}))
            //     .then(res=>{
            //         console.log(res,"----------------is gettting info")
            //         // setIsConnected()
            //     }).catch(err=>{
            //         console.log(err,"-----------------not getting info")
            //     }))
            //     .then(res=>console.log("CONNECTED?"))
            //     .error(res=>console.log("NOT&&&"))
            // // this.props.onReduxUpdate('UPDATE_ONLINE', isConnected)
            // console.log("connectivtiyCheck.2")
            // AUTH_URL, 3000, true

            // checkInternetConnection()
            //     .then(isConnected => {
            //         console.log("connectivtiyCheck2", isConnected)
            //         if (isConnected!==this.props.userSetup.online) {
            //             console.log("headerBlock", isConnected)
            //             // store.dispatch(connectionChange(isConnected));
            //             this.props.onReduxUpdate('UPDATE_ONLINE', isConnected)
            //         }
            //     })
            //     .catch(res=>console.log("headerBlock:error", res))
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
        const {token, userID, markscount, userName, langLibary, classNumber} = this.props.userSetup
        const {showFooter, showKeyboard, theme, themeColor, showLogin} = this.props.interface
        const {online} = this.props.tempdata
        console.log("headerBlock:render", this.props.userSetup)
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
                        <Text>{classNumber}-й класс, {this.state.geoObj.city}, {this.state.geoObj.country}, {this.state.geoObj.iso_code}</Text>
                        <TouchableOpacity
                            style={{position: "absolute", top: 10, right: 10, zIndex: 10}}
                            onPress={() => this.setState({showQR: false})}>
                            <View style={{
                                paddingTop: 5, paddingBottom: 5,
                                paddingLeft: 15, paddingRight: 15, borderRadius: 5,
                                borderWidth: 2, borderColor: theme.photoButtonColor, zIndex: 10,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: theme.photoButtonColor,
                                    zIndex: 10,
                                }}
                                >X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>

                {this.props.token.length ?
                    <LoggingByToken email={this.props.email} token={this.props.token} langLibary={this.props.langLibary} theme={this.props.theme} themeColor={this.props.themeColor} logout={false}/> :
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
                            <Button transparent disabled={showLogin}>
                                {userID?<Text style={{color: theme.primaryTextColor, fontWeight: "700", fontSize : userName.length > 10?RFPercentage(1.75):RFPercentage(2)}}>{userName}</Text>:null}
                                <Icon size={36} color={userID ? theme.primaryTextColor : theme.primaryLightColor}
                                      style={styles.menuIcon} name='person'
                                      onPress={ () => {
                                          if (!showLogin) {
                                              // this.props.updateState("showFooter", false)
                                              this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', false);
                                              this.props.onReduxUpdate("USER_LOGGEDIN_DONE");
                                              this.props.onReduxUpdate("SHOW_LOGIN", true);
                                              this.props.updateState('selectedFooter', 0);
                                              this.props.updateState('showLogin')
                                          }
                                          else {
                                              // this.props.updateState("showFooter", true)
                                              this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true);
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
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),

    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderBlock)