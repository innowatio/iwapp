import React, {Component} from "react";
import {Dimensions, View} from "react-native";
import {connect} from "react-redux";
import {Content} from "native-base";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

class Stats extends Component {

    render () {
        const {height} = Dimensions.get("window");
        return (
            <Content style={{backgroundColor: colors.background}}>
                <View style={{height: height}}>
                    <Text>
                        {"Stats page"}
                    </Text>
                </View>
            </Content>
        );
    }
}

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Stats);
