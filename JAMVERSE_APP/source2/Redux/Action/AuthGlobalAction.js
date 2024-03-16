import ReduxConstant from "../../constant/Redux.Constant";

const AuthGlobalAction = (value) => (dispatch) => {
    dispatch({ type: ReduxConstant.AUTHENTICATION_CONSTANT, payload: value })
}


export default AuthGlobalAction;