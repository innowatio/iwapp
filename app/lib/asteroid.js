import {createClass} from "asteroid";
import collectionMixin from "asteroid-immutable-collections-mixin";
import storage from "react-native-storage-wrapper";

import {READ_BACKEND_ENDPOINT} from "../../env";

const Asteroid = createClass([collectionMixin]);

const asteroid = new Asteroid({
    endpoint: READ_BACKEND_ENDPOINT,
    storage
});

module.exports = asteroid;
