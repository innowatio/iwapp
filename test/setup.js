import "babel-polyfill";
import fs from "fs";
import path from "path";
import register from "babel-core/register";
import chai from "chai";
import ReactTestUtils from "react-addons-test-utils";
import chaiEnzyme from "chai-enzyme";
import ReactDOM from "react-dom";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromise from "chai-as-promised";
import ws from "ws";
import hook from "node-hook";

// Added test cross platform to handle the
const PLATFORM = process.env.PLATFORM || "android";

function logLoadedFilename (source, filename) {
    return `console.log(${filename});\n + ${source}`;
}
hook.hook(`.${PLATFORM}.js`, logLoadedFilename);

// This function is for fix an issue with `react-native-router-flux`, that import
//a png file without compile it. If require a png file, return null.
function noop () {
    return null;
}
require.extensions[".png"] = noop;
require.extensions[".gif"] = noop;

// Ignore all node_modules except these
const modulesToCompile = [
    "react-native",
    "react-native-router-flux",
    "native-base"
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));

const rcPath = path.join(__dirname, "..", ".babelrc");
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = function (filename) {
    if (!(/\/node_modules\//).test(filename)) {
        return false;
    } else {
        const matches = modulesToCompile.filter((regex) => regex.test(filename));
        const shouldIgnore = matches.length === 0;
        return shouldIgnore;
    }
};

register(config);

// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;
global.sinon = sinon;

chai.use(sinonChai);
chai.use(chaiAsPromise);
chai.use(chaiEnzyme());

// Setup global WebSocket
global.WebSocket = ws;

// Setup mocks
require("react-native-mock/mock");
const React = require("react-native");

// Setup React
global.React = React;
global.ReactDOM = ReactDOM;
global.TestUtils = ReactTestUtils;

React.NavigationExperimental = {
    AnimatedView: React.View,
    Card: React.View
};
