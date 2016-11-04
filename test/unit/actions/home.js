import {toggleForecast} from "actions/home";

describe("`home` action", () => {

    describe("`toggleForecast` action", () => {

        it("returns the correct object", () => {
            const ret = toggleForecast(true);
            expect(ret).to.deep.equal({
                type: "TOGGLE_FORECAST",
                payload: true
            });
        });

        it("throw if isn't passed a boolean as parameter", () => {
            const toggle = "not_a_boolean";
            function troublemaker () {
                toggleForecast(toggle);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw(`Invalid value ${JSON.stringify(toggle, null, 2)} supplied to Boolean`);
        });
    });
});
