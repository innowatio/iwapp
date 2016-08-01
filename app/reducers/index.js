import {combineReducers} from "redux";

import analytics from "./analytics";
import collections from "./collections";
import home from "./home";
import navigation from "./navigation";
import questionnaire from "./questionnaire";
import sessionId from "./session-id";
import site from "./site";
import stats from "./stats";
import survey from "./survey";
import userId from "./user-id";

const rootReducer = combineReducers({
    analytics,
    collections,
    home,
    navigation,
    questionnaire,
    sessionId,
    site,
    stats,
    survey,
    userId
});

export default rootReducer;
