import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {View, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {Content} from "native-base";

import Text from "../components/text-lato";

class Home extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    render () {
        return (
            <View>
                <Content>
                    <Text>{"Home page"}</Text>
                    <TouchableOpacity onPress={this.onLogout.bind(this)}>
                        <Text>{"logout"}</Text>
                    </TouchableOpacity>
                </Content>
            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Home);
