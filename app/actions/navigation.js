import actionTypeValidator from "redux-action-type-validator";
import {String} from "tcomb";

export const PUSH_SCENE = "PUSH_SCENE";
export const POP_SCENE = "POP_SCENE";
export const REPLACE_SCENE = "REPLACE_SCENE";
export const RESET_SCENE = "RESET_SCENE";
export const POP_TO_SCENE = "POP_TO_SCENE";

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
*   replace next view to the current view
*/
const typeofReplaceNavigator = actionTypeValidator(String);
export function replaceNavigator (scene) {
    typeofReplaceNavigator(...arguments);
    return {
        type: REPLACE_SCENE,
        payload: scene
    };
}

/**
*   reset the navigation
*/
export function resetNavigator () {
    return {
        type: RESET_SCENE
    };
}

/**
*   pop to view
*/
const typeofResetNavigator = actionTypeValidator(String);
export function popToNavigator (scene) {
    typeofResetNavigator(...arguments);
    return {
        type: POP_TO_SCENE,
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
