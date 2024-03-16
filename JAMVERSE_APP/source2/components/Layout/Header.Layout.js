import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useNavigation } from '@react-navigation/native';

import Color from '../../theme/color/defaultColor.json';

function Header() {
    const navigation = useNavigation();
    const icon = '';

    const styles = StyleSheet.create({
        headerFrame: {
            backgroundColor: Color.background,
            width: wp(100),
            height: hp(5),
            flexDirection: "row",
            paddingHorizontal: 20,
            borderBottomColor: Color.grey,
            borderBottomWidth: 0.5
        },
        headerText: {
            fontSize: 18,
            alignSelf: "center",
            color: Color.primary,
            fontFamily: "Chewy-Regular"
        },
        iconStyle: {
            paddingHorizontal: 10,
            alignSelf: "center"
        },
        tOStyle: {
            alignSelf: "center"
        }
    });

    return (
        <View style={styles.headerFrame}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.headerText}>JAM VERSE</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.tOStyle} onPress={() => navigation.navigate("SettingScreen")}>
                <Ionicons name={icon === "setting" ? "settings" : "settings-outline"} size={20} style={[styles.iconStyle, { color: icon === "setting" ? "#f84f38" : Color.black }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tOStyle} onPress={() => navigation.navigate("NotificationScreen")}>
                <FontAwesome name={icon === "notification" ? "bell" : "bell-o"} size={20} style={[styles.iconStyle, { color: icon === "notification" ? "#f84f38" : Color.black }]} />
            </TouchableOpacity>
        </View>
    );
}

export default React.memo(Header);