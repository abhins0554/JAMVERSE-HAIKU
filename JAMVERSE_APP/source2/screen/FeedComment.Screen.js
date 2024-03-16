import React, { useState, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";

import { useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Color from '../theme/color/defaultColor.json';
import Styles from '../theme/styles/defaultStyle';

import TextInput from '../components/core/TextInput.Core';
import Text from '../components/core/Text.Core';
import ButtonCore from '../components/core/Button.Core';

import FeedService from '../services/Feed.Service';


function FeedCommentScreen({ route, navigation }) {
    let { post_id } = route.params;

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const AuthData = '';
    const reduxData = '';
    const [CommentData, setCommentData] = React.useState([]);

    const load_likes_data = async () => {
        try {
            let { data } = await FeedService.get_feed_comments(`?_id=${post_id}`, token);
            setCommentData(data.data.comment);
        } catch (error) {
        }
    }

    const [commentText, setCommentText] = useState("");

    const updateCommentText = React.useCallback((e) => setCommentText(e), [commentText])


    React.useEffect(() => {
        load_likes_data();
    }, []);

    const submitNewUserComment = React.useCallback(async () => {
        try {
            let { data } = await FeedService.add_feed_comments({ text: commentText, post_id: post_id }, token);
        } catch (error) {
        }
        setCommentText('');
        load_likes_data();
    }, [commentText]);



    const ReplyCard = memo(({ item }) => {
        return (
            <>
                <View
                    style={styles.replyCards}
                    onPress={() => AuthData?._id !== item?.reply_user_id?._id ? (navigation.push("FriendProfileScreen", { _id: item?.reply_user_id?._id, postCount: 0 })) : (navigation.push('UserProfileScreen'))}
                >
                    <Image style={[styles.userProfileImage, { height: 50, width: 50 }]} source={item?.reply_user_id?.personalImage?.pI1 ? { uri: item?.reply_user_id?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.likeModalName}>{item?.reply_user_id?.full_name}</Text>
                        <Text style={[styles.likeModalName, { color: Color.textSecondary }]}>@{item?.reply_user_id?.user_name}</Text>
                        <Text style={styles.commentTxt}>{item?.reply_comment_text}</Text>
                    </View>
                </View>
            </>
        )
    })

    const CommentsCard = memo(({ item }) => {
        const [shownReply, setShownReply] = useState(false);
        const [replyText, setReplyText] = useState("");
        const updateReplyText = React.useCallback((e) => setReplyText(e) , [replyText]);

        const submitReplyToComment = React.useCallback(async () => {
            try {
                let { data } = await FeedService.add_feed_comments({ text: replyText, comment_id: item?._id, post_id: post_id }, token);
            } catch (error) {
            }
            load_likes_data();
            setReplyText("");
            setShownReply(false)
        }, [replyText]);

        return (
            <>
                <View
                    style={styles.cards}
                    onPress={() => AuthData?._id !== item._id ? (navigation.push("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 })) : (navigation.push('UserProfileScreen'))}
                >
                    <Image style={[styles.userProfileImage, { height: 50, width: 50 }]} source={item?.initial_user_id?.personalImage?.pI1 ? { uri: item?.initial_user_id?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} />
                    <View style={{ flexDirection: "column", width: '70%' }}>
                        <Text style={styles.likeModalName}>{item?.initial_user_id?.full_name}</Text>
                        <Text style={styles.commentTxt} >{item?.initial_comment_text}</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => setShownReply(!shownReply)}>
                        <Text style={{ textAlign: "right", padding: 10, color: Color.textSecondary }}>Reply</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "column" }}>
                    <FlatList
                        data={item?.reply}
                        keyExtractor={item => item._id.toString()}
                        renderItem={(props) => <ReplyCard {...props} />}
                        initialNumToRender={5}
                        maxToRenderPerBatch={6}
                        updateCellsBatchingPeriod={10}
                        removeClippedSubviews={true}
                        windowSize={10}
                    />
                </View>
                {
                    shownReply ?
                        <View style={{ flexDirection: "row", left: 50 }}>
                            <TextInput placeholder={"Relpy Comment .."} borderWidth={1} borderBottomWidth={1} width={wp(60)} borderRadius={5} value={replyText} onChangeText={updateReplyText} />
                            <ButtonCore onPress={submitReplyToComment} width={wp(20)}>Submit</ButtonCore>
                        </View>
                        :
                        <></>
                }
            </>
        )
    })

    return (
        <View style={[Styles.appBackground]}>
            <FlatList
                data={CommentData}
                keyExtractor={CommentData => CommentData._id.toString()}
                renderItem={(props) => <CommentsCard {...props} />}
                initialNumToRender={5}
                maxToRenderPerBatch={6}
                updateCellsBatchingPeriod={10}
                removeClippedSubviews={true}
                windowSize={10}
            />
            <View style={{ flexDirection: "row", width: wp(90), paddingBottom: 4 }}>
                <TextInput placeholder={"Write Comment .."} borderWidth={1} borderBottomWidth={1} width={wp(70)} borderRadius={7} value={commentText} onChangeText={updateCommentText} />
                <ButtonCore onPress={submitNewUserComment} width={wp(20)}>Submit</ButtonCore>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    likeModalName: {
        fontSize: 12,
        textAlign: "left",
        marginLeft: 10,
        color: Color.textPrimary
    },
    userProfileImage: {
        borderRadius: 360,
        alignSelf: "center"
    },
    commentTxt: {
        fontSize: 15,
        textAlign: "left",
        marginLeft: 10,
        color: Color.textSecondary
    },
    cards: {
        backgroundColor: Color.white,
        width: wp(90),
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: "row",
        padding: 2,
        overflow: 'hidden'
    },
    replyCards: {
        backgroundColor: Color.white,
        width: wp(80),
        alignSelf: 'center',
        marginVertical: 5,
        flexDirection: "row",
        padding: 2,
        overflow: 'hidden',
        left: wp(5),
    }
});

export default React.memo(FeedCommentScreen);