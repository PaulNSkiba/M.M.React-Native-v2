/**
 * Created by Paul on 03.10.2019.
 */
import React, { Component } from 'react'
import { Button } from 'react-native'
import styles from '../../css/styles'
import { LoginManager } from 'react-native-fbsdk'

export default class FacebookLogin extends Component {
    handleFacebookLogin () {
        LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log('Login cancelled')
                } else {
                    console.log('Login success with permissions: ' + result.grantedPermissions.toString())
                }
            },
            function (error) {
                console.log('Login fail with error: ' + error)
            }
        )
    }
    render () {
        return (
            <Button block primary disabled style={styles.inputButton} title={"Facebook"} onPress={this.handleFacebookLogin}/>
        )
    }
}