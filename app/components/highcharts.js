import React, {Component, PropTypes} from "react";
import {Platform, TouchableOpacity, WebView, View, Text, UIManager} from "react-native";
import IPropTypes from "react-immutable-proptypes";
import shallowCompare from "react-addons-shallow-compare";

import readingsDailyAggregatesToHighchartsData from "../lib/readings-daily-aggregates-to-highcharts-data";
import {lineReading, lineForecast} from "../lib/colors";

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
            console.log("UPDATE");
            console.log(this.props.charts);
            console.log(this.refs.highchartsWebview);
            UIManager.dispatchViewManagerCommand(
              this.refs.highchartsWebview.getWebViewHandle(),
              UIManager.RCTWebView.Commands.reload,
              null
            );
        }
    }

    getSeries () {
        const coordinates = readingsDailyAggregatesToHighchartsData(this.props.aggregates, this.props.charts);
        const colors = [lineReading, lineForecast];
        const types = ["column", "area"];
        return coordinates.map((coordinate, index) => ({
            ...coordinate,
            animation: index === 0 ? false : true,
            color: colors[index],
            turboThreshold: 0,
            type: types[index]
        }));
    }

    getChartConfig () {
        return {
            chart: {
                renderTo: "chart",
                animation: false
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
                }
            },
            tooltip: {
                enabled: false
            },
            series: this.getSeries(),
            title: null,
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: null
                }
            }
        };
    }

    getHTML () {
        return (
            `
                <html>
                    <head>
                        <script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
                        <style>
                            #chart {
                                height: ${this.props.height}px;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="chart"></div>
                        <script>
                            new Highcharts.Chart(${JSON.stringify(this.getChartConfig())})
                        </script>
                    </body>
                </html>
            `
        );
    }

    onPress () {
        console.log("press");
        this.forceUpdate();
        // this.refs.highchartsWebview.reload();
    }

    render () {
        const html = this.getHTML();
        return (
            <View>
                <TouchableOpacity onPress={::this.onPress}>
                    <Text>{"Update"}</Text>
                </TouchableOpacity>
                <WebView
                    javaScriptEnabled={true}
                    ref="highchartsWebview"
                    scrollEnabled={false}
                    source={{html}}
                    style={{height: this.props.height}}
                />
            </View>
        );
    }

}
