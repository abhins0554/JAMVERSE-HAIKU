import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, } from 'react-native'

import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';

import AuthGlobalAction from '../Redux/Action/AuthGlobalAction';

import Color from '../theme/color/defaultColor.json';
import Style from '../theme/styles/defaultStyle';

import Button from '../components/core/Button.Core';
import Text from '../components/core/Text.Core';
import TextInput from '../components/core/TextInput.Core';
import ProfileService from '../services/Profile.Service';

function EditProfileScreen({ navigation }) {
    const dispatch = useDispatch();
    const userData = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.data);
    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);


    const [name, set_name] = useState(`${userData.full_name}`);
    const [about, set_about] = useState(`${userData?.about}`);
    const [loading, set_loading] = useState(false);

    const _save = async () => {
        set_loading(true);
        if (name.length > 3 && about.length >= 5 && (name !== userData.full_name || about !== userData?.about)) {
            try {
                await ProfileService.updateProfile({ about, full_name: name }, token);
                let { data } = await ProfileService.userProfileUpdate(token);
                dispatch(AuthGlobalAction({ token: data.token, data: data.userData }))
            } catch (error) {

            }
        }
        else if (name !== userData.full_name || about !== userData?.about) {
            Toast.show({
                type: 'error',
                text1: 'Name or About is required',
                text2: "Name must contain 3 letter and about must contain 5 letter"
            });
        }

        if (userData?.personalImage?.pI1 !== profileImage) {
            try {
                let response = await ProfileService.updateProfileImage(imageData, token, navigation);
                await response.json();
                let { data } = await ProfileService.userProfileUpdate(token);
                dispatch(AuthGlobalAction({ token: data.token, data: data.userData }))
            } catch (error) {
                console.log({ error });
            }
        }
        navigation.navigate('UserProfileScreen');
        set_loading(false);
    }

    const [profileImage, setProfileImage] = React.useState(userData?.personalImage?.pI1 + '?' + new Date());
    const [imageData, setImageData] = React.useState({});

    const _PickProfileImage = async () => {
        ImagePicker.openPicker({
            multiple: false,
            cropping: true,
            compressImageQuality: 0.6,
            height: 512,
            width: 512,

        }).then(async image => {
            setImageData(image);
            setProfileImage(image.path);
        })
    }

    return (
        <View style={Style.appBackground}>
            <View style={Styles.cards}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={Styles.userFollowFollowingImage} onPress={_PickProfileImage}>
                        <Image source={profileImage ? { uri: profileImage } : { uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png' }} style={Styles.userProfileImage} />
                    </TouchableOpacity>
                    <View style={Styles.userFollowFollowingImage}>
                        <Text style={Styles.profileCardText}>{userData.post || 0}</Text>
                        <Text style={Styles.profileCardText}>POST</Text>
                    </View>
                    <TouchableOpacity style={Styles.userFollowFollowingImage} onPress={() => navigation.navigate('FollowerFollowingScreen', { _id: userData._id })} >
                        <Text style={Styles.profileCardText}>{userData.followers || 0}</Text>
                        <Text style={Styles.profileCardText}>Follower</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.userFollowFollowingImage} onPress={() => navigation.navigate('FollowerFollowingScreen', { _id: userData._id })} >
                        <Text style={Styles.profileCardText}>{userData.following || 0}</Text>
                        <Text style={Styles.profileCardText}>Following</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                    }}>
                    <View style={{ marginBottom: 0 }}>
                        <Text style={{ color: Color.textSecondary, fontSize: 12, }}>{`Name`}</Text>
                        <TextInput borderBottomWidth={1} defaultValue={`${userData.full_name}`} value={name} onChangeText={(e) => set_name(e)} maxLength={55} />
                        <Text style={{ color: Color.textSecondary, fontSize: 12, marginTop: 20 }}>{`Username`}</Text>
                        <Text style={{ color: 'grey', fontWeight: '500' }}>{`@${userData.user_name}`}</Text>
                        <Text style={{ color: Color.textSecondary, fontSize: 12, marginTop: 20 }}>{`About`}</Text>
                        <TextInput borderBottomWidth={1} defaultValue={userData?.about} value={about} onChangeText={(e) => set_about(e)} multiline={true} maxLength={250} />
                    </View>
                </View>
                <Button width={wp(85)} onPress={_save} >Save</Button>
            </View>
            <View style={{ flex: 1 }} />
        </View>
    )
}

const Styles = StyleSheet.create({
    cards: {
        width: wp(90),
        alignSelf: 'center',
        backgroundColor: Color.white,
        marginTop: 10,
        padding: 10
    },
    userFollowFollowingImage: {
        width: (wp(90) / 4) - 5,
        alignSelf: 'center',
        flexDirection: 'column'
    },
    userProfileImage: {
        width: (wp(90) / 4) - 5,
        height: (wp(90) / 4) - 5,
        borderRadius: 360
    },
    profileCardText: {
        fontSize: 16,
        textAlign: 'center',
        color: Color.textPrimary
    },
});


export default React.memo(EditProfileScreen);