import {shallow} from "enzyme";
import {fromJS, Map} from "immutable";
import {Switch} from "react-native";

import ChartConsumption from "components/chart-consumption";
import Highcharts from "components/highcharts";

describe("`ChartConsumption` component", () => {

    const onToggleSwitch = sinon.spy();
    var chartConsumption;
    var clock;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    beforeEach(() => {
        onToggleSwitch.reset();
        chartConsumption = shallow(
            <ChartConsumption
                charts={charts}
                consumptionAggregates={consumptionAggregates}
                dailyAggregates={dailyAggregates}
                heightSwiper={100}
                onToggleSwitch={onToggleSwitch}
            />
        );
    });

    after(() => {
        clock.restore();
    });

    const dailyAggregates = fromJS({"_id": "sensorId-day-source-measurementType"});
    const consumptionAggregates = fromJS({"_id": "sensorId-year-source-measurementType"});
    const charts = [{
        sensorId: "sensorId",
        source: "source",
        day: "day",
        measurementType: "measurementType"
    }];

    it("renders a `Highcharts` component with correct props", () => {
        expect(chartConsumption.find(Highcharts)).to.have.length(1);
        expect(chartConsumption.find(Highcharts).props()).to.deep.equal({
            aggregates: fromJS({"_id": "sensorId-day-source-measurementType"}),
            charts: [{
                sensorId: "sensorId",
                source: "source",
                day: "day",
                measurementType: "measurementType"
            }],
            height: 46
        });
    });

    it("renders a `Switch` component", () => {
        expect(chartConsumption.find(Switch)).to.have.length(1);
    });

    it("renders a `Switch` component with the correct props [CASE: `this.props.home.charts.length === 2`]", () => {
        const charts = [{
            sensorId: "sensorId",
            source: "source"
        }, {
            sensorId: "sensorId",
            source: "forecast"
        }];
        const chartConsumptionWrp = shallow(
            <ChartConsumption
                charts={charts}
                consumptionAggregates={consumptionAggregates}
                dailyAggregates={dailyAggregates}
                heightSwiper={0}
                onToggleSwitch={onToggleSwitch}
            />
        );
        expect(chartConsumptionWrp.find(Switch).prop("onValueChange")).to.equal(onToggleSwitch);
        expect(chartConsumptionWrp.find(Switch).prop("value")).to.equal(true);
    });

    it("renders a `Switch` component with the correct props [CASE: `this.props.home.charts.length !== 2`]", () => {
        expect(chartConsumption.find(Switch).prop("onValueChange")).to.equal(onToggleSwitch);
        expect(chartConsumption.find(Switch).prop("value")).to.equal(false);
    });

    it("calls `toggleForecast` function `onValueChange` in `Switch` component", () => {
        chartConsumption.find("Switch").simulate("valueChange");
        expect(onToggleSwitch).to.have.callCount(1);
    });

    describe("`getSummaryConsumption` method", () => {

        const getDailySumConsumption = sinon.stub().returns(1);

        before(() => {
            ChartConsumption.__Rewire__("getDailySumConsumption", getDailySumConsumption);
        });

        beforeEach(() => {
            getDailySumConsumption.reset();
        });

        after(() => {
            ChartConsumption.__ResetDependency__("getDailySumConsumption");
        });

        const getSummaryConsumption = ChartConsumption.prototype.getSummaryConsumption;

        it("calls `getDailySumConsumption` with correct arguments", () => {
            const consumptionAggregates = Map();
            const instance = {
                props: {
                    consumptionAggregates,
                    charts: [{
                        sensorId: "sensorId"
                    }]
                }
            };
            getSummaryConsumption.call(instance);
            expect(getDailySumConsumption).to.have.callCount(1);
            expect(getDailySumConsumption).to.have.been.calledWithExactly(
                Map(),
                {
                    sensorId: "sensorId",
                    year: "1970",
                    source: "reading",
                    measurementType: "activeEnergy"
                },
                1
            );
        });

    });

});
