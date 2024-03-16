import React from 'react';
import { SafeAreaView, View } from 'react-native';

import commonStyle from "../Common/styles";

import Header from "../Components/Header";
import BottomNavBar from "../Components/BottomNav";
import { fetchGroupPostByID } from '../Service/Post.Service';
import { useSelector } from 'react-redux';
import CardFeedComponent from '../Components/FeedComponent/Card.FeedComponent';

function SinglePostPage({navigation, route}) {
    const {post_id } = route.params;
    const reduxToken = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);

    const [response, setResponse] = React.useState({});

    const get_post_data = async () => {
        let [response] = await fetchGroupPostByID(reduxToken.token, `?post_id=${post_id}`);
        if (response?._id) setResponse({...response});
    }

    React.useEffect(() => {
        get_post_data();
    }, []);

    return (
        <SafeAreaView style={commonStyle.mainframe}>
            <Header navigation={navigation} />
                <View style={{flex: 1}}>
                    {
                        response ?
                        <CardFeedComponent {...response} navigation={navigation}/>
                        :
                        <>
                        </>
                    }
                </View>
            <BottomNavBar navigation={navigation} type={"home"} />
        </SafeAreaView>
    );
}

export default SinglePostPage;