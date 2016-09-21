import get from "lodash.get";
import moment from "moment";

import {
    ANALYTICS_POST_SUCCESS
} from "../actions/analytics";

import {
    PUSH_SCENE,
    POP_SCENE,
    REPLACE_SCENE,
    RESET_SCENE,
    POP_TO_SCENE
} from "../actions/navigation";

const defaultState = {
    navigationHistory: [{
        view: "home",
        timestamp: moment.utc().format()
    }]
};

export default function analytics (state = defaultState, {type, payload}) {
    switch (type) {
        case PUSH_SCENE:
        case REPLACE_SCENE:
        case POP_TO_SCENE: {
            return {
                ...state,
                navigationHistory: [
                    ...state.navigationHistory,
                    {
                        view: payload,
                        timestamp: moment.utc().format()
                    }
                ]
            };
        }
        case POP_SCENE: {
            return {
                ...state,
                navigationHistory: [
                    ...state.navigationHistory,
                    {
                        view: get(state, `navigationHistory[${state.navigationHistory.length - 2}].view`, "home"),
                        timestamp: moment.utc().format()
                    }
                ]
            };
        }
        case RESET_SCENE:
            return {
                ...state,
                navigationHistory: [
                    ...state.navigationHistory,
                    {
                        view: "home",
                        timestamp: moment.utc().format()
                    }
                ]
            };
        case ANALYTICS_POST_SUCCESS:
            return defaultState;
        default: {
            return state;
        }
    }
}
