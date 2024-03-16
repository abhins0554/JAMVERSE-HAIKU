import React, { memo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

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

function UserProfileScreen({navigation}) {

    const userData = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.data);
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const UserProfileHeader = React.memo(() => {
        return (
            <View style={styles.profileCard}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.userFollowFollowingImage}>
                        <Image source={userData?.personalImage?.pI1 ? { uri: userData?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={styles.userProfileImage} />
                    </View>
                    <View style={styles.userFollowFollowingImage}>
                        <Text style={styles.profileCardText}>{userData?.postCount[0]?.number || 0}</Text>
                        <Text style={styles.profileCardText}>POST</Text>
                    </View>
                    <TouchableOpacity style={styles.userFollowFollowingImage} onPress={() => navigation.navigate('FollowerFollowingScreen', {_id: userData._id})} >
                        <Text style={styles.profileCardText}>{userData.followers || 0}</Text>
                        <Text style={styles.profileCardText}>Follower</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userFollowFollowingImage} onPress={() => navigation.navigate('FollowerFollowingScreen', {_id: userData._id})} >
                        <Text style={styles.profileCardText}>{userData.following || 0}</Text>
                        <Text style={styles.profileCardText}>Following</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.userFullNameText}>{userData?.full_name}</Text>
                <Text style={styles.userNameText}>@{userData?.user_name}</Text>
                <Text style={styles.userFullNameText}>{userData?.about}</Text>
                <ButtonCore onPress={() => navigation.navigate('EditProfileScreen')}>Edit Profile</ButtonCore>
            </View>
        )
    })

    const [feedData, setFeedData] = React.useState([]);

    const get_user_feed_data = React.useCallback(async () => {
        try {
            let { data } = await FeedService.get_user_feed(token);
            setFeedData(data.data);
        } catch (error) {
        }
    }, [])

    React.useEffect(() => {
        get_user_feed_data();
    }, []);

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

export default memo(UserProfileScreen);