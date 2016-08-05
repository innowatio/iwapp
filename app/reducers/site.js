import {SELECT_SITE} from "../actions/site";

export default function site (state = null, {type, payload}) {
    switch (type) {
        case SELECT_SITE: {
            return payload;
        }
        default:
            return state;
    }
}
