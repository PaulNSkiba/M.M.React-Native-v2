/**
 * Created by Paul on 14.10.2019.
 */
import React, {Component} from "react";
import {Container, Header, Content, Icon, Accordion, Text, View, Left, Body, Right, ScrollView} from "native-base";
import {connect} from 'react-redux'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {
    dateFromYYYYMMDD,
    mapStateToProps,
    prepareMessageToFormat,
    addDay,
    toYYYYMMDD,
    daysList
} from '../../js/helpersLight'
import styles from '../../css/styles'

// const dataArray = [
//     { title: "First Element", content: "Lorem ipsum dolor sit amet" },
//     { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
//     { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
// ];

class AccordionCustom extends Component {
    constructor(props) {
        super(props);
        // this.props.data2.filter((item2, key2)=>key2===key)[0]
        this.state = {
            dataArray: this.props.data.map((item, key) => {
                title = item.label.toUpperCase();
                item.label = item.label.toUpperCase();
                item.content = this.props.ishomework? this.props.data2.filter((item2, key2) => key2 === key)[0] : null;
                // console.log("AccordionCustom: item", item.content)
                return item;
            })
        }
        this._renderHeader = this._renderHeader.bind(this)
        this._renderContent = this._renderContent.bind(this)
    }
    componentDidMount() {
    }
    _renderHeader(item, expanded) {
        const {showFooter, showKeyboard, theme, themeColor, online} = this.props.interface
        return (
            <View style={{
                flexDirection: "row",
                paddingTop: 4,
                paddingBottom : 4,
                paddingRight : 8,
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "#ffdde2",
                backgroundColor : theme.primaryTextColor,
                // borderColor: "#ecabb9",
                borderLeftWidth: 4,
                marginTop : 6,
                borderLeftColor : theme.secondaryColor
            }}>
                    {item.hasOwnProperty("labelEx")?<Left style={{width: 120}}><Text style={{
                        fontWeight: "800",
                        fontSize: RFPercentage(2.2),
                        color: "#565656", paddingLeft : 10
                    }}>{`${item.labelEx}`}</Text><Text style={{
                        fontWeight: "800",
                        fontSize: RFPercentage(2.2),
                        color: theme.primaryColor, paddingLeft : 10
                    }}>{item.dateEx}</Text></Left>:<Left style={{width: 120}}><Text style={{
                        fontWeight: "800",
                        fontSize: RFPercentage(1.8),
                        color: "#565656", paddingLeft : 10
                    }}>{item.label}</Text></Left>}

                <Body>
                {item.count?<Text style={{fontWeight: "600", color: theme.primaryDarkColor}}>{item.count}{"  "}</Text>:null}
               </Body>
                {expanded
                    ? <Icon style={{fontSize: 18, color : theme.secondaryColor}} name="arrow-up"/>
                    : <Icon style={{fontSize: 18, color : theme.secondaryColor}} name="arrow-down"/>}
            </View>
        );
    }

    _renderContent(item) {
        return (
            <View>
                {item.content}
            </View>
        );
    }

    render() {
        const {showFooter, showKeyboard, theme, themeColor, online} = this.props.interface
        // console.log("Accordion: dataArray", this.state.dataArray)
        return (
            <Container>
                <Content padder style={{backgroundColor: theme.primaryLightColor}}>
                    <Accordion
                        dataArray={this.state.dataArray}
                        animation={true}
                        expanded={this.props.index}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        expandedIconStyle={{ color: theme.primaryDarkColor }}
                    />
                </Content>
            </Container>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate: (key, payload) => dispatch({type: key, payload: payload}),
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(AccordionCustom)
