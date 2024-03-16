import { combineReducers } from 'redux';

import AuthGlobalReducer from "./Reducer/AuthGlobalReducer";
import NotificationReducer from "./Reducer/NotificationReducer";

const reducers = combineReducers({
    AUTHENTICATION: AuthGlobalReducer,
    NOTIFICATION: NotificationReducer,
});

export default reducers;