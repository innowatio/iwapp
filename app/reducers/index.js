import {combineReducers} from "redux";

import navigation from "./navigation";
import collections from "./collections";
import userId from "./user-id";

const rootReducer = combineReducers({
    collections,
    navigation,
    userId
});

export default rootReducer;
