import { StyleSheet } from "react-native";
import { PlatFormData } from '../Constant/CustomPlatform';
const styles = StyleSheet.create({
    mainframe: {
        flex: 1,
        backgroundColor: PlatFormData.colorMode === "dark" ? "#1a1a1a" : "#FFFFFF",
    }
});

export default styles;