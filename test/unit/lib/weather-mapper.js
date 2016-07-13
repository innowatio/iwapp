import {isDaytime} from "lib/weather-mapper";

describe("`weather-mapper`", () => {
    it("`isEvening` return correct result", () => {
        expect(isDaytime(0)).to.be.equal(false);
        expect(isDaytime(1)).to.be.equal(false);
        expect(isDaytime(2)).to.be.equal(false);
        expect(isDaytime(3)).to.be.equal(false);
        expect(isDaytime(4)).to.be.equal(false);
        expect(isDaytime(5)).to.be.equal(false);
        expect(isDaytime(6)).to.be.equal(true);
        expect(isDaytime(7)).to.be.equal(true);
        expect(isDaytime(8)).to.be.equal(true);
        expect(isDaytime(9)).to.be.equal(true);
        expect(isDaytime(10)).to.be.equal(true);
        expect(isDaytime(11)).to.be.equal(true);
        expect(isDaytime(12)).to.be.equal(true);
        expect(isDaytime(13)).to.be.equal(true);
        expect(isDaytime(14)).to.be.equal(true);
        expect(isDaytime(15)).to.be.equal(true);
        expect(isDaytime(16)).to.be.equal(true);
        expect(isDaytime(17)).to.be.equal(true);
        expect(isDaytime(18)).to.be.equal(false);
        expect(isDaytime(19)).to.be.equal(false);
        expect(isDaytime(20)).to.be.equal(false);
        expect(isDaytime(21)).to.be.equal(false);
        expect(isDaytime(22)).to.be.equal(false);
        expect(isDaytime(23)).to.be.equal(false);
        expect(isDaytime(24)).to.be.equal(false);
    });
});