import {shallow} from "enzyme";
import {ListItem} from "native-base";
import {View, TouchableOpacity} from "react-native";

import DropDown from "components/drop-down";
import Text from "components/text-lato";

describe("`DropDown` component", () => {

    const optionItems = [{
        key: 1,
        title: "Progetto XYZ"
    }, {
        key: 2,
        title: "Progetto XYZ"
    }, {
        key: 3,
        title: "Progetto XYZ"
    }, {
        key: 4,
        title: "Progetto XYZ"
    }];

    const title = "Progetto XYZ";

    it("renders title", () => {
        const dropDown = shallow(<DropDown optionItems={optionItems} titlePlaceholder={title} />);
        const texts = dropDown.find(Text);
        expect(texts).to.have.length(1);
        expect(texts.get(0).props.children).to.be.equal(title);
    });

    it("renders title placeholder", () => {
        const dropDown = shallow(<DropDown optionItems={optionItems} />);
        const texts = dropDown.find(Text);
        expect(texts).to.have.length(1);
        expect(texts.get(0).props.children).to.be.equal("Select an item");
    });

    it("renders ListItem [CASE 0: hide]", () => {
        const dropDown = shallow(<DropDown optionItems={optionItems} titlePlaceholder={title} />);
        expect(dropDown.find(View)).to.have.length(2);
        expect(dropDown.find(ListItem)).to.have.length(0);
    });

    it("renders ListItem [CASE 1: show]", () => {
        const dropDown = shallow(<DropDown optionItems={optionItems} titlePlaceholder={title} />);
        expect(dropDown.find(View)).to.have.length(2);
        dropDown.find(TouchableOpacity).simulate("press");
        expect(dropDown.find(ListItem)).to.have.length(optionItems.length);
    });
});
