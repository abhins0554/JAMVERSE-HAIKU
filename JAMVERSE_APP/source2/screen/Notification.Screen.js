import React, { useState, memo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import moment from 'moment';

import NotificationService from '../services/Notification.Service';

import Text from '../components/core/Text.Core';

import Style from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json';

function NotificationScreen({ navigation }) {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [data, setData] = useState([])

    const getData = async () => {
        try {
            let { data } = await NotificationService.getNotification(token);
            setData(data.data);
        } catch (error) {
        }
    }

    React.useEffect(() => {
        getData();
    }, []);

    const NotificationCard = memo(({ item }) => {
        return (
            <TouchableOpacity style={styles.cards} onPress={() => navigation.navigate("SinglePostScreen", { post_id: item.post_id })}>
                <Image source={item?.hostData?.personalImage?.pI1 ? { uri: item?.hostData?.personalImage?.pI1 } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={styles.imgpp} />
                <View style={{ justifyContent: "center", marginHorizontal: 7, width: wp(82) }}>
                    <Text style={{ color: Color.textPrimary }} numberOfLines={2}>{item?.body}</Text>
                    <Text style={{ color: Color.textSecondary }}>{moment(item.createdAt).fromNow()}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <View style={Style.appBackground}>
            <FlatList
                data={data}
                keyExtractor={data => data._id.toString()}
                renderItem={(props) => <NotificationCard {...props} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    cards: {
        marginTop: 5,
        backgroundColor: Color.white,
        borderRadius: 5,
        flexDirection: "row",
        padding: wp(2),
        width: wp(95),
        alignSelf: 'center'
    },
    imgpp: {
        width: wp(10),
        height: wp(10),
        borderRadius: 360,
    }
})

export default memo(NotificationScreen);