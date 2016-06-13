import {combineReducers} from "redux";

import collections from "./collections";
import home from "./home";
import navigation from "./navigation";
import userId from "./user-id";

const rootReducer = combineReducers({
    collections,
    home,
    navigation,
    userId
});

export default rootReducer;
