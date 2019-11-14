/**
 * Created by Paul on 10.09.2019.
 */
import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    Modal,
    Radio,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Button,
    Icon,
    Title,
    Content,
    Footer,
    FooterTab,
    TabHeading,
    Tabs,
    Tab,
    Badge,
    Form,
    Item,
    Input,
    Label,
    Textarea,
    CheckBox,
    ListItem,
    Spinner
} from 'native-base';
import RadioForm from 'react-native-radio-form';
import {
    toLocalDate,
    dateFromYYYYMMDD,
    mapStateToProps,
    prepareMessageToFormat,
    AddDay,
    toYYYYMMDD,
    daysList,
    instanceAxios
} from '../../js/helpersLight'
import {SingleImage, wrapperZoomImages, ImageInWraper} from 'react-native-zoom-lightbox';
import SingleImageZoomViewer from 'react-native-single-image-zoom-viewer'
import ImageViewer from 'react-native-image-zoom-viewer';
import LoginBlock from '../LoginBlock/loginBlock'
import {connect} from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'
import ImageZoom from 'react-native-image-pan-zoom';
import { API_URL } from '../../config/config'
import AccordionCustom from '../AccordionCustom/accordioncustom'
import {PermissionsAndroid} from 'react-native';
import styles from '../../css/styles'
//
// READ_CALENDAR: 'android.permission.READ_CALENDAR'
// WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR'
// CAMERA: 'android.permission.CAMERA'
// READ_CONTACTS: 'android.permission.READ_CONTACTS'
// WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS'
// GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS'
// ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION'
// ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION'
// RECORD_AUDIO: 'android.permission.RECORD_AUDIO'
// READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE'
// CALL_PHONE: 'android.permission.CALL_PHONE'
// READ_CALL_LOG: 'android.permission.READ_CALL_LOG'
// WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG'
// ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL'
// USE_SIP: 'android.permission.USE_SIP'
// PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS'
// BODY_SENSORS: 'android.permission.BODY_SENSORS'
// SEND_SMS: 'android.permission.SEND_SMS'
// RECEIVE_SMS: 'android.permission.RECEIVE_SMS'
// READ_SMS: 'android.permission.READ_SMS'
// RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH'
// RECEIVE_MMS: 'android.permission.RECEIVE_MMS'
// READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE'
// WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE'

async function requestSDPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Cool Photo App Camera Permission',
                message: 'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}
const insertTextAtIndices = (text, obj) => {
    return text.replace(/./g, function (character, index) {
        return obj[index] ? obj[index] + character : character;
    });
};

class HomeworkBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selDate: this.getNextStudyDay(this.getDaysArrMap())[1],
            previewID: 0,
            showPreview: false,
            previewImage : null,
            isSpinner : false,
            daysArr : this.getDaysArrMap(),
            initialDay : this.getNextStudyDay(this.getDaysArrMap())[0],
            chatTags : this.getChatTagsObj(),
            homeworkItems : this.getHomeWorksForAccordion(),
            tagItems : this.getTagsForAccordion(),
        };
        this.getHomeworkItems = this.getHomeworkItems.bind(this)
        this.getImage = this.getImage.bind(this)
    }
    componentDidMount() {
        requestSDPermission()
    }
    getDaysArrMap=()=>{
        const homeworkorig = this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null))

        let daysArr =  daysList().map(item => {
            let newObj = {};
            newObj.label = item.name;
            newObj.value = item.id;
            newObj.date = item.date;
            return newObj;
        })
        for (i = 0; i < daysArr.length; i++) {
            let arr = homeworkorig.filter(item => {
                // console.log("HomeWork", item.date, daysArr[i].date, toYYYYMMDD(new Date(item.date)), toYYYYMMDD(new Date(daysArr[i].date)))
                return (item.homework_date.length===8?item.homework_date:toYYYYMMDD(new Date(item.homework_date))) === toYYYYMMDD(new Date(daysArr[i].date))
            })
            daysArr[i].count = arr.length
        }
        console.log("HomeWorkblock: daysArr", daysArr, this.props.userSetup.localChatMessages, this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null)), this.props.userSetup.homework)
        return daysArr
    }
    onSelectDay = item => {
        this.setState({selDate: item})
        // console.log(item.value)
    }
    getNextStudyDay = arr => {
        let i = 0;
        obj = {};
        arr.forEach((item, index) => {
            if (item.value > 0 && i === 0) {
                i = index;
                obj = item;
            }
        })
        return [i, obj];
    }
    getImage=async (id)=>{
        this.setState({isSpinner : true})
        await instanceAxios().get(API_URL + `chat/getbigimg/${id}`)
            .then(response => {
                // console.log('getImage2', response.data.attachment2)
                this.setState({previewID: id, showPreview: true, previewImage : response.data.attachment2, isSpinner : false})
            })
            .catch(responce=>{
                this.setState({isSpinner : false})
                console.log("ErrorGetImage")
            })

    }
    getHomeworkItems = arr => {
        return ( arr.map((item, key) => {
                let msg = prepareMessageToFormat(item, true)
                let hw = msg.hasOwnProperty('hwdate') && (!(msg.hwdate === undefined)) ? (toLocalDate(msg.hwdate, "UA", false, false)) + ':' + msg.subjname : ''
                let i = key
                let isImage = false
                // console.log("homeWork", item, msg)

                if (item !== undefined && item.attachment3 !== null && item.attachment3 !== undefined) {
                    isImage = true
                }

                return (
                    <View key={key} id={"msg-" + msg.id} style={{marginTop: 10}}>
                        <View key={msg.id}
                              style={(hw.length ? [styles.msgRightSide, styles.homeworkBorder] : [styles.msgRightSide, styles.homeworkNoBorder])}>
                            <View key={'id' + i} style={styles.msgRightAuthor}><Text
                                style={styles.msgAuthorText}>{item.student_name ? item.student_name : this.props.userSetup.userName}</Text></View>
                            {isImage ?
                                <View style={{display: "flex", flex: 1, flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => {
                                       this.getImage(msg.id)
                                    }}>
                                        <View style={{flex: 1}}>
                                            <Image
                                                source={{uri: `data:image/png;base64,${JSON.parse(item.attachment3).base64}`}}
                                                style={{
                                                    width: 100, height: 100,
                                                    // marginBottom : 15,
                                                    borderRadius: 15,
                                                    overflow: "hidden", margin: 7
                                                }}/>
                                        </View>
                                    </TouchableOpacity>
                                    <View key={'msg' + i} id={"msg-text-" + i}
                                          style={[styles.msgText,
                                              {flex: 3, marginLeft: 20, marginTop: 10}]}>
                                        <Text>{msg.text}</Text>
                                    </View>
                                </View>
                                : <View key={'msg' + i} id={"msg-text-" + i} style={styles.msgText}>
                                    <Text>{msg.text}</Text>
                                </View>}
                            <View style={msg.id ? styles.btnAddTimeDone : styles.btnAddTime}>
                                <Text style={msg.id ? styles.btnAddTimeDone : styles.btnAddTime}>{msg.time}</Text>
                            </View>
                            {hw.length ?
                                <View key={'idhw' + i} style={[styles.msgRightIshw, {color: 'white'}]}>
                                    <Text style={{color: 'white'}}>{hw}</Text>
                                </View> : null}
                        </View>
                    </View>
                )
            })
        )
    }
    getTagItems = arr => {
        return ( arr.map((item, key) => {
                let msg = prepareMessageToFormat(item, true)
                let hw = msg.hasOwnProperty('hwdate') && (!(msg.hwdate === undefined)) ? (toLocalDate(msg.hwdate, "UA", false, false)) + ':' + msg.subjname : ''
                let i = key
                let isImage = false
                // console.log("GETTAGITEM", item, msg)

                if (item !== undefined && item.attachment3 !== null && item.attachment3 !== undefined) {
                    isImage = true
                }
                return (
                    <View key={key} id={"msg-" + msg.id} style={{marginTop: 10}}>
                        <View key={msg.id}
                              style={(hw.length ? [styles.msgRightSide, styles.homeworkBorder] : [styles.msgRightSide, styles.homeworkNoBorder])}>
                            <View key={'id' + i} style={styles.msgRightAuthor}><Text
                                style={styles.msgAuthorText}>{item.student_name ? item.student_name : this.props.userSetup.userName}</Text></View>
                            {isImage ?
                                <View style={{display: "flex", flex: 1, flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => {
                                        this.getImage(msg.id)
                                    }}>
                                        <View style={{flex: 1}}>
                                            <Image
                                                source={{uri: `data:image/png;base64,${JSON.parse(item.attachment3).base64}`}}
                                                style={{
                                                    width: 100, height: 100,
                                                    // marginBottom : 15,
                                                    borderRadius: 15,
                                                    overflow: "hidden", margin: 7
                                                }}/>
                                        </View>
                                    </TouchableOpacity>
                                    <View key={'msg' + i} id={"msg-text-" + i}
                                          style={[styles.msgText,
                                              {flex: 3, marginLeft: 20, marginTop: 10}]}>
                                        <Text>{msg.text}</Text>
                                    </View>
                                </View>
                                : <View key={'msg' + i} id={"msg-text-" + i} style={styles.msgText}>
                                    <Text>{msg.text}</Text>
                                </View>}
                            <View style={msg.id ? styles.btnAddTimeDone : styles.btnAddTime}>
                                <Text style={msg.id ? styles.btnAddTimeDone : styles.btnAddTime}>{msg.time}</Text>
                            </View>
                            {hw.length ?
                            <View key={'idhw' + i} style={[styles.msgRightIshw, {color: 'white'}]}>
                                <Text style={{color: 'white'}}>{hw}</Text>
                            </View> : null}
                            {msg.tagid?<View style={{ position : "absolute", right : 3, top : -7, display : "flex", alignItems : "center"}}>
                                <View><Icon style={{fontSize: 15, color: '#b40530'}} name="medical"/></View>
                            </View>:null}
                            {/*{msg.tagid?<View style={{ position : "absolute", right : 5, top : -5, display : "flex", alignItems : "center"}}>*/}
                                {/*<View><Icon style={{fontSize: 20, color: '#4472C4'}} name="bookmark"/></View>*/}
                            {/*</View>:null}*/}
                        </View>
                    </View>
                )
                // return <View key={key}><Text>{msg.text}</Text></View>
            })
        )
    }
    updateMsg = () => {

    }
    getHomeWorksForAccordion=()=>{
        const homeworkorig = this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null))
        const daysArr = daysList().map(item => {
            let newObj = {};
            newObj.label = item.name;
            newObj.value = item.id;
            newObj.date = item.date;
            return newObj;
        })
        // По умолчанию выбираем домашку на завтра...
        console.log("getHomeWorksForAccordion: daysArr", daysArr)
        return daysArr.map((itemDate, key)=>{
            const homework = homeworkorig.length ? homeworkorig.filter(
                item => {
                    if (!(item.hasOwnProperty("homework_date"))) return false
                    if (item.homework_date === null) return false
                    if (item.homework_date.length === 8) {
                        return (toYYYYMMDD(dateFromYYYYMMDD(item.homework_date)) === toYYYYMMDD(new Date(itemDate.date)))
                    }
                    else
                        return (toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(new Date(itemDate.date)))
                }) : []
            // console.log("homework", homework, item, key)
            return   <View key={key} style={{flex: 1}}>
                        <View style={[styles.msgList, {flex: 7}, {marginBottom: 5}]}>
                            {homework.length ? <ScrollView
                                // ref="scrollViewHW"
                                // onContentSizeChange={(contentWidth, contentHeight) => {
                                //     console.log("onContentSizeChange", contentHeight)
                                //     this.refs.scrollViewHW.scrollToEnd()
                                // }}
                            >
                                {homework.length ? this.getHomeworkItems(homework) : null}
                            </ScrollView> : null}
                        </View>
                    </View>
        })
    }
    getTagsForAccordion=()=>{
        const origChat = this.props.userSetup.localChatMessages.filter(item=>item.tagid!==null)
        const chatTags = this.props.userSetup.chatTags.map(item => {
            let newObj = {};
            newObj.label = `${item.name}[${item.short}]`;
            newObj.value = item.id;
            return newObj;
        })
        // const { localChatMessages: homeworkorig } = this.props.userSetup
        // По умолчанию выбираем домашку на завтра...
        console.log("getTagsForAccordion: chatTags", chatTags)
        return chatTags.map((itemTag, key)=>{
            const tags = origChat.length?origChat.filter(item=>itemTag.value===item.tagid):[]
            // console.log("HOMEWORK", itemTag, homework)
            return   <View key={key} style={{flex: 1}}>
                        <View style={[styles.msgList, {flex: 7}, {marginBottom: 5}]}>
                            {tags.length ? <ScrollView
                                // ref="scrollViewHW"
                                // onContentSizeChange={(contentWidth, contentHeight) => {
                                //     console.log("onContentSizeChange", contentHeight)
                                //     this.refs.scrollViewHW.scrollToEnd()
                                // }}
                            >
                                {tags.length?this.getTagItems(tags):null}
                            </ScrollView> : null}
                        </View>
                    </View>
        })
    }
    getChatTagsObj=()=>{
        console.log("getChatTagsObj", this.props.userSetup.localChatMessages.filter(item=>(item.tagid!==null)))
        const tags = this.props.userSetup.localChatMessages.filter(item=>(item.tagid!==null), this.props.userSetup.chatTags)
        let chatTags = this.props.userSetup.chatTags.map(item => {
        let newObj = {};
            newObj.label = `${item.name}[${item.short}]`;
            newObj.value = item.id;
            return newObj;
        })
        for (i = 0; i < chatTags.length; i++) {
            let arr = tags.filter(item => {
                return item.tagid === chatTags[i].value
            })
            chatTags[i].count = arr.length
        }
        return chatTags
    }
    render() {
        // let messages = []
        // const {userName, classID} = this.props.userSetup
        const {daysArr, initialDay, chatTags, homeworkItems, tagItems} = this.state
        const homeworkorig = this.props.userSetup.localChatMessages.filter(item=>(item.homework_date!==null))

        // const daysArr = daysList().map(item => {
        //     let newObj = {};
        //     newObj.label = item.name;
        //     newObj.value = item.id;
        //     newObj.date = item.date;
        //     return newObj;
        // })
        // const initialDay = this.getNextStudyDay(daysArr)[0];

        console.log("getHomeworkItems", daysArr, homeworkorig)

        // По умолчанию выбираем домашку на завтра...
        // for (i = 0; i < daysArr.length; i++) {
        //     let arr = homeworkorig.filter(item => {
        //         // console.log("HomeWork", item.date, daysArr[i].date, toYYYYMMDD(new Date(item.date)), toYYYYMMDD(new Date(daysArr[i].date)))
        //         return (item.homework_date.length===8?item.homework_date:toYYYYMMDD(new Date(item.homework_date))) === toYYYYMMDD(new Date(daysArr[i].date))
        //     })
        //     daysArr[i].count = arr.length
        // }
        // const chatTags = this.props.userSetup.chatTags.map(item => {
        //     let newObj = {};
        //     newObj.label = `${item.name}[${item.short}]`;
        //     newObj.value = item.id;
        //     return newObj;
        // })
        // for (i = 0; i < chatTags.length; i++) {
        //     let arr = tags.filter(item => {
        //         // console.log("HomeWork", item.date, daysArr[i].date, toYYYYMMDD(new Date(item.date)), toYYYYMMDD(new Date(daysArr[i].date)))
        //         return item.tagid === chatTags[i].value
        //     })
        //     chatTags[i].count = arr.length
        // }

        const homework = homeworkorig.length ? homeworkorig.filter(
            item => {
                // console.log("HOMEWORK", item)
                if (!(item.hasOwnProperty("homework_date"))) return false
                if (item.homework_date === null) return false
                if (item.homework_date.length === 8) {
                    return (toYYYYMMDD(dateFromYYYYMMDD(item.homework_date)) === toYYYYMMDD(AddDay((new Date()), this.state.selDate.value)))
                }
                else
                    return (toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(AddDay((new Date()), this.state.selDate.value)))
            }) : 0
        let img = ''
        // let imgPath = ''

        if (this.state.previewID) {
            console.log("write file", JSON.parse(this.state.previewImage).base64, JSON.parse(this.state.previewImage))
            // img = `data:image/png;base64,${JSON.parse(homework.filter(item => item.id === this.state.previewID)[0].attachment3).base64}`
            img = `data:image/png;base64,${JSON.parse(this.state.previewImage).base64}`
            // console.log("write.2", img)
            // const Base64Code = JSON.parse(this.state.previewImage).base64 //base64Image is my image base64 string
            // const dirs = RNFetchBlob.fs.dirs;
            // imgPath = dirs.DCIMDir + "/image64.png";


            // RNFetchBlob.fs.writeFile(imgPath, Base64Code, 'base64')
            //     .then(res => {console.log("File : ", res)})
            //     .catch(res => console.log("FileWrite: Error", res))
        }
        // console.log("IMG_PATH", imgPath)

        // В счётчике обновления делаем на завтра
        let index = 0;
        for (let i = 0; i < daysArr.length; i++) {
            if (daysArr[i].value > 0 && daysArr[i].count > 0) {
                index = i;
                break;
            }
        }
        return (
            <View>

                <View style={this.props.hidden ? styles.hidden : styles.chatContainerNewHW}>
                    <View style={styles.msgList}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.showPreview}
                            onRequestClose={() => {
                                // Alert.alert('Modal has been closed.');
                            }}>
                            <View>
                                {this.state.previewID ?
                                    <ImageZoom cropWidth={Dimensions.get('window').width}
                                               cropHeight={Dimensions.get('window').height}
                                               imageWidth={Dimensions.get('window').width}
                                               imageHeight={Dimensions.get('window').height}
                                               // enableCenterFocus={false}
                                               // panToMove={true}
                                        >
                                        <Image style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height,
                                            // resizeMode: Image.resizeMode.contain,
                                            // borderWidth: 1,
                                            // borderColor: 'red'
                                        }} source={{uri: img}}/>

                                        {/*<SingleImage*/}
                                        {/*uri={`data:image/png;base64,${JSON.parse(homework.filter(item => item.id === this.state.previewID)[0].attachment3).base64}`}*/}
                                        {/*style={{position: "relative", height: "100%"}}*/}
                                        {/*onClose={() => this.setState({showPreview: false, previewID: 0})}*/}
                                        {/*/>*/}
                                    </ImageZoom> : null}

                                {/*{homework.length && this.state.previewID?*/}
                                {/*<SingleImageZoomViewer source={img} width={200} height={200}/>*/}
                                {/*:null}*/}
                                {/*{homework.length && this.state.previewID ?*/}
                                {/*<ImageViewer imageUrls={images}/>*/}
                                {/*: null}*/}

                                <TouchableOpacity
                                    style={{position: "absolute", top: 10, right: 10, zIndex: 10}}
                                    onPress={() => this.setState({showPreview: false, previewID: 0})}>
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
                        <Container>
                            <Tabs>
                                <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text
                                    style={{color: "#fff"}}>{`ЗАДАНИЯ`}</Text></TabHeading>}>
                                    <AccordionCustom data={daysArr}  data2={homeworkItems} ishomework={true} index={index}/>
                                </Tab>
                                <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text
                                    style={{color: "#fff"}}>{`ЗАМЕТКИ `}<Icon style={{fontSize: 15, color: '#fff'}} name="medical"/></Text></TabHeading>}>
                                    <AccordionCustom data={chatTags} data2={tagItems} ishomework={true}/>
                                </Tab>
                            </Tabs>
                        </Container>
                    </View>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeworkBlock)