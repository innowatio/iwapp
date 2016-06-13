import {shallow} from "enzyme";
import {TouchableOpacity} from "react-native";

import Header from "components/header";
import Icon from "components/iwapp-icons";

describe("`Header` component", () => {

    it("renders 4 buttons", () => {
        const header = shallow(<Header />);
        expect(header.find(TouchableOpacity)).to.have.length(4);
    });

    it("renders 4 icons", () => {
        const header = shallow(<Header />);
        expect(header.find(Icon)).to.have.length(4);
    });

    it("renders the correct icons", () => {
        const header = shallow(<Header />);
        expect(header.find(Icon).get(0).props.name).to.equal("iw-menu");
        expect(header.find(Icon).get(1).props.name).to.equal("iw-innowatio-logo");
        expect(header.find(Icon).get(2).props.name).to.equal("iw-alarm");
        expect(header.find(Icon).get(3).props.name).to.equal("iw-user");
    });

});
