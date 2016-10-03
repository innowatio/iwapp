var BPromise = require("bluebird");
var devip    = require("dev-ip");
var fs       = require("fs");
var R        = require("ramda");

var getIp = function () {
    return R.find(function (ip) {
        return (
            ip.slice(0, 3) === "192" ||
            ip.slice(0, 2) === "10"
        );
    }, devip());
};

function getEnvirnomentVariables () {
    return process.env.TRAVIS_TAG ? {
        READ_BACKEND_ENDPOINT: process.env.READ_BACKEND_ENDPOINT_PRODUCTION,
        WRITE_API_ENDPOINT: process.env.WRITE_API_ENDPOINT_PRODUCTION
    } : {
        READ_BACKEND_ENDPOINT: (
            process.env.READ_BACKEND_ENDPOINT ||
            process.env.READ_BACKEND_ENDPOINT_STAGING ||
            `ws://${getIp()}:3000/websocket`
        ),
        WRITE_API_ENDPOINT: (
            process.env.WRITE_API_ENDPOINT ||
            process.env.WRITE_API_ENDPOINT_STAGING ||
            "https://iwwa-write-api-development.innowatio-aws.com"
        )
    };
}

BPromise.resolve().then(() => {
    const variables = getEnvirnomentVariables();
    var env = Object.keys(variables)
        .map(key => `export const ${key} = "${variables[key]}";`)
        .join("\n");
    fs.writeFileSync("env.js", env, "utf8");
});
