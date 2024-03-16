import React, { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useSelector } from 'react-redux';

import { FlashList } from "@shopify/flash-list";

/* Import Default App Theme */
import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json'

import BannerAdsComponent from '../components/AdsComponents/BannerAds.Component';
import FeedComponent from '../components/Feed.Components';

import FeedService from '../services/Feed.Service';
import NotificationService from '../services/Notification.Service';

function FeedScreen() {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [feedData, setFeedData] = React.useState([]);
    const skip = React.useRef(0);

    const loading = React.useRef(false);

    let limit = 15;

    const get_post_data = React.useCallback(async () => {
        if(loading.current === true) return;
        loading.current = true;
        try {
            let { data } = await FeedService.get_feed_data(`?skip=${skip.current}&limit=${limit}`, token);
            if (data.data) {
                data.data = data.data.reduce((prev, item) => {
                    let temp = feedData.filter(i => i._id === item._id);
                    if (temp.length === 0) {
                        prev.push(item);
                    }
                    return prev;
                }, [])
                setFeedData([...feedData, ...data.data]);
                skip.current = skip.current + data.data.length;
                loading.current = false;
            }
        } catch (error) {
        }
    }, [skip.current])

    const NToken = useSelector(e => e.NOTIFICATION.NOTIFICATION.token);

    const updateNotificationToken = async () => {
        try {
            await NotificationService.saveNotificationToken(NToken, token);
        } catch (error) {
        }
    }

    React.useEffect(() => {
        get_post_data();

        setTimeout(() => {
            updateNotificationToken();
        }, 15 * 1000);
    }, []);


    return (
        <View style={Styles.appBackground}>
            <FlashList
                data={feedData}
                keyExtractor={feedData => feedData._id}
                renderItem={({ item, index }) => {
                    return (
                        <>
                            <FeedComponent new_feed={true} {...item} index={index} />
                            {
                                index % 4 === 0 ?
                                    <BannerAdsComponent index={index} />
                                    :
                                    <></>
                            }
                            {
                                feedData.length === index + 1 && feedData.length % limit == 0 ?
                                    <ActivityIndicator size={'large'} color={'#f84f38'} style={{ height: 80 }} />
                                    :
                                    <>
                                    </>
                            }
                        </>
                    )
                }}
                onEndReached={get_post_data}
                initialNumToRender={5}
                maxToRenderPerBatch={6}
                updateCellsBatchingPeriod={10}
                removeClippedSubviews={true}
                windowSize={10}
                onEndReachedThreshold={0.1}
                estimatedItemSize={500}
            />
        </View>
    );
}

export default memo(FeedScreen);