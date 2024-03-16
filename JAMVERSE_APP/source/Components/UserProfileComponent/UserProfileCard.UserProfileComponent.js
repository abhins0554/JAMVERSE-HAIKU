import React from 'react';

import { View, StyleSheet, Dimensions } from "react-native";

import ProfileHeader from '../Profile/ProfileHeader.Profile';
import UserBio from '../Profile/UserBio.Profile';
import Button from '../../Common/Button';
import { Color } from '../../Constant/Color.Constant';

function UserProfileCardUserProfileComponent({ navigation }) {
    return (

        <View style={styles.cards}>
            <ProfileHeader navigation={navigation} />
            <UserBio />
            <Button text={"Edit Profile"} textColor="#FFFFFF" color="#f84f38" width={Dimensions.get('screen').width - 40} borderWidth={0} borderRadius={10} onPress={() => navigation.push('EditProfileScreen')} />
        </View>
    );
}
const styles = StyleSheet.create({
    cards: {
        marginTop: 5,
        backgroundColor: Color.cardsColor,
        marginHorizontal: 10,
        shadowRadius: 10,
        borderRadius: 10,
        shadowColor: '#52006A',
        elevation: 20,
        overflow: "hidden",
        borderRadius: 10
    }
})
export default React.memo(UserProfileCardUserProfileComponent);