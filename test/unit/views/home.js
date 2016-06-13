import {shallow} from "enzyme";
import {Map, fromJS} from "immutable";
import {Content} from "native-base";
import {Switch} from "react-native";
import Swiper from "react-native-swiper";

import Highcharts from "components/highcharts";
import Home from "views/home";

describe("`Home` view", () => {

    const HomeView = Home.__get__("Home");

    const asteroid = {};
    const collections = fromJS({});
    const home = {
        charts: [{
            sensorId: "sensorId",
            source: "source",
            day: "day",
            measurementType: "measurementType"
        }]
    };
    const toggleForecast = sinon.spy();
    const Dimensions = {
        get: sinon.stub().returns({height: 100})
    };
    const getDailySumConsumption = sinon.stub().returns(1);

    before(() => {
        Home.__Rewire__("Dimensions", Dimensions);
        Home.__Rewire__("getDailySumConsumption", getDailySumConsumption);
        homeView = shallow(
            <HomeView
                asteroid={asteroid}
                collections={collections}
                home={home}
                toggleForecast={toggleForecast}
            />
        );
    });

    var homeView;

    beforeEach(() => {
        toggleForecast.reset();
        Dimensions.get.reset();
    });

    after(() => {
        Home.__ResetDependency__("Dimensions");
        Home.__ResetDependency__("getDailySumConsumption");
    });

    it("renders a `Content` component", () => {
        expect(homeView.find(Content)).to.have.length(1);
    });

    it("renders a `Swiper` component", () => {
        expect(homeView.find(Swiper)).to.have.length(1);
    });

    it("renders a `Swiper` with 3 children", () => {
        expect(homeView.find(Swiper).children()).to.have.length(3);
    });

    it("renders a `Highcharts` component", () => {
        expect(homeView.find(Highcharts)).to.have.length(1);
    });

    it("renders a `Swiper` with `Highcharts` component in the second children", () => {
        const swiper = homeView.find(Swiper);
        const secondSwiperChildren = swiper.children().at(1);
        expect(secondSwiperChildren.find(Highcharts)).to.have.length(1);
    });

    it("renders a `Highcharts` component with correct props [CASE: `readings-daily-aggregates` is defined]", () => {
        const collectionsWithAggregate = fromJS({
            "readings-daily-aggregates": {
                "_id": "sensorId-day-source-measurementType"
            }
        });
        const homeWrp = shallow(
            <HomeView
                asteroid={asteroid}
                collections={collectionsWithAggregate}
                home={home}
                toggleForecast={toggleForecast}
            />
        );
        expect(homeWrp.find(Highcharts).props()).to.deep.equal({
            aggregates: fromJS({"_id": "sensorId-day-source-measurementType"}),
            charts: [{
                sensorId: "sensorId",
                source: "source",
                day: "day",
                measurementType: "measurementType"
            }],
            height: 20
        });
    });

    it("renders a `Highcharts` component with correct props [CASE: `readings-daily-aggregates` is not defined]", () => {
        expect(homeView.find(Highcharts).props()).to.deep.equal({
            aggregates: Map(),
            charts: [{
                sensorId: "sensorId",
                source: "source",
                day: "day",
                measurementType: "measurementType"
            }],
            height: 20
        });
    });

    it("renders a `Switch` component", () => {
        expect(homeView.find(Switch)).to.have.length(1);
    });

    it("renders a `Swiper` with `Switch` component in the second children", () => {
        const swiper = homeView.find(Swiper);
        const secondSwiperChildren = swiper.children().at(1);
        expect(secondSwiperChildren.find(Switch)).to.have.length(1);
    });

    it("renders a `Switch` component with the correct props [CASE: `this.props.home.charts.length !== 2`]", () => {
        expect(homeView.find(Switch).prop("onValueChange")).to.equal(toggleForecast);
        expect(homeView.find(Switch).prop("value")).to.equal(false);
    });

    it("renders a `Switch` component with the correct props [CASE: `this.props.home.charts.length === 2`]", () => {
        const homeWithMultipleCharts = {
            charts: [{
                sensorId: "sensorId",
                source: "source"
            }, {
                sensorId: "sensorId",
                source: "forecast"
            }]
        };
        const homeWrp = shallow(
            <HomeView
                asteroid={asteroid}
                collections={collections}
                home={homeWithMultipleCharts}
                toggleForecast={toggleForecast}
            />
        );
        expect(homeWrp.find(Switch).prop("onValueChange")).to.equal(toggleForecast);
        expect(homeWrp.find(Switch).prop("value")).to.equal(true);
    });

    it("calls `toggleForecast` function `onValueChange` in `Switch` component", () => {
        homeView.find("Switch").simulate("valueChange");
        expect(toggleForecast).to.have.callCount(1);
    });

    describe("`componentDidMount` method", () => {

        const componentDidMount = HomeView.prototype.componentDidMount;

        it("calls asteroid's `subscribe` method to sites collections", () => {
            const subscribe = sinon.spy();
            const props = {
                asteroid: {subscribe}
            };
            const subscribeToMeasure = sinon.spy();
            const instance = {
                props,
                subscribeToMeasure
            };
            componentDidMount.call(instance);
            expect(subscribe).to.have.callCount(1);
            expect(subscribe).to.have.been.calledWithExactly("sites");
        });

        it("calls `subscribeToMeasure` with `props` as arguments", () => {
            const subscribe = sinon.spy();
            const props = {
                asteroid: {subscribe}
            };
            const subscribeToMeasure = sinon.spy();
            const instance = {
                props,
                subscribeToMeasure
            };
            componentDidMount.call(instance);
            expect(subscribeToMeasure).to.have.callCount(1);
            expect(subscribeToMeasure).to.have.been.calledWithExactly(props);
        });

    });

    describe("`componentDidMount` method", () => {

        const componentWillReceiveProps = HomeView.prototype.componentWillReceiveProps;

        it("calls `subscribeToMeasure` with `props` as arguments", () => {
            const subscribe = sinon.spy();
            const nextProps = {
                asteroid: {subscribe}
            };
            const subscribeToMeasure = sinon.spy();
            const instance = {
                subscribeToMeasure
            };
            componentWillReceiveProps.call(instance, nextProps);
            expect(subscribeToMeasure).to.have.callCount(1);
            expect(subscribeToMeasure).to.have.been.calledWithExactly(nextProps);
        });

    });

    describe("`onLogout` function", () => {

        const onLogout = HomeView.prototype.onLogout;

        it("calls `logout`", () => {
            const logout = sinon.spy();
            const instance = {
                props: {
                    asteroid: {logout}
                }
            };
            onLogout.call(instance);
            expect(logout).to.have.callCount(1);
        });

    });

    describe("`subscribeToMeasure` function", () => {

        var clock;
        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

        const subscribeToMeasure = HomeView.prototype.subscribeToMeasure;

        it("calls asteroid's `subscribe` method with correct arguments [CASE: charts array of length 1]", () => {
            const subscribe = sinon.spy();
            const props = {
                asteroid: {
                    subscribe
                },
                home: {
                    charts: [{
                        sensorId: "sensorId",
                        source: "reading",
                        measurementType: "activeEnergy",
                        day: "1970-01-01"
                    }]
                }
            };
            subscribeToMeasure(props);
            expect(subscribe).to.have.callCount(3);
            expect(subscribe.firstCall).to.have.been.calledWithExactly(
                "dailyMeasuresBySensor",
                "sensorId",
                "1970-01-01",
                "1970-01-01",
                "reading",
                "activeEnergy"
            );
            expect(subscribe.secondCall).to.have.been.calledWithExactly(
                "yearlyConsumptions",
                "sensorId",
                "1970",
                "reading",
                "activeEnergy"
            );
        });

        it("calls asteroid's `subscribe` method with correct arguments [CASE: charts array of length 2]", () => {
            const subscribe = sinon.spy();
            const props = {
                asteroid: {
                    subscribe
                },
                home: {
                    charts: [{
                        sensorId: "sensorId",
                        source: "reading",
                        measurementType: "activeEnergy",
                        day: "1970-01-01"
                    }, {
                        sensorId: "sensorId",
                        source: "forecast",
                        measurementType: "activeEnergy",
                        day: "1970-01-01"
                    }]
                }
            };
            subscribeToMeasure(props);
            expect(subscribe).to.have.callCount(4);
            expect(subscribe.firstCall).to.have.been.calledWithExactly(
                "dailyMeasuresBySensor",
                "sensorId",
                "1970-01-01",
                "1970-01-01",
                "reading",
                "activeEnergy"
            );
            expect(subscribe.secondCall).to.have.been.calledWithExactly(
                "dailyMeasuresBySensor",
                "sensorId",
                "1970-01-01",
                "1970-01-01",
                "forecast",
                "activeEnergy"
            );
            expect(subscribe.thirdCall).to.have.been.calledWithExactly(
                "yearlyConsumptions",
                "sensorId",
                "1970",
                "reading",
                "activeEnergy"
            );
            expect(subscribe.lastCall).to.have.been.calledWithExactly(
                "dailyMeasuresBySensor",
                "sensorId",
                "1970-01-01",
                "1970-01-01",
                "reading",
                "maxPower"
            );
        });

    });

});
