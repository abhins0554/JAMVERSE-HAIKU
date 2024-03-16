import axios from 'axios';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from'react-native';
import { useSelector } from 'react-redux';

import Text from '../components/core/Text.Core';

import Color from '../theme/color/defaultColor.json';
import Styles from '../theme/styles/defaultStyle';
import Constant from '../constant/Constant';


function ActivityScreen({navigation}) {

    const token = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const dataRequested = async () => {
        await axios.post(`${Constant.BASE_URL}/report/request-info`, {}, { headers: {
            Authorization: 'Bearer ' + token,
        }}).then( ({data}) => {
            alert('We will send your data in some time to personal registered email.');
        })
        .catch( err => {
        })
    }

    return (
        <View style={Styles.appBackground}>
            <TouchableOpacity style={styles.listContainer} onPress={() => dataRequested()}>
                <Text style={styles.listContainerText}>Jam you create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listContainer} onPress={() => dataRequested()}>
                <Text style={styles.listContainerText}>Post you like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listContainer} onPress={() => dataRequested()}>
                <Text style={styles.listContainerText}>Download all stored information</Text>
            </TouchableOpacity>
            <View style={{flex: 1}} />
            <Text style={{ textAlign: "center", flex: 1}}>We will send all data to your registered email only **</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    listContainer: {
        margin: 10,
    },
    listContainerText: {
        color: Color.textPrimary,
    }
})
export default memo(ActivityScreen);