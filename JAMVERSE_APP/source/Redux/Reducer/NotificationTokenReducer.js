import { NotificationTokenConstant } from "../../Constant/ReduxContant";
const initTheme =
{
    notificationToken: "",
};


const NotificationTokenReducer = (state = initTheme, action) => {

    switch (action.type) {
        case NotificationTokenConstant:
            return { ...state, notificationToken: action.payload }
        default:
            return state;

    }
};

export default NotificationTokenReducer;