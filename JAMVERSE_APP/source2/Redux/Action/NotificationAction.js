import ReduxConstant from "../../constant/Redux.Constant";

const NotificationAction = (value) => (dispatch) => {
    dispatch({ type: ReduxConstant.NOTIFICATION_CONSTANT, payload: value })
}


export default NotificationAction;