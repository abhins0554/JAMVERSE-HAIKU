import React from 'react';

import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";

import { useSelector } from 'react-redux';

import Header from '../Components/Header';
import CardFriendProfileComponent from '../Components/FriendProfileComponent/Card.FriendProfileComponent.js';
import BottomNav from '../Components/BottomNav';

import { Color } from '../Constant/Color.Constant';
import { getGroupPostById } from '../Service/Profile.Service';
import CardFeedComponent from '../Components/FeedComponent/Card.FeedComponent';
import FeedComponent from '../../source2/components/Feed.Components.js';

function FriendProfileScreen({ navigation, route }) {
    const AuthGlobalDataToken = useSelector(e => e.AuthGlobalReducer.AuthGlobalData.token)

    const [group_post, set_group_post] = React.useState([]);
    const limit = 10;

    const getFeedData = React.useCallback(async () => {
        let result = await getGroupPostById({ skip: group_post.length, limit: limit, token: AuthGlobalDataToken, user_id: route?.params?._id });
        if (result && result.length === 0) return true;
        const reduceData = [...group_post, ...result].reduce((accumulator, item, index, initialArray) => {
            if (!accumulator.find(i => i?._id === item?._id)) {
                accumulator.push(item);
            }
            return accumulator;
        }, []);
        set_group_post(reduceData);
    }, [group_post]);


    React.useEffect(() => {
        getFeedData();
    }, [])

    return (
        <SafeAreaView style={styles.mainFrame}>
            <Header navigation={navigation} />
            <View style={{ flex: 1 }}>
                <FlatList
                    data={group_post}
                    style={{ flex: 1 }}
                    nestedScrollEnabled={true}
                    keyExtractor={group_post => group_post._id}
                    renderItem={({ item, index }) => {
                        return (
                            <>
                                {index === 0 ? <CardFriendProfileComponent navigation={navigation} route={route} /> : <></>}
                                <FeedComponent {...item} navigation={navigation} />
                            </>
                        )
                    }}
                    onEndReached={getFeedData}
                    initialNumToRender={5}
                    maxToRenderPerBatch={6}
                    updateCellsBatchingPeriod={10}
                    removeClippedSubviews={true}
                    windowSize={10}
                />
                {group_post && group_post.length === 0 ? <CardFriendProfileComponent navigation={navigation} route={route} /> : <></>}
            </View>
            <BottomNav navigation={navigation} type={"profile"} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainFrame: {
        flex: 1,
        backgroundColor: Color.backgroundColor,
    }
});

export default React.memo(FriendProfileScreen);