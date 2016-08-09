import moment from "moment";
import {last} from "ramda";

export default function getRealTimeValue (sensorId, dailyAggregates) {
    const day = moment.utc().format("YYYY-MM-DD");
    const powerValues = dailyAggregates ? dailyAggregates.getIn(
        [`${sensorId}-${day}-reading-maxPower`, "measurementValues"]
    ) : null;
    const power = powerValues ? last(powerValues.split(",")) : 0;
    return parseFloat(power);
}
