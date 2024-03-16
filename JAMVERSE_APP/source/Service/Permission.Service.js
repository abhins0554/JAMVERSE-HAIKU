import { PERMISSIONS, request } from "react-native-permissions"

export const askPermission = async () => {
    let permissionArr = [];

        await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(response => {
            console.log(response);
        })
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(response => {
            console.log(response);
        })

    return permissionArr;
}