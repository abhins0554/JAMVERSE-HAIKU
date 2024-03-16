import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useState } from 'react'

import CommonStyle from "../Common/styles";
import Header from '../Components/Header';

import { useDispatch, useSelector } from 'react-redux';
import { PlatFormData } from '../Constant/CustomPlatform';
import Button from '../Common/Button';
import Toast from 'react-native-toast-message';
import { updateProfile, updateProfileImage } from '../Service/Profile.Service';
import BottomNav from '../Components/BottomNav';

import {commonuserProfileUpdate} from "../Service/Common.Service";
import ImagePicker from 'react-native-image-crop-picker';
import LoadingComponent from '../Components/LoadingComponent';

function EditProfileScreen({ navigation }) {
    const dispatch = useDispatch();
    const profileData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));
    const reduxData = useSelector(e => e?.AuthGlobalReducer?.AuthGlobalData);

    const [name, set_name] = useState(`${profileData.full_name}`);
    const [about, set_about] = useState(`${profileData?.about}`);
    const [loading, set_loading] = useState(false);

    const _save = async () => {
        set_loading(true);
        if (name.length > 3 && about.length >= 5 && (name !== profileData.full_name || about !== profileData?.about)) {
            await updateProfile({about, full_name: name}, reduxData, navigation);
            await commonuserProfileUpdate(reduxData?.token, dispatch);
        }
        else if (name !== profileData.full_name || about !== profileData?.about) {
            Toast.show({
                type: 'error',
                text1: 'Name or About is required',
                text2: "Name must contain 3 letter and about must contain 5 letter"
            });
        }

        if (profileData?.personalImage?.pI1 !== profileImage) {
            updateProfileImage(imageData, reduxData?.token, navigation)
            await commonuserProfileUpdate(reduxData?.token, dispatch);
        }
        set_loading(false);
    }

    const [profileImage, setProfileImage] = React.useState(profileData?.personalImage?.pI1 + '?' + new Date() );
    const [imageData, setImageData] = React.useState({});

    const _PickProfileImage = async () => {
        ImagePicker.openPicker({
            multiple: false,
            cropping: true,
            compressImageQuality: 0.7,
            height: 512,
            width: 512,
            
        }).then(async image => {
            setImageData(image);
            setProfileImage(image.path);
        })
    }

    return (
        <SafeAreaView style={CommonStyle.mainframe}>
            <Header navigation={navigation} />
            <View style={Styles.cards}>
                <View style={Styles.container}>
                    <TouchableOpacity onPress={() => _PickProfileImage()}>
                        <Image
                            source={ profileImage ? { uri: profileImage } : require("../Asset/user_318-159711.png")}
                            style={Styles.prfilePicture}
                        />
                    </TouchableOpacity>

                    <View style={Styles.container2}>
                        <View style={Styles.container3}>
                            <TouchableOpacity>
                                <Text style={Styles.numberContainer}>10</Text>
                                <Text style={Styles.text}>Posts</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.container3}>
                            <TouchableOpacity>
                                <Text style={Styles.numberContainer}>{profileData.followers}</Text>
                                <Text style={Styles.text}>Followers</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.container3}>
                            <TouchableOpacity>
                                <Text style={Styles.numberContainer}>{profileData.following}</Text>
                                <Text style={Styles.text}>Following</Text>
                            </TouchableOpacity>
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
                        <Text style={{ color: PlatFormData.textSecondaryColor, fontWeight: '400', fontSize: 12, }}>{`Name`}</Text>
                        <TextInput style={{ color: PlatFormData.textPrimaryColor, fontWeight: 'bold', top: -10, borderBottomWidth: 1, borderRadius: 5, paddingBottom: 2, borderColor: PlatFormData.textSecondaryColor }} defaultValue={`${profileData.full_name}`} value={name} onChangeText={(e) => set_name(e)} maxLength={55} />
                        <Text style={{ color: PlatFormData.textSecondaryColor, fontWeight: '400', fontSize: 12, }}>{`Username`}</Text>
                        <Text style={{ color: 'grey', fontWeight: '500' }}>{`@${profileData.user_name}`}</Text>
                    </View>
                    <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
                        <Text style={{ color: PlatFormData.textSecondaryColor, fontWeight: '400', fontSize: 12, }}>{`About`}</Text>
                        <TextInput style={{ color: PlatFormData.textPrimaryColor, textAlign: "justify", top: -10, borderBottomWidth: 1, borderRadius: 5, paddingBottom: 2, borderColor: PlatFormData.textSecondaryColor }} defaultValue={profileData?.about} value={about} onChangeText={(e) => set_about(e)} multiline={true} maxLength={250} />
                    </View>
                </View>
                <Button text={"Save"} textColor="#FFFFFF" color="#f84f38" width={Dimensions.get('screen').width - 40} borderWidth={0} borderRadius={10} onPress={_save}  />
            </View>
            <View style={{flex: 1}} />
            <BottomNav navigation={navigation} type="Profile" />
            <LoadingComponent loading={loading} />
        </SafeAreaView>
    )
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
        backgroundColor: "#f84f38", padding: 2
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
    cards: {
        marginTop: 5,
        backgroundColor: PlatFormData.primaryColor,
        marginHorizontal: 10,
        borderRadius: 7,
        elevation: 1,
    }
});


export default React.memo(EditProfileScreen);