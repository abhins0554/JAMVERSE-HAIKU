
import ReduxConstant from "../../constant/Redux.Constant";
const initTheme =
{
    NOTIFICATION: {
        token: '',
        os: '',
    }
};


const NotificationReducer = (state = initTheme, action) => {
    switch (action.type) {
        case ReduxConstant.NOTIFICATION_CONSTANT:
            return { ...state, NOTIFICATION: action.payload }
        default:
            return state;
    }
};

export default NotificationReducer;