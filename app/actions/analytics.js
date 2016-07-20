import moment from "moment";
import {post} from "axios";

import {WRITE_API_ENDPOINT} from "../../env";

export const NAVIGATE_BACK = "NAVIGATE_BACK";
export const NAVIGATE_VIEW = "NAVIGATE_VIEW";
export const POST_ANALYTICS = "POST_ANALYTICS";

export function navigateView (view) {
    return {
        type: NAVIGATE_VIEW,
        payload: {
            view
        }
    };
}

export function navigateBack () {
    return {
        type: NAVIGATE_BACK
    };
}

export function postAnalytics (userId, store) {
    const {analytics} = store;
    post(WRITE_API_ENDPOINT + "/user-interactions", {
        userId,
        interactions: analytics.navigationHistory.map(viewed => {
            return {
                type: "page_view",
                timestamp: moment.utc().format(),
                body: viewed
            };
        })
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
    return {
        type: POST_ANALYTICS
    };
}
