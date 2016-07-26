import {combineReducers} from "redux";

import analytics from "./analytics";
import collections from "./collections";
import home from "./home";
import navigation from "./navigation";
import site from "./site";
import userId from "./user-id";
import stats from "./stats";
import sessionId from "./session-id";

const rootReducer = combineReducers({
    analytics,
    collections,
    home,
    navigation,
    site,
    stats,
    userId,
    sessionId
});

export default rootReducer;
