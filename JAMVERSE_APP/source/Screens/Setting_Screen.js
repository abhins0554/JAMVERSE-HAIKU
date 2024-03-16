import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";

import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Share from 'react-native-share';

import CommonStyle from "../Common/styles";
import BottomNav from '../Components/BottomNav';
import Header from '../Components/Header';
import { PlatFormData } from '../Constant/CustomPlatform';
import { Color } from '../Constant/Color.Constant';

function Setting_Screen({ navigation }) {

    const styles = StyleSheet.create({
        itemSeperator: {
            marginHorizontal: 20,
            margin: 10,
            padding: 7.5,
            flexDirection: "row",
        },
        itemSeperatorText: {
            color: PlatFormData.textPrimaryColor,
        },
        itemSeperatorIcon: {
            color: PlatFormData.textPrimaryColor,
            paddingHorizontal: 10,
            fontSize: 20,
        }
    })

    const _logout = async () => {
        AsyncStorage.clear();
        RNRestart.restart();
    }

    const _shareApp = async () => { 
        Share.open({ 
            url: `https://play.google.com/store/apps/details?id=com.jamverse`, 
            title: `Download JAM VERSE - HAIKU`, 
            message: `Hey you, download JAM VERSE - HAIKU an amazing app for writing haiku and share with your friends`,
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <SafeAreaView style={[CommonStyle.mainframe, {backgroundColor: Color.backgroundColor}]}>
            <Header icon={"setting"} navigation={navigation} />
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => navigation.navigate("EditProfileScreen")}>
                    <AntDesign name="edit" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Edit Profile</Text>
                </TouchableOpacity>
                <View style={styles.itemSeperator}>
                    <Feather name="globe" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Change Language</Text>
                </View>
                <View style={styles.itemSeperator}>
                    <MaterialCommunityIcons name="lock-alert" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Forgot Password</Text>
                </View>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => navigation.navigate('ActivityScreen')}>
                    <Feather name="activity" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Your Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <MaterialIcons name="privacy-tip" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
                    <MaterialIcons name="privacy-tip" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Terms & Condition</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() =>  Linking.openURL('mailto:support@jamverse.in')}>
                    <MaterialIcons name="help" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Help & Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() =>  _shareApp()}>
                    <AntDesign name="sharealt" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Invite you friend and create HAIKU</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => _logout()}>
                    <AntDesign name="logout" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Logout Profile</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: "35%" }}>
                    <Text style={{ color: PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000" }}>App Version </Text>
                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}> J</Text>
                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>A</Text>
                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>M</Text>
                    <Text style={{ fontWeight: "bold", fontStyle: "italic" }}> VERSE</Text>
                    <Text style={{ color: PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000" }}> - 20</Text>
                </View>
            </View>
            <BottomNav navigation={navigation} />
        </SafeAreaView>
    );
}

export default React.memo(Setting_Screen);