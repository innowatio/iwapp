import React, {Component, PropTypes} from "react";

import Svg, {
    Circle,
    Path
} from "react-native-svg";

export default class CircleProgress extends Component {

    static propTypes = {
        percentage: PropTypes.number,
        size: PropTypes.number,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number
    }

    getArcAngle () {
        const {percentage} = this.props;
        return 2 * Math.PI * percentage;
    }

    getArcRadius () {
        const {size, strokeWidth} = this.props;
        return size * 0.5 - strokeWidth * 0.5;
    }

    getCenterX () {
        const {size} = this.props;
        return size * 0.5;
    }

    getCenterY () {
        const {size} = this.props;
        return size * 0.5;
    }

    getCoordinatesAt (angle) {
        const centerX = this.getCenterX();
        const centerY = this.getCenterY();
        const radius = this.getArcRadius();
        const x = (
            centerX +
            radius * Math.cos(angle - 0.5 * Math.PI)
        );
        const y = (
            centerY +
            radius * Math.sin(angle - 0.5 * Math.PI)
        );
        return `${x},${y}`;
    }

    renderCircle () {
        const {strokeColor, strokeWidth} = this.props;
        return (
            <Circle
                cx={this.getCenterX()}
                cy={this.getCenterY()}
                fill="none"
                r={this.getArcRadius()}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        );
    }

    renderPath () {
        const {percentage, strokeColor, strokeWidth} = this.props;
        const radius = this.getArcRadius();
        const largeArcFlag = (percentage >= 0.5 ? 1 : 0);
        const startingPoint = this.getCoordinatesAt(0);
        const endingPoint = this.getCoordinatesAt(this.getArcAngle());
        return (
            <Path
                d={`
                    M ${startingPoint}
                    A ${radius},${radius} 0 ${largeArcFlag} 1 ${endingPoint}
                `}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        );
    }

    render () {
        const {size, percentage} = this.props;
        return (
            <Svg height={size} width={size}>
                {percentage === 1 ? this.renderCircle() : this.renderPath()}
            </Svg>
        );
    }
}
