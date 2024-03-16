
import { JammingGlobalConstant } from "../../Constant/ReduxContant";
const initTheme =
{
    JammingGlobalData: {
        font_family: "Robot",
    },
};


const JammingReducer = (state = initTheme, action) => {

    switch (action.type) {
        case JammingGlobalConstant:
            return { ...state, JammingGlobalData: action.payload }
        default:
            return state;

    }
};

export default JammingReducer;