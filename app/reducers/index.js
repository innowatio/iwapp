import {combineReducers} from "redux";

import navigation from "./navigation";
import collections from "./collections";

const rootReducer = combineReducers({
    navigation,
    collections
});

export default rootReducer;
