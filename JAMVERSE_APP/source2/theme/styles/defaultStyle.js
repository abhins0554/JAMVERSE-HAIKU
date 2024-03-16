import { StyleSheet } from 'react-native';

/* Import Default App Color */
import Color from '../color/defaultColor.json';

const styles = StyleSheet.create({
    appBackground: {
        flex: 1,
        backgroundColor: Color.background,
    },
    screenMainFrame: {
        flex: 1,
        flexDirection: "column",
    },
})

export default styles;