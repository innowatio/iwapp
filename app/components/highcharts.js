import React, {Component, PropTypes} from "react";
import {Dimensions, Platform, StyleSheet, WebView} from "react-native";
import IPropTypes from "react-immutable-proptypes";
import shallowCompare from "react-addons-shallow-compare";

import readingsDailyAggregatesToHighchartsData from "../lib/readings-daily-aggregates-to-highcharts-data";
import {lineForecast, lineReading, lineStandby} from "../lib/colors";

const styles = StyleSheet.create({
    webView: {
        marginBottom: -10
    }
});

export default class Highcharts extends Component {

    static propTypes = {
        aggregates: IPropTypes.map.isRequired,
        charts: PropTypes.arrayOf(PropTypes.shape({
            sensorId: PropTypes.string,
            source: PropTypes.string,
            measurementType: PropTypes.string,
            day: PropTypes.string
        }).isRequired).isRequired,
        height: PropTypes.number.isRequired
    }

    constructor (props) {
        super(props);
        this.state = {
            html: this.getHTML()
        };
    }

    shouldComponentUpdate (nextProps) {
        return shallowCompare(this, nextProps);
    }

    componentDidUpdate () {
        if (Platform.OS === "android") {
            this.refs.highchartsWebview.reload();
        }
    }

    getSeries () {
        const coordinates = readingsDailyAggregatesToHighchartsData(this.props.aggregates, this.props.charts);
        const colors = [lineReading, lineForecast];
        const types = ["column", "area", "area"];
        return coordinates.map((coordinate, index) => ({
            ...coordinate,
            animation: index === 0 ? false : true,
            color: (coordinates.length > 1) && index === (coordinates.length - 1) ? lineStandby : colors[index],
            turboThreshold: 0,
            type: types[index]
        }));
    }

    getChartConfig () {
        return {
            chart: {
                renderTo: "chart",
                animation: true,
                marginRight: 40
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                },
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: 0.1
                }
            },
            series: this.getSeries(),
            title: null,
            xAxis: {
                minorGridLineWidth: 0,
                categories: []
                // min: moment.utc(this.props.charts[0].day).startOf("day").valueOf(),
                // max: moment.utc(this.props.charts[0].day).endOf("day").valueOf()
            },
            yAxis: {
                endOnTick: false,
                gridLineWidth: 0,
                labels: {
                    format: "{value}"
                },
                title: {text: null}
            }
        };
    }

    getHTML () {
        return (`
            <html>
                <head>
                    <script type="text/javascript" src="https://code.highcharts.com/highcharts.js"></script>
                    <style>
                        #chart {
                            height: ${this.props.height - 15}px;
                        }
                    </style>
                </head>
                <body>
                    <div id="chart"></div>
                    <script>
                        Highcharts.setOptions({global: {useUTC: false}});
                        new Highcharts.Chart(${JSON.stringify(this.getChartConfig())})
                    </script>
                </body>
            </html>`
        );
    }

    render () {
        const html = this.getHTML();
        const {width} = Dimensions.get("window");
        return (
            <WebView
                javaScriptEnabled={true}
                ref="highchartsWebview"
                scrollEnabled={false}
                source={{html}}
                style={[styles.webView, {height: this.props.height, width}]}
            />
        );
    }

}
