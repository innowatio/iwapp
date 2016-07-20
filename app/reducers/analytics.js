import moment from "moment";

import {
    NAVIGATE_BACK,
    NAVIGATE_VIEW,
    ANALYTICS_POST_SUCCESS
} from "../actions/analytics";

const defaultState = {
    navigationHistory: [{
        view: "home",
        timestamp: moment.utc().format()
    }]
};

export default function analytics (state = defaultState, {type, payload}) {
    switch (type) {
        case NAVIGATE_VIEW: {
            return {
                ...state,
                navigationHistory: [
                    ...state.navigationHistory,
                    {
                        view: payload.view,
                        timestamp: moment.utc().format()
                    }
                ]
            };
        }
        case NAVIGATE_BACK: {
            return {
                ...state,
                navigationHistory: [
                    ...state.navigationHistory,
                    {
                        view: state.navigationHistory[state.navigationHistory.length - 2].view,
                        timestamp: moment.utc().format()
                    }
                ]
            };
        }
        case ANALYTICS_POST_SUCCESS:
            return defaultState;
        default: {
            return state;
        }
    }
}
