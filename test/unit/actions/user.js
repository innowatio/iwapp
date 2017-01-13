import {onLogin, onLogout, setUserInfo} from "actions/user";

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

    describe("`setUserInfo` function", () => {

        it("returns the correct object", () => {
            const username = "username";
            const name = "name";
            const email = "test@email.com";
            const ret = setUserInfo(username, email, name);
            expect(ret).to.deep.equal({
                type: "SET_USER_INFO",
                payload: {
                    username,
                    name,
                    email
                }
            });
        });

    });


});
