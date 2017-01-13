import user from "reducers/user";

describe("`user` reducers", () => {

    const stateCollections = Object.freeze({});

    describe("`ON_LOGIN` type", () => {

        it("returns the `userId`", () => {
            const valuePassedFromAction = {
                type: "ON_LOGIN",
                payload: "userId"
            };
            const ret = user(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal({
                userId: "userId"
            });
        });

    });

    describe("`ON_LOGOUT` type", () => {

        const newState = Object.freeze({userId: "userId"});

        it("removes the `userId` and returns `null`", () => {
            const valuePassedFromAction = {
                type: "ON_LOGOUT"
            };
            const ret = user(newState, valuePassedFromAction);
            expect(ret).to.deep.equal({});
        });

    });

    describe("`SET_USER_INFO` type", () => {

        it("set user info with `userId` specified", () => {
            const newState = Object.freeze({userId: "userId"});
            const valuePassedFromAction = {
                type: "SET_USER_INFO",
                payload: {
                    email: "test@email.com",
                    username: "username",
                    name: "name"
                }
            };
            const ret = user(newState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                userId: "userId",
                email: "test@email.com",
                username: "username",
                name: "name"
            });
        });

        it("set user info without `userId` specified", () => {
            const newState = Object.freeze({});
            const valuePassedFromAction = {
                type: "SET_USER_INFO",
                payload: {
                    email: "test@email.com",
                    username: "username",
                    name: "name"
                }
            };
            const ret = user(newState, valuePassedFromAction);
            expect(ret).to.deep.equal({
                email: "test@email.com",
                username: "username",
                name: "name"
            });
        });

    });

    it("returns the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = user(stateCollections, valuePassedFromAction);
        expect(ret).to.deep.equal(stateCollections);
    });

});
