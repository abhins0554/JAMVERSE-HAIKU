import React, { memo } from 'react';
import { Platform, View } from 'react-native';
import { BannerAd, TestIds, BannerAdSize, } from 'react-native-google-mobile-ads';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

function BannerAdsComponent(props) {

    // Function to get a random number between 1 and 7
    function getRandomNumber() {
        // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
        const randomDecimal = Math.random();

        // Scale and shift the random decimal to the desired range
        const randomNumber = Math.floor(randomDecimal * 7) + 1;

        return randomNumber;
    }

    let randomSize = {
        '1': BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
        '2': BannerAdSize.BANNER,
        '3': BannerAdSize.FULL_BANNER,
        '4': BannerAdSize.INLINE_ADAPTIVE_BANNER,
        '5': BannerAdSize.LARGE_BANNER,
        '6': BannerAdSize.LEADERBOARD,
        '7': BannerAdSize.MEDIUM_RECTANGLE,
    }
    return (
        <View style={{ width: wp('100%'), alignItems: 'center' }}>
            <BannerAd
                unitId={Platform.OS === 'ios' ? "ca-app-pub-9265757158906430/5241151561" : Platform.OS === 'android' ? 'ca-app-pub-9265757158906430/6520176933' : TestIds.BANNER}
                size={randomSize[getRandomNumber()]}
                key={props.index}
            />
        </View>
    );
}

export default memo(BannerAdsComponent);