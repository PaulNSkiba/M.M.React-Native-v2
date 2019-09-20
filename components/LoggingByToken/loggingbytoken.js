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
        // console.log("loggingbytoken", this.props.email, this.props.token)
        // if (!this.props.logout)
            this.props.onUserLoggingByToken(this.props.email, this.props.token, null, this.props.langLibrary);
        // else
        //     this.props.onUserLoggingOut(this.props.token, this.props.langLibrary)
    }
    render(){
        return null;
    }
}
const mapDispatchToProps = dispatch => {
    return ({
        onReduxUpdate : (key, payload) => dispatch({type: key, payload: payload}),
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
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(LoggingByToken)