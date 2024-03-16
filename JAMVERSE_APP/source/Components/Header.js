import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Button from '../Common/Button';
import {cretePost} from "../Service/Post.Service";
import { PlatFormData } from '../Constant/CustomPlatform';
import { Color } from '../Constant/Color.Constant';

function Header({ type, icon, onPressHome }) {
    const navigation = useNavigation();
    const reduxData = useSelector(e => e?.TextGlobal?.TextGlobal);
    const reduxDataBG = useSelector(e => e?.BackGroundGlobal?.BackGroundGlobal);
    const _share = async () => {
        cretePost(reduxData, navigation, reduxDataBG);
    }

    const styles = StyleSheet.create({
        headerFrame: {
            backgroundColor: Color.cardsColor,
            width: Dimensions.get('screen').width,
            height: type === "share" ? 70 : 45,
            flexDirection: "row",
            paddingHorizontal: 20
        },
        headerText: {
            fontSize: 18,
            alignSelf: "center",
            color: PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000",
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
            <View style ={{flexDirection: "row"}}>
                <Text style={styles.headerText}>JAM VERSE</Text>
                {type == "home" ?
                    <TouchableOpacity style={styles.tOStyle} onPress={onPressHome}>
                        <AntDesign name={"down"} size={20} style={[styles.iconStyle, { color: "#f84f38" }]} />
                    </TouchableOpacity>
                    :
                    <></>
                }
            </View>
            <View style={{ flex: 1 }} />
            {
                type === "share" ?
                    <>
                        <Button color={"#f84f38"} text="Share" textColor={"white"} width={80} borderRadius={7} onPress={()=>_share()} />
                    </>
                    :
                    <>
                        <TouchableOpacity style={styles.tOStyle} onPress={() => navigation.navigate("SettingScreen")}>
                            <Ionicons name={icon === "setting" ? "settings":"settings-outline"} size={20} style={[styles.iconStyle,{color: icon === "setting" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000" }]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tOStyle} onPress={() => navigation.navigate("Notification")}>
                            <FontAwesome name={icon === "notification" ? "bell":"bell-o"} size={20} style={[styles.iconStyle,{color: icon === "notification" ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000" }]} />
                        </TouchableOpacity>
                    </>
            }
        </View>
    );
}

export default React.memo(Header);