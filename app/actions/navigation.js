import actionTypeValidator from "redux-action-type-validator";
import {String} from "tcomb";

export const PUSH_SCENE = "PUSH_SCENE";
export const POP_SCENE = "POP_SCENE";

/**
*   action push on navigator.
*   @param {scene} - scene name
*/
const typeofPushNavigator = actionTypeValidator(String);
export function pushNavigator (scene) {
    typeofPushNavigator(...arguments);
    return {
        type: PUSH_SCENE,
        payload: scene
    };
}

/**
*   action pop on navigator.
*/
export function popNavigator () {
    return {
        type: POP_SCENE
    };
}
