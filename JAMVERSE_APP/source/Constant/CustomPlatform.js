import { Platform, Appearance } from "react-native";

export const PlatFormData = {
    osVersion: Platform.constants['Release'],
    api: Platform.Version?.toString(),
    os: Platform.OS,
    colorMode: Appearance.getColorScheme(),
    primaryColor: Appearance.getColorScheme() === "dark" ? "#000000" : "#ffffff",
    secondaryColor: Appearance.getColorScheme() === "dark" ? "#1a1a1a" : "#f5f7f9",
    textPrimaryColor: Appearance.getColorScheme() === "dark" ? "#ffffff" : "#000000",
    textSecondaryColor: "lightgrey",
}