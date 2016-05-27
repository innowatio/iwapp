import {shallow} from "enzyme";

import {iwwaMobile as iwwaMobileAndroid} from "../index.android.js";
import {iwwaMobile as iwwaMobileIos} from "../index.ios.js";

describe("<iwwaMobile /> [CASE: android]", () => {

    it("render the app", () => {
        const iwapp = shallow(<iwwaMobileAndroid />);
        expect(iwapp).to.have.length(1);
    });

});

describe("<iwwaMobile /> [CASE: ios]", () => {

    it("render the app", () => {
        const iwapp = shallow(<iwwaMobileIos />);
        expect(iwapp).to.have.length(1);
    });

});
