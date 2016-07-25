import {dropLast} from "ramda";

import {PUSH_SCENE, POP_SCENE, POP_TO_HOME} from "../actions/navigation";

const defaultState = ["home"];

export default function navigation (state = defaultState, {type, payload}) {
    switch (type) {
        case PUSH_SCENE: {
            return state.concat([payload]);
        }
        case POP_SCENE: {
            return state.length > 1 ? dropLast(1, state) : state;
        }
        case POP_TO_HOME: {
            return defaultState;
        }
        default: {
            return state;
        }
    }
}
