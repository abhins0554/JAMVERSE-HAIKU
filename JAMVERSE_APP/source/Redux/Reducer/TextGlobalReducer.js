
import { PlatFormData } from "../../Constant/CustomPlatform";
import { TextGlobalConstant } from "../../Constant/ReduxContant";
const initTheme =
{
    TextGlobal: {
        fontSize: 12,
        color: PlatFormData.textPrimaryColor,
        alignment: "justify",
        lineHeight: 20,
        letterSpacing: 5,
        fontFamily: "Roboto",
        title: "",
    },
};


const Language = (state = initTheme, action) => {

    switch (action.type) {
        case TextGlobalConstant:
            return { ...state, TextGlobal: action.payload }
        default:
            return state;

    }
};

export default Language;