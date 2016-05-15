import {dropLast} from "ramda";

import {PUSH, POP} from "../actions/navigation";

export default function navigation (state = ["home"], {type, payload}) {
    switch (type) {
        case PUSH: {
            return state.concat([payload]);
        }
        case POP: {
            return state.length > 1 ? dropLast(1, state) : state;
        }
        default: {
            return state;
        }
    }
}
