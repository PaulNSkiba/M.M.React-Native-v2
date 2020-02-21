/**
 * Created by Paul on 17.02.2020.
 */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Text, View, Image, Modal, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Header, Left, Body, Right, Button, Title} from 'native-base';
import {Icon} from 'react-native-elements'
import {axios2, mapStateToProps} from '../../js/helpersLight'
import {version, AUTH_URL, API_URL} from '../../config/config'
import styles from '../../css/styles'

class WhoTyping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const {theme, footerHeight, headerHeight} = this.props.interface
        const {showUserList, users, typingUsers} = this.props.tempdata
        return (<TouchableWithoutFeedback delayLongPress={500}
                                          onLongPress={() => this.props.onReduxUpdate("SHOW_USERLIST", !showUserList)}>
            <View style={[styles.whoTyping, {backgroundColor : theme.primaryTextColor}]}>
                <Icon size={18} color={this.props.isConnected?theme.primaryDarkColor:theme.errorColor} style={[{alighSelf: "flex-start"}]} name='person'/>
                { showUserList && users.length ? <View
                    style={{
                        zIndex: 50,
                        position: "absolute",
                        left: 10,
                        bottom: 30,
                        borderRadius: 5,
                        backgroundColor: theme.primaryLightColor,
                        borderWidth: .5,
                        borderColor: theme.primaryDarkColor
                    }}
                    onPress={() => {
                        this.setState(() => this.props.onReduxUpdate("SHOW_USERLIST", false))
                    }}>
                    {users.map((item, key) =>
                        <View key={key} style={{marginLeft: 5, marginRight: 5}}>
                            <Text style={{color: theme.primaryDarkColor}}>{item}</Text>
                        </View>
                    )}
                </View> : null}
                <Text style={{
                    color: theme.primaryDarkColor,
                    fontSize: 12}}>
                    {users.length ? `[${users.length}]:` : null}
                </Text>
                <Text style={{color: theme.primaryDarkColor, fontSize: 12}}>{typingUsers.size > 0 ?
                    ` ... ${Array.from(typingUsers.keys()).length > 2?
                        (Array.from(typingUsers.keys()).length + " человека") :
                         Array.from(typingUsers.keys()).join(', ')} ... ` : null}
                </Text>
            </View>
        </TouchableWithoutFeedback>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
        onStartLoading: () => dispatch({type: 'APP_LOADING'}),
        onStopLoading: () => dispatch({type: 'APP_LOADED'}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(WhoTyping)