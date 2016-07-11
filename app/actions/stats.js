export const SELECT_PERIOD = "SELECT_PERIOD";

export function selectPeriod (period) {
    return {
        type: SELECT_PERIOD,
        payload: period
    };
}