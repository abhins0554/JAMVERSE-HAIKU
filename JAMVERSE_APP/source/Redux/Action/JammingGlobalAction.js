import { JammingGlobalConstant } from "../../Constant/ReduxContant"

const JammingGlobalAction = (value) => (dispatch) => {
    dispatch({ type: JammingGlobalConstant, payload: value })
}


export default JammingGlobalAction;