import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, ImageBackground, Dimensions, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Appearance } from 'react-native';

import commonStyle from "../Common/styles";
import AntDesign from "react-native-vector-icons/AntDesign";

import Swiper from 'react-native-deck-swiper'
import { useSelector, useDispatch } from 'react-redux';
import BottomNav from '../Components/BottomNav';
import Header from '../Components/Header';
import { addPostToSkip, getSemiCompletedGroupPost, submitGroupPost } from '../Service/Post.Service';

// import TextFilter from 'bad-words';
import CreateGroupPostCard from '../Components/Post/CreateGroupPostCard';
import { PlatFormData } from '../Constant/CustomPlatform';
import { fontFamilyData } from '../Constant/FontData';

import NotificationServices from '../Service/Notification.Service';
import LoadingComponent from '../Components/LoadingComponent';
import JammingGlobalAction from '../Redux/Action/JammingGlobalAction';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Text from '../../source2/components/ResponsiveText';

const Card = React.memo(({ data, userData, navigation }) => {
    const [editing, setEditing] = useState(false);
    const [line, setLine] = useState();
    const [loading, set_loading] = useState(false);

    const onChangeText = (text) => {
        let words = text.split(" ");
        if (words.length > 8) return false;
        if (text.length > 50) return false;
        setLine(text);
    }

    const submitPost = async () => {
        if (!line || line?.length < 3) return false;
        set_loading(true);
        let _id = await submitGroupPost(userData.token, line, data?.second_line_details?.created_by?._id ? 3 : 2, data._id);
        if (_id == data._id) {
            navigation.push("JammingScreen");
        }
        set_loading(false);
    }

    return (
        <View style={[styles.cardMainframe,{backgroundColor : data?.color  === '#000000' && Appearance.getColorScheme() == 'dark' ? 'black': data?.color === '#ffffff' && Appearance.getColorScheme() === 'light' ? 'black': '#E6DFD4' }]}>
            <View style={{ justifyContent: "center", flex: 1 }}>
                <Text style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]}>{data?.title || ''}</Text>
                <Text style={{fontFamily: data?.font_family, color: data?.color, ...styles.centerCardText }}>{data?.first_line_text}</Text>
                {
                    data?.second_line_details?.created_by?._id ?
                        <Text style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]}>{data?.second_line_details?.second_line_text}</Text>
                        :
                        !data?.second_line_details?.created_by?._id ?
                            <>
                                {
                                    editing ?
                                        <TextInput style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]} value={line} onChangeText={onChangeText} placeholder='Write second line' onEndEditing={() => setEditing(false)} autoFocus={editing} placeholderTextColor={data?.color} />
                                        :
                                        <TouchableOpacity onPress={() => setEditing(true)}>
                                            <Text style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]}>{line ?? 'Write second line'}</Text>
                                        </TouchableOpacity>
                                }
                            </>
                            :
                            <>
                            </>
                }
                {
                    data?.second_line_details?.created_by?._id && data?.third_line_details?.created_by?._id ?
                        <Text style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]}>{data?.second_line_details?.second_line_text}</Text>
                        :
                        data?.second_line_details?.created_by?._id ?
                            <>
                                {
                                    editing ?
                                        <TextInput style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]} value={line} onChangeText={onChangeText} placeholder='Write third line' onEndEditing={() => setEditing(false)} autoFocus={editing} placeholderTextColor={data?.color} />
                                        :
                                        <TouchableOpacity onPress={() => setEditing(true)}>
                                            <Text style={[styles.centerCardText, { fontFamily: data?.font_family, color: data?.color }]}>{line ?? 'Write third line'}</Text>
                                        </TouchableOpacity>
                                }
                            </>
                            :
                            <>
                            </>
                }
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.leftImageComponent}>
                    <Image source={data?.created_by?.personalImage?.pI1 ? { uri: `${data?.created_by?.personalImage?.pI1}?date=${new Date()}` } : require("../Asset/user_318-159711.png")} style={styles.userProfileImage} />
                    {
                        data?.second_line_details?.created_by?._id ?
                            <Image source={data?.second_line_details?.created_by?.personalImage?.pI1 ? { uri: `${data?.second_line_details?.created_by?.personalImage?.pI1}?date=${new Date()}` } : require("../Asset/user_318-159711.png")} style={styles.userProfileImage} />
                            :
                            <>
                            </>
                    }
                </View>
                <TouchableOpacity style={styles.rightCheckCompleteEditing} onPress={() => submitPost()}>
                    <AntDesign name="checkcircle" size={30} color={"#f84f38"} />
                </TouchableOpacity>
            </View>
            <LoadingComponent loading={loading} />
        </View>
    )
});

function JammingScreen({ navigation }) {
    const userData = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);
    const dispatch = useDispatch();


    const [loading, set_loading] = useState(false);
    const [page, setPage] = useState(0);
    const [cards, setCards] = useState([]);
    const [post_id, set_post_id] = useState("");
    const [fontFamily, set_FontFamily] = useState("Robot");

    const get_data = async () => {
        set_loading(true);
        let response = await getSemiCompletedGroupPost(page, userData.token);
        if (response?._id) {
            set_post_id(response?._id)
            setCards([response]);
            setPage(page + 1);
        }
        set_loading(false);
    }

    const add_post_skip = async (post_id) => {
        await addPostToSkip(post_id, userData.token);
    }

    const nToken = useSelector(e => e.NotificationToken.notificationToken);

    const updateNotificationToken = async (token, user_id) => {
        await NotificationServices.updateNotificationTokenAPI(token, user_id);
    }

    useEffect(() => {
        get_data();
        // updateNotificationToken(nToken.token, userData.token);
    }, []);

    const handleSwipeLeft = async () => {
        await add_post_skip(post_id);
        await get_data();
    };

    const handleSwipeRight = () => {
        set_loading(true);
        let temp = {
            cardType: "create"
        }
        setCards([temp]);
        set_loading(false);
    };

    return (
        <SafeAreaView style={commonStyle.mainframe}>
            <Header navigation={navigation} />
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'} style={{flex: 1}}>
                    <Swiper
                        cards={cards}
                        containerStyle={styles.cardContainerStyles}
                        cardStyle={styles.cardStyles}
                        renderCard={(card, index) => {
                            return (
                                <>
                                    {
                                        cards.length !== 0 ?
                                            <>
                                                {card?.cardType === "create" ? (
                                                    <CreateGroupPostCard
                                                        navigation={navigation}
                                                        userData={userData}
                                                        fontFamily={fontFamily}
                                                    />
                                                ) : (
                                                    <Card
                                                        userData={userData}
                                                        data={card}
                                                        navigation={navigation}
                                                    />
                                                )}
                                            </>
                                            :
                                            <>
                                                <CreateGroupPostCard
                                                    navigation={navigation}
                                                    userData={userData}
                                                    fontFamily={fontFamily}
                                                />
                                            </>
                                    }
                                </>
                            );
                        }}
                        onSwipedRight={() => handleSwipeRight()}
                        horizontalSwipe={true}
                        verticalSwipe={false}
                        onSwipedLeft={() => handleSwipeLeft()}
                        stackSize={1}
                        infinite={true}
                    />
                    {cards.length != 0 && cards[0]?.cardType ? (
                        <FlatList
                            style={{ top: wp('130%') }}
                            data={fontFamilyData}
                            horizontal={true}
                            keyExtractor={fontFamilyData => fontFamilyData.name.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        style={{ padding: 5, margin: 10, marginTop: 25 }}
                                        onPress={() => dispatch(JammingGlobalAction({ font_family: item.fontFamily }))}>
                                        <Text
                                            style={{
                                                fontFamily: item.fontFamily,
                                                color: PlatFormData.textPrimaryColor,
                                            }}>
                                            ABC
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </KeyboardAvoidingView>
            </View>
            <BottomNav navigation={navigation} type={'jamming'} />
            <LoadingComponent loading={loading} />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    centerCardText: {
        justifyContent: "center",
        textAlign: "left",
        alignItems: "center",
        fontSize: 25,
        paddingLeft: 10
    },
    rightCheckCompleteEditing: {
        alignItems: "flex-end",
        padding: 11,
        flex: 1
    },
    leftImageComponent: {
        flexDirection: "row",
        width: wp('80%'),
        paddingHorizontal: 10
    },
    userProfileImage: {
        height: wp('80%') / 2 / 2.5,
        width: wp('80%') / 2 / 2.5,
        alignSelf: "center",
        overflow: 'hidden',
        borderRadius: 360,
    },
    cardContainerStyles: {
        backgroundColor: PlatFormData?.colorMode === "dark" ? "#1a1a1a" : "#f5f7f9",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        flex: 1,
    },
    cardStyles: {
        backgroundColor: PlatFormData?.colorMode === "dark" ? "#1a1a1a" : "#f5f7f9",
        justifyContent: "center",
        zIndex: 10,
        padding: 1,
        borderRadius: 7
    },
    cardMainframe: {
        width: Dimensions.get('window').width - 0,
        height: Dimensions.get('window').width - 0,
        top: "-6.8%",
        alignSelf: "center",
        backgroundColor: '#E6DFD4',
    }
})

export default JammingScreen;