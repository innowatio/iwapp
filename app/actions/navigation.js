export const PUSH = "PUSH_SCENE";
export const POP = "POP_SCENE";

export function pushNavigator (scene) {
    return {
        type: PUSH,
        payload: scene
    };
}

export function popNavigator () {
    return {
        type: POP
    };
}
