import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useNavigation } from '@react-navigation/native';

import Color from '../../theme/color/defaultColor.json';
import Text from '../core/Text.Core';


function BottomNav() {

    const type = 'jamming';

    const navigation = useNavigation();

    const styles = StyleSheet.create({
        icon: {
            alignSelf: "center"
        },
    })

    return (
        <>
            <View style={dynamicStyleNav.card}>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "home" ? (wp(90) * 2 / 5) : ((wp(90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("FeedScreen")}>
                    <Ionicons name={type === "home" ? "home-sharp" : "home-outline"} size={20} style={styles.icon} color={type === "home" ? "#f84f38" : Color.black} />
                    {type === "home" ? <Text style={dynamicStyleNav.navigationText}>Feed</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "navigation" ? (wp(90) * 2 / 5) : ((wp(90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden"
                }]}>
                    <Ionicons name={type === "navigation" ? "navigate-sharp" : "navigate-outline"} size={20} style={styles.icon} color={type === "navigation" ? "#f84f38" : Color.black} />
                    {type === "navigation" ? <Text style={dynamicStyleNav.navigationText}>Navigate</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "jamming" ? (wp(90) * 2 / 5) : ((wp(90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("JammingScreen")} >
                    <AntDesign name="plus" size={20} style={styles.icon} color={"#f84f38"} />
                    {type === "jamming" ? <Text style={dynamicStyleNav.navigationText}>Create</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "search" ? (wp(90) * 2 / 5) : ((wp(90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("SearchScreen")}>
                    <Ionicons name={type === "search" ? "search-sharp" : "search-outline"} size={20} style={styles.icon} color={type === "search" ? "#f84f38" : Color.black} />
                    {type === "search" ? <Text style={dynamicStyleNav.navigationText}>Search</Text> : <></>}
                </TouchableOpacity>
                <TouchableOpacity style={[dynamicStyleNav.iconContainer, {
                    width: type === "profile" ? (wp(90) * 2 / 5) : ((wp(90) * 3 / 5) / 4),
                    borderRadius: 10,
                    overflow: "hidden",
                }]} onPress={() => navigation.navigate("UserProfileScreen")}>
                    <Ionicons name={type === "profile" ? "person" : "person-outline"} size={20} style={styles.icon} color={type === "profile" ? "#f84f38" : Color.black} />
                    {type === "profile" ? <Text style={dynamicStyleNav.navigationText}>Profile</Text> : <></>}
                </TouchableOpacity>
            </View>
        </>
    );
}

const dynamicStyleNav = StyleSheet.create({
    card: {
        backgroundColor: Color.background,
        width: wp(100),
        height: hp(5),
        alignSelf: "center",
        shadowRadius: 10,
        shadowColor: '#52006A',
        flexDirection: "row",
        borderTopWidth: 0.5,
        borderTopColor: Color.grey
    },
    iconContainer: {
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
        marginHorizontal: 3
    },
    navigationText: {
        fontSize: 18,
        paddingHorizontal: 6,
        color: Color.textPrimary,
    }
})

export default React.memo(BottomNav);