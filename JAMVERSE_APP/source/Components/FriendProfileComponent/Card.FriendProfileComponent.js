import React from 'react';

import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from "react-native";

import Button from '../../Common/Button';
import { PlatFormData } from '../../Constant/CustomPlatform';
import { Color } from '../../Constant/Color.Constant';
import { useSelector } from 'react-redux';
import { userSearchSingle } from '../../Service/Search.Service';
import { follow, unfollow } from '../../Service/FollowUnfollow.Service';

function CardFriendProfileComponent({navigation, route}) {
    const AuthGlobalDataToken = useSelector(e => e.AuthGlobalReducer.AuthGlobalData.token)
    
    const [is_follow, set_is_follow] = React.useState(false);
    const [result, set_result] = React.useState({ result: [] })

    const getProfileData = async () => {
      let result = await userSearchSingle(route.params._id, AuthGlobalDataToken);
      set_result(result);
    }
  
    React.useEffect(() => {
      getProfileData();
    }, [])


    const unfollowUser = async () => {
      if(is_follow) {
        await unfollow(AuthGlobalDataToken, route?.params?._id)
        set_is_follow(!is_follow);
      }
      else {
        await follow(AuthGlobalDataToken, route?.params?._id)
        set_is_follow(!is_follow);
      }
    }
  
    React.useEffect(() => {
      set_is_follow(result?.result[0]?.followers_list ?? false);
    }, [result]);

    return (
        <View style={styles.cards}>
            <View style={Styles.container}>

                <TouchableOpacity>
                    <Image
                        source={result?.result[0]?.personalImage?.pI1 ? { uri: `${result?.result[0]?.personalImage?.pI1}?date=${new Date()}` } : require("../../Asset/user_318-159711.png")}
                        style={Styles.prfilePicture}
                    />
                </TouchableOpacity>

                <View style={Styles.container2}>
                    <View style={Styles.container3}>
                        <View>
                            <Text style={Styles.numberContainer}>{0}</Text>
                            <Text style={Styles.text}>Posts</Text>
                        </View>
                    </View>
                    <View style={Styles.container3}>
                        <View>
                            <Text style={Styles.numberContainer}>{result?.result[0]?.followers ?? '0'}</Text>
                            <Text style={Styles.text}>Followers</Text>
                        </View>
                    </View>
                    <View style={Styles.container3}>
                        <View>
                            <Text style={Styles.numberContainer}>{result?.result[0]?.following ?? '0'}</Text>
                            <Text style={Styles.text}>Following</Text>
                        </View>
                    </View>
                </View>
            </View>


            <View
                style={{
                    flexDirection: 'column',
                    marginStart: 10,
                    marginTop: 20,
                }}>
                <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
                    <Text style={{ color: PlatFormData.textPrimaryColor, fontWeight: 'bold' }}>{`${result?.result[0]?.full_name ?? ''}`}</Text>
                    <Text style={{ color: 'grey', fontWeight: '500' }}>{`@${result?.result[0]?.user_name ?? ''}`}</Text>
                </View>
                <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
                    <Text style={{ color: PlatFormData.textPrimaryColor, textAlign: "justify" }}>{result?.result[0]?.about ?? ''}</Text>
                </View>
            </View>
            <Button text={is_follow ? "Unfollow" : "Follow"} textColor="#FFFFFF" color="#f84f38" width={Dimensions.get('screen').width - 40} borderWidth={1} borderRadius={10} onPress={unfollowUser} />
        </View>
    );
}
const Styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    prfilePicture: {
        height: 80,
        width: 80,
        borderRadius: 100,
        marginLeft: 20,
        padding: 2
    },
    numberContainer: {
        color: "#f84f38",
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 15,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginEnd: 20,
    },
    text: {
        color: "#f84f38",
        //fontWeight: 'bold',
        alignSelf: 'center',
    },
    container3: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
    },
})
const styles = StyleSheet.create({
    cards: {
        marginTop: 5,
        backgroundColor: Color.cardsColor,
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 20,
        shadowRadius: 10,
        shadowColor: '#52006A',
        overflow: "hidden"
    }
})
export default React.memo(CardFriendProfileComponent);