/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image} from 'react-native';
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { Icon } from 'react-native-elements'
import {instanceAxios, mapStateToProps} from '../../js/helpersLight'
import { version} from '../../config/config'
import LogginByToken from '../../components/LoggingByToken/loggingbytoken'
import styles from '../../css/styles'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import Logo from '../../img/LogoMyMsmall.png'
import OfflineNotice from '../OfflineNotice/offlinenotice'

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
        }
    }
    componentDidMount() {
    }
    render = () => {
        return (
            <Header style={styles.header}>
                {this.props.token.length ?
                    <LogginByToken email={this.props.email} token={this.props.token} logout={false}/> :
                    null}
                {this.props.userSetup.token.length?this.props.updateState("userToken", this.props.userSetup.token):null}
                {this.props.updateState("marksInBaseCount", this.props.userSetup.markscount)}
                <Left>
                    <Image source={Logo}/>
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