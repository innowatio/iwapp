import {Iterable} from "immutable";
import createLogger from "redux-logger";

function immutableTransformer (object) {
    var newObject = {};
    for (var i of Object.keys(object)) {
        if (Iterable.isIterable(object[i])) {
            newObject[i] = object[i].toJS();
        } else {
            newObject[i] = object[i];
        }
    }
    return newObject;
}

module.exports = createLogger({
    actionTransformer: immutableTransformer,
    collapsed: true,
    stateTransformer: immutableTransformer
});
