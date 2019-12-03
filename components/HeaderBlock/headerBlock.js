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
import Logo from '../../img/LogoMyMsmall.png'
import LogoBlack from '../../img/LogoMyMsmallBlack.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'
import { QRCode } from 'react-native-custom-qr-codes';

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
            geoObj : {city : "", country : "", iso_code : ""}
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
    render = () => {
        // console.log("headerBlock", this.props.token.length,'@', this.props.userSetup.token.length)
        return (
            <Header style={styles.header}>
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
                        justifyContent : "center",
                        alignItems : "center",
                    }}>
                        {/*<QRCode className='qrcode'*/}
                                {/*value={'https://mymarks.info/student/add/OUnU0wbadrnUcKIX4qyVoY0sotQQ7Zumqcbb7nUG'}*/}
                                {/*size={300}*/}
                                {/*fgColor='black'*/}
                                {/*bgColor='white'*/}
                                {/*logo={Logo}*/}
                        {/*/>*/}
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
                {this.props.userSetup.token.length?this.props.updateState("userToken", this.props.userSetup.token):null}
                {this.props.updateState("marksInBaseCount", this.props.userSetup.markscount)}
                <Left>
                    <TouchableOpacity onPress={()=>this.setState({showQR:true})}>
                        <Image source={Logo}/>
                    </TouchableOpacity>
                </Left>
                <Body style={{position: "relative", flex: 1, flexDirection: "row"}}>
                <View>
                    <Title style={styles.myTitle}>My.Marks</Title>
                </View>
                <OfflineNotice/>
                </Body>
                <Right>
                    <View style={{positon: "relative"}}>
                        <Text style={[{
                            fontSize: RFPercentage(1),
                            position: "absolute",
                            right: 0,
                            top: -5,
                            color: "#4472C4"
                        }]}>{version}</Text>
                        <View >
                            <Button transparent disabled={this.props.userSetup.showLogin}>
                                {this.props.userSetup.userID ? <Text style={{
                                    color: "#4472C4",
                                    fontWeight: "700"
                                }}>{this.props.userSetup.userName}  </Text> : null}
                                <Icon size={36} color={this.props.userSetup.userID ? "#4472C4" : "#A9A9A9"}
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
                </Right>
            </Header>
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