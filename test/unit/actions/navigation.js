import {pushNavigator, popNavigator, popToHome} from "actions/navigation";

describe("`navigation` actions", () => {

    describe("`pushNavigator` action", () => {

        it("returns the correct object with `scene` as payload", () => {
            const scene = "home";
            const ret = pushNavigator(scene);
            expect(ret).to.deep.equal({
                type: "PUSH_SCENE",
                payload: scene
            });
        });

        it("throw if isn't passed a string as parameter", () => {
            const scene = {scene: "home"};
            function troublemaker () {
                pushNavigator(scene);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw(`Invalid value ${JSON.stringify(scene, null, 2)} supplied to String`);
        });

    });

    describe("`popToHome` action", () => {

        it("returns an object with type `POP_TO_HOME`", () => {
            const ret = popToHome();
            expect(ret).to.deep.equal({
                type: "POP_TO_HOME"
            });
        });

    });

    describe("`popNavigator` action", () => {

        it("returns an object with type `POP_SCENE`", () => {
            const ret = popNavigator();
            expect(ret).to.deep.equal({
                type: "POP_SCENE"
            });
        });

    });

});
