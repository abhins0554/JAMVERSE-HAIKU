import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, FlatList  } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import { Color } from '../Constant/Color.Constant';
import { PlatFormData } from '../Constant/CustomPlatform';
import { postLikeinGroupById } from '../Service/Post.Service';

function FeedLikeScreen({route, navigation}) {
    const { post_id } = route.params;

    const AuthData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));
    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);
    const [likesData, setLikesData] = React.useState([]);

    const load_likes_data = React.useCallback(async () => {
        let postLikeData = await postLikeinGroupById(post_id, reduxData?.token);
        if(postLikeData?._id) {
            postLikeData.likes = postLikeData?.likes?.reduce((prev_arr, item) => {
                if (!prev_arr.filter(i => i._id === item._id).length) prev_arr.push(item);
                return prev_arr;
            },[]);
            setLikesData(postLikeData?.likes);
        }
    }, [likesData]);

    React.useEffect(() => {
        load_likes_data();
    }, []);

    return (
        <View style={[styles.modalMainFrame]}>
            <View style={styles.modalHeader}>
                <FontAwesome name="arrow-left" onPress={() => navigation.goBack()} size={25} style={styles.ico} />
                <Text style={styles.modalHeaderText}>Likes</Text>
            </View>
            <FlatList
                data={likesData}
                keyExtractor={likesData => likesData._id.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={{ zIndex: 10, padding: 1, borderRadius: 10, backgroundColor: Color.cardsColor, flexDirection: "row", marginHorizontal: 20, marginVertical: 5 }}
                            onPress={() => AuthData?._id !== item._id ? (navigation.push("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 })) : (navigation.push('UserProfileScreen'))}
                        >
                            <Image style={[styles.userProfileImage, { height: 50, width: 50 }]} source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1 } : require("../Asset/user_318-159711.png")} />
                            <View>
                                <Text style={styles.likeModalName}>{item.full_name}</Text>
                                <Text style={styles.likeModalName}>@{item.user_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    modalMainFrame: {
        backgroundColor: Color.backgroundColor,
        flex: 1
    },
    modalHeader: {
        flexDirection: "row",
        margin: 10,
        padding:10,
    },
    modalHeaderText: {
        fontSize: 20,
        textAlign: "center",
        justifyContent: "center",
        color: PlatFormData.textPrimaryColor,
        marginHorizontal: 10,
        fontWeight: "600"
    },
    likeModalName: {
        color: PlatFormData.textPrimaryColor,
        fontSize: 15,
        textAlign: "left",
        marginLeft: 10
    },
    userProfileImage: {
        borderRadius: 360,
    }
})
export default React.memo(FeedLikeScreen);