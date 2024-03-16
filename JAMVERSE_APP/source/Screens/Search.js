import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, ScrollView, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import Button from '../Common/Button';

import commonStyle from "../Common/styles";
import BottomNav from '../Components/BottomNav';

import AntDesign from "react-native-vector-icons/AntDesign";
import { getSearchData, getSuggestionData } from '../Service/Search.Service';
import { useSelector } from 'react-redux';
import { follow, unfollow } from '../Service/FollowUnfollow.Service';
import { PlatFormData } from '../Constant/CustomPlatform';
import LoadingComponent from '../Components/LoadingComponent';
import { Color } from '../Constant/Color.Constant';

function Search({ navigation }) {

    const AuthGlobalDataToken = useSelector(e => e.AuthGlobalReducer.AuthGlobalData.token)
    const AuthGlobalData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));

    const styles = StyleSheet.create({
        cards: {
            marginTop: 5,
            backgroundColor: Color.cardsColor,
            marginHorizontal: 10,
            borderRadius: 10,
            elevation: 20,
            flexDirection: "row",
            padding: 10,
            shadowRadius: 10,
            overflow: "hidden",
            shadowColor: '#52006A',
        },
        imgpp: {
            width: 50,
            height: 50,
            borderRadius: 360,
        }
    })

    const [loading, set_loading] = useState(false);

    const _search = async () => {
        set_loading(true);
        let result = await getSearchData(searchText, AuthGlobalDataToken);
        setSearchData(result);
        set_loading(false);
    }

    const _follow = async (_id) => {
        let response = await follow(AuthGlobalDataToken, _id);
        console.log("_follow",response)
        _search();
    }

    const _unfollow = async (_id) => {
        let response = await unfollow(AuthGlobalDataToken, _id);
        console.log("_unfollow",response)
        _search();
    }

    const [searchText, setSearchText] = useState("");

    const [searchData, setSearchData] = useState([]);


    return (
        <SafeAreaView style={[commonStyle.mainframe, {backgroundColor: Color.backgroundColor}]}>
            <View style={styles.cards}>
                <TextInput placeholder='Search for person' style={{ flex: 1 }} value={searchText} onChangeText={(e)=> setSearchText(e)} />
                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => _search()}>
                    <AntDesign name="search1" size={25} color={PlatFormData.textPrimaryColor} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={searchData}
                keyExtractor={i => i._id.toString()}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity style={styles.cards} onPress={() => AuthGlobalData?._id !== item._id ? navigation.push("FriendProfileScreen", {_id: item._id, postCount: item?.postCount ?? 0}) : navigation.navigate('UserProfileScreen')}>
                            <Image source={{ uri: item?.personalImage?.pI1 ?? "https://picsum.photos/600" }} style={styles.imgpp} />
                            <View style={{ justifyContent: "center", marginHorizontal: 7, flex: 1 }}>
                                <Text style={{ color: PlatFormData.textPrimaryColor }} numberOfLines={1}>{item?.full_name}</Text>
                                <Text style={{ color: "darkgrey" }}>@{item?.user_name}</Text>
                            </View>
                            {
                                AuthGlobalData?._id !== item._id ?
                                    <Button text={item?.following ? "Unfollow": "Follow"} textColor={"#f84f38"} width={80} borderWidth={0.7} borderRadius={7} onPress={()=> item?.following ? _unfollow(item?._id) : _follow(item._id)} />
                                    :
                                    <></>
                            }
                        </TouchableOpacity>
                    )
                }}
            />
            <BottomNav navigation={navigation} type="search" />
            <LoadingComponent loading={loading} />
        </SafeAreaView>
    );
}

export default React.memo(Search);