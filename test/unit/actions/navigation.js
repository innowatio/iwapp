import {
    pushNavigator,
    popNavigator,
    popToNavigator,
    replaceNavigator,
    resetNavigator
} from "actions/navigation";

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

    describe("`replaceNavigator` action", () => {

        it("returns the correct object with `scene` as payload", () => {
            const scene = "home";
            const ret = replaceNavigator(scene);
            expect(ret).to.deep.equal({
                type: "REPLACE_SCENE",
                payload: scene
            });
        });

        it("throw if isn't passed a string as parameter", () => {
            const scene = {key: "home"};
            function troublemaker () {
                replaceNavigator(scene);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw(`Invalid value ${JSON.stringify(scene, null, 2)} supplied to String`);
        });

    });

    describe("`resetNavigator` action", () => {

        it("returns an object with type `RESET_SCENE`", () => {
            const ret = resetNavigator();
            expect(ret).to.deep.equal({
                type: "RESET_SCENE"
            });
        });

    });

    describe("`popToNavigator` action", () => {

        it("returns the correct object with `scene` as payload", () => {
            const scene = "home";
            const ret = popToNavigator(scene);
            expect(ret).to.deep.equal({
                type: "POP_TO_SCENE",
                payload: scene
            });
        });

        it("throw if isn't passed a string as parameter", () => {
            const scene = {key: "home"};
            function troublemaker () {
                popToNavigator(scene);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw(`Invalid value ${JSON.stringify(scene, null, 2)} supplied to String`);
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
