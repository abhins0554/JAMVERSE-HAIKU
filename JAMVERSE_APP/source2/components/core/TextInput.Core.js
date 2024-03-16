import React from 'react';
import { Text, View, StyleSheet, TextInput } from "react-native";

import Color from '../../theme/color/defaultColor.json'

function TextInputComponent({ placeholder, borderWidth = 0, borderRadius = 0, keyboardType, secureTextEntry, value = "", onChangeText, borderBottomWidth = 0, width = '100%'}) {
    const styles = StyleSheet.create({
        textInputView: {
            borderWidth: borderWidth,
            borderColor: Color.black,
            borderRadius: borderRadius,
            width: width || '100%',
            alignSelf: "center",
            margin: 5,
            marginTop: 12,
            borderBottomWidth: borderBottomWidth,
            fontFamily: 'Oswald-Regular',
            color: Color.black
        },
        input: {
            alignSelf: "flex-start",
            marginHorizontal: 10,
            width: width || '100%',
        }
    })

    return (
        <TextInput value={value} caretHidden={false} onChangeText={onChangeText} keyboardType={keyboardType} secureTextEntry={secureTextEntry} placeholder={placeholder} placeholderTextColor={Color.black} style={[styles.input, styles.textInputView]} />
    );
}

export default React.memo(TextInputComponent);