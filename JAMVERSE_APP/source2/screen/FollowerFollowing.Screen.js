import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from "react-native";

import { useSelector } from 'react-redux';

import Text from '../components/core/Text.Core';

import Color from '../theme/color/defaultColor.json';
import Style from '../theme/styles/defaultStyle';

import ProfileService from '../services/Profile.Service';

function FollowerFollowingScreen({ navigation, route }) {
    const [type, setType] = React.useState(route?.params?.type ?? "following");
    const AuthGlobalData = ''
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [result, setResult] = React.useState([]);

    const _get_follower_list = async () => {
        try {
            let { data } = await ProfileService.getFollowerFollowing(token);
            setResult(data.data);
        } catch (error) {
        }
    }

    React.useEffect(() => {
        _get_follower_list();
    }, []);

    return (
        <View style={Style.appBackground}>
            <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 10 }}>
                <TouchableOpacity style={{ flex: 1, alignSelf: "center" }} onPress={() => setType("follower")}>
                    <Text style={[styles.headerText, { color: type == "follower" ? "#f84f38" : Color.textSecondary }]}>Follower</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignSelf: "center" }} onPress={() => setType("following")}>
                    <Text style={[styles.headerText, { color: type == "following" ? "#f84f38" : Color.textSecondary }]}>Following</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={Style.appBackground}>
                {
                    type === "follower" ?
                        <>
                            {
                                result[0]?.followers?.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={styles.cards} onPress={() => AuthGlobalData?._id !== item._id ? navigation.navigate("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 }) : navigation.navigate('UserProfileScreen')} key={index}>
                                            <Image source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={styles.imgpp} />
                                            <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                                <Text style={{ color: Color.textPrimary }} numberOfLines={1}>{item?.full_name}</Text>
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
                                            <Image source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={styles.imgpp} />
                                            <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                                <Text style={{ color: Color.textPrimary }} numberOfLines={1}>{item?.full_name}</Text>
                                                {/* <Text style={{ color: "darkgrey" }}>@{item?.user_name}</Text> */}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </>
                }
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    backIcon: {
        margin: 10,
        color: Color.textPrimary
    },
    headerText: {
        alignSelf: "center",
    },
    cards: {
        marginTop: 5,
        backgroundColor: Color.white,
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