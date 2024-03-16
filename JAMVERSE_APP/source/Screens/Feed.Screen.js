import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';

import { useSelector } from 'react-redux';


import Header from '../Components/Header';
import FeedComponent from '../../source2/components/Feed.Components';
import { fetchGroupPost } from '../Service/Post.Service';
import BottomNav from '../Components/BottomNav';
import AdsBannerComponent from '../../source2/components/AdsComponents/BannerAds.Component';

function FeedScreen({ navigation }) {
    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);
    const [FeedData, SetFeedData] = React.useState([]);
    const Limit = 15;

    const loadData = React.useCallback(async () => {
        let data = await fetchGroupPost(reduxData, `?skip=${FeedData.length}&limit=${Limit}`);
        if (data.length === 0) return true;
        const reduceData = [...FeedData, ...data].reduce((accumulator, item, index, initialArray) => {
            if (!accumulator.find(i => i?._id === item?._id)) {
                accumulator.push(item);
            }
            return accumulator;
        }, []);
        SetFeedData(reduceData);
    }, [FeedData]);

    React.useEffect(() => {
        loadData()
    }, []);

    return (
        <SafeAreaView style={styles.mainFrame}>
            <Header/>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {
                    FeedData.length === 0 ?
                        <ActivityIndicator size={'large'} style={{ justifyContent: "center" }} color={'#f84f38'} />
                        :
                        <FlatList
                            data={FeedData}
                            extraData={FeedData}
                            keyExtractor={FeedData => FeedData._id}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        <FeedComponent {...item} index={index} reduxData={reduxData} navigation={navigation} />
                                        {
                                            index % 4 === 0 ?
                                                    <AdsBannerComponent index={index} />
                                                :
                                                <></>
                                        }
                                        {
                                            FeedData.length === index + 1 && FeedData.length % Limit == 0 ?
                                                <ActivityIndicator size={'large'} color={'#f84f38'} style={{height: 80}} />
                                                :
                                                <>
                                                </>
                                        }
                                    </>
                                )
                            }}
                            onEndReached={loadData}
                            initialNumToRender={5}
                            maxToRenderPerBatch={6}
                            updateCellsBatchingPeriod={10}
                            removeClippedSubviews={true}
                            windowSize={10}
                            onEndReachedThreshold={0.1}
                        />
                }
            </View>
            <BottomNav type={"home"} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainFrame: {
        flex: 1,
        backgroundColor: 'white'
    }
})
export default React.memo(FeedScreen);