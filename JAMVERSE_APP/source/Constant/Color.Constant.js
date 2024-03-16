import { Appearance } from "react-native";

export const Color = {
    backgroundColor: Appearance.getColorScheme() === "dark" ? "black": "#c8cdd0",
    cardsColor: Appearance.getColorScheme() === "dark" ? "#242731": "#ffffff",
    primaryColor : "#242731",
}