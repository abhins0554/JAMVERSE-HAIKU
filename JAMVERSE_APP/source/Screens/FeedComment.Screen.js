import React, { useState, memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from 'react-redux';
import { Color } from '../Constant/Color.Constant';
import { PlatFormData } from '../Constant/CustomPlatform';
import { addCommentByPostId, getCommentByPostId } from '../Service/Post.Service';
import TextInput from '../Common/TextInput';


function FeedLikeScreen({ route, navigation }) {
    let { post_id } = route.params;

    const AuthData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));
    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);
    const [CommentData, setCommentData] = React.useState([]);

    const load_likes_data = async () => {
        let postLikeData = await getCommentByPostId(post_id, reduxData?.token);
        if (postLikeData?._id) setCommentData(postLikeData?.comment)
    }

    const [commenttext, setCommentText] = useState("");
    

    React.useEffect(() => {
        load_likes_data();
    }, []);

    const submitNewUserComment = async () => {
        // commenttext
        await addCommentByPostId(reduxData?.token, post_id, '', commenttext);
        setCommentText('');
        load_likes_data();
    }



    const ReplyCard = memo(({ replyItem }) => {
        return (
            <>
                <View
                    style={{ zIndex: 10, padding: 1, borderRadius: 10, backgroundColor: Color.cardsColor, flexDirection: "row", marginHorizontal: 20, marginVertical: 5, flex: 1, left: 50 }}
                    onPress={() => AuthData?._id !== replyItem?.reply_user_id?._id ? (navigation.push("FriendProfileScreen", { _id: replyItem?.reply_user_id?._id, postCount: 0 })) : (navigation.push('UserProfileScreen'))}
                >
                    <Image style={[styles.userProfileImage, { height: 50, width: 50 }]} source={replyItem?.reply_user_id?.personalImage?.pI1 ? { uri: replyItem?.reply_user_id?.personalImage?.pI1 } : require("../Asset/user_318-159711.png")} />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.likeModalName}>{replyItem?.reply_user_id?.full_name}</Text>
                        <Text style={[styles.likeModalName, { color: PlatFormData.textSecondaryColor }]}>@{replyItem?.reply_user_id?.user_name}</Text>
                        <Text style={styles.commentTxt}>{replyItem?.reply_comment_text}</Text>
                    </View>
                </View>
            </>
        )
    })

    const CommentsCard = memo(({ item }) => {
        const [shownReply, setShownReply] = useState(false);
        const [replytext, setReplyText] = useState("");

        const comment_id = item?._id;
        const token = reduxData?.token;

        const submitReplyToComment = async () => {
            await addCommentByPostId(token, post_id, comment_id, replytext);
            load_likes_data();
            setReplyText("");
            setShownReply(false)
        }

        return (
            <>
                <View
                    style={{ zIndex: 10, padding: 1, borderRadius: 10, backgroundColor: Color.cardsColor, flexDirection: "row", marginHorizontal: 20, marginVertical: 5 }}
                    onPress={() => AuthData?._id !== item._id ? (navigation.push("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 })) : (navigation.push('UserProfileScreen'))}
                >
                    <Image style={[styles.userProfileImage, { height: 50, width: 50 }]} source={item?.initial_user_id?.personalImage?.pI1 ? { uri: item?.initial_user_id?.personalImage?.pI1 } : require("../Asset/user_318-159711.png")} />
                    <View style={{ flexDirection: "column", width: '70%' }}>
                        <Text style={styles.likeModalName}>{item?.initial_user_id?.full_name}</Text>
                        <Text style={[styles.likeModalName, { color: PlatFormData.textSecondaryColor }]}>@{item?.initial_user_id?.user_name}</Text>
                        <Text style={styles.commentTxt} >{item?.initial_comment_text}</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => setShownReply(!shownReply)}>
                        <Text style={{ textAlign: "right", padding: 10 }}>Reply</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "column" }}>
                    <FlatList
                        data={item?.reply}
                        keyExtractor={item => item._id.toString()}
                        renderItem={({ item: replyItem }) => {

                            return (
                                <ReplyCard replyItem={replyItem} />
                            )
                        }}
                    />
                </View>
                {
                    shownReply ?
                        <View style={{ flexDirection: "row", left: 50 }}>
                            <TextInput placeholder={"Relpy Comment .."} width={Dimensions.get('window').width - 180} borderRadius={20} backgroundColor={Color.cardsColor} value={replytext} onChangeText={i => setReplyText(i)} />
                            <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={submitReplyToComment}>
                                <Text style={{ alignSelf: "center" }}>Post</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <></>
                }
            </>
        )
    })

    return (
        <View style={[styles.modalMainFrame]}>
            <View style={styles.modalHeader}>
                <FontAwesome name="arrow-left" onPress={() => navigation.goBack()} size={25} style={styles.ico} />
                <Text style={styles.modalHeaderText}>Comments</Text>
            </View>
            <FlatList
                data={CommentData}
                keyExtractor={CommentData => CommentData._id.toString()}
                renderItem={({ item }) => {
                    return (
                        <CommentsCard item={item} />
                    )
                }}
            />
            <View style={{ flexDirection: "row" }}>
                <TextInput placeholder={"Write Comment .."} width={Dimensions.get('window').width - 80} borderRadius={20} backgroundColor={Color.cardsColor} value={commenttext} onChangeText={i => setCommentText(i)} />
                <TouchableOpacity style={{ flex: 1, justifyContent: "center" }} onPress={submitNewUserComment}>
                    <Text style={{ alignSelf: "center" }}>Post</Text>
                </TouchableOpacity>
            </View>
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
        padding: 10,
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
        fontSize: 12,
        textAlign: "left",
        marginLeft: 10
    },
    userProfileImage: {
        borderRadius: 360,
        alignSelf: "center"
    },
    commentTxt: {
        fontSize: 15,
        textAlign: "left",
        marginLeft: 10,
        color: PlatFormData.textPrimaryColor,
    }
})
export default React.memo(FeedLikeScreen);