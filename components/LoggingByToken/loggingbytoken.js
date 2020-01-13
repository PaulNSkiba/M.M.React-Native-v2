/**
 * Created by Paul on 14.09.2019.
 */
import React, { Component } from 'react'
import { userLoggedIn, userLoggedInByToken, userLoggedOut } from '../../actions/userAuthActions'
import { mapStateToProps } from '../../js/helpersLight'
import { connect } from 'react-redux'

class LoggingByToken extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
        this.props.onUserLoggingByToken(this.props.email, this.props.token, null, this.props.langLibrary);
     }
    render(){
        return null;
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
        onUserLoggingByToken : async (email, token, kind, langLibrary, theme, themeColor)=>{
                const asyncLoggedInByToken = (email, token, kind, langLibrary, theme, themeColor) => {
                    return async dispatch => {
                        dispatch(userLoggedInByToken(email, token, kind, langLibrary, theme, themeColor))
                    }
                }
                dispatch(asyncLoggedInByToken(email, token, kind, langLibrary, theme, themeColor))
            },
        onUserLoggingOut  : (token, langLibrary, theme, themeColor) => {
            return dispatch(userLoggedOut(token, langLibrary, theme, themeColor))
        },
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(LoggingByToken)