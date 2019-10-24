/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions, TouchableOpacity} from 'react-native';
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { Icon } from 'react-native-elements'
import {instanceAxios, mapStateToProps} from '../../js/helpersLight'
import { version, AUTH_URL} from '../../config/config'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
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
        }
    }
    componentDidMount() {
    }
    render = () => {
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
                        <QRCode innerEyeStyle='square' logo={LogoBlack} content={`${AUTH_URL}/student/add/${this.props.userSetup.addUserToken}`}/>

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
                    <LogginByToken email={this.props.email} token={this.props.token} logout={false}/> :
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
                            <Button transparent>
                                {this.props.userSetup.userID ? <Text style={{
                                    color: "#4472C4",
                                    fontWeight: "700"
                                }}>{this.props.userSetup.userName}  </Text> : null}
                                <Icon size={32} color={this.props.userSetup.userID ? "#4472C4" : "#A9A9A9"}
                                      style={styles.menuIcon} name='person'
                                      onPress={ () => {
                                                this.props.onReduxUpdate("USER_LOGGEDIN_DONE");
                                                this.props.updateState('selectedFooter', 0);
                                                this.props.updateState('showLogin')}}/>
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