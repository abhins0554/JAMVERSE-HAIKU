import React from 'react';
import { TouchableOpacity, StyleSheet, } from 'react-native';

import Color from '../../theme/color/defaultColor.json'
import TextCore from './Text.Core';

function Button({children, onPress, width = '100%'}) {
    
    const styles = StyleSheet.create({
        mainFrame: {
            backgroundColor: Color.primary,
            width: width || '100%',
            alignSelf: 'center',
            margin: 5,
            borderRadius: 3,
            justifyContent: "center"
        },
        text: {
            textAlign: "center",
            padding: 5,
            color: Color.white,
            fontSize: 16,
        }
    });

    return (
        <TouchableOpacity style={styles.mainFrame} onPress={onPress}>
            <TextCore style={styles.text}>{children}</TextCore>
        </TouchableOpacity>
    );
}

export default React.memo(Button);