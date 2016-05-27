import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Text, View, TouchableOpacity} from "react-native";
import {connect} from "react-redux";

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
                <Text>{"Home page"}</Text>
                <TouchableOpacity onPress={this.onLogout.bind(this)}>
                    <Text>{"LOGOUT"}</Text>
                </TouchableOpacity>
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
