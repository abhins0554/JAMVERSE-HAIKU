import React from 'react';
import { Text, View, StyleSheet, TextInput } from "react-native";
import { PlatFormData } from '../Constant/CustomPlatform';

function TextInputComponent({ placeholder, borderWidth = 0, borderRadius = 0, width = 80, keyboardType, secureTextEntry, value = "", onChangeText, borderBottomWidth = 0, backgroundColor }) {
    const styles = StyleSheet.create({
        textInputView: {
            borderWidth: borderWidth,
            borderColor: PlatFormData.colorMode === 'dark' ? "white" : "#000000",
            borderRadius: borderRadius,
            width: width,
            alignSelf: "center",
            margin: 5,
            marginTop: 12,
            borderBottomWidth: borderBottomWidth,
        },
        input: {
            alignSelf: "flex-start",
            marginHorizontal: 10,
            color: PlatFormData.colorMode === 'dark' ? "#ffffff" : "#000000",
            width: '100%'
        }
    })

    return (
        <View style={[styles.textInputView, backgroundColor ? {backgroundColor: backgroundColor} : {}]}>
            <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} secureTextEntry={secureTextEntry} placeholder={placeholder} placeholderTextColor={PlatFormData.colorMode === 'dark' ? "white" : "#000000"} style={styles.input} />
        </View>
    );
}

export default React.memo(TextInputComponent);