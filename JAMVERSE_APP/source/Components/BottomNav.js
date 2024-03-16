import React, { useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from '@react-navigation/native';


import { PlatFormData } from '../Constant/CustomPlatform';
import { Color } from '../Constant/Color.Constant';


function BottomNav({ type }) {

    const navigation = useNavigation();

    const styles = StyleSheet.create({
        mainFrame: {
            width: Dimensions.get('window').width,
            height: 40,
            flexDirection: "row",
            backgroundColor: PlatFormData.colorMode === "dark" ? "#000000" : "#ffffff",
            elevation: 2
        },
        iconContainer: {
            flex: 1,
            justifyContent: "center",
        },
        icon: {
            alignSelf: "center"
        },
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: PlatFormData.secondaryColor,
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalHeading: {
            color: PlatFormData.textPrimaryColor,
            fontSize: 18,
        },
        modalBtn: {
            margin: 10,
            padding: 7,
            backgroundColor: "#f84f38",
            borderRadius: 7
        },
        modalBtnTxt: {
            fontSize: 15,
            color: PlatFormData.textSecondaryColor
        }
    })

    return (
        <>
            <View style={dynamicStyleNav.card}>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "home" ? ((Dimensions.get('screen').width - 90) * 2 / 5) : (((Dimensions.get('screen').width - 90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("FeedScreen")}>
                    <Ionicons name={type === "home" ? "home-sharp" : "home-outline"} size={20} style={styles.icon} color={type === "home" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000"} />
                    {type === "home" ? <Text style={dynamicStyleNav.navigationText}>Feed</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "navigation" ? ((Dimensions.get('screen').width - 90) * 2 / 5) : (((Dimensions.get('screen').width - 90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden"
                }]}>
                    <Ionicons name={type === "navigation" ? "navigate-sharp" : "navigate-outline"} size={20} style={styles.icon} color={type === "navigation" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000"} />
                    {type === "navigation" ? <Text style={dynamicStyleNav.navigationText}>Navigate</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "jamming" ? ((Dimensions.get('screen').width - 90) * 2 / 5) : (((Dimensions.get('screen').width - 90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                    
                }]} onPress={() => navigation.navigate("JammingScreen")} >
                    <AntDesign name="plus" size={20} style={styles.icon} color={"#f84f38"} />
                    {type === "jamming" ? <Text style={dynamicStyleNav.navigationText}>Create</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "search" ? ((Dimensions.get('screen').width - 90) * 2 / 5) :  (((Dimensions.get('screen').width - 90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("Search")}>
                    <Ionicons name={type === "search" ? "search-sharp" : "search-outline"} size={20} style={styles.icon} color={type === "search" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000"} />
                    {type === "search" ? <Text style={dynamicStyleNav.navigationText}>Search</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "profile" ? ((Dimensions.get('screen').width - 90) * 2 / 5) : (((Dimensions.get('screen').width - 90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("UserProfileScreen")}>
                    <Ionicons name={type === "profile" ? "person" : "person-outline"} size={20} style={styles.icon} color={type === "profile" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000"} />
                    {type === "profile" ? <Text style={dynamicStyleNav.navigationText}>Profile</Text> : <></>}
                </TouchableOpacity>
            </View>
        </>
    );
}

const dynamicStyleNav = StyleSheet.create({
    card: {
        backgroundColor: Color.cardsColor,
        width: Dimensions.get('screen').width - 40,
        height: 60,
        position: "absolute",
        top: "91%",
        alignSelf: "center",
        borderRadius: 360,
        elevation: 20,
        shadowRadius: 10,
        shadowColor: '#52006A',
        flexDirection: "row"
    },
    iconContainer: {
        padding: 3,
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        marginHorizontal: 3
    },
    navigationText: {
        fontSize: 18,
        paddingHorizontal: 6,
        color: PlatFormData.textPrimaryColor,
    }
})

export default React.memo(BottomNav);