
import { AuthGlobalConstant } from "../../Constant/ReduxContant";
const initTheme =
{
    AuthGlobalData: {
        token: "",
        data: "",
    },
};


const AuthReducer = (state = initTheme, action) => {

    switch (action.type) {
        case AuthGlobalConstant:
            return { ...state, AuthGlobalData: action.payload }
        default:
            return state;

    }
};

export default AuthReducer;