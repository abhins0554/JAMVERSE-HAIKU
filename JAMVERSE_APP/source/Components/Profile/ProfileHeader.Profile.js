import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';




function ProfileHeader({ navigation }) {
  const profileData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));

  const [profile_image, set_profile_image] = useState("");

  React.useEffect(() => {
    const tempFunction = async () => {
      set_profile_image(profileData?.personalImage?.pI1 + '?' + new Date());
    }
    tempFunction();
  }, []);

  return (
    <View style={Styles.container}>
      <TouchableOpacity>
        <Image
          source={profile_image ? { uri: profile_image, cache: "reload", } : require("../../Asset/user_318-159711.png")}
          style={Styles.prfilePicture}
        />
      </TouchableOpacity>

      <View style={Styles.container2}>
        <View style={Styles.container3}>
          <View>
            <Text style={Styles.numberContainer}>{profileData?.postCount ?? 0}</Text>
            <Text style={Styles.text}>Posts</Text>
          </View>
        </View>
        <View style={Styles.container3}>
          <TouchableOpacity onPress={() => navigation.push("FollowerFollowingScreen", { _id: profileData._id, type: "follower" })}>
            <Text style={Styles.numberContainer}>{profileData.followers ?? 0}</Text>
            <Text style={Styles.text}>Followers</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.container3}>
          <TouchableOpacity onPress={() => navigation.push("FollowerFollowingScreen", { _id: profileData._id, type: "following" })}>
            <Text style={Styles.numberContainer}>{profileData.following ?? 0}</Text>
            <Text style={Styles.text}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prfilePicture: {
    height: 80,
    width: 80,
    borderRadius: 100,
    marginLeft: 20,
    padding: 2
  },
  numberContainer: {
    color: "#f84f38",
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 15,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    marginEnd: 20,
  },
  text: {
    color: "#f84f38",
    //fontWeight: 'bold',
    alignSelf: 'center',
  },
  container3: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
});


export default React.memo(ProfileHeader);