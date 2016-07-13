import {isDay, isNight} from "lib/weather-mapper";

describe("`weather-mapper`", () => {
    it("`isDay` return correct result", () => {
        expect(isDay(0)).to.be.equal(false);
        expect(isDay(1)).to.be.equal(false);
        expect(isDay(2)).to.be.equal(false);
        expect(isDay(3)).to.be.equal(false);
        expect(isDay(4)).to.be.equal(false);
        expect(isDay(5)).to.be.equal(false);
        expect(isDay(6)).to.be.equal(true);
        expect(isDay(7)).to.be.equal(true);
        expect(isDay(8)).to.be.equal(true);
        expect(isDay(9)).to.be.equal(true);
        expect(isDay(10)).to.be.equal(true);
        expect(isDay(11)).to.be.equal(true);
        expect(isDay(12)).to.be.equal(true);
        expect(isDay(13)).to.be.equal(true);
        expect(isDay(14)).to.be.equal(true);
        expect(isDay(15)).to.be.equal(true);
        expect(isDay(16)).to.be.equal(true);
        expect(isDay(17)).to.be.equal(true);
        expect(isDay(18)).to.be.equal(false);
        expect(isDay(19)).to.be.equal(false);
        expect(isDay(20)).to.be.equal(false);
        expect(isDay(21)).to.be.equal(false);
        expect(isDay(22)).to.be.equal(false);
        expect(isDay(23)).to.be.equal(false);
        expect(isDay(24)).to.be.equal(false);
    });
    it("`isNight` return correct result", () => {
        expect(isNight(0)).to.be.equal(true);
        expect(isNight(1)).to.be.equal(true);
        expect(isNight(2)).to.be.equal(true);
        expect(isNight(3)).to.be.equal(true);
        expect(isNight(4)).to.be.equal(true);
        expect(isNight(5)).to.be.equal(true);
        expect(isNight(6)).to.be.equal(false);
        expect(isNight(7)).to.be.equal(false);
        expect(isNight(8)).to.be.equal(false);
        expect(isNight(9)).to.be.equal(false);
        expect(isNight(10)).to.be.equal(false);
        expect(isNight(11)).to.be.equal(false);
        expect(isNight(12)).to.be.equal(false);
        expect(isNight(13)).to.be.equal(false);
        expect(isNight(14)).to.be.equal(false);
        expect(isNight(15)).to.be.equal(false);
        expect(isNight(16)).to.be.equal(false);
        expect(isNight(17)).to.be.equal(false);
        expect(isNight(18)).to.be.equal(false);
        expect(isNight(19)).to.be.equal(false);
        expect(isNight(20)).to.be.equal(false);
        expect(isNight(21)).to.be.equal(false);
        expect(isNight(22)).to.be.equal(false);
        expect(isNight(23)).to.be.equal(true);
        expect(isNight(24)).to.be.equal(true);
    });
});