import React, { useState } from 'react';

import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, FlatList, Text, Image, Modal, ImageBackground, ScrollView } from 'react-native';

import AntDesign from "react-native-vector-icons/AntDesign";
// import TextFilter from 'bad-words';
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';


import ColorPicker from 'react-native-wheel-color-picker';
import { fontFamilyData } from '../../Constant/FontData';
import ImagePicker from 'react-native-image-crop-picker';
import { PlatFormData } from '../../Constant/CustomPlatform';
import { askPermission } from '../../Service/Permission.Service';
import DefaultImage from "../../Constant/DefaultImage.json";
import { createGroupPostNew } from '../../Service/Post.Service';
import LoadingComponent from '../LoadingComponent';

function CreateGroupPostCard({ navigation, userData, fontFamily }) {
    const JammingFontFamily = useSelector(e => e.JammingGlobal.JammingGlobalData.font_family);


    const [line, setLine] = useState();
    const [line1, setLine1] = useState();
    const [color, set_color] = useState(PlatFormData.textPrimaryColor);
    const [editing, setEditing] = useState(false);

    const [loading, set_loading] = useState(false);

    const [editing1, setEditing1] = useState(true);

    const onChangeText = (text) => {
        let words = text.split(" ");
        if (words.length > 6) return false;
        if (text.length > 50) return false;
        setLine(text);
    }
    const onChangeText2 = (text) => {
        let words = text.split(" ");
        if (words.length > 3) return false;
        if (text.length > 50) return false;
        setLine1(text);
    }

    const submitPost = async () => {
        if (!line) return true;
        if (!line.length > 5) return true;
        set_loading(true);
        let resp = await createGroupPostNew(1, line, JammingFontFamily, color, 'background', userData.token, line1);
        if (resp?.data?._id) {
            navigation.push("JammingScreen");
        }
        set_loading(false);
    }


    return (
        <>
            <View style={{ justifyContent: "center", backgroundColor: PlatFormData.primaryColor, width: Dimensions.get('window').width, height: Dimensions.get('window').width, right: "5%", bottom: editing ? "20%" : "10%",  backgroundColor: '#E6DFD4', }}>
                <>
                    {editing1 ?
                        <TextInput style={[styles.centerCardText, { fontFamily: JammingFontFamily, color: color, textAlign: "left", }]} value={line1} onChangeText={onChangeText2} placeholder='Write Beautiful Title' onEndEditing={() => setEditing1(false)} autoFocus={editing1} placeholderTextColor={color} />
                        :
                        <>
                            <TouchableOpacity onPress={() => setEditing1(true)}>
                                <Text style={{ fontFamily: JammingFontFamily, color: color, textAlign: "left", fontSize: 20, }}>{line1 ?? "Write Beautiful Title"}</Text>
                            </TouchableOpacity>
                        </>
                    }
                    {editing ?
                        <TextInput style={[styles.centerCardText, { fontFamily: JammingFontFamily, color: color, textAlign: "left" }]} value={line} onChangeText={onChangeText} placeholder='Write First line' onEndEditing={() => setEditing(false)} autoFocus={editing} placeholderTextColor={color} />
                        :
                        <>
                            <TouchableOpacity onPress={() => setEditing(true)}>
                                <Text style={{ fontFamily: JammingFontFamily, color: color, textAlign: "left", fontSize: 20,  }}>{line ?? "Write First line"}</Text>
                            </TouchableOpacity>
                        </>
                    }
                    <TouchableOpacity style={styles.rightCheckCompleteEditing} onPress={() => submitPost()}>
                        <AntDesign name="checkcircle" size={30} color={"#f84f38"} />
                    </TouchableOpacity>
                    <ScrollView style={{ position: "absolute", right: 11, alignSelf: "center", top: "104%", width: Dimensions.get('screen').width - 20, alignContent: "center" }}>
                        <ColorPicker
                            swatchesOnly={true}
                            color={color}
                            onColorChange={e => set_color(e)}
                        />
                    </ScrollView>
                </>
                <LoadingComponent loading={loading} />
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    centerCardText: {
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 20
    },
    rightCheckCompleteEditing: {
        alignSelf: "flex-end",
        padding: 11,
        position: "absolute",
        top: "86%"
    },
    cameraEditing: {
        alignSelf: "flex-end",
        padding: 11,
        position: "absolute",
        top: "0%"
    },
    centeredView: {
        flex: 1,
    },
})
export default React.memo(CreateGroupPostCard);