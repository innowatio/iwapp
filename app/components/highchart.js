import React, {PropTypes, Component} from "react";
import {WebView} from "react-native";

export default class Highcharts extends Component {

    static propTypes = {
        height: PropTypes.number
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
            series: [{
                data: [37.253, 67.153, 97.562, 117.4, 127.383, 157.404, 117.562, 107.413, 207.296, 157.335, 81, 16],
                type: "column"
            }, {
                data: [41, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4].reverse(),
                type: "area"
            }],
            title: null,
            yAxis: {
                title: {
                    text: null
                }
            }
        };
    }

    getHTML () {
        return `
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
        `;
    }

    render () {
        return (
            <WebView
                javaScriptEnabled={true}
                scalesPageToFit={true}
                source={{
                    html: this.getHTML()
                }}
                style={{
                    height: this.props.height
                }}
            />
        );
    }

}
