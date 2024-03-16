import React, { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { FlashList } from "@shopify/flash-list";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

import Color from '../theme/color/defaultColor.json';
import Styles from '../theme/styles/defaultStyle';

import TextInput from '../components/core/TextInput.Core';
import Text from '../components/core/Text.Core';
import ButtonCore from '../components/core/Button.Core';
import FeedComponents from '../components/Feed.Components';

import FeedService from '../services/Feed.Service';
import ProfileService from '../services/Profile.Service';

function FriendProfileScreen({ route }) {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [userData, setUserData] = React.useState({});

    const UserProfileHeader = React.memo(() => {

        const _follow = async (_id) => {
            try {
                let { data } = await ProfileService.followUser({ following: userData._id }, token);
                get_profile_data();
            } catch (error) {
            }
        };

        const _unfollow = async (_id) => {
            try {
                let { data } = await ProfileService.unFollowUser({ following: userData._id }, token);
                get_profile_data();
            } catch (error) {
            }
        }

        return (
            <View style={styles.profileCard}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.userFollowFollowingImage}>
                        <Image source={userData?.personalImage?.pI1 ? { uri: userData?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={styles.userProfileImage} />
                    </View>
                    <View style={styles.userFollowFollowingImage}>
                        <Text style={styles.profileCardText}>{userData?.post_count?.length ? userData?.post_count[0]?.number : 0 || 0}</Text>
                        <Text style={styles.profileCardText}>POST</Text>
                    </View>
                    <View style={styles.userFollowFollowingImage}>
                        <Text style={styles.profileCardText}>{userData.followers || 0}</Text>
                        <Text style={styles.profileCardText}>Follower</Text>
                    </View>
                    <View style={styles.userFollowFollowingImage}>
                        <Text style={styles.profileCardText}>{userData.following || 0}</Text>
                        <Text style={styles.profileCardText}>Following</Text>
                    </View>
                </View>
                <Text style={styles.userFullNameText}>{userData?.full_name}</Text>
                <Text style={styles.userNameText}>@{userData?.user_name}</Text>
                <Text style={styles.userFullNameText}>{userData?.about}</Text>
                <ButtonCore onPress={userData?.followers_list ? _unfollow : _follow}>{userData?.followers_list ? 'Unfollow' : 'Follow'}</ButtonCore>
            </View>
        )
    })

    const [feedData, setFeedData] = React.useState([]);

    const get_user_feed_data = React.useCallback(async () => {
        try {
            let { data } = await FeedService.get_friend_feed(`?user_id=${route.params._id}`, token);
            setFeedData(data.data);
        } catch (error) {
        }
    }, [route.params._id])

    const get_profile_data = React.useCallback(async () => {
        try {
            let { data } = await ProfileService.getFriendPost(`?_id=${route.params._id}`, token);
            setUserData({ ...data?.data?.result[0], post_count: data.data.post_count });
        } catch (error) {

        }
    }, [route.params._id]);

    React.useEffect(() => {
        get_user_feed_data();
        get_profile_data();
    }, [route.params._id]);

    return (
        <View style={Styles.appBackground}>
            <FlashList
                data={feedData}
                keyExtractor={feedData => feedData._id.toString()}
                ListHeaderComponent={() => <UserProfileHeader />}
                renderItem={(props) => <FeedComponents new_feed={true} {...props.item} />}
                initialNumToRender={5}
                maxToRenderPerBatch={6}
                updateCellsBatchingPeriod={10}
                removeClippedSubviews={true}
                windowSize={10}
                estimatedItemSize={500}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        width: wp(90),
        alignSelf: 'center',
        backgroundColor: Color.white,
        marginTop: 10,
        padding: 10
    },
    userFollowFollowingImage: {
        width: (wp(90) / 4) - 5,
        alignSelf: 'center',
        flexDirection: 'column'
    },
    userProfileImage: {
        width: (wp(90) / 4) - 5,
        height: (wp(90) / 4) - 5,
        borderRadius: 360
    },
    profileCardText: {
        fontSize: 16,
        textAlign: 'center',
        color: Color.textPrimary
    },
    userFullNameText: {
        fontSize: 18,
        color: Color.textPrimary
    },
    userNameText: {
        fontSize: 16,
        color: Color.textSecondary
    }
})

export default memo(FriendProfileScreen);