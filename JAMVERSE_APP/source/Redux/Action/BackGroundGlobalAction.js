import { BackGroundGlobalConstant } from "../../Constant/ReduxContant"

const BackGroundGlobalAction = (value) => (dispatch) => {
    dispatch({ type: BackGroundGlobalConstant, payload: value })
}


export default BackGroundGlobalAction;