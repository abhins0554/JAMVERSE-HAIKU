
import ReduxConstant from "../../constant/Redux.Constant";
const initTheme =
{
    AUTHENTICATION: {
        token: '',
        data: {
        }
    }
};


const JammingReducer = (state = initTheme, action) => {
    switch (action.type) {
        case ReduxConstant.AUTHENTICATION_CONSTANT:
            return { ...state, AUTHENTICATION: action.payload }
        default:
            return state;
    }
};

export default JammingReducer;