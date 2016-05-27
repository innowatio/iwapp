import debounce from "lodash.debounce";
import {Map} from "immutable";
import {partial} from "ramda";

import {changeCollections} from "../actions/collections";

function dispatchChangeCollections (store, collections) {
    store.dispatch(changeCollections(collections));
}


export function syncStoreAndAsteroid (store, asteroid) {
    asteroid.on(
        "collections:change",
        debounce(
            partial(dispatchChangeCollections, [store, asteroid.collections]),
            150
        )
    );
    asteroid.off(
        "collections:change",
        debounce(
            partial(dispatchChangeCollections, [store, Map()]),
            150
        )
    );
}
