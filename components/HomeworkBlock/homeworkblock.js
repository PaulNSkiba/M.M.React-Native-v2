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
            selDate: this.getNextStudyDay(daysList().map(item => {
                let newObj = {};
                newObj.label = item.name;
                newObj.value = item.id;
                return newObj;
            }))[1],
            previewID: 0,
            showPreview: false,
            previewImage : null,
            isSpinner : false,
        };
        this.getHomeworkItems = this.getHomeworkItems.bind(this)
        this.getImage = this.getImage.bind(this)
    }

    componentDidMount() {
        requestSDPermission()
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
                // return <View key={key}><Text>{msg.text}</Text></View>
            })
        )
    }
    updateMsg = () => {

    }
    getHomeWorksForAccordion=()=>{
        const daysArr = daysList().map(item => {
            let newObj = {};
            newObj.label = item.name;
            newObj.value = item.id;
            newObj.date = item.date;
            return newObj;
        })
        // const initialDay = this.getNextStudyDay(daysArr)[0];
        const { localChatMessages: homeworkorig } = this.props.userSetup

        // По умолчанию выбираем домашку на завтра...
        console.log("getHomeWorksForAccordion: daysArr", daysArr)
        return daysArr.map((itemDate, key)=>{
            const homework = homeworkorig.length ? homeworkorig.filter(
                item => {
                    // console.log("HOMEWORK", item)
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
                                // style={{ backgroundColor: "#ffe9ee"}}
                                ref="scrollViewHW"
                                onContentSizeChange={(contentWidth, contentHeight) => {
                                    console.log("onContentSizeChange", contentHeight)
                                    this.refs.scrollViewHW.scrollToEnd()
                                }}>
                                {homework.length ? this.getHomeworkItems(homework) : null}
                            </ScrollView> : null}
                        </View>

                    </View>
        })
    }
    render() {
        let messages = []

        const daysArr = daysList().map(item => {
            let newObj = {};
            newObj.label = item.name;
            newObj.value = item.id;
            newObj.date = item.date;
            return newObj;
        })
        const initialDay = this.getNextStudyDay(daysArr)[0];
        const {userName, localChatMessages: homeworkorig, classID} = this.props.userSetup

        // По умолчанию выбираем домашку на завтра...
        // console.log("daysArr", daysArr)
        for (i = 0; i < daysArr.length; i++) {
            let arr = homeworkorig.filter(item => {
                // console.log("HomeWork", item.date, daysArr[i].date, toYYYYMMDD(new Date(item.date)), toYYYYMMDD(new Date(daysArr[i].date)))
                return toYYYYMMDD(new Date(item.homework_date)) === toYYYYMMDD(new Date(daysArr[i].date))
            })

            // daysArr[i].label = daysArr[i].label + (arr.length ? ' [' + arr.length + ']' : '')
            daysArr[i].count = arr.length
            // console.log("daysArr2", daysArr[i].label, arr.length)
        }

        console.log("getHomeworkItems", daysArr, this.props.userSetup)

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
        let img = '', imgPath = ''

        if (this.state.previewID) {
            console.log("write file", JSON.parse(this.state.previewImage).base64, JSON.parse(this.state.previewImage))
            // img = `data:image/png;base64,${JSON.parse(homework.filter(item => item.id === this.state.previewID)[0].attachment3).base64}`
            img = `data:image/png;base64,${JSON.parse(this.state.previewImage).base64}`
            console.log("write.2")
            const Base64Code = JSON.parse(this.state.previewImage).base64 //base64Image is my image base64 string
            const dirs = RNFetchBlob.fs.dirs;
            imgPath = dirs.DCIMDir + "/image64.png";
            // RNFetchBlob.fs.writeFile(imgPath, Base64Code, 'base64')
            //     .then(res => {console.log("File : ", res)})
            //     .catch(res => console.log("FileWrite: Error", res))
        }
        // console.log("IMG_PATH", imgPath)

        // В счётчике обновления делаем на завтра
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
                                {homework.length && this.state.previewID ?
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
                                {/*<Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text style={{color: "#fff"}}>ЗАДАНИЯ</Text></TabHeading>}>*/}
                                    {/*<View style={{flex: 1}}>*/}

                                        {/*<View style={[styles.msgList, {flex: 7}, {marginBottom: 70}]}>*/}
                                            {/*<ScrollView*/}
                                                {/*ref="scrollViewHW"*/}
                                                {/*onContentSizeChange={(contentWidth, contentHeight) => {*/}
                                                    {/*console.log("onContentSizeChange", contentHeight)*/}
                                                    {/*this.refs.scrollViewHW.scrollToEnd()*/}
                                                {/*}}>*/}
                                                {/*{homework.length ? this.getHomeworkItems(homework) : null}*/}
                                            {/*</ScrollView>*/}
                                        {/*</View>*/}
                                        {/*<View style={{flex: 1}}>*/}

                                        {/*</View>*/}
                                    {/*</View>*/}
                                {/*</Tab>*/}
                                {/*<Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text*/}
                                    {/*style={{color: "#fff"}}>{`НА ${this.state.selDate.label}`}</Text></TabHeading>}>*/}

                                    {/*<View style={styles.homeworkSubjectList}>*/}

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
                                    {/*</View>*/}
                                {/*</Tab>*/}
                                <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text
                                    style={{color: "#fff"}}>{`ЗАДАНИЯ`}</Text></TabHeading>}>
                                    <AccordionCustom data={daysArr}  data2={this.getHomeWorksForAccordion()} ishomework={true}/>
                                </Tab>
                                <Tab heading={<TabHeading style={styles.tabHeaderWhen}><Text
                                    style={{color: "#fff"}}>{`ЗАМЕТКИ`}</Text></TabHeading>}>
                                    <AccordionCustom data={[
                                { label: "Родительский комитет", content: "Родительский комитет" },
                                { label: "Реквизиты оплат", content: "Реквизиты оплат" },
                                { label: "Инфа от классного", content: "Инфа от классного" },
                                { label: "Инфа от школы", content: "Инфа от школы" }
                                                            ]}
                                                     ishomework={false}/>
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