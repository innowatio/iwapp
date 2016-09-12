import {shallow} from "enzyme";
import {Provider} from "react-redux";

import Main from "main";
import store from "lib/store";
import scene from "lib/scene";
import asteroid from "lib/asteroid";

describe("`Main` component", () => {

    it("render `Provider`", () => {
        const main = shallow(<Main />);
        expect(main.find(Provider)).to.have.length(1);
    });

    it("render `Provider` with props `store`", () => {
        const main = shallow(<Main />);
        expect(
            main.find(Provider).prop("store")
        ).to.deep.equal(store);
    });

    it("render `Provider` with scene as `children`", () => {
        const main = shallow(<Main />);
        expect(
            main.find(Provider).prop("children")
        ).to.deep.equal(scene);
    });

    describe("`componentDidMount` method", () => {

        const codePush = {
            sync: sinon.spy(),
            InstallMode: {
                ON_NEXT_RESTART: "next_restart",
                IMMEDIATE: "immediate"
            }
        };
        const FCM = {
            requestPermissions: sinon.spy(),
        };
        const syncStoreAndAsteroid = sinon.spy();

        beforeEach(() => {
            Main.__Rewire__("codePush", codePush);
            Main.__Rewire__("FCM", FCM);
            Main.__Rewire__("syncStoreAndAsteroid", syncStoreAndAsteroid);
            FCM.requestPermissions.reset();
            codePush.sync.reset();
        });

        afterEach(() => {
            codePush.sync.reset();
            syncStoreAndAsteroid.reset();
            Main.__ResetDependency__("syncStoreAndAsteroid");
            Main.__ResetDependency__("FCM");
            Main.__ResetDependency__("codePush");
        });

        it("call `codePush.sync` function", () => {
            Main.prototype.componentDidMount();
            expect(codePush.sync).to.have.callCount(1);
            expect(codePush.sync).to.have.been.calledWithExactly({
                installMode: "next_restart",
                mandatoryInstallMode: "immediate",
                minimumBackgroundDuration: 60 * 10
            });
        });

        it("call `syncStoreAndAsteroid` function", () => {
            Main.prototype.componentDidMount();
            expect(syncStoreAndAsteroid).to.have.callCount(1);
            expect(syncStoreAndAsteroid).to.have.calledWith(store, asteroid);
        });

        it("call `requestPermissions` function", () => {
            Main.prototype.componentDidMount();
            expect(FCM.requestPermissions).to.have.callCount(1);
        });

    });

});
