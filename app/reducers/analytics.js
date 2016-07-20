import moment from "moment";
import DeviceInfo from "react-native-device-info";

import {
    NAVIGATE_BACK,
    NAVIGATE_VIEW,
    POST_ANALYTICS
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
                        timestamp: moment.utc().format(),
                        device: DeviceInfo.getDeviceId()
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
                        timestamp: moment.utc().format(),
                        device: DeviceInfo.getDeviceId()
                    }
                ]
            };
        }
        case POST_ANALYTICS:
            return defaultState;
        default: {
            return state;
        }
    }
}
