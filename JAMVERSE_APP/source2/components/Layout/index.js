import React from 'react';
import { View } from 'react-native';

import HeaderLayout from './Header.Layout';
import FooterLayout from './Footer.Layout';

function index({ children }) {
    return (
        <>
            <HeaderLayout />
            <React.StrictMode>
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            </React.StrictMode>
            <FooterLayout />
        </>
    );
}

export default index;