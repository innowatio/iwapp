import {is} from "ramda";
import ReactNativePropRegistry from "react-native/Libraries/Renderer/src/renderers/native/ReactNativePropRegistry";

export default function getStyle (style = {}) {
    return is(Number, style) ? ReactNativePropRegistry.getByID(style) : style;
}
