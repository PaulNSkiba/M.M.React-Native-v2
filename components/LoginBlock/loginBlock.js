/**
 * Created by Paul on 27.08.2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import {    Container, Header, Left, Body, Right, Button,
    Icon, Title, Content,  Footer, FooterTab, Badge,
    Form, Item, Input, Label} from 'native-base';
import { bindActionCreators } from 'redux';
// import { addFriend } from './FriendActions';
// import { LOGINUSER_URL } from './config/config'
import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from '../../js/helpersLight'
import { LOGINUSER_URL } from '../../config/config'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
// import { instanceAxios, mapStateToProps /*, langLibrary as langLibraryF*/ } from './js/helpersLight'
import styles from '../../css/styles'

class LoginBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatMessages : [],
            selectedFooter : 0,
            showLogin : false,
            username: '',
            password: '',
            userID: 0,
            userName : '',
        }
        this.onLogin = this.onLogin.bind(this)
        // this.onChangeText = this.onChangeText.bind(this)
        // this.RootContainer = this.RootContainer.bind(this)
    }
    componentDidMount() {
        // this.nameLogin.focus()
    }
    onChangeText = (key, val) => {
        // console.log("onChangeText", key, val, this.refs)
        this.setState({ [key]: val})
        // alert(key, val)
        // this.props.updateState()
    }
    onLogin=()=>{
        // alert(this.state.username + ' ' + this.state.password + ' ' + this.refs)
        // alert(this.refs.nameLogin.value + " " + this.refs.pwdLogin.value)
        // return
        let  name = this.state.username, //"test@gmail.com",
            pwd = this.state.password, //"test1",
            provider = null,
            provider_id = null


        // const data = {
        //     "email": name,
        //     "password": pwd,
        //     "provider" : provider,
        //     "provider_id" : provider_id,
        //     "token" : null,
        // };
        // alert('onLogin', this.state.username, this.state.password)
        // ToDO: Подсветить неверный пароль
        this.props.onUserLogging(name, pwd, provider, provider_id /*,  langLibraryF(this.state.myCountryCode?this.state.myCountryCode:"GB")*/);

        this.props.updateState("showLogin", false)
        // instanceAxios().post(LOGINUSER_URL, JSON.stringify(data), null)
        //     .then(response => {
        //         console.log('USER_LOGGEDIN.1', response.data);
        //         this.setState({
        //             userID : response.data.user.id,
        //             userName : response.data.user.name,
        //         })
        //         this.setState({showLogin : !this.state.showLogin})
        //         alert('USER_LOGGEDIN.1', response.data.userName)
        //         dispatch({type: 'USER_LOGGEDIN', payload: response.data, langLibrary : langLibrary});
        //         dispatch({type: 'ADD_CHAT_MESSAGES', payload : response.data.chatrows});
        //         // пробуем записать в LocalStorage имя пользователя, ID, имя и тип авторизации
        //         // saveToLocalStorage("myMarks.data", email, response.data)
        //         // window.localStorage.setItem("localChatMessages", response.data.chatrows)
        //         // document.body.style.cursor = 'default';
        //         dispatch({type: 'APP_LOADED'})
        //     })
        //     .catch(error => {
        //         // Список ошибок в отклике...
        //         console.log("ERROR_LOGGEDIN", error)
        //         alert('ERROR_LOGGEDIN ' + error)
        //         // document.body.style.cursor = 'default';
        //         dispatch({type: 'USER_PWD_MISSEDMATCH'})
        //         dispatch({type: 'APP_LOADED'})
        //     })
    }
    render() {
        return (
            <View style={{backgroundColor : "#fff"}}>
                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input ref="nameLogin"/*ref={ (c) => this.nameLogin = c }*/
                               // autoFocus={true}
                               onChangeText={text=>this.onChangeText('username', text)}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Пароль</Label>
                        <Input secureTextEntry={true} ref="pwdLogin"
                               onChangeText={val => this.onChangeText('password', val)}/>
                    </Item>
                    {/*<Item></Item>*/}
                    {/*<Item></Item>*/}
                    {/*<Item></Item>*/}
                    {/*<Item></Item>*/}
                    <Button iconRight full info style={styles.inputButton} onPress={() => this.onLogin()}>
                        <Text style={styles.loginButton}>Логин</Text>
                    </Button>
                    <Button iconRight full primary style={styles.inputButton} onPress={() => alert("Facebook")}>
                        <Text style={styles.loginButton}>Facebook</Text>
                    </Button>
                    <Button iconRight full danger style={styles.inputButton} onPress={() => alert("Google")}>
                        <Text style={styles.loginButton}>Google</Text>
                    </Button>
                </Form>
            </View>
        )

    }
}

const mapDispatchToProps = dispatch => {
    // console.log("mapDispatchToProps", this.props)
    // console.log("mapDispatchToProps", dispatch)
    // let {userSetup} = this.props
    return ({
        onUserLogging : (name, pwd, provider, provider_id, langLibrary) =>{
            dispatch({type: 'APP_LOADING'})
            console.log("OnUserLogging")
            const asyncLoggedIn = (name, pwd, provider, provider_id, langLibrary) =>{
                return dispatch => {
                    dispatch(userLoggedIn(name, pwd, provider, provider_id, langLibrary))
                }}
            dispatch(asyncLoggedIn(name, pwd, provider, provider_id, langLibrary))
        },
        onUserLoggingByToken :
            async (email, token, kind, langLibrary)=>{
                const asyncLoggedInByToken = (email, token, kind, langLibrary) => {
                    return async dispatch => {
                        dispatch(userLoggedInByToken(email, token, kind, langLibrary))
                    }
                }
                dispatch(asyncLoggedInByToken(email, token, kind, langLibrary))
            },
        onUserLoggingOut  : (token, langLibrary) => {
            return dispatch(userLoggedOut(token, langLibrary))
        },
        onClearErrorMsg : ()=>{
            dispatch({type: 'USER_MSG_CLEAR', payload: []})
        },
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onStudentChartSubject  : value => {
            return dispatch({type: 'UPDATE_STUDENT_CHART_SUBJECT', payload: value})
        },
        onStopLogging : ()=> dispatch({type: 'USER_LOGGEDIN_DONE', payload: []}),
        onStopLoading : ()=> dispatch({type: 'APP_LOADED'}),
        onStartLoading : ()=> dispatch({type: 'APP_LOADING'}),
        onChangeStepsQty : (steps)=>dispatch({type: 'ENABLE_SAVE_STEPS', payload : steps})
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBlock)