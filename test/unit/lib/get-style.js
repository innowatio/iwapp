import getStyle from "lib/get-style";

describe("`getStyle` function", () => {

    const getByID = sinon.stub().returns({
        height: 100
    });

    before(() => {
        getStyle.__Rewire__("getByID", getByID);
    });

    after(() => {
        getStyle.__ResetDependency__("getByID");
    });

    beforeEach(() => {
        getByID.reset();
    });

    it("calls the `getByID` with the correct argument if is passed a number", () => {
        getStyle(1);
        expect(getByID).to.have.callCount(1);
        expect(getByID).to.have.been.calledWith(1);
    });

    it("returns the correct object [CASE: the argument is a number]", () => {
        const ret = getStyle(1);
        expect(ret).to.be.an("object");
        expect(ret).to.deep.equal({
            height: 100
        });
    });

    it("returns the correct object [CASE: the argument is an object]", () => {
        const style = {
            width: 200
        };
        const ret = getStyle(style);
        expect(ret).to.be.an("object");
        expect(ret).to.deep.equal({
            width: 200
        });
    });

    it("returns the correct object [CASE: the argument is `undefined`]", () => {
        const ret = getStyle();
        expect(ret).to.be.an("object");
        expect(ret).to.deep.equal({});
    });

});
