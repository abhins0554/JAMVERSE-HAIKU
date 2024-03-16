import React, { memo } from 'react';
import { View } from 'react-native';

import { useSelector } from 'react-redux';

import Style from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json';

import FeedService from '../services/Feed.Service';
import FeedComponents from '../components/Feed.Components';

function SinglePostScreen({ route }) {
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [feedData, setFeedData] = React.useState({});

    const getFeedData = async () => {
        try {
            let { data } = await FeedService.get_feed_by_id(`?post_id=${route.params.post_id}`, token);
            setFeedData(data.result[0]);
        } catch (error) {
        }
    }

    React.useEffect(() => {
        getFeedData();
    }, [route.params.post_id]);

    return (
        <View style={Style.appBackground}>
            {feedData._id ? <FeedComponents {...feedData} /> : <></> }
        </View>
    );
}

export default memo(SinglePostScreen);