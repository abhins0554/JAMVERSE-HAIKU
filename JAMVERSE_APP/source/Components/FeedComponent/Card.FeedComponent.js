import React from 'react';
import { Dimensions, View, StyleSheet, ImageBackground, Text, PixelRatio, TouchableOpacity } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';

import UserProfileCardFeedComponent from './UserProfileCard.FeedComponent';
import { Color } from '../../Constant/Color.Constant';
import { likeUnlikePost } from '../../Service/Post.Service';
import { PlatFormData } from '../../Constant/CustomPlatform';
import { useSelector } from 'react-redux';

function CardFeedComponent(props) {
    const { _id, mediaLink = "https://unsplash.com/photos/fIq0tET6llw/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjg5OTY0ODc1fA&force=true&w=640", font_family = "Robot", color = "#ffdc16", first_line_text, likes = false, created_by, second_line_details, third_line_details, likeCount = 0 } = props;

    const fontScale = PixelRatio.getFontScale();
    const getFontSize = size => size / fontScale;

    const [LikeCount, SetLikeCount] = React.useState(likeCount);
    const [Liked, SetLiked] = React.useState(likes);
    const [ShareFlag, SetShareFlag] = React.useState(false);

    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);

    const addLikeUnlike = async () => {
        let rep = await likeUnlikePost(reduxData, Liked, _id, "group");
        if (rep) {
            SetLikeCount(Liked ? LikeCount - 1 : LikeCount + 1);
            SetLiked(!Liked);
        }
    }

    const screenShotRef = React.useRef();

    const createScreenShot = React.useCallback(() => {
        SetShareFlag(true);
        setTimeout(() => {
            screenShotRef.current.capture().then(uri => {
                Share.open({ url: uri, title: `A Jam by Jam verse`, message: "Download the app now. https://play.google.com/store/apps/details?id=com.jamverse" })
                    .then((res) => {
                        SetShareFlag(false);
                        console.log(res);
                    })
                    .catch((err) => {
                        SetShareFlag(false);
                        console.log(err);
                    });
            })
        }, 1000);
    }, []);

    const styles = StyleSheet.create({
        cardFrame: {
            height: Dimensions.get('screen').width - 20 + 50,
            width: Dimensions.get('screen').width - 20,
            backgroundColor: Color.cardsColor,
            shadowRadius: 10,
            shadowColor: '#52006A',
            elevation: 20,
            margin: 10,
            alignSelf: "center",
            padding: 5,
            overflow: "hidden",
            borderRadius: 25,
        },
        imageBackground: {
            shadowRadius: 10,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            height: Dimensions.get('screen').width - 30,
            width: Dimensions.get('screen').width - 30,
            overflow: 'hidden',
            justifyContent: "center",
        },
        textLine: {
            textAlign: "center",
            fontSize: getFontSize(22),
            color: color,
            fontFamily: font_family,
            textShadowColor: 'rgba(0, 0, 0, 1)',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 20,
        },
        ico: {
            justifyContent: "center",
            textAlign: "center",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            margin: 10
        }
    })

    return (
        <View style={styles.cardFrame}>
            <ViewShot ref={screenShotRef}>
                <ImageBackground source={{ uri: mediaLink?.replace('force=true&w=640', `force=true&w=${Dimensions.get('screen').width - 50}`) }} style={styles.imageBackground}>
                    <Text style={styles.textLine}>{first_line_text}</Text>
                    <Text style={styles.textLine}>{second_line_details?.second_line_text}</Text>
                    <Text style={styles.textLine}>{third_line_details?.third_line_text}</Text>
                    <View style={{ position: "absolute", flexDirection: "row", top: "75%" }}>
                        <UserProfileCardFeedComponent image={created_by?.personalImage?.pI1} name={created_by?.full_name} _id={created_by?._id} userId={JSON.parse(reduxData?.data)._id} navigation={props.navigation} />
                        <UserProfileCardFeedComponent image={second_line_details?.created_by?.personalImage?.pI1} name={second_line_details?.created_by?.full_name} _id={second_line_details?.created_by?._id} userId={JSON.parse(reduxData?.data)._id} navigation={props.navigation} />
                        <UserProfileCardFeedComponent image={third_line_details?.created_by?.personalImage?.pI1} name={third_line_details?.created_by?.full_name} _id={third_line_details?.created_by?._id} userId={JSON.parse(reduxData?.data)._id} navigation={props.navigation} />
                    </View>
                </ImageBackground>
                {ShareFlag ?
                    <View style={{backgroundColor: PlatFormData.primaryColor}}>
                        <Text style={{textAlign: "center", fontSize: getFontSize(25), fontFamily: "Chewy-Regular", color: PlatFormData.textPrimaryColor}}>@JAM VERSE . IN</Text>
                    </View>
                    :
                    <></>
                }
            </ViewShot>
            <View style={{ flexDirection: "row" }}>
                <AntDesign name={Liked ? "heart" : "hearto"} size={getFontSize(30)} style={styles.ico} onPress={addLikeUnlike} />
                {
                    LikeCount ?
                        <TouchableOpacity style={{justifyContent: "center"}} onPress={() => props.navigation.navigate("FeedLikeScreen", {post_id: _id})}>
                            <Text style={[styles.ico, { alignSelf: "center", marginLeft: 10 }]}>{LikeCount ?? 0} Likes</Text>
                        </TouchableOpacity>
                        :
                        <>
                        </>
                }
                <EvilIcons name={"comment"} size={getFontSize(40)} style={styles.ico} onPress={() => props.navigation.navigate("FeedCommentScreen", {post_id: _id})} />
                <View style={{ flex: 1 }} />
                <FontAwesome name="bookmark-o" size={getFontSize(30)} style={styles.ico} />
                <FontAwesome name="share" size={getFontSize(30)} style={styles.ico} onPress={createScreenShot} />
            </View>
        </View>
    );

}
export default React.memo(CardFeedComponent);