import React from 'react';
import { Text } from 'react-native';

function TextCore({children, style = {} }) {
    return (
        <Text style={[style, { fontFamily: 'Oswald-Regular'}]}>
            {children}
        </Text>
    );
}

export default TextCore;