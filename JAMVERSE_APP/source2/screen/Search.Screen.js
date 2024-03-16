import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import AntDesign from "react-native-vector-icons/AntDesign";

import { useSelector } from 'react-redux';


import Color from '../theme/color/defaultColor.json';
import Style from '../theme/styles/defaultStyle';

import Button from '../components/core/Button.Core';
import TextInput from '../components/core/TextInput.Core';
import Text from '../components/core/Text.Core';
import ProfileService from '../services/Profile.Service';

function Search({ navigation }) {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);
    const userData = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.data);


    const styles = StyleSheet.create({
        cards: {
            marginTop: 5,
            backgroundColor: Color.white,
            marginHorizontal: 10,
            borderRadius: 5,
            flexDirection: "row",
            overflow: "hidden",
        },
        imgpp: {
            width: 50,
            height: 50,
            borderRadius: 360,
        }
    })

    const [loading, setLoading] = useState(false);

    const _search = async () => {
        try {
            setLoading(true)
            let { data } = await ProfileService.searchUserProfile(`?search=${searchText}`, token);
            setSearchData(data.data);
            setLoading(false);
        } catch (error) {

        }
    };

    const _follow = async (_id) => {
        try {
            let { data } = await ProfileService.followUser({ following: _id }, token);
            _search();
        } catch (error) {
        }
    };

    const _unfollow = async (_id) => {
        try {
            let { data } = await ProfileService.unFollowUser({ following: _id }, token);
            _search();
        } catch (error) {
        }
    }

    const [searchText, setSearchText] = useState("");
    const updateSearchText = React.useCallback((e) => setSearchText(e), [searchText])

    const [searchData, setSearchData] = useState([]);


    return (
        <View style={Style.appBackground}>
            <View style={styles.cards}>
                <TextInput width='85%' placeholder='Search for person' value={searchText} onChangeText={updateSearchText} />
                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => _search()}>
                    <AntDesign name="search1" size={25} color={Color.textPrimary} />
                </TouchableOpacity>
            </View>
            {loading ? <ActivityIndicator color={Color.primary} size={'large'} /> : <FlatList
                data={searchData}
                keyExtractor={i => i._id.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.cards} onPress={() => userData?._id !== item._id ? navigation.push("FriendProfileScreen", { _id: item._id, postCount: item?.postCount ?? 0 }) : navigation.navigate('UserProfileScreen')}>
                            <Image source={{ uri: item?.personalImage?.pI1 ?? "https://picsum.photos/600" }} style={styles.imgpp} />
                            <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                <Text style={{ color: Color.textPrimary }} numberOfLines={1}>{item?.full_name}</Text>
                                <Text style={{ color: "darkgrey" }}>@{item?.user_name}</Text>
                            </View>
                            {
                                userData?._id !== item._id ?
                                    <Button width={80} borderWidth={0.7} borderRadius={7} onPress={() => item?.following ? _unfollow(item?._id) : _follow(item._id)} > {item?.following ? "Unfollow" : "Follow"} </Button>
                                    :
                                    <></>
                            }
                        </TouchableOpacity>
                    )
                }}
            />}

        </View>
    );
}

export default React.memo(Search);