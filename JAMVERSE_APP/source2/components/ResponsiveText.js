import React, {memo} from 'react';
import { Dimensions, PixelRatio, Text } from 'react-native';

const ResponsiveText = ({ style, children, percentage = 4 }) => {
    const { width } = Dimensions.get('window');
    const baseFontSize = (width * percentage) / 100;

    // Adjust the font size for different pixel densities
    const fontSize = baseFontSize * PixelRatio.getFontScale();

    return <Text style={[{ fontSize }, style]}>{children}</Text>;
};

const getResponsiveSize = ({ percentage = 4 }) => {
    const { width } = Dimensions.get('window');
    const baseFontSize = (width * percentage) / 100;

    // Adjust the font size for different pixel densities
    const fontSize = baseFontSize * PixelRatio.getFontScale();
    return fontSize;
}

export {getResponsiveSize};
export default memo(ResponsiveText);