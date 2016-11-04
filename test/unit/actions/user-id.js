import {onLogin, onLogout} from "actions/user-id";

describe("`userId` actions", () => {

    describe("`onLogin` function", () => {

        it("returns the correct object with the `userId` as payload", () => {
            const userId = "user";
            const ret = onLogin(userId);
            expect(ret).to.deep.equal({
                type: "ON_LOGIN",
                payload: userId
            });
        });

        it("throw if isn't passed a string as parameter", () => {
            const userId = {userId: "user"};
            function troublemaker () {
                onLogin(userId);
            }
            expect(troublemaker).to.throw(Error);
            expect(troublemaker).to.throw(`Invalid value ${JSON.stringify(userId, null, 2)} supplied to String`);
        });

    });

    describe("`onLogout` function", () => {

        it("returns an object with type `ON_LOGOUT`", () => {
            const ret = onLogout();
            expect(ret).to.deep.equal({
                type: "ON_LOGOUT"
            });
        });

    });

});
