import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";

import reducers from "../reducers";

const middlewares = [thunk];

if (process.env.NODE_ENV !== "test") {
    var logger = require("./redux-logger");
    middlewares.push(logger);
}

const store = createStore(
    reducers,
    applyMiddleware(...middlewares),
);

if (module.hot) {
    module.hot.accept(() => {
        const nextRootReducer = require("../reducers/index").default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
