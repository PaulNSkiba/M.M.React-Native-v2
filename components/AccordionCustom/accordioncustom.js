/**
 * Created by Paul on 14.10.2019.
 */
import React, {Component} from "react";
import {Container, Header, Content, Icon, Accordion, Text, View, Left, Body, Right} from "native-base";
import {connect} from 'react-redux'
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {
    dateFromYYYYMMDD,
    mapStateToProps,
    prepareMessageToFormat,
    AddDay,
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
        // "Lorem ipsum dolor sit amet"
        // this.props.data2.filter((item2, key2)=>key2===key)[0]
        this.state = {
            dataArray: this.props.data.map((item, key) => {
                title = item.label.toUpperCase();
                item.label = item.label.toUpperCase();
                item.content = this.props.ishomework? this.props.data2.filter((item2, key2) => key2 === key)[0] : null;
                // console.log(item.content)
                return item;
            })
        }
    }

    componentDidMount() {
        // console.log("componentDidMount", this.props.data2)
        // const dataArray = this.props.data.map(item=>{
        //     item.content = "Lorem ipsum dolor sit amet"
        //     return item
        //
        // })
    }

    _renderHeader(item, expanded) {
        return (
            <View style={{
                flexDirection: "row",
                padding: 8,
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "#ffdde2",
                backgroundColor : "#edf0f2",
                borderColor: "#ecabb9",
                borderWidth: 1
            }}>
                <Left style={{width: "80%"}}>
                    <Text style={{
                        fontWeight: "400",
                        fontSize: RFPercentage(1.8),
                        color: "#4472C4"
                    }}>{item.label}</Text>
                </Left>
                <Body>
                    <Text style={{fontWeight: "600", color: "#b40530"}}>{item.count ? item.count : null}{"  "}</Text>
                </Body>
                {expanded
                    ? <Icon style={{fontSize: 18}} name="arrow-up"/>
                    : <Icon style={{fontSize: 18}} name="arrow-down"/>}
            </View>
        );
    }

    _renderContent(item) {
        return (
            <View
                // style={{backgroundColor: "#E0E0E0"}}
            >
                {item.content}
            </View>

        );
    }

    render() {

        // console.log("dataArray", index, this.state.dataArray)
        return (
            <Container>
                <Content padder style={{backgroundColor: "white"}}>
                    <Accordion
                        dataArray={this.state.dataArray}
                        animation={true}
                        expanded={this.props.index}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        expandedIconStyle={{ color: "#b40530" }}
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
