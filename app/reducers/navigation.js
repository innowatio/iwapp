import {dropLast} from "ramda";

import {PUSH_SCENE, POP_SCENE} from "../actions/navigation";

export default function navigation (state = ["home"], {type, payload}) {
    switch (type) {
        case PUSH_SCENE: {
            return state.concat([payload]);
        }
        case POP_SCENE: {
            return state.length > 1 ? dropLast(1, state) : state;
        }
        default: {
            return state;
        }
    }
}
