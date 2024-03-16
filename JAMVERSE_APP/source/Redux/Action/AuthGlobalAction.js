import { AuthGlobalConstant } from "../../Constant/ReduxContant"

const AuthGlobalAction = (value) => (dispatch) => {
    dispatch({ type: AuthGlobalConstant, payload: value })
}


export default AuthGlobalAction;