import React from 'react';

import { View, ActivityIndicator } from 'react-native';

function LoadingComponent({ loading }) {
    return (
        <>
            {loading ? (
                <View
                    style={{
                        position: 'absolute',
                        backgroundColor: '#FFFFFF',
                        height: 50,
                        width: 50,
                        alignSelf: 'center',
                        top: '50%',
                    }}>
                    <ActivityIndicator size={'large'} color={'#f84f38'} />
                </View>
            ) : (
                <></>
            )}
        </>
    );
}

export default React.memo(LoadingComponent);
