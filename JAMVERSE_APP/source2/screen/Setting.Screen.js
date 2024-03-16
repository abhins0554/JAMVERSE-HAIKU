import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking, ScrollView } from "react-native";

import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Share from 'react-native-share';

import Text from '../components/core/Text.Core';

import Color from '../theme/color/defaultColor.json';
import Style from '../theme/styles/defaultStyle';

function Setting_Screen({ navigation }) {

    const styles = StyleSheet.create({
        itemSeperator: {
            marginHorizontal: 20,
            margin: 10,
            padding: 7.5,
            flexDirection: "row",
        },
        itemSeperatorText: {
            color: Color.textPrimary
        },
        itemSeperatorIcon: {
            color: Color.textPrimary,
            paddingHorizontal: 10,
            fontSize: 20,
        }
    })

    const _logout = async () => {
        AsyncStorage.clear();
        RNRestart.restart();
    }

    const _shareApp = React.useCallback(async () => {
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
    }, []);

    return (
        <View style={Style.appBackground}>
            <ScrollView style={{ flex: 1 }}>
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
                <TouchableOpacity style={styles.itemSeperator} onPress={() => Linking.openURL('mailto:support@jamverse.in')}>
                    <MaterialIcons name="help" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Help & Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => _shareApp()}>
                    <AntDesign name="sharealt" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Invite you friend and create HAIKU</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemSeperator} onPress={() => _logout()}>
                    <AntDesign name="logout" style={styles.itemSeperatorIcon} />
                    <Text style={styles.itemSeperatorText}>Logout Profile</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: "20%" }}>
                    <Text style={{ color: Color.textSecondary }}>App Version - </Text>
                    <Text style={{ color: Color.textSecondary }}> J</Text>
                    <Text style={{ color: Color.textSecondary }}>A</Text>
                    <Text style={{ color: Color.textSecondary }}>M</Text>
                    <Text style={{ color: Color.textSecondary }}> VERSE</Text>
                    <Text style={{ color: Color.textSecondary }}> - v25</Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default React.memo(Setting_Screen);