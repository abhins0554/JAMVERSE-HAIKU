import React from 'react';

import { TouchableOpacity, StyleSheet, Dimensions, Text, Image } from "react-native";
import { Color } from '../../Constant/Color.Constant';

function UserProfileCardFeedComponent({ name = "", image = "", _id, userId, navigation }) {
    return (
        <TouchableOpacity style={styles.cardFrame}
            onPress={() => userId !== _id ? (navigation.push("FriendProfileScreen", { _id: _id, postCount: 0 })) : (navigation.push('UserProfileScreen'))}
        >
            <Image source={image ? {uri: image} : require("../../Asset/user_318-159711.png")} style={styles.userImageProfile} />
            <Text numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardFrame: {
        height: Dimensions.get('screen').width * 0.5 / 3,
        width: Dimensions.get('screen').width * 0.5 / 3,
        backgroundColor: Color.cardsColor,
        shadowRadius: 10,
        borderRadius: 10,
        shadowColor: '#52006A',
        elevation: 20,
        margin: 10,
        alignSelf: "center",
        padding: 5,
        justifyContent: "center",
        overflow: "hidden",
    },
    userImageProfile: {
        height: Dimensions.get('screen').width * 0.3 / 3,
        width: Dimensions.get('screen').width * 0.3 / 3,
        borderRadius: 360,
        alignSelf: "center",
        overflow: "hidden"
    }
});

export default React.memo(UserProfileCardFeedComponent);