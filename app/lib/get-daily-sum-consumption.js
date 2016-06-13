export default function getDailySumConsumption (consumptionAggregate, selection, dayOfYear) {
    if (consumptionAggregate.isEmpty()) {
        return 0;
    }
    const {sensorId, year, source, measurementType} = selection;
    const consumption = consumptionAggregate.get(
        `${sensorId}-${year}-${source}-${measurementType}`
    );
    if (consumption) {
        return parseFloat(consumption.get("measurementValues").split(",")[dayOfYear - 1]) || 0;
    }
    return 0;
}
