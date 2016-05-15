import {createClass} from "asteroid";
import collectionMixin from "asteroid-immutable-collections-mixin";

import reactMixin from "./asteroid-react";
import {READ_BACKEND_ENDPOINT} from "../../env";

const Asteroid = createClass([reactMixin, collectionMixin]);

const asteroid = new Asteroid({
    endpoint: READ_BACKEND_ENDPOINT
});

// Decommment for debugging
// window.asteroid = asteroid;
// asteroid.ddp.socket.on("message:in", (msg) => {
//     console.log("Message IN");
//     console.log(msg);
// });
// asteroid.ddp.socket.on("message:out", (msg) => {
//     console.log("Message OUT");
//     console.log(msg);
// });

module.exports = asteroid;
