import {is} from "ramda";
import {getByID} from "react/lib/ReactNativePropRegistry";

export default function getStyle (style = {}) {
    return is(Number, style) ? getByID(style) : style;
}
