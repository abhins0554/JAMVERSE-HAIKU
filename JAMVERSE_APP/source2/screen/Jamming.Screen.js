import React, { memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, FlatList } from 'react-native';

import Swiper from 'react-native-deck-swiper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import ColorPicker from 'react-native-wheel-color-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';

import Button from '../components/core/Button.Core';
import ResponsiveText, { getResponsiveSize } from '../components/ResponsiveText';

import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json';

import Constant from '../constant/Constant';

import FeedService from '../services/Feed.Service';


const CollabScreen = React.memo(() => {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [iCFeedData, setICFeedData] = React.useState([]);

    const deckSwiperRef = React.useRef();


    const ExitingDataCard = React.memo((props) => {
        if (Object.keys(props).length === 0) return <ActivityIndicator />

        const [inputText, setInputText] = React.useState('');
        const [loading, set_loading] = React.useState(false);

        const _submitForExistingData = async () => {
            let line = 2
            if (!props?.third_line_details?.third_line_text && props?.second_line_details?.second_line_text) line = 3;

            if (inputText.length == 0) return Toast.show({
                type: 'error',
                text1: 'Line is required',
                text2: "Please type something before submit",
            })
            if (inputText.length < 4) return Toast.show({
                type: 'error',
                text1: 'Line is required',
                text2: "Please type something before submit",
            })
            set_loading(true);
            try {
                let { data } = await FeedService.submit_for_collab_feed({
                    line: line,
                    text: inputText,
                    post_id: props._id
                }, token);
                setICFeedData([]);
                get_incomplete_feed_data();
                setTimeout(() => {
                    set_loading(false);
                }, 1000 * 1.5);
                return Toast.show({
                    type: 'success',
                    text1: 'Submit',
                    text2: 'Success',
                })
            } catch (error) {
                setTimeout(() => {
                    set_loading(false);
                }, 1000 * 1.5);
                return Toast.show({
                    type: 'error',
                    text1: 'Some error occurred',
                    text2: error?.response?.data?.message || error?.message || 'Error while submit try again',
                })
            }
        }

        return (
            <View style={styles.cards}>
                <ResponsiveText style={[styles.titleText, { fontFamily: props?.font_family }]} percentage={5}>{props?.title || 'Untitled'}</ResponsiveText>
                <ResponsiveText style={[styles.normalText, { fontFamily: props?.font_family }]} percentage={3.5}>{`${props?.first_line_text}`}</ResponsiveText>
                {props?.second_line_details?.second_line_text ? <ResponsiveText style={[styles.normalText, { fontFamily: props?.font_family }]} percentage={3.5}>{`${props?.second_line_details?.second_line_text}`}</ResponsiveText> :
                    <>
                        <TextInput keyboardType='default' style={{ fontFamily: 'Oswald-Regular', color: props.color, marginVertical: 5, }} autoFocus={true} placeholder='Enter second line' value={inputText} onChangeText={e => setInputText(e)} />
                    </>}
                {props?.third_line_details?.third_line_text ? <ResponsiveText style={[styles.normalText, { fontFamily: props?.font_family }]} percentage={3.5}>{`${props?.third_line_details?.third_line_text}`}</ResponsiveText> :
                    <>
                        {props?.second_line_details?.second_line_text ? <TextInput keyboardType='default' style={{ fontFamily: 'Oswald-Regular', color: props.color, marginVertical: 5, }} autoFocus={true} placeholder='Enter third line' value={inputText} onChangeText={e => setInputText(e)} /> : <></>}

                    </>}
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.userImageContainer}>
                        <View style={[styles.imageTouchStyle, { zIndex: 3, left: 0 }]}>
                            <Image source={props?.first_user[0]?.personalImage?.pI1 ? { uri: props?.first_user[0]?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                        </View>
                        {props?.second_line_details?.second_line_text ? <View style={[styles.imageTouchStyle, { zIndex: 2, left: -wp('2%') }]}>
                            <Image source={props?.second_user[0]?.personalImage?.pI1 ? { uri: props?.second_user[0]?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                        </View> : <></>}
                        {props?.third_line_details?.third_line_text ? <View style={[styles.imageTouchStyle, { zIndex: 1, left: -wp('4%') }]}>
                            <Image source={props?.third_line_details?.created_by?.personalImage?.pI1 ? { uri: props?.third_line_details?.created_by?.personalImage?.pI1 } : { uri: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }} style={styles.userProfile} />
                        </View> : <></>}
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1 }} />
                        {loading ?
                            <ActivityIndicator color={Color.primary} size={'large'} />
                            :
                            <TouchableOpacity style={styles.submitIcon} onPress={_submitForExistingData}>
                                <AntDesign name='checkcircle' color={Color.primary} size={25} style={[styles.submitIcon, { marginRight: 10 }]} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        )
    })

    const CreateNewJamScreen = React.memo(() => {
        const [title, setTitle] = useState('');
        const [firstLine, setFirstLine] = useState('');
        const [color, setColor] = useState('#000000');
        const [loading, set_loading] = useState(false);

        const _submitForCreateNewPost = async () => {
            if (title.length == 0) return Toast.show({
                type: 'error',
                text1: 'Title is required',
                text2: "Please type something before submit",
            })
            if (title.split(' ').length > 3) return Toast.show({
                type: 'error',
                text1: 'Keep title small',
                text2: "make it small and amazing",
            })
            if (firstLine.length == 0) return Toast.show({
                type: 'error',
                text1: 'Line is required',
                text2: "Please type something before submit",
            })
            if (firstLine.length < 4) return Toast.show({
                type: 'error',
                text1: 'Line is required',
                text2: "Please type something before submit",
            })
            set_loading(true);
            try {
                let { data } = await FeedService.submit_for_new_feed({ line: 1, text: firstLine, font_family: 'font_family', color: color, bg_info: 'bg_info', title: title }, token);
                setICFeedData([]);
                get_incomplete_feed_data();
                setTimeout(() => {
                    set_loading(false);
                }, 1000 * 1.5);
                return Toast.show({
                    type: 'success',
                    text1: 'Submit',
                    text2: 'Success',
                })
            } catch (error) {
                setTimeout(() => {
                    set_loading(false);
                }, 1000 * 1.5);
                return Toast.show({
                    type: 'error',
                    text1: 'Some error occurred',
                    text2: error?.response?.data?.message || error?.message || 'Error while submit try again',
                })
            }
        }

        return (
            <View style={styles.cards}>
                <TextInput keyboardType='default' style={{ fontFamily: 'Oswald-Regular', color: color, marginVertical: 5, }} placeholderTextColor={color} autoFocus={true} placeholder='Enter Title' value={title} onChangeText={e => setTitle(e)} />
                <TextInput keyboardType='default' style={{ fontFamily: 'Oswald-Regular', color: color, marginVertical: 5, marginBottom: 15 }} placeholderTextColor={color} placeholder='Enter First line' value={firstLine} onChangeText={e => setFirstLine(e)} />
                <ColorPicker
                    swatchesOnly={true}
                    thumbSize={'60'}
                    color={color}
                    onColorChange={e => setColor(e)}
                />
                {/* Submit Button to Submit the post */}
                <View style={{ flexDirection: "row", flex: 1, marginTop: 25 }}>
                    <View style={{ flex: 1 }} />
                    {loading ?
                        <ActivityIndicator color={Color.primary} size={'large'} />
                        :
                        <TouchableOpacity style={styles.submitIcon} onPress={_submitForCreateNewPost}>
                            <AntDesign name='checkcircle' color={Color.primary} size={25} style={[styles.submitIcon, { marginRight: 10 }]} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    })




    const get_incomplete_feed_data = async () => {
        try {
            let { data } = await FeedService.get_incomplete_post_feed('?skip=0&limit=50', token);
            setICFeedData(data.data);
            if(data.data.length === 0) {
                setICFeedData([{ type: 'create' }]);
            }
        } catch (error) {
        }
    }

    React.useEffect(() => {
        get_incomplete_feed_data();
    }, []);

    const onSkip = async (e) => {
        try {
            if (iCFeedData[e]?.type !== 'create') await FeedService.skip_incomplete_post_feed(`?_id=${iCFeedData[e]?._id}`, token);
            else {
                setICFeedData([]);
                get_incomplete_feed_data();
            }
        } catch (error) {
        }
    }

    const onCreate = () => {
        setICFeedData([]);
        setTimeout(() => {
            setICFeedData([{ type: 'create' }]);
        }, 1000);
    }

    return (
        <>
            {
                iCFeedData.length === 0 ?
                    <ActivityIndicator color={Color.primary} size={'large'} />
                    :
                    <Swiper
                        ref={deckSwiperRef}
                        cards={iCFeedData}
                        showSecondCard={false}
                        disableBottomSwipe={true}
                        disableTopSwipe={true}
                        onSwipedLeft={onSkip}
                        onSwipedRight={onCreate}
                        overlayLabels={{
                            left: {
                                title: 'Skip',
                                style: {
                                    label: {
                                        backgroundColor: 'black',
                                        borderColor: 'black',
                                        color: 'white',
                                        borderWidth: 1
                                    },
                                    wrapper: {
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-start',
                                        marginTop: 30,
                                        marginLeft: -30
                                    }
                                }
                            },
                            right: {
                                title: 'Create',
                                style: {
                                    label: {
                                        backgroundColor: 'black',
                                        borderColor: 'black',
                                        color: 'white',
                                        borderWidth: 1
                                    },
                                    wrapper: {
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        marginTop: 30,
                                        marginLeft: 30
                                    }
                                }
                            },
                        }}
                        renderCard={(props) => props.type === 'create' ? <CreateNewJamScreen /> : <ExitingDataCard {...props} />}
                    />
            }
        </>

    )
})



function JammingScreen() {
    return (
        <View style={Styles.appBackground}>
            <CollabScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    cards: {
        width: wp('100%'),
        backgroundColor: Color.white,
        alignSelf: "center",
        padding: 5,
        marginVertical: 7,
        borderRadius: 7,
        elevation: 1,
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
    },
    submitIcon: {
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        alignItems: "center",
    }
})

export default memo(JammingScreen);