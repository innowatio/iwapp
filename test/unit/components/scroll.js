import {shallow} from "enzyme";

import Button from "react-native-button";
import Scroll from "components/scroll";
import FaIcons from "react-native-vector-icons/FontAwesome";

describe("`Scroll` component", () => {

    it("renders if props visible is setted to true", () => {
        const scroll = shallow(
            <Scroll
                visible={true}
            />
        );
        expect(scroll.find(Button)).to.have.length(1);
    });

    it("not renders if props visible is setted to false", () => {
        const scroll = shallow(
            <Scroll
                visible={false}
            />
        );
        expect(scroll.find(Button)).to.have.length(0);
    });

    it("renders correct icon `angle-down`", () => {
        const scroll = shallow(
            <Scroll
                visible={true}
            />
        );
        expect(scroll.find(FaIcons)).to.have.length(1);
        expect(scroll.find(FaIcons).at(0).prop("name")).to.equal("angle-down");
    });

});
