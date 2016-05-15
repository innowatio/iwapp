import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger"
;
import reducers from "../reducers";

const logger = createLogger({collapsed: true});

const store = createStore(
    reducers,
    applyMiddleware(thunk, logger),
);

if (module.hot) {
    module.hot.accept(() => {
        const nextRootReducer = require("../reducers/index").default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
