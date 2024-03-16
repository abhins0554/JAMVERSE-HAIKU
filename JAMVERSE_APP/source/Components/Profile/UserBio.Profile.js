import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { PlatFormData } from '../../Constant/CustomPlatform';

function UserBio() {
  const AuthGlobalData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data) ?? "{}")
  return (
    <View
      style={{
        flexDirection: 'column',
        marginStart: 10,
        marginTop: 20,
      }}>
      <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
        <Text style={{ color: PlatFormData.textPrimaryColor, fontWeight: 'bold' }}>{`${AuthGlobalData.full_name}`}</Text>
        <Text style={{ color: 'grey', fontWeight: '500' }}>{`@${AuthGlobalData.user_name}`}</Text>
      </View>
      <View style={{ marginBottom: 5, marginHorizontal: 10 }}>
        <Text style={{ color: PlatFormData.textPrimaryColor, textAlign: "justify" }}>{AuthGlobalData?.about}</Text>
      </View>
    </View>
  );
}

export default React.memo(UserBio);