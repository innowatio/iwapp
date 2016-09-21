/**
 * IwappIcons icon set component.
 * Usage: <IwappIcons name="icon-name" size={20} color="#4F8EF7" />
 *
 * This file is created with command:
 *
 * ./node_modules/.bin/generate-icon node_modules/iwapp-icons/css/styles.css --componentName=IwappIcons --fontFamily=iwapp > app/components/iwapp-icons.js
 *
 * After that, you should add the font to assets of android and ios.
 */

import createIconSet from "react-native-vector-icons/lib/create-icon-set";

const glyphMap = {
    "iw-alarm": 97,
    "iw-alarms-tip": 98,
    "iw-alert": 99,
    "iw-badge": 100,
    "iw-broken-clouds": 101,
    "iw-buildings": 102,
    "iw-chart": 103,
    "iw-clear-sky": 105,
    "iw-clouds": 106,
    "iw-cooling": 107,
    "iw-daily": 108,
    "iw-demand-response": 109,
    "iw-demographics": 110,
    "iw-edit": 111,
    "iw-energetic-efficiency": 112,
    "iw-energetic-tip": 113,
    "iw-equipment": 114,
    "iw-few-clouds": 115,
    "iw-gauge": 116,
    "iw-heating": 117,
    "iw-innowatio-logo": 118,
    "iw-lightbulb": 119,
    "iw-lighting": 120,
    "iw-like": 121,
    "iw-lock": 122,
    "iw-logout": 65,
    "iw-menu": 66,
    "iw-mist": 67,
    "iw-monthly": 68,
    "iw-overview": 69,
    "iw-power": 70,
    "iw-rain": 71,
    "iw-recycling": 72,
    "iw-report": 73,
    "iw-scattered-clouds": 74,
    "iw-smart-building": 75,
    "iw-snow": 76,
    "iw-statistics": 77,
    "iw-thunderstorm": 78,
    "iw-upgrade": 79,
    "iw-user": 80,
    "iw-welcome": 81,
    "iw-check": 104,
    "iw-bad": 82,
    "iw-middling": 85,
    "iw-good": 86,
    "iw-reset": 87,
    "iw-night-clear-sky": 88,
    "iw-night-clouds": 89,
    "iw-center": 90,
    "iw-night-few-clouds": 49,
    "iw-search": 83
};

const IwappIcons = createIconSet(glyphMap, "iwapp", "iwapp.ttf");

module.exports = IwappIcons;
module.exports.glyphMap = glyphMap;
