/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
    TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
// import { Container, Header, Content, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {    Container, Header, Left, Body, Right, Button,
    Title, Content, Card, CardItem,  Footer, FooterTab, TabHeading, Tabs, Tab,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail } from 'native-base';
// import RadioForm from 'react-native-radio-form';
import {API_URL} from '../../config/config'
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, instanceAxios} from '../../js/helpersLight'
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux'
import { stylesCamera } from '../../css/camera'

// import '../../ChatMobile/chatmobile.css'

const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class CameraBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoPath : this.props.userSetup.photoPath,

        };
        this.addToChat = this.addToChat.bind(this)
    }
    addToChat = (data) => {
        const msg = this.prepareJSON(data)
        this.sendMessage(msg)
    }
    sendMessage(text) {
        const id = 0;
        instanceAxios().post(API_URL + 'chat/add' + (id?`/${id}`:''), text)
            .then(response => {
                console.log('ADD_MSG', response)
            })
            .catch(response=>
                console.log("AXIOUS_ERROR", response)
            )
        console.log("sendMessage", text, id)
    }
    takePicture = async() => {
        if (this.camera) {
            const options = { quality: 0.7, base64: true, format: 'png', result: 'file', };
            const data = await this.camera.takePictureAsync(options);
            console.log("Picture", data)
            let arr = this.state.photoPath
            arr.push({uri : data.uri, time : (new Date()), data: data})
            this.setState({photoPath : arr})
            this.props.onReduxUpdate("PHOTO_PATH", arr)
            console.log(data.uri);
        }
    };
    prepareJSON=(data)=>{
        console.log("prepareJSON")
        let {classID, userName, userID, studentId, studentName} = this.props.userSetup
        // let text = this.state.curMessage
        let obj = {}

        obj.id = 0;
        obj.class_id = classID;
        obj.message = "ФОТО";
        obj.msg_date = toYYYYMMDD(new Date());
        obj.msg_time = (new Date()).toLocaleTimeString().slice(0, 5);
        obj.attachment3 = data
        // if (!(this.state.selSubjkey === null)) {
        //     obj.homework_date = toYYYYMMDD(this.state.curDate)
        //     obj.homework_subj_key = this.state.selSubjkey
        //     obj.homework_subj_name = this.state.selSubjname
        //     // this.addHomeWork(obj.text)
        // }
        obj.user_id = userID
        obj.user_name = userName
        obj.student_id = studentId
        obj.student_name = studentName
        obj.uniqid = new Date().getTime() + this.props.userSetup.userName //uniqid()

        console.log("prepareJSON", obj, JSON.stringify(obj))
        return JSON.stringify(obj)
    }
    showPreview=()=>{

    }
    render () {
        // const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        // const initialDay = this.getNextStudyDay(daysArr)[0];
        console.log("PhotoPath", this.state.photoPath)
        return (
            <Container>
                <View style={styles.modalView}>
                    <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>КАМЕРА</Text></TabHeading>}>
                            {/*<View style={styles.container}>*/}
                                {/*<RNCamera*/}
                                    {/*ref={ref => {*/}
                                        {/*this.camera = ref;*/}
                                    {/*}}*/}
                                    {/*style={styles.preview}*/}
                                    {/*type={RNCamera.Constants.Type.back}*/}
                                    {/*flashMode={RNCamera.Constants.FlashMode.on}*/}
                                    {/*androidCameraPermissionOptions={{*/}
                                        {/*title: 'Permission to use camera',*/}
                                        {/*message: 'We need your permission to use your camera',*/}
                                        {/*buttonPositive: 'Ok',*/}
                                        {/*buttonNegative: 'Cancel',*/}
                                    {/*}}*/}
                                    {/*androidRecordAudioPermissionOptions={{*/}
                                        {/*title: 'Permission to use audio recording',*/}
                                        {/*message: 'We need your permission to use your audio',*/}
                                        {/*buttonPositive: 'Ok',*/}
                                        {/*buttonNegative: 'Cancel',*/}
                                    {/*}}*/}
                                    {/*onGoogleVisionBarcodesDetected={({ barcodes }) => {*/}
                                        {/*console.log(barcodes);*/}
                                    {/*}}*/}
                                {/*/>*/}
                                {/*<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>*/}
                                    {/*<TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>*/}
                                        {/*<Text style={{ fontSize: 14 }}> ФОТО </Text>*/}
                                        {/*<Text>{this.state.photoPath}</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                            <View style={styles.cameraBlock}>
                                <RNCamera
                                    ref={ref => {this.camera = ref;}}
                                    // captureTarget={Camera.constants.CaptureTarget.disk}
                                    style={{ flex: 1, width: '100%', }}>
                                </RNCamera>
                                <View style={{  display: "flex", alignItems : "center", position : "absolute", flex: 0, top : 10,
                                                marginLeft : "30%", marginRight : "30%", flexDirection: 'row', justifyContent: 'center', borderRadius : 10 }}>
                                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                                        <View style={{  width : "100%", textAligh : "center", borderWidth : 2,
                                                        borderColor : "#33ccff", borderRadius : 20, paddingLeft : 40, paddingRight : 40}}>
                                            <Icon color="#33ccff" fontSize="35" type='foundation' name="camera" />
                                            <Text style={{ fontSize: 14, color : "#33ccff" }}> ФОТО </Text>
                                            {/*<Text style={{ fontSize: 14, color : "#33ccff" }}>{this.state.photoPath}</Text>*/}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Tab>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}>
                            <Text badge vertical style={{color: "#fff"}}>ИЗОБРАЖЕНИЯ</Text>
                            {this.state.photoPath.length?
                                <Badge value={this.state.photoPath.length}
                                       status={"warning"}
                                       containerStyle={{ position: 'absolute', top: -8, right: 2 }}>
                                </Badge>:null}
                        </TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                {this.state.photoPath.map((item, key)=>{
                                    return (
                                    <Card key={key}>

                                            <CardItem>
                                                {/*<View key={key} style={{height: 100, width:100, borderWidth : 2, borderColor: "#fff"}}>*/}
                                                    {/*<Image source={{uri: item, isStatic:true}} style={{height: 200, width:null, flex : 1}}/>*/}
                                                    {/*<Text>Добавить в чат</Text>*/}
                                                {/*</View>*/}
                                                <Left>
                                                    <TouchableOpacity onPress={()=>this.showPreview(item.uri)}>
                                                        <Thumbnail source={{uri: item.uri, isStatic:true}}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={()=>this.addToChat(JSON.stringify(item.data))}>
                                                        <Body style={{borderWidth : 2, borderColor : "#7DA8E6", borderRadius : 20, paddingLeft : 40, paddingRight : 40}}>
                                                            <Text>Добавить в чат</Text>
                                                            <Text note>{item.time.toLocaleTimeString()}</Text>
                                                        </Body>
                                                    </TouchableOpacity>
                                                </Left>
                                            </CardItem>

                                    </Card>)
                                })
                                }
                                {/*<RadioForm*/}
                                    {/*// style={{ paddingBottom : 20 }}*/}
                                    {/*dataSource={daysArr}*/}
                                    {/*itemShowKey="label"*/}
                                    {/*itemRealKey="value"*/}
                                    {/*circleSize={16}*/}
                                    {/*initial={initialDay}*/}
                                    {/*formHorizontal={false}*/}
                                    {/*labelHorizontal={true}*/}
                                    {/*onPress={(item) => this.onSelectDay(item)}*/}
                                {/*/>*/}
                            </View>
                        </Tab>
                    </Tabs>
                </View>
            </Container>)
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraBlock)