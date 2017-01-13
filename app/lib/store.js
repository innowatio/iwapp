import {AsyncStorage} from "react-native";
import {createStore, applyMiddleware} from "redux";
import {persistStore, autoRehydrate} from "redux-persist";
import thunk from "redux-thunk";

import reducers from "../reducers";

const middlewares = [thunk];

// if (process.env.NODE_ENV !== "test" && __DEV__) {
//     var logger = require("./redux-logger");
//     middlewares.push(logger);
// }

const store = createStore(
    reducers,
    applyMiddleware(...middlewares),
    autoRehydrate()
);

if (module.hot) {
    module.hot.accept(() => {
        const nextRootReducer = require("../reducers/index").default;
        store.replaceReducer(nextRootReducer);
    });
}

persistStore(store, {storage: AsyncStorage, whitelist: ["site", "user"], keyPrefix: "iwapp"});

export default store;
