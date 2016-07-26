import {dropLast} from "ramda";

import {PUSH_SCENE, POP_SCENE, POP_TO_SCENE, REPLACE_SCENE, RESET_SCENE} from "../actions/navigation";

const defaultState = ["home"];

export default function navigation (state = defaultState, {type, payload}) {
    switch (type) {
        case PUSH_SCENE: {
            return state.concat([payload]);
        }
        case POP_SCENE: {
            return state.length > 1 ? dropLast(1, state) : state;
        }
        case REPLACE_SCENE: {
            return dropLast(1, state).concat([payload]);
        }
        case RESET_SCENE: {
            return defaultState;
        }
        case POP_TO_SCENE: {
            const index = state.findIndex(view => payload === view);
            return state.slice(0, index).concat(payload);
        }
        default: {
            return state;
        }
    }
}
