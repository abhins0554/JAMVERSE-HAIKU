import React, { memo } from 'react';
import { FlatList, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Text from '../components/core/Text.Core';

import FeedService from '../services/Feed.Service';

import Color from '../theme/color/defaultColor.json';
import Styles from '../theme/styles/defaultStyle';
import { useNavigation } from '@react-navigation/native';



function FeedLikeScreen({ route }) {
    const navigation = useNavigation();
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);
    const user_id = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.data._id);

    const [likesData, setLikesData] = React.useState([]);

    const getPostLikeData = React.useCallback(async () => {
        try {
            let { data } = await FeedService.get_feed_likes(`?_id=${route.params.post_id}`, token);
            setLikesData(data.data.likes);
        } catch (error) {
        }
    }, [route.params.post_id]);

    React.useEffect(() => {
        getPostLikeData();
    }, [route.params.post_id]);


    const UserCard = React.memo(({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.cards}
                onPress={() => user_id !== item._id ? (navigation.push("FriendProfileScreen", { _id: item._id, })) : (navigation.push('UserProfileScreen'))}
            >
                <Image style={{ height: wp(15), width: wp(15) }} source={item?.personalImage?.pI1 ? { uri: item?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.likeModalName}>{item.full_name}</Text>
                    <Text style={styles.likeModalName}>@{item.user_name}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <View style={Styles.appBackground}>
            <FlatList
                data={likesData}
                keyExtractor={likesData => likesData._id.toString()}
                renderItem={(props) => <UserCard {...props} />}
                initialNumToRender={5}
                maxToRenderPerBatch={6}
                updateCellsBatchingPeriod={10}
                removeClippedSubviews={true}
                windowSize={10}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    cards: {
        backgroundColor: Color.white,
        width: wp(90),
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: "row",
        padding: 2,
        overflow: 'hidden'
    },
    likeModalName: {
        color: Color.textPrimary
    },
    detailsContainer: {
        flex: 1,
        marginHorizontal: 5
    }
});

export default memo(FeedLikeScreen);