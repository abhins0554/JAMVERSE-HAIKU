import { combineReducers } from 'redux';

import TextGlobalReducer from "./Reducer/TextGlobalReducer";
import BackGroundGlobalReducer from "./Reducer/BackGroundGlobalReducer";
import AuthGlobalReducer from "./Reducer/AuthGlobalReducer";
import NotificationTokenReducer from "./Reducer/NotificationTokenReducer";
import JammingGlobalReducer from "./Reducer/JammingGlobalReducer";

const reducers = combineReducers({
    TextGlobal: TextGlobalReducer,
    BackGroundGlobal: BackGroundGlobalReducer,
    AuthGlobalReducer: AuthGlobalReducer,
    NotificationToken: NotificationTokenReducer,
    JammingGlobal: JammingGlobalReducer,
});

export default reducers;