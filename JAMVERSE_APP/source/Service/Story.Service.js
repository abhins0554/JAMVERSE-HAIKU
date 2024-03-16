import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../Constant/Default';
import { Platform } from 'react-native';

export const createStory = async (token, body) => {
  ImagePicker.openPicker({
    multiple: false,
    cropping: true
  }).then(async image => {

    let body = new FormData();
    let filename = Platform.OS === 'android' ? image.path : image.uri.replace('file://', '').split('/').pop();
    body.append('storyImage',  {uri:Platform.OS === 'android' ? image.path : image.uri.replace('file://', ''), name:filename, type:'image/jpg', });
  
  
    const header = {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`
      }
    fetch(`${BASE_URL}stories/add-story`, {
      method: 'POST',
      headers: header,
      body: body,
    }).then(response => response.json())
      .then(res => {
        console.log(res)
        if (res.code === 200) {
          Toast.show({
            type: 'success',
            text1: 'Story added sucessfully',
            text2: res.message
          });
        }
        else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.message
          });
        }
      })
      .catch(err => console.log("err", err))
  
  });
}