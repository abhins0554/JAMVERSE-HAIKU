import React, { memo, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useSelector } from 'react-redux';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';

import { useNavigation } from '@react-navigation/native';

import ResponsiveText, { getResponsiveSize } from './ResponsiveText';

import Color from '../theme/color/defaultColor.json';
import FeedService from '../services/Feed.Service';

function FeedComponents(props) {

    const navigation = useNavigation();

    const [like, setLikes] = useState( props.new_feed === true ? props.is_liked === true ? true : false : props.likes || false);

    const screenShotRef = React.useRef();
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const addLikeUnlike = React.useCallback(async () => {
        try {
            let { data } = await FeedService.like_post({
                "post_id": props._id,
                "type": like ? "unlike" : "like",
                post_type: 'group'
            }, token);
            setLikes(!like);
        } catch (error) {
        }
    }, [like]);

    const createScreenShot = React.useCallback(() => {
        setTimeout(() => {
            screenShotRef.current.capture().then(uri => {
                Share.open({ url: uri, title: `A Jam by Jam verse`, message: "Download the app now. https://play.google.com/store/apps/details?id=com.jamverse" })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
        }, 1000);
    }, []);

    return (
        <>
            {
                props.new_feed === true ?
                    <ViewShot ref={screenShotRef}>
                        <View style={styles.cards}>
                            <ResponsiveText style={[styles.titleText, { fontFamily: props.font_family || 'Oswald-Regular', color: props.color == '#ffffff' || props.color == '#FFFFFF' ? '#000000' : props.color }]} percentage={5}>{props?.title || 'Untitled'}</ResponsiveText>
                            <ResponsiveText style={[styles.normalText, { fontFamily: props.font_family || 'Oswald-Regular', color: props.color == '#ffffff' || props.color == '#FFFFFF' ? '#000000' : props.color }]} percentage={3.5}>{`${props.first_line_text}\n${props.second_line_details.second_line_text}\n${props.third_line_details.third_line_text}`}</ResponsiveText>
                            <View style={styles.userImageContainer}>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 3, left: 0 }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.first_user?._id })}>
                                    <Image source={props?.first_user?.personalImage?.pI1 ? { uri: props?.first_user?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 2, left: -wp('2%') }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.second_user?._id })}>
                                    <Image source={props?.second_user?.personalImage?.pI1 ? { uri: props?.second_user?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 1, left: -wp('4%') }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.third_user?._id })}>
                                    <Image source={props?.third_user?.personalImage?.pI1 ? { uri: props?.third_user?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.iconContainer}>
                                <View style={{ flex: 1, flexDirection: "row", }}>
                                    <Fontisto name={like ? 'heart' : 'heart-alt'} size={getResponsiveSize({ percentage: 5 })} style={[styles.iconsStyle, { color: like ? 'red' : 'black' }]} onPress={addLikeUnlike} />
                                    <TouchableOpacity onPress={() => navigation.navigate("FeedLikeScreen", { post_id: props._id })}>
                                        <ResponsiveText style={{ color: 'black' }}>{props.is_liked === true && like === true ? props?.like_count : like === true && props.is_liked === false ? props?.like_count + 1 : props?.like_count} Likes</ResponsiveText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("FeedCommentScreen", { post_id: props._id })}>
                                        <Fontisto name='comment' size={getResponsiveSize({ percentage: 5 })} style={[styles.iconsStyle, { marginHorizontal: 15 }]} />
                                        <ResponsiveText style={{ color: 'black' }}>{props?.comment_count} Comment</ResponsiveText>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ flex: 1, flexDirection: "row-reverse", }} onPress={createScreenShot}>
                                    <Fontisto name='share-a' size={getResponsiveSize({ percentage: 5 })} style={styles.iconsStyle} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ViewShot>
                    :
                    <ViewShot ref={screenShotRef}>
                        <View style={styles.cards}>
                            <ResponsiveText style={[styles.titleText, { fontFamily: props.font_family }]} percentage={5}>{props?.title || 'Untitled'}</ResponsiveText>
                            <ResponsiveText style={[styles.normalText, { fontFamily: props.font_family }]} percentage={3.5}>{`${props.first_line_text}\n${props.second_line_details.second_line_text}\n${props.third_line_details.third_line_text}`}</ResponsiveText>
                            <View style={styles.userImageContainer}>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 3, left: 0 }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.created_by?._id })}>
                                    <Image source={props?.created_by?.personalImage?.pI1 ? { uri: props?.created_by?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 2, left: -wp('2%') }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.second_line_details?.created_by?._id })}>
                                    <Image source={props?.second_line_details?.created_by?.personalImage?.pI1 ? { uri: props?.second_line_details?.created_by?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.imageTouchStyle, { zIndex: 1, left: -wp('4%') }]} onPress={() => navigation.push("FriendProfileScreen", { _id: props?.third_line_details?.created_by?._id })}>
                                    <Image source={props?.third_line_details?.created_by?.personalImage?.pI1 ? { uri: props?.third_line_details?.created_by?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.iconContainer}>
                                <View style={{ flex: 1, flexDirection: "row", }}>
                                    <Fontisto name={like ? 'heart' : 'heart-alt'} size={getResponsiveSize({ percentage: 5 })} style={[styles.iconsStyle, { color: like ? 'red' : 'black' }]} onPress={addLikeUnlike} />
                                    <TouchableOpacity onPress={() => navigation.navigate("FeedLikeScreen", { post_id: props._id })}>
                                        <ResponsiveText style={{ color: 'black' }}>{like ? props?.likeCount + 1 : props?.likeCount} Likes</ResponsiveText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("FeedCommentScreen", { post_id: props._id })}>
                                        <Fontisto name='comment' size={getResponsiveSize({ percentage: 5 })} style={[styles.iconsStyle, { marginHorizontal: 15 }]} />
                                        <ResponsiveText style={{ color: 'black' }}>{props?.comment?.length} Comment</ResponsiveText>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ flex: 1, flexDirection: "row-reverse", }} onPress={createScreenShot}>
                                    <Fontisto name='share-a' size={getResponsiveSize({ percentage: 5 })} style={styles.iconsStyle} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ViewShot>
            }
        </>
    );
}
const styles = StyleSheet.create({
    cards: {
        width: wp('95%'),
        backgroundColor: Color.white,
        alignSelf: "center",
        padding: 5,
        marginVertical: 7,
        borderRadius: 7,
        elevation: 1
    },
    userImageContainer: {
        flexDirection: "row",
        width: wp('95%') / 2.5,
        marginTop: 10,
    },
    iconContainer: {
        flexDirection: "row",
        marginTop: 10,
        width: wp('90%')
    },
    userProfile: {
        height: (wp('75%') / 2.2) / 2.8,
        width: (wp('75%') / 2.2) / 2.8,
        alignSelf: "center",
        overflow: 'hidden',
        borderRadius: 360,
        flex: 1
    },
    imageTouchStyle: {
        height: (wp('75%') / 2.2) / 3,
        width: (wp('75%') / 2.2) / 3,
        flex: 1,
        elevation: 1,
        borderRadius: 360,
    },
    titleText: {
        color: 'black',
        fontWeight: "500",
        marginLeft: 7,
    },
    normalText: {
        color: 'black',
        marginTop: 10,
        marginLeft: 7,

    },
    iconsStyle: {
        marginHorizontal: 5,
        color: "black"
    }
})
export default memo(FeedComponents);