import { TextGlobalConstant } from "../../Constant/ReduxContant"

const TextGlobalAction = (value) => (dispatch) => {
    dispatch({ type: TextGlobalConstant, payload: value })
}


export default TextGlobalAction;