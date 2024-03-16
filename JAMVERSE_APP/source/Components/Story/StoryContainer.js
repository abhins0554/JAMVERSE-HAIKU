import React, { useState, version } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
// import StoryListItem from './StoryListItem.js';

import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import {createStory} from "../../Service/Story.Service";

export default function StoryContainer() {
  const stories = [
    {
      key: 'JohnDoe',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
    {
      key: 'CarlaCoe1',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
    {
      key: 'CarlaCoe2',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
    {
      key: 'CarlaCoe3',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
    {
      key: 'CarlaCoe4',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
    {
      key: 'CarlaCoe5',
      hasStory: true,
      src: 'https://picsum.photos/600',
    },
  ];

  const userData = JSON.parse(useSelector(e => e.AuthGlobalReducer.AuthGlobalData.data));
  const token = useSelector(e => e.AuthGlobalReducer.AuthGlobalData.token);

  const [story, set_story] =useState([{
    key: `${userData.full_name}`,
    hasStory: false,
    _id: userData?._id,
    src: userData?.personalImage?.pI1 ?? 'https://picsum.photos/600',
  }])

  return (
    <View style={Styles.mainframe}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        indicatorStyle={'white'}
        horizontal={true}
        data={story}
        renderItem={({ item }) => (
          <View style={Styles.container}>
            <TouchableOpacity onPress={() => {(item._id == userData?._id && item.hasStory == false) ? createStory(token, { userid: userData?._id }) : console.log("Friend Story")}}>
              <LinearGradient
                colors={['#CA1D7E', '#E35157', '#F2703F']}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={{ borderRadius: 100, padding: 2 }}>
                <View style={{ borderWidth: 2, borderRadius: 100 }}>
                  <Image
                    source={{ uri: item.src }}
                    style={{ width: 55, height: 55, borderRadius: 70 }}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <View>
              <Text style={Styles.storyText}> {item.key} </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  mainframe: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 7
  },
  sperator: {
    backgroundColor: "#1c1c1c",
    height: 0.5,
  },
  container: {
    flexDirection: 'column',
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  storyText: {
    color: 'black',
    fontSize: 12,
    marginTop: 5,
  },
});
