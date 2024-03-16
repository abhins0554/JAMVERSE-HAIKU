import axios from 'axios';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from'react-native';
import { useSelector } from 'react-redux';

import commonStyle from '../Common/styles';
import Header from '../Components/Header';
import { PlatFormData } from '../Constant/CustomPlatform';
import { BASE_URL } from '../Constant/Default';


function ActivityScreen({navigation}) {

    const userData = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);

    const dataRequested = async () => {
        await axios.post(`${BASE_URL}/report/request-info`, {}, { headers: {
            Authorization: 'Bearer ' + userData.token,
        }}).then( ({data}) => {
            console.log(res);
            alert('We will send your data in some time to personal registered email.');
        })
        .catch( err => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView style={commonStyle.mainframe}>
            <Header navigation={navigation} />
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
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    listContainer: {
        margin: 10,
    },
    listContainerText: {
        color: PlatFormData.textPrimaryColor,
    }
})
export default ActivityScreen;