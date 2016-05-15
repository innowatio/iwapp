import {shallow} from "enzyme";

import {iwwaMobile as iwwaMobileAndroid} from "../index.android.js";
import {iwwaMobile as iwwaMobileIos} from "../index.ios.js";

describe("<iwwaMobile /> [CASE: android]", () => {

    it("should render", () => {
        const wrapper = shallow(<iwwaMobileAndroid />);
        expect(wrapper.length).to.equal(1);
    });

});

describe("<iwwaMobile /> [CASE: ios]", () => {

    it("should render", () => {
        const wrapper = shallow(<iwwaMobileIos />);
        expect(wrapper.length).to.equal(1);
    });

});
