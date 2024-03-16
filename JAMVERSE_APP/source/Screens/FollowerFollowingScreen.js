import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from 'react-redux';

import CommonStyle from "../Common/styles";
import { PlatFormData } from '../Constant/CustomPlatform';
import { followerFollowingList } from '../Service/FollowerFollowing.Service';
import { Color } from '../Constant/Color.Constant';

function FollowerFollowingScreen({ navigation, route }) {
    const [type, setType] = React.useState(route?.params?.type ?? "following");
    const AuthGlobalData = JSON.parse(useSelector(E => E.AuthGlobalReducer.AuthGlobalData.data))
    const token = useSelector(E => E.AuthGlobalReducer.AuthGlobalData.token);

    const [result, setResult] = React.useState([]);

    const _get_follower_list = async () => {
        let res = await followerFollowingList(token, route.params._id)
        if (res.length !== 0) setResult(res);
    }

    React.useEffect(() => {
        _get_follower_list();
    }, []);

    return (
        <SafeAreaView style={[CommonStyle.mainframe, {backgroundColor: Color.backgroundColor}]}>
            <AntDesign name="arrowleft" size={20} style={styles.backIcon} onPress={() => navigation.goBack()} />
            <View style={{ flexDirection: "row", alignSelf: "center", marginBottom: 15 }}>
                <TouchableOpacity style={{ flex: 1, alignSelf: "center" }} onPress={() => setType("follower")}>
                    <Text style={[styles.headerText, { color: type == "follower" ? "#f84f38" : PlatFormData.textSecondaryColor }]}>Follower</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignSelf: "center" }} onPress={() => setType("following")}>
                    <Text style={[styles.headerText, { color: type == "following" ? "#f84f38" : PlatFormData.textSecondaryColor }]}>Following</Text>
                </TouchableOpacity>
            </View>
            {
                type === "follower" ?
                    <>
                        {
                            result[0]?.followers?.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.cards} onPress={() => AuthGlobalData?._id !== item._id ? navigation.navigate("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 }) : navigation.navigate('UserProfileScreen')} key={index}>
                                        <Image source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1  } : require("../Asset/user_318-159711.png")} style={styles.imgpp} />
                                        <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                            <Text style={{ color: PlatFormData.textPrimaryColor }} numberOfLines={1}>{item?.full_name}</Text>
                                            {/* <Text style={{ color: "darkgrey" }}>@{item?.user_name}</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </>
                    :
                    <>
                        {
                            result[0]?.following?.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.cards} onPress={() => AuthGlobalData?._id !== item._id ? navigation.navigate("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 }) : navigation.navigate('UserProfileScreen')} key={index}>
                                        <Image source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1 } : require("../Asset/user_318-159711.png")} style={styles.imgpp} />
                                        <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                            <Text style={{ color: PlatFormData.textPrimaryColor }} numberOfLines={1}>{item?.full_name}</Text>
                                            {/* <Text style={{ color: "darkgrey" }}>@{item?.user_name}</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </>
            }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    backIcon: {
        margin: 10,
        color: PlatFormData.textPrimaryColor
    },
    headerText: {
        alignSelf: "center",
    },
    cards: {
        marginTop: 5,
        backgroundColor: Color.cardsColor,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowRadius: 10,
        elevation: 10,
        flexDirection: "row",
        padding: 10,
        shadowColor: '#52006A',
        overflow: "hidden"
    },
    imgpp: {
        width: 50,
        height: 50,
        borderRadius: 360,
    }
})
export default React.memo(FollowerFollowingScreen);