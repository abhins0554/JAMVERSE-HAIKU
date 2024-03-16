import React from 'react';

import { SafeAreaView, FlatList } from "react-native";

import { useSelector } from 'react-redux';

import UserProfileCardUserProfileComponent from '../Components/UserProfileComponent/UserProfileCard.UserProfileComponent';
import Header from '../Components/Header';
import { Color } from '../Constant/Color.Constant';
import { getGroupPostById } from '../Service/Profile.Service';
import CardFeedComponent from '../Components/FeedComponent/Card.FeedComponent';
import FeedComponent from '../../source2/components/Feed.Components';
import BottomNav from '../Components/BottomNav';

function UserProfileScreen({ navigation }) {
    const token = useSelector(e => e.AuthGlobalReducer.AuthGlobalData.token);

    const [UserFeedData, SetUserFeedData] = React.useState([]);
    const Limit = 15;

    const GetUserFeedData = React.useCallback(async () => {
        let result = await getGroupPostById({ skip: UserFeedData.length, limit: Limit, token, user_id: "" });
        if (result && result.length === 0) return true;
        const reduceData = [...UserFeedData, ...result].reduce((accumulator, item, index, initialArray) => {
            if (!accumulator.find(i => i?._id === item?._id)) {
                accumulator.push(item);
            }
            return accumulator;
        }, []);
        SetUserFeedData(reduceData);
    },[UserFeedData])

    React.useEffect(() => {
        GetUserFeedData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.backgroundColor }}>
            <Header navigation={navigation} />
            {
                UserFeedData && UserFeedData.length !== 0 ?
                    <FlatList
                        style={{flex: 1}}
                        data={UserFeedData}
                        keyExtractor={UserFeedData => UserFeedData._id}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    {
                                        index === 0 ?
                                            <UserProfileCardUserProfileComponent navigation={navigation} />
                                            :
                                            <>
                                            </>
                                    }
                                    <FeedComponent {...item} navigation={navigation} />
                                </>
                            )
                        }}
                        onEndReached={GetUserFeedData}
                        initialNumToRender={5}
                        maxToRenderPerBatch={6}
                        updateCellsBatchingPeriod={10}
                        removeClippedSubviews={true}
                        windowSize={10}
                    />
                    :
                    <>
                    </>
            }
            {
                UserFeedData.length === 0 ?
                    <UserProfileCardUserProfileComponent navigation={navigation} />
                    :
                    <>
                    </>
            }
            <BottomNav navigation={navigation} type={"profile"} />
        </SafeAreaView>
    );
}

export default React.memo(UserProfileScreen);