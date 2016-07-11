import {combineReducers} from "redux";

import collections from "./collections";
import home from "./home";
import navigation from "./navigation";
import site from "./site";
import userId from "./user-id";
import stats from "./stats";

const rootReducer = combineReducers({
    collections,
    home,
    navigation,
    site,
    stats,
    userId
});

export default rootReducer;
