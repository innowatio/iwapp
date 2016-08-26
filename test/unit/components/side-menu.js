import {shallow} from "enzyme";
import {Map} from "immutable";

import SideMenu from "components/side-menu";
import DropDown from "components/drop-down";
import Text from "components/text-lato";
import Icon from "components/iwapp-icons";

describe("`SideMenu` component", () => {

    const asteroid = {
        collections: new Map()
    };

    const items = [{
        icon: "overview",
        title: "Overview",
        navigateTo: "home"
    }, {
        icon: "chart",
        title: "Statistiche",
        navigateTo: "stats"
    }, {
        icon: "gauge",
        title: "Il mio smartmeter",
        navigateTo: "home"
    }, {
        icon: "badge",
        title: "Badgeboard",
        navigateTo: "home"
    }, {
        icon: "lightbulb",
        title: "Risparmio energetico",
        navigateTo: "home"
    }, {
        icon: "report",
        title: "Report",
        navigateTo: "home"
    }];

    it("renders SideMenu", () => {
        const dropDown = shallow(<SideMenu asteroid={asteroid} menuItems={items}/>);

        expect(dropDown.find(DropDown)).to.have.length(1);

        expect(dropDown.find(Text)).to.have.length(7);

        expect(dropDown.find(Text).get(0).props.children).to.be.equal("Overview");
        expect(dropDown.find(Icon).get(0).props.name).to.be.equal("iw-overview");

        expect(dropDown.find(Text).get(1).props.children).to.be.equal("Statistiche");
        expect(dropDown.find(Icon).get(1).props.name).to.be.equal("iw-chart");

        expect(dropDown.find(Text).get(2).props.children).to.be.equal("Il mio smartmeter");
        expect(dropDown.find(Icon).get(2).props.name).to.be.equal("iw-gauge");

        expect(dropDown.find(Text).get(3).props.children).to.be.equal("Badgeboard");
        expect(dropDown.find(Icon).get(3).props.name).to.be.equal("iw-badge");

        expect(dropDown.find(Text).get(4).props.children).to.be.equal("Risparmio energetico");
        expect(dropDown.find(Icon).get(4).props.name).to.be.equal("iw-lightbulb");

        expect(dropDown.find(Text).get(5).props.children).to.be.equal("Report");
        expect(dropDown.find(Icon).get(5).props.name).to.be.equal("iw-report");

        expect(dropDown.find(Text).get(6).props.children).to.be.equal("Logout");
        expect(dropDown.find(Icon).get(6).props.name).to.be.equal("iw-logout");
    });

});
