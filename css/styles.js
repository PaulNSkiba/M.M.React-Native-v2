/**
 * Created by Paul on 27.08.2019.
 */
import { SafeAreaView,  StyleSheet,  ScrollView,  View,  Text,  StatusBar,} from 'react-native';
import { LearnMoreLinks,  Colors,  DebugInstructions,  ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
export default styles = StyleSheet.create({
    chatContainerNew : {
        flex : 1,
        flexDirection: 'column',
        opacity : 1,
        // borderWidth : 1,
        // borderColor : "darkgrey",
        backgroundColor: "white",
        height : "100%",
    },
    chatContainerNewHW : {
        flex : 1,
        flexDirection: 'column',
        opacity : 1,
        // borderWidth : 1,
        // borderColor : "darkgrey",
        backgroundColor: "white",
        height : "100%",
    },
    messageListContainer : {
        flex : 5,
        // borderWidth : 1,
        // borderColor : "#f2b436",
        // height : "100%",
    },
    servicePlus : {
        position : "absolute",
        right : 5,
        top : "1%",
        fontWeight: "800",
        backgroundColor: "#33ccff",
        color: "#f7f7f7",
        borderWidth: 2,
        borderColor: "#898989",
        paddingTop : 1,
        paddingRight : 5,
        paddingLeft : 5,
        paddingBottom : 3,
        textAlign: "center",
        borderRadius: 12,
        // // font-size: .9em;
        // display: "inline-block",
        width : 180,
        zIndex : 20,
    },
    frmAddMsg : {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e9e9e9",
        // border : 0,
        margin : 0,
        // paddingTop : 5,
        // paddingBottom : 5,
        // height : auto,
        bottom : 0,
        // borderBottomLeftRadius: 10,
        // borderBottomRightRadius: 10,
    },
    inputMsgBlock : {
        display: "flex",
        flex: 1,
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "row",
        position: "relative",
        // justifyContent: "space-between",
        width : "100%",
        height : 80,
    },
    addMsgContainer : {
        position : "relative",
        backgroundColor: "#e9e9e9",
        flexDirection : "row",
        justifyContent : "space-between",
        // alignItems : "center",
        // flex : 1,
        width : "100%",
        height : 70,
        bottom : 0,
        // paddingRight : 10,
     },
    msgAddTextarea : {
        // position : "absolute"
        // flex : 8,
        borderWidth: 0.5,
        margin : 8,
        // width: "85%",
        width : "95%",
        height : 55,
        padding : 0.5,
        backgroundColor: "white",
        alignSelf : "flex-start",
        // resize: none,
        // outline: none,
        borderRadius: 10,
        fontSize : 14,
    },
    btnAddMessage : {
        // display: "flex",
        flex : 1,
        // textAlign: "center",
        color: "#898989",
        // fontSize : 20,
        // alignSelf : "flex-end",
        justifyContent : "center",
        margin : 8,
        height : 50,
        // margin : 5,
        // height: 25,
        // marginTop : 10,
        // marginRight : 15,
        // padding : 10,
        // borderRadius: 5,
        // borderWidth : 1,
        // width: 80,
        // borderColor : "darkgrey",
    },
    msgUpdateTextarea : {
        borderWidth: 1,
        margin : 8,
        borderColor : "#E0E0E0",
        width : "96%",
        height : 100,
        padding : 2,
        backgroundColor: "white",
        alignSelf : "flex-start",
        borderRadius: 10,
    },
    homeworkPlus : {
        position : "absolute",
        right : 5,
        bottom : "2%",
        fontWeight: "800",
        backgroundColor: "#33ccff",
        color: "#f7f7f7",
        borderWidth: 2,
        borderColor: "#898989",
        paddingTop : 1,
        paddingRight : 5,
        paddingLeft : 5,
        paddingBottom : 3,
        textAlign: "center",
        borderRadius: 12,
        // // font-size: .9em;
        // display: "inline-block",
        width : 180,
        zIndex : 20,
    },

    msgList : {},
    msgText : {},
    addMsgHomeworkDay : {

    },
    activeMsgBtn : {

    },
    showDaysSection : {

    },
    nonOpacity : {
      opacity : 0
    },
    msgBtnUp : {

    },
    addMsgHomeworkBlock : {

    },
    addMsgHomeworkTitle : {

    },
    addMsgHomeworkSubject : {

    },
    showSubjSection : {

    },
    whoTyping : {
        marginLeft : 20,
        // fontSize : ".9em",
        color : "darkgrey",
        fontWeight: "500",
        height: 20,
        width : "100%",
    },
    inputButton : {
        marginTop : 10,
        color : "#fff",
    },
    inputButtonDark : {
        marginTop : 10,
        color : "#000",
    },
    tabColor : {
        color : "#4472C4",
        // fontWeight : 900,
    },
    tabColorSelected : {
        color : "#fff"
    },
    tabHomework : {
        // color : "#dfa700",
        color : "#b40530",
    },
    menuIcon : {
        color : "#555a6e",
    },
    versionNumber : {
        position:"absolute",
        // fontSize : 10,
        // left : 3,
        // top : -22,
        color : "#4472C4"
        // borderWidth: 0.5,
        // borderColor : "black",
    },
    leftArrow : {
        color : "#555a6e",
    },
    header : {
        backgroundColor : "#f0f0f0",
        color : "black",
        borderBottomColor: '#c7c7c7',
        borderBottomWidth: 1,
    },
    myTitle : {
        // textDecoration: "underline",
        // fontFamily: "'Poiret One' cursive",
        fontWeight: "900",
        color : "#4472C4",
        // minWidth: "140px",
        // zIndex: "20",
        // textShadow: "1px 1px 0px #eee, 1px 1px 2px #707070",
        // color : "black",
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    msgRightSide : {
        position : "relative",
        display: "flex",
        flexDirection: "column",
        paddingTop : 13, paddingBottom : 13,
        paddingLeft : 10, paddingRight : 10,
        width : "95%",
        marginTop : 5,
        marginRight : 5,
        marginBottom : 2,
        borderRadius: 10,
        backgroundColor: 'rgba(163, 234, 247, 0.49)',
        // alignItems : "flex-end",
        alignSelf: 'flex-end',
        textAlign: "left",
    },
    msgLeftSide : {
        position : "relative",
        display: "flex",
        flexDirection: "column",
        paddingTop : 13, paddingBottom : 13,
        paddingLeft : 10, paddingRight : 10,
        width : "95%",
        marginTop : 5,
        marginLeft : 5,
        marginBottom : 2,
        borderRadius: 10,
        backgroundColor: "#edf0f2",
        alignItems : "flex-start",
        textAlign: "left",
    },
    msgAuthorLeft : {
        marginTop : -15,
        marginRight : -50,
        marginBottom : -15,
        marginLeft :0,
    },
    homeworkBorder : {
        borderColor : "#ecabb9",
        borderWidth : 2,
    },
    homeworkNoBorder : {
        borderColor : "#ffffff",
        borderWidth : 2,
    },
    msgAuthorText : {
        color : "#ffffff"
    },
    msgRightAuthor : {
        color : "#ffffff",
        display: "flex",
        position: "absolute",
        borderRadius: 8,
        paddingRight : 7,
        paddingBottom : 2,
        paddingLeft : 7,
        // fontSize: 0.75em;
        marginTop : -10,
        borderWidth: 0.5,
        borderColor : "#33ccff",
        backgroundColor: "#33ccff",
        fontWeight: "600",
        right : 10,
        // zIndex : 10,
    },
    msgLeftAuthor : {
        color : "#ffffff",
        display: "flex",
        position: "absolute",
        borderRadius: 8,
        paddingRight : 7,
        paddingBottom : 2,
        paddingLeft : 7,
        // fontSize: 0.75em;
        marginTop : -10,
        borderWidth: 0.5,
        borderColor : "#33ccff",
        backgroundColor: "#33ccff",
        fontWeight: "600",
        // zIndex : 10,
    },
    authorBorder : {
        // borderWidth: 0,
        // borderColor : "#b40530",
    },
    btnAddTime : {
        position : "absolute",
        right : 5,
        bottom : 2,
        alignSelf: 'flex-end',
        color : "#A9A9A9",
        fontSize : 10,
        // font-size : 0.7em;
    },
    btnAddTimeDone  : {
        position : "absolute",
        right : 5,
        bottom : 2,
        alignSelf: 'flex-end',
        color : "#526ef3",
        fontSize : 10,
    // font-size : 0.7em;
    },
    modalView : {
        display : "flex",
        flexDirection : "column",
        flex : 1,
        // marginTop: 22,
        height : "98%",
        // borderWidth : 2,
        // borderColor : "#ecabb9",
        // borderRadius : 10,
    },
    // modalHeader : {
    //     flex : 1,
    //     color : "#b40530",
    //     // width : "100%",
    //     fontSize : 30,
    //     // paddingLeft : 40,
    // },
    modalHeaderText : {
        color : "#b40530",
        fontWeight : "700",
        fontSize : 22,
    },
    btnHomework : {
      height : "100%",
      backgroundColor : "#b40530",

    },
    btnHomeworkDisabled : {
        height : "100%",
        backgroundColor : "darkgrey",

    },
    btnHomeworkText : {
        color : "#fff",
    },
    btnClose : {
        height : "100%",
        backgroundColor : "#7DA8E6",
    },
    btnCloseText : {
      color : "#fff",
    },
    doneButtons : {
        display : "flex",
        flex: 1,
    },
    homeworkSettings : {
        display : "flex",
        flex: 12,
    },
    msgLeftIshw : {
        color : "#fff",
        display: "flex",
        position: "absolute",
        borderRadius: 8,
        paddingRight : 7,
        paddingBottom : 2,
        paddingLeft : 7,
        // font-size: 0.75em;
        marginTop : -10,
        borderWidth: 0.5,
        borderColor : "#b40530",
        backgroundColor: "#b40530",
        // fontWeight: "600",
        right : 10,
    },
    homeworkContainer : {
        display : "flex",
        flex : 1,
        flexDirection : "row"
    },
    tabHeader : {
        backgroundColor : "#edf0f2",
    },
    editHomeworkCheckbox : {
        height : 20,
        borderWidth : 1,
    },
    tabHeaderWhen : {
        color : "#ffffff",
        backgroundColor : '#b40530',
    },
    homeworkSubjectList : {
        position : 'relative',
        backgroundColor : "#edf0f2",
        // width : "50%",
        // borderRadius : 30,
        // marginTop : 10,
    },
    homeworkDayList : {
        // width : "50%",
        backgroundColor : 'rgba(64, 155, 230, 0.16)',
    },
    msgRightIshw: {
        color : "#fff",
        display: "flex",
        position: "absolute",
        borderRadius: 8,
        paddingRight : 7,
        paddingBottom : 2,
        paddingLeft : 7,
        // font-size: 0.75em;
        marginTop : -10,
        borderWidth: 0.5,
        borderColor : "#b40530",
        backgroundColor: "#b40530",
        // fontWeight: "600"
    },
    radioButtonText : {
        color : "#b40530",
        fontSize : 10,
        paddingBottom : 10,
    },
    hidden: {
        flex : 1,
        flexDirection: 'column',
        opacity : 0,
        // position: 'absolute',
        // bottom : 0,
        // left : -500,
        borderWidth : 1,
        borderColor : "darkgrey",
        backgroundColor: "white",
        height : "100%",
    },
    normal : {
        position: 'relative',
        // top: 0,
        left : 0,
    },
    absoluteView : {
        position : 'absolute',
        // borderWidth : 3,
        // borderColor : "#b40530",
        // borderType : "solid",
    },
    mymMsgDateSeparator : {
        backgroundColor : "rgba(64, 155, 230, 0.16)",
        padding : 5,
        marginLeft : "30%",
        marginRight : "30%",
        borderWidth : 1,
        borderColor : "rgba(64, 155, 230, 0.16)",
        borderRadius: 10,
    },
    mymMsgDateSeparatorText : {
        color: "#7DA8E6",
        textAlign: "center",
        fontWeight: "600",
    },
    cameraBlock : {
        borderWidth : 2,
        borderColor : "#7DA8E6",
        borderRadius: 10,
        height : "100%",
    },
    updateMsg : {
        borderWidth : 2,
        borderColor : "#E0E0E0",
        borderRadius: 10,
        height : 40,
        // paddingLeft : "50%",
        width : "95%",
        // paddingRight : "50%",
        margin : 8,
    },
    updateMsgText : {
        display : "flex",
        justifyContent: "center",
        alignItems : "center",
        textAlign : "center",
        backgroundColor : "#E0E0E0",
        color : "#4472C4",
        width : "100%",
        height : "100%",
        paddingTop : 7,
    },
    updatedMsgText : {
        display : "flex",
        justifyContent: "center",
        alignItems : "center",
        textAlign : "center",
        color : "#E0E0E0",
        backgroundColor : "#4472C4",
        width : "100%",
        height : "100%",
        paddingTop : 7,
    },
    isNewsCheckbox : {
        margin : 8,
    },
    /* Popup container */
    popup : {
        position: "absolute",
        // cursor: "pointer",
        // display: inline-block;
        /*margin: 20px 0;*/
    },
/* The actual popup (appears on top) */
    popuptext : {
        width: 220,
        backgroundColor: "#f2b436",
        color: "#fff",
        textAlign: "center",
        borderRadius: 6,
        paddingTop: 8,
        paddingBottom : 8,
        position: "absolute",
        zIndex: 1,
        bottom: "125",
        left: "50%",
        marginBottom : -63,
        marginLeft : -170,
    },
    answer : {
        backgroundColor : "#C6EFCE",
        borderRadius : 10,
        marginLeft : 5,
        paddingTop : 4,
        paddingBottom : 4,
        paddingLeft : 8,
        paddingRight : 8,
    }

 });