import React, {Component, PropTypes} from "react";
import {Dimensions, Platform, StyleSheet, WebView} from "react-native";
import IPropTypes from "react-immutable-proptypes";
import shallowCompare from "react-addons-shallow-compare";

import readingsDailyAggregatesToHighchartsData from "../lib/readings-daily-aggregates-to-highcharts-data";
import {lineForecast, lineReading, lineStandby} from "../lib/colors";

const styles = StyleSheet.create({
    webView: {
        marginBottom: -5,
        marginRight: -5
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
            type: (coordinates.length > 1) && index === (coordinates.length - 1) ? "line" : types[index],
            marker: {
                enabled: true,
                radius: 2
            }
        }));
    }

    getChartConfig () {
        const {categories} = this.getSeries()[0];
        // const {width} = Dimensions.get("window");
        const endOnTick =  (categories ? categories.length>24 :false); //only for month chart;
        return {
            chart: {
                renderTo: "chart",
                animation: true,
                marginRight: 10,
                marginLeft: 38
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
                endOnTick: endOnTick, // only for month chart
                categories: categories
            },
            yAxis: {
                endOnTick: false,
                gridLineWidth: 0,
                title: {
                    align: "high",
                    text: "kWh",
                    margin: 0,
                    x: 25,
                    y: 0,
                    rotation: 360

                }
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
