/**
 * Created by Paul on 24.09.2019.
 */
import React, { Component } from 'react';
import { TouchableOpacity, View, ImageBackground, Text, Linking } from 'react-native';
import LinkPreview from 'react-native-link-preview';
import Icon from 'react-native-vector-icons/FontAwesome';

class LinkPreviewEx extends Component {

    state = {
        title: null, // title of the web page
        image_url: null, // URL of the thumbnail image preview
        link: null, // URL to open when the chat bubble is clicked
        link_type: null, // type of content displayed by the webpage (e.g. article, video)
        has_preview: false // whether to display the preview or not
    }

    async componentDidMount() {
        const { uri } = this.props;
        try {
            const { title, images, url, mediaType } = await LinkPreview.getPreview(uri);

            await this.setState({
                title: title,
                image_url: images[0],
                link: url,
                link_type: mediaType,
                has_preview: true // display the preview
            });

        } catch (e) {
            console.log('error occurred: ', e);
        }
    }
    render() {
        const { image_url, title, link, link_type, has_preview } = this.state;
        const { text_color } = this.props;
        const is_video = (link_type && link_type.indexOf('video') !== -1) ? true : false;
        // console.log("LinkPreview", this.state)
        return (
            <View style={styles.container}>
                <View style={{ flex : 1, flexDirection : "row" }}>
                    {
                        has_preview &&
                        <View style={{flex : 2}}>
                            <TouchableOpacity onPress={this.openLink}>
                                <ImageBackground
                                    style={styles.preview}
                                    source={{uri: image_url}}
                                    imageStyle={{resizeMode: 'contain'}}>
                                    {
                                        is_video &&
                                        <Icon name="play-circle" style={styles.play} size={50} color="#FFF" />
                                    }
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{flex: 4, flexDirection : "column", justifyContent: "space-around"}}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={this.openLink}>
                                <Text style={[styles.title, { color: text_color }]}>{title}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            !this.state.has_preview &&
                            <View style={{flex: 1}}>
                                <Text style={styles.link}>{link}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    }

    openLink = async () => {
        const { link } = this.state;
        try {
            const supported = await Linking.canOpenURL(link); // determine if the device has the app for opening the link
            if (supported) {
                return Linking.openURL(link); // launch the app in question
            }
        } catch(e) {
            console.log('error occurred: ', e);
        }
    }

}

const styles = {
    container: {
        width: "100%",
        margin: 5,
        height: 90,
    },
    preview: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    play: {
        opacity: 0.75
    },
    title: {
        fontSize: 14
    },
    link: {
        color: '#0178ff'
    }
}

export default LinkPreviewEx;