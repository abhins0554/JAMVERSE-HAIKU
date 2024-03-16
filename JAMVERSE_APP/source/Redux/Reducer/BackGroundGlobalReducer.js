
import { PlatFormData } from "../../Constant/CustomPlatform";
import { BackGroundGlobalConstant } from "../../Constant/ReduxContant";
const initTheme =
{
    BackGroundGlobal: {
        type: "color",
        bg: PlatFormData.primaryColor,
    },
};


const BackGroundGlobalReducer = (state = initTheme, action) => {

    switch (action.type) {
        case BackGroundGlobalConstant:
            return { ...state, BackGroundGlobal: action.payload }
        default:
            return state;

    }
};

export default BackGroundGlobalReducer;