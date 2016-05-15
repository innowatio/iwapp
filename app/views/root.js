import React, {Component, PropTypes} from "react";
import {StyleSheet, View} from "react-native";
import {connect} from "react-redux";
import {equals, last, identity} from "ramda";

import {DefaultRenderer} from "react-native-router-flux";
import {popNavigator} from "../actions/navigation";
import store from "../lib/store";

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

class Root extends Component {

    static propTypes = {
        navigationScene: PropTypes.arrayOf(PropTypes.string),
        navigationState: PropTypes.shape({
            children: PropTypes.array.isRequired
        }).isRequired
    }

    getNavigationChildrenIndex () {
        const currentScene = last(this.props.navigationScene);
        const scenes = this.props.navigationState.children;
        return scenes.findIndex(scene => equals(scene.sceneKey, currentScene));
    }

    onPop () {
        store.dispatch(popNavigator());
    }

    render () {
        const sceneIndex = this.getNavigationChildrenIndex();
        // FIXME: onNavigate when RN 0.26
        return (
            <View style={style.container}>
                <DefaultRenderer
                    navigationState={this.props.navigationState.children[sceneIndex]}
                    onNavigate={identity()}
                />
            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        navigationScene: state.navigation
    };
}
export default connect(mapStateToProps)(Root);
