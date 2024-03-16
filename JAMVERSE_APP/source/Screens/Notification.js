import React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, Dimensions, Image, Text, TouchableOpacity } from "react-native";
import BottomNav from '../Components/BottomNav';
import Header from '../Components/Header';

import commonStyle from "../Common/styles";
import { useSelector } from 'react-redux';
import NotificationService from '../Service/Notification.Service';
import { useState, memo } from 'react';
import { FlatList } from 'react-native';
import moment from 'moment';


function Notification({ navigation }) {

    const styles = StyleSheet.create({
        cards: {
            marginTop: 5,
            backgroundColor: "#FFFFFF",
            marginHorizontal: 10,
            borderRadius: 7,
            elevation: 1,
            flexDirection: "row",
            padding: 10,
        },
        imgpp: {
            width: 50,
            height: 50,
            borderRadius: 360,
        }
    })
    const reduxData = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);

    const [data, setData] = useState([])

    const getData = async () => {
        // /notification/get-notification
        // reduxData.token
        let result = await NotificationService.getNewNotification(reduxData.token);
        if (result?.data?.length !== 0) {
            setData(result.data);
        }

    }

    React.useEffect(() => {
        getData();
    }, []);

    const NotificationCard = memo(({ item }) => {
        return (
            <TouchableOpacity style={styles.cards} onPress={() => navigation.navigate("SinglePostPage", {post_id: item.post_id})}>
                <Image source={item?.hostData?.personalImage?.pI1 ? { uri: item?.hostData?.personalImage?.pI1 } : require("../Asset/user_318-159711.png")} style={styles.imgpp} />
                <View style={{ justifyContent: "center", marginHorizontal: 7 }}>
                    <Text style={{ color: "#000000", paddingHorizontal: 5 }} numberOfLines={2}>{item?.body}</Text>
                    <Text style={{ color: "darkgrey" }}>{moment(item.createdAt).fromNow()}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <SafeAreaView style={commonStyle.mainframe}>
            <Header navigation={navigation} icon={"notification"} />
            <FlatList
                data={data}
                keyExtractor={data => data._id.toString()}
                renderItem={({ item }) => <NotificationCard item={item} />}
            />
            <BottomNav navigation={navigation} type={"profile"} />
        </SafeAreaView>
    );
}

export default memo(Notification);