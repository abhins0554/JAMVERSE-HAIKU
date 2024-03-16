import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

function Button({ color, onPress, text, textColor, borderRadius = 0, borderWidth = 0, borderColor = "#D8D8D8", width = 50 }) {

    const styles = StyleSheet.create({
        mainFrame: {
            justifyContent: "center",
            backgroundColor: color,
            paddingHorizontal: 10,
            height: 45,
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: borderRadius,
            borderWidth: borderWidth,
            borderColor: borderColor,
            width: width,
            alignSelf: "center"
        },
        text: {
            color: textColor,
            textAlign: "center"
        }
    });

    return (
        <TouchableOpacity style={styles.mainFrame} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

export default React.memo(Button);