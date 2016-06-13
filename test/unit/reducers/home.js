import moment from "moment";
import home from "reducers/home";

describe("`home` reducers", () => {

    it("has a `defaultChartState`", () => {
        const defaultChartState = home.__get__("defaultChartState");
        expect(defaultChartState).to.deep.equal([{
            day: moment.utc().format("YYYY-MM-DD"),
            sensorId: "SitoDiTest1",
            source: "reading",
            measurementType: "activeEnergy"
        }]);
    });

    describe("`charts` reducer", () => {

        const chartReducer = home.__get__("charts");

        const stateCollections = Object.freeze([{
            sensorId: "sensorId",
            source: "reading"
        }]);

        describe("`TOGGLE_FORECAST` type", () => {

            it("returns the new array of chart state with multiple sources [CASE: payload is `true`]", () => {
                const valuePassedFromAction = {
                    type: "TOGGLE_FORECAST",
                    payload: true
                };
                const ret = chartReducer(stateCollections, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    sensorId: "sensorId",
                    source: "reading"
                }, {
                    sensorId: "sensorId",
                    source: "forecast"
                }]);
            });

            it("returns the new array with single source [CASE: payload `false`, single state]", () => {
                const valuePassedFromAction = {
                    type: "TOGGLE_FORECAST",
                    payload: false
                };
                const ret = chartReducer(stateCollections, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    sensorId: "sensorId",
                    source: "reading"
                }]);
            });

            it("returns the new array with single source [CASE: payload is `false`, multiple state]", () => {
                const valuePassedFromAction = {
                    type: "TOGGLE_FORECAST",
                    payload: false
                };
                const multipleState = [{
                    sensorId: "sensorId",
                    source: "reading"
                }, {
                    sensorId: "sensorId",
                    source: "forecast"
                }];
                const ret = chartReducer(multipleState, valuePassedFromAction);
                expect(ret).to.deep.equal([{
                    sensorId: "sensorId",
                    source: "reading"
                }]);
            });

            it("returns the previous state if any correct `type` is checked", () => {
                const valuePassedFromAction = {
                    type: "NOT_A_CORRECT_TYPE_CASE"
                };
                const ret = chartReducer(stateCollections, valuePassedFromAction);
                expect(ret).to.deep.equal(stateCollections);
            });

        });


    });

});
