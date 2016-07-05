import {Map} from "immutable";

function getUser (userId, collections) {
    return collections.getIn(["users", userId]) || Map();
}

export function getUsername (userId, collections) {
    return getUser(userId, collections).getIn(["profile", "username"]) || "";
}

export function getEmail (userId, collections) {
    return getUser(userId, collections).getIn(["emails", "0", "address"]) || "";
}
