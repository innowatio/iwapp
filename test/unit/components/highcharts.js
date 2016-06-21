import {shallow} from "enzyme";
import {fromJS} from "immutable";
import {WebView} from "react-native";

import Highcharts from "components/highcharts";

describe("`Highcharts` component", () => {

    const aggregates = fromJS({});
    const height = 100;
    const charts = [{
        sensorId: "sensorId",
        day: "1970-01-01",
        measurementType: "activeEnergy",
        source: "reading"
    }];

    it("renders a `WebView` component", () => {
        const header = shallow(
            <Highcharts
                aggregates={aggregates}
                charts={charts}
                height={height}
            />
        );
        expect(header.find(WebView)).to.have.length(1);
    });

    it("renders a `WebView` component with correct props", () => {
        const getHTML = sinon.stub().returns("html");
        Highcharts.prototype.getHTML = getHTML;
        const header = shallow(
            <Highcharts
                aggregates={aggregates}
                charts={charts}
                height={height}
            />
        );
        expect(header.find(WebView).prop("scrollEnabled")).to.deep.equal(false);
        expect(header.find(WebView).prop("source")).to.deep.equal({html: "html"});
    });

    describe("`getHTML` function", () => {

        const getHTML = Highcharts.prototype.getHTML;

        it("returns the HTML", () => {
            const config = {};
            const instance = {
                props: {
                    height: 1
                },
                getChartConfig: sinon.stub().returns(config)
            };
            const ret = getHTML.call(instance);
            expect(ret).to.equal(`
                <html>
                    <head>
                        <script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
                        <style>
                            #chart {
                                height: 1px;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="chart"></div>
                        <script>
                            Highcharts.setOptions({global: {useUTC: false}});
                            new Highcharts.Chart(${JSON.stringify(config)})
                        </script>
                    </body>
                </html>
            `);
        });

    });

    describe("`componentDidUpdate` function", () => {

        const componentDidUpdate = Highcharts.prototype.componentDidUpdate;

        const Platform = {};

        before(() => {
            Highcharts.__Rewire__("Platform", Platform);
        });

        after(() => {
            Highcharts.__ResetDependency__("Platform");
        });

        it("calls the `reload` method of the `WebView` [CASE: OS `android`]", () => {
            Platform.OS = "android";
            const reload = sinon.spy();
            const instance = {
                refs: {
                    highchartsWebview: {
                        reload
                    }
                }
            };
            componentDidUpdate.call(instance);
            expect(reload).to.have.callCount(1);
        });

        it("calls the `reload` method of the `WebView` [CASE: OS `ios`]", () => {
            Platform.OS = "ios";
            const reload = sinon.spy();
            const instance = {
                refs: {
                    highchartsWebview: {
                        reload
                    }
                }
            };
            componentDidUpdate.call(instance);
            expect(reload).to.have.callCount(0);
        });

    });

});
