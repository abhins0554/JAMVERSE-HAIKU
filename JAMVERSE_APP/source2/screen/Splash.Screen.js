import React from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

/* Import Default App Theme */
import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json'

/* Import Components */
import TextCore from '../components/core/Text.Core';

function SplashScreen() {
    return (
        <View style={Styles.screenMainFrame}>
            <Image source={{uri: 'https://jamverse.in/logo.png'}} style={styles.logo} />
            <TextCore style={styles.tagline} >Celebrating Collaboration and Creativity </TextCore>
            <Image source={require("../assets/Image/splash.png")} style={styles.splashImage} />
            <ActivityIndicator color={Color.primary} size='large' style={styles.loader} />
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        height: wp('50'),
        width: wp('50'),
        backgroundColor: 'white',
        alignSelf: "center",
        marginTop: hp('5'),
        borderRadius: 10,
    },
    splashImage: {
        height: wp('80'),
        width: wp('80'),
        alignSelf: "center",
    },
    tagline: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
        color: Color.textPrimary
    },
    loader: {
        top: hp(10),
    }
});

export default SplashScreen;