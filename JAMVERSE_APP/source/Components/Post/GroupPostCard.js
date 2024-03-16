import React, {useState} from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import { PlatFormData } from '../../Constant/CustomPlatform';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { likeUnlikePost, postLikeinGroupById } from '../../Service/Post.Service';
import { useSelector } from 'react-redux';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import LoadingComponent from '../LoadingComponent';
import CommonStyle from "../../Common/styles";

function GroupPostCard({ item, navigation }) {
    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);
    const AuthData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));
    const [likeCount, setLikeCount] = useState(item?.likeCount ?? 0);
    const [like, setLike] = useState(item?.likes ?? false);
    
    const _like_unlikePost = async () => {
        let rep = await likeUnlikePost(reduxData, like, item._id, "group");
        if (rep) {
            setLikeCount(like ? likeCount - 1 : likeCount + 1);
            setLike(!like);
        }
    }

    const screenShotRef = React.useRef();

    const createScreenShot = React.useCallback(() => {
        screenShotRef.current.capture().then(uri => {
            Share.open({ url: uri, title: `A Jam by Jam verse`, })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
        })
    }, []);

    const [likesModal, setLikesModal] = React.useState(false);
    const [loading, set_loading] = React.useState(false);
    const [likesData, setLikesData] = React.useState([]);
    const openLikesViewer = () => {
        setLikesModal(!likesModal);
    }

    const loadLikesData = async () => {
        set_loading(true);
        let postLikeData = await postLikeinGroupById(item._id, reduxData.token);
        if(postLikeData?._id) setLikesData(postLikeData?.likes)
        set_loading(false);
    }

    React.useEffect(() => {
        if(likesModal) loadLikesData();
    }, [likesModal]);

    return (
        <>
            <ViewShot ref={screenShotRef} style={{ backgroundColor: PlatFormData.colorMode === "dark" ? "#000000" : "#FFFFFF", padding: 1 }}>
                <ImageBackground source={{ uri: item?.mediaLink }} style={styles.mainFrame}>
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text style={[styles.centerCardText, { fontFamily: item?.font_family, color: item.color }]}>{item.first_line_text}</Text>

                        <Text style={[styles.centerCardText, { fontFamily: item?.font_family, color: item.color }]}>{item?.second_line_details?.second_line_text}</Text>


                        <Text style={[styles.centerCardText, { fontFamily: item?.font_family, color: item.color }]}>{item?.third_line_details?.third_line_text}</Text>

                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.leftImageComponent}>
                            <TouchableOpacity style={styles.profileImageSeperator} onPress={() => navigation.push("FriendProfileScreen", { _id: item?.created_by?._id, postCount: null })}>
                                <Image source={item?.created_by?.personalImage?.pI1 ? { uri: `${item?.created_by?.personalImage?.pI1}?date=${new Date()}` } : require("../../Asset/user_318-159711.png")} style={styles.userProfileImage} />
                                <Text>{(item?.created_by?.full_name ?? "").slice(0, 10)}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.profileImageSeperator} onPress={() => navigation.push("FriendProfileScreen", { _id: item?.second_line_details?.created_by?._id, postCount: null })}>
                                <Image source={item?.second_line_details?.created_by?.personalImage?.pI1 ? { uri: `${item?.second_line_details?.created_by.personalImage.pI1}?date=${new Date()}` } : require("../../Asset/user_318-159711.png")} style={styles.userProfileImage} />
                                <Text>{(item?.second_line_details?.created_by?.full_name).slice(0, 10)}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.profileImageSeperator} onPress={() => navigation.push("FriendProfileScreen", { _id: item?.third_line_details?.created_by?._id, postCount: null })}>
                                <Image source={item?.third_line_details?.created_by?.personalImage?.pI1 ? { uri: `${item?.third_line_details?.created_by?.personalImage?.pI1}?date=${new Date()}` } : require("../../Asset/user_318-159711.png")} style={styles.userProfileImage} />
                                <Text>{(item?.third_line_details?.created_by?.full_name).slice(0, 10)}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ backgroundColor: PlatFormData.colorMode === "dark" ? "#000000" : "#ffffff" }}>
                        <View style={{ flexDirection: "row", marginVertical: 10, width: Dimensions.get('window').width - 35, alignSelf: "center", }}>
                            <AntDesign name={like ? "heart" : "hearto"} size={25} style={[styles.ico, { color: like ? "#f84f38" : PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000" }]} onPress={() => _like_unlikePost()} />
                            <TouchableOpacity onPress={() => openLikesViewer()}>
                                <Text style={[styles.ico, { alignSelf: "center", marginLeft: 10 }]}>{likeCount ?? 0}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }} />
                            <FontAwesome name="bookmark-o" size={25} style={styles.ico} />
                            <FontAwesome name="share" size={25} style={styles.ico} onPress={() => createScreenShot()} />
                        </View>
                    </View>
                </ImageBackground>
            </ViewShot>
            <Modal
                animationType="slide"
                transparent={false}
                style={{flex: 1}}
                visible={likesModal}
                onRequestClose={() => openLikesViewer()}>
                <View style={[styles.modalMainFrame]}>
                    <View style={styles.modalHeader}>
                        <FontAwesome name="arrow-left" onPress={openLikesViewer} size={25} style={styles.ico} />
                        <Text style={styles.modalHeaderText}>Likes</Text>
                    </View>
                    <FlatList
                        data={likesData}
                        keyExtractor={likesData => likesData._id.toString()}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity 
                                    style={{zIndex: 10, padding: 1, borderRadius: 10, backgroundColor: PlatFormData.secondaryColor, flexDirection: "row", marginHorizontal: 20, marginVertical: 5 }}
                                    onPress={() => AuthData?._id !== item._id ? (navigation.push("FriendProfileScreen", {_id: item._id, postCount: item?.postCount ?? 0}),openLikesViewer())  : (navigation.navigate('UserProfileScreen'),openLikesViewer())}    
                                >
                                    <Image style={[styles.userProfileImage, {height: 50, width: 50}]} source={item?.personalImage?.pI1? {uri: item?.personalImage?.pI1} : require("../../Asset/user_318-159711.png")} />
                                    <View>
                                        <Text style={styles.likeModalName}>{item.full_name}</Text>
                                        <Text style={styles.likeModalName}>@{item.user_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                <LoadingComponent loading={loading} />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    mainFrame: {
        width: Dimensions.get('window').width - 20, 
        height: Dimensions.get('window').width - 20, 
        alignSelf: "center", marginVertical: 10,
        elevation: 10,
        borderRadius: 7,
        overflow: "hidden"
    },
    centerCardText: {
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        fontSize: 25
    },
    rightCheckCompleteEditing: {
        alignItems: "flex-end",
        padding: 11,
        flex: 1
    },
    leftImageComponent: {
        alignItems: "flex-end",
        padding: 11,
        flex: 1,
        flexDirection: "row",
    },
    userProfileImage: {
        height: 25,
        width: 25,
        borderRadius: 360,
        alignSelf: "center"
    },
    profileImageSeperator: {
        flexDirection: "column",
        margin: 2.1,
        padding: 5,
        backgroundColor: PlatFormData.secondaryColor,
        borderRadius: 7,
        width: (Dimensions.get('window').width/1.8)/3
    },
    ico: {
        color: PlatFormData.colorMode === "dark" ? "#ffffff" : "#000000",
        marginHorizontal: 5
    },
    modalMainFrame: {
        backgroundColor: PlatFormData.primaryColor,
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
        color: PlatFormData.colorMode == "dark" ? "white": "black",
        fontSize: 15,
        textAlign: "left",
        marginLeft: 10
    }
})

export default GroupPostCard;