/**
 * Created by Paul on 10.09.2019.
 */
/**
 * Created by Paul on 10.09.2019.
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView,
    TouchableHighlight, Modal, Radio, TouchableOpacity } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {    Container, Header, Left, Body, Right, Button,
    Title, Content, Card, CardItem,  Footer, FooterTab, TabHeading, Tabs, Tab,
    Form, Item, Input, Label, Textarea, CheckBox, ListItem, Thumbnail } from 'native-base';
import {API_URL} from '../../config/config'
import {dateFromYYYYMMDD, mapStateToProps, prepareMessageToFormat, AddDay, toYYYYMMDD, daysList, instanceAxios} from '../../js/helpersLight'
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux'
import {SingleImage,wrapperZoomImages,ImageInWraper} from 'react-native-zoom-lightbox';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
// import { stylesCamera } from '../../css/camera'
// import ImageView from 'react-native-image-view';
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
            showPreview : false,
            prevuri : '',
        };
        this.addToChat = this.addToChat.bind(this)
    }
    addToChat = (data, data100) => {
        const msg = this.prepareJSON(data, data100)
        this.sendMessage(msg)
    }
    sendMessage(text) {
        const id = 0;
        console.log("sendMessage", API_URL + 'chat/add' + (id?`/${id}`:''), text)
        const {userID} = this.props.userSetup

        instanceAxios().post(API_URL + 'chat/add' + (id?`/${id}`:''), text)
            .then(response => {
                console.log('ADD_MSG', response)
            })
            .catch(response=> {
                    console.log("AXIOUS_ERROR", response)
                }
            )
        // console.log("sendMessage", text, id)
    }
    takePicture = async() => {
        if (this.camera) {
            const options = { quality: 0.7, base64: true, width : 960, format: 'png', result: 'file', };
            const data = await this.camera.takePictureAsync(options);
            console.log("Picture", data)
            let arr = this.state.photoPath
            ImageResizer.createResizedImage(data.uri, 240, 240, 'PNG', 100)
                .then(response => {
                    console.log("ImageResizer", response)
                    ImgToBase64.getBase64String(response.uri)
                        .then(base64String =>{
                            let data100 = {}
                            data100.base64 = base64String
                            data100.uri = response.uri
                            data100.height = 240
                            data100.width = 240

                            arr.push({uri : data.uri, time : (new Date()), data: data, data100: data100})
                            this.setState({photoPath : arr})
                            this.props.onReduxUpdate("PHOTO_PATH", arr)
                            console.log("PHOTO_DATA", data.uri);
                            // doSomethingWith(base64String))
                        })
                        .catch(err => console.log("ImgToBase64:Err"));
                })
                .catch(err=>
                console.log("Resize:Err", err))

        }
    };
    prepareJSON=(data, data100)=>{
        console.log("prepareJSON")
        let {classID, userName, userID, studentId, studentName} = this.props.userSetup
        // let text = this.state.curMessage
        let obj = {}

        obj.id = 0;
        obj.class_id = classID;
        obj.message = "ФОТО";
        obj.msg_date = toYYYYMMDD(new Date());
        obj.msg_time = (new Date()).toLocaleTimeString().slice(0, 5);
        obj.attachment2 = data
        obj.attachment3 = data100
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

        // console.log("prepareJSON", obj, JSON.stringify(obj))
        return JSON.stringify(obj)
    }
    showPreview=(uri)=>{
        // const images = [
        //     {
        //         source: {
        //             uri: uri,
        //         },
        //         title: 'Preview',
        //         width: "100%",
        //         height: "100%",
        //     },
        // ];
        this.setState({showPreview : true, prevuri: uri})
        // return <ImageView
        //     images={images}
        //     imageIndex={0}
        //     isVisible={this.state.isImageViewVisible}
        //     renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
        // />
    }
    render () {
        // const daysArr = daysList().map(item=>{let newObj = {}; newObj.label = item.name; newObj.value = item.id;  return newObj;})
        // const initialDay = this.getNextStudyDay(daysArr)[0];
        console.log("PhotoPath", this.state.photoPath, this.state.prevuri)
        return (
            <Container>
                <View style={styles.modalView}>
                    <Tabs>
                        <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>КАМЕРА</Text></TabHeading>}>
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
                                       containerStyle={{ position: 'absolute', top: -8, right: 10 }}>
                                </Badge>:null}
                        </TabHeading>}>
                            <View style={styles.homeworkSubjectList}>
                                {this.state.showPreview?
                                    <View>
                                        <SingleImage
                                            uri={this.state.prevuri}
                                            style={{position : "relative", height : "100%"}}
                                            onClose={()=>this.setState({showPreview : false})}
                                        />
                                        <TouchableOpacity
                                            style={{position : "absolute", top : 10, right : 10, zIndex:10}}
                                            onPress={()=>this.setState({showPreview : false})}>
                                            <View style={{

                                                paddingTop : 5, paddingBottom : 5,
                                                paddingLeft : 15, paddingRight : 15, borderRadius : 5,
                                                borderWidth : 2, borderColor : "#33ccff", zIndex:10,
                                            }}>
                                                <Text style={{  fontSize : 20,
                                                                color: "#33ccff",
                                                                zIndex:10,
                                                                }}
                                                    >X</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>:
                                    this.state.photoPath.map((item, key) => {
                                        return (
                                            <Card key={key}>
                                                <CardItem>
                                                    <Left>
                                                        <TouchableOpacity onPress={() => this.showPreview(item.uri)}>
                                                            <Thumbnail source={{uri: item.uri, isStatic: true}}/>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => this.addToChat(JSON.stringify(item.data), JSON.stringify(item.data100))}>
                                                            <Body style={{
                                                                borderWidth: 2,
                                                                borderColor: "#7DA8E6",
                                                                borderRadius: 20,
                                                                paddingLeft: 40,
                                                                paddingRight: 40,
                                                                display : "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}>
                                                            <Text>Добавить в чат</Text>
                                                            <Text note>{item.time.toLocaleTimeString()}</Text>
                                                            </Body>
                                                        </TouchableOpacity>
                                                    </Left>
                                                </CardItem>
                                            </Card>)
                                    })
                                }

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