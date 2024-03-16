import React from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image, Dimensions, ActivityIndicator } from 'react-native';

function SplashScreen() {

    const styles = StyleSheet.create({
        mainframe: {
            flex: 1,
            backgroundColor: '#fcefef',
        },
        heading: {
            fontWeight: "bold",
            fontSize: 26,
            margin: 40,
            marginTop: 25,
            marginBottom: 20,
            color: "#292b39",
        },
        subHeading: {
            marginHorizontal: 40,
            marginVertical: 0,
            fontSize: 18,
            color: "#292b39",
        },
        image: {
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').width / 2,
            alignSelf: "center",
            marginBottom: 50
        },
    })

    return (
        <SafeAreaView style={styles.mainframe}>
            <Image style={styles.image} source={require('../Asset/jamverse.png')} />
            <Image source={require("../Asset/welcome.png")} style={{ alignSelf: "center", justifyContent: "center" }} />
            <View style={{ flex: 1 }} />
            <ActivityIndicator color={"#f84f38"} size="large" style={{ marginBottom: 20 }} />
        </SafeAreaView>
    );
}

export default SplashScreen;