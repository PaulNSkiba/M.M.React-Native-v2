/**
 * Created by Paul on 18.02.2020.
 */
/**
 * Created by Paul on 17.02.2020.
 */
import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Text, View, Image, Modal, Dimensions, Keyboard,
         TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {axios2, mapStateToProps, getLangWord} from '../../js/helpersLight'
import {    Container, Header, Left, Body, Right, Button,
    Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label, Textarea, Toast, CheckBox} from 'native-base';
import { Picker, NimbleEmoji, getEmojiDataFromCustom, Emoji, emojiIndex  } from 'emoji-mart-native'
import { Icon } from 'react-native-elements'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import styles from '../../css/styles'

class AddMsgContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curMessage : '',
            keyboardHeight : 0,
        }
        this._handleKeyDown = this._handleKeyDown.bind(this)
    }
    componentDidMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }
    componentWillUnmount(){
        this.keyboardDidShowSub&&this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub&&this.keyboardDidHideSub.remove();
    }
    handleKeyboardDidShow = (event) => {
        // const { height } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        this.setState({keyboardHeight})
        // console.log("handleKeyboardDidShow")
    }
    handleKeyboardDidHide = () => {
        // const { height } = Dimensions.get('window');
        this.setState({keyboardHeight : 0})
    }
    _handleKeyDown = (e) => {
        const {classID, userName} = this.props.userSetup
        let key = e.nativeEvent.key
        if (this.props.isnew) {
            let channelName = 'class.'+classID
            this.props.Echo.join(channelName)
                .whisper('typing', {
                    name: userName
                })
        }
    }
    onChangeText = (key, val) => {
        const {classID, userName} = this.props.userSetup
        if (val.length > 1&&(!(val.length>=6&&val.slice(-6)==='http:/'))&&(!(val.length>=7&&val.slice(-7)==='https:/'))) {
            let smile = emojiIndex
                .search(val.slice(-2))
                .filter(item => item.emoticons.indexOf(val.slice(-2)) >= 0)
                .map(o => ({
                    colons: o.colons,
                    native: o.native,
                }))

            if (smile.length) {
                val = val.slice(0, val.length - 2) + smile[0].native
            }
        }
        this.setState({[key]: val})

        if (this.props.isnew) {
            let channelName = 'class.'+classID
            this.props.Echo.join(channelName)
                .whisper('typing', {
                    name: userName
                })
        }
    }
    render(){
        const {langLibrary, offlineMsgs, classID, isadmin, userID } = this.props.userSetup
        const {theme, footerHeight, headerHeight } = this.props.interface

        // placeholder={userID?"Задать вопрос разработчику..." : "Задавая вопрос без логина, пожалуйста, укажите в сообщении контактный email для связи)..."} type="text"

        const placeholder = this.props.index===0?getLangWord("mobMsgHint", langLibrary):
            (userID?"Задать вопрос разработчику..." : "Задавая вопрос без логина, пожалуйста, укажите в сообщении контактный email для связи)..."
)

        return (<View style={[{bottom : (Platform.OS==="ios"?(this.state.keyboardHeight-(this.state.keyboardHeight>0?50:0)):0)}, styles.addMsgContainer, {display: "flex", alignItems : "center", flex : 1, backgroundColor : theme.primaryLightColor}]}>
            {/*<Button*/}
            {/*type="button"*/}
            {/*className="toggle-emoji"*/}
            {/*onClick={this.toggleEmojiPicker}*/}
            {/*>*/}
            {/*<Smile />*/}
            {/*</Button>*/}
            {isadmin&&this.props.index===3?
                <View className={styles.isNewsCheckbox}>
                    <CheckBox style={{marginTop : 20}}
                              checked={this.props.isNews}
                              onPress={()=>{this.props.setstate({isNews:!this.props.isNews})}} color={theme.primaryDarkColor}/>
                    <Body>
                        <Text style={{ color : theme.primaryDarkColor, fontSize: RFPercentage(2)}}> News</Text>
                    </Body>
                </View>
                :null}
            <View style={{flex: this.props.index===3?6.5:(Platform.OS==="ios"?7:7.5), position : "relative"}}>
                <Textarea   style={styles.msgAddTextarea}
                            ref={component => this._textarea = component}
                            onKeyPress={this._handleKeyDown}
                            onChangeText={text=>this.onChangeText('curMessage', text)}
                            onFocus={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true)}}
                            onBlur={()=>{this.props.onReduxUpdate('UPDATE_FOOTER_SHOW', true)}}
                            placeholder={placeholder}  type="text"
                            value={this.state.curMessage}
                />
                {this.props.index===0?<TouchableWithoutFeedback
                            delayLongPress={300}
                            onLongPress={()=>this.props.loadfile()}>
                    <View  style={{right : 10, position : "absolute", zIndex : 50, top : 15}}>
                        <Icon name={'attach-file'}
                              type='Material Icons'
                              color={"#565656"}
                              size={30}
                              style={{transform: [{rotate: '30deg'}]}}
                        />
                    </View>
                </TouchableWithoutFeedback>:null}
            </View>
            <View style={styles.btnAddMessage}>
                <Icon
                    name='rightcircle'
                    type='antdesign'
                    color={theme.primaryDarkColor}
                    size={40}
                    onPress={()=>{  this.props.addmessage(this.state.curMessage);
                                    this.setState({curMessage:''});
                                    this._textarea.setNativeProps({'editable': false});
                                    this._textarea.setNativeProps({'editable':true});
                    }} />
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
export default connect(mapStateToProps, mapDispatchToProps)(AddMsgContainer)