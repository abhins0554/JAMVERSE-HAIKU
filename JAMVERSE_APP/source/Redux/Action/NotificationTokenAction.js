import { NotificationTokenConstant } from "../../Constant/ReduxContant"

const NotificationTokenAction = (value) => (dispatch) => {
    dispatch({ type: NotificationTokenConstant, payload: value })
}


export default NotificationTokenAction;