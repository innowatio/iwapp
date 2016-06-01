import {is} from "ramda";
// FIXME: replace when RN 0.26 and react 15
// import StyleSheetRegistry from "react/lib/ReactNativePropRegistry";
import {getByID} from "react-native/Libraries/ReactNative/ReactNativePropRegistry";

export default function getStyle (style) {
    return is(Number, style) ? getByID(style) : style;
}
