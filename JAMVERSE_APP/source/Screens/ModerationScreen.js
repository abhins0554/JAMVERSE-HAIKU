import axios from 'axios';
import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, FlatList, TouchableOpacity } from 'react-native';

import AntDesign from'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';

import Button from '../Common/Button';
import commonStyle from "../Common/styles";
import { PlatFormData } from '../Constant/CustomPlatform';
import { BASE_URL } from '../Constant/Default';

const reasons = [
    {
        id: 1,
        name: 'Content anchored in sensitive location'
    },
    {
        id: 2,
        name: 'Dangerous organizations and individuals'
    },
    {
        id: 3,
        name: 'Illegal actives and requited goods'
    },
    {
        id: 4,
        name: 'Violent and graphic content'
    },
    {
        id: 5,
        name: 'Animal cruelty'
    },
    {
        id: 6,
        name: `Suicide or self-harm`
    },
    {
        id: 7,
        name: `Hate speech`
    },
    {
        id: 8,
        name: `Harassment or bullying`
    },
    {
        id: 9,
        name: `Pornography and nudity`
    },
    {
        id: 10,
        name: `Minor safety`
    },
    {
        id: 11,
        name: 'Spam'
    },
    {
        id: 12,
        name: `Intellectual property infringement`
    },
    {
        id: 13,
        name: `Other`
    }
]

function ModerationScreen({navigation, route,}) {
    const [stages, setStages] = React.useState(1);
    const [reasonSelected, setReasonSelected] = React.useState(0);

    const userData = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);

    const dataRequested = async () => {
        await axios.post(`${BASE_URL}/report/add-report`, {
            "post_id": route.params.post_id ?? "",
            "name": reasons.filter(i => i.id == reasonSelected)[0].name ?? "",
            "id": reasonSelected ?? ""
        }, { headers: {
            Authorization: 'Bearer ' + userData.token,
        }}).then( ({data}) => {
            navigation.navigate("JammingScreen");
            alert("Our team will soon look into it thanks for your feedback");
        })
        .catch( err => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView style={commonStyle.mainframe}>
            {
                stages === 1?
                <View style={styles.mainframe}>
                    <View style={styles.container}>
                        <AntDesign name = "arrowleft" size={25} style={{color: PlatFormData.textPrimaryColor, margin: 10}} onPress={() => navigation.goBack()} />
                        <Text style={styles.textReport}>Report</Text>
                    </View>
                    <Text style={styles.headingSubText}>Please select a Reason</Text>
                    <FlatList 
                        data={reasons}
                        keyExtractor={ reasons => reasons.id.toString()}
                        renderItem={({item}) => (
                            <TouchableOpacity style={styles.containerList} onPress={() => {setStages(2); setReasonSelected(item.id);}}>
                                <Text style={styles.textReportContext} numberOfLines={1}>{item.name}</Text>
                                <AntDesign name = "right" size={15} style={{color: PlatFormData.textPrimaryColor, margin: 10}}  />
                            </TouchableOpacity>
                        )}
                    />
                </View>
                :
                <View style={styles.mainframe}>
                    <View style={styles.container}>
                        <AntDesign name = "arrowleft" size={25} style={{color: PlatFormData.textPrimaryColor, margin: 10}} onPress={() => navigation.goBack()} />
                        <Text style={styles.textReport}>Report</Text>
                    </View>
                    <Text style={styles.headingSubText}>Please know that by submitting we will review each post / profile reported by our users</Text>
                    <Text style={{margin: 10}}> Type: {reasonSelected}</Text>
                    <Text style={{margin: 10}}> Reason: {reasons.filter(i => i.id == reasonSelected)[0].name}</Text>
                    <Text>{``}</Text> 
                    <Button text={"Submit"} width={Dimensions.get('screen').width-40} color={'#f84f38'} borderRadius={7} onPress={() => dataRequested ()} /> 
                </View>
            }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainframe: {
        width: Dimensions.get("screen").width,
        alignSelf: "center"
    },
    container: {
        flexDirection: "row",
    },
    textReport : {
        color: PlatFormData.textPrimaryColor,
        fontSize: 20,
        marginLeft: 10,
        marginRight: 50,
        marginTop: 10,
        textAlign: "center",
        flex: 1
    },
    headingSubText: {
        color: "grey",
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        marginBottom: 20
    },
    textReportContext: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        textAlign: "left",
        flex: 1,
        fontSize: 15,
    },
    containerList: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row"
    }
})
export default ModerationScreen;