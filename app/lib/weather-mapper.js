import moment from "moment";

export function mapWeatherIcon (iconId) {
    const hours = moment().hours();
    const evening = 17;
    switch (iconId) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
            return "iw-thunderstorm";
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
        case 802:
        case 804:
        case 905:
            return "iw-scattered-clouds";
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
            return "iw-rain";
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
        case 903:
        case 906:
            return "iw-snow";
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 762:
        case 771:
        case 781:
        case 957:
            return "iw-mist";
        case 800:
        case 904:
        case 951:
        case 952:
            return hours < evening ? "iw-clear-sky" : "iw-night-clear-sky";
        case 801:
        case 953:
        case 954:
        case 955:
        case 956:
            return hours < evening ?  "iw-few-clouds" : "iw-night-few-clouds";
        case 803:
        case 900:
        case 901:
        case 902:
        case 960:
        case 961:
        case 962:
            return "iw-broken-clouds";
        default:
            return hours < evening ? "iw-clear-sky" : "iw-night-clear-sky";
    }
}

export function mapWeatherBackground (iconId) {
    switch (iconId) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
            return isEvening() ? require("../assets/img/day_thunderstorm.gif") : require("../assets/img/night_thunderstorm.gif");
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
        case 802:
        case 804:
        case 905:
            return isEvening() ? require("../assets/img/day_scattered-clouds.gif") : require("../assets/img/night_scattered-clouds.gif");
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 511:
        case 520:
        case 521:
        case 522:
        case 531:
            return isEvening() ? require("../assets/img/day_rain.gif") : require("../assets/img/night_rain.gif");
        case 600:
        case 601:
        case 602:
        case 611:
        case 612:
        case 615:
        case 616:
        case 620:
        case 621:
        case 622:
        case 903:
        case 906:
            return isEvening() ? require("../assets/img/day_snow.gif") : require("../assets/img/night_snow.gif");
        case 701:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 761:
        case 762:
        case 771:
        case 781:
        case 957:
            return isEvening() ? require("../assets/img/day_mist.gif") : require("../assets/img/night_mist.gif");
        case 800:
        case 904:
        case 951:
        case 952:
            return isEvening() ? require("../assets/img/day_clear-sky.gif") : require("../assets/img/night_clear-sky.gif");
        case 801:
        case 953:
        case 954:
        case 955:
        case 956:
            return isEvening() ? require("../assets/img/day_few-clouds.gif") : require("../assets/img/night_few-clouds.gif");
        case 803:
        case 900:
        case 901:
        case 902:
        case 960:
        case 961:
        case 962:
            return isEvening() ? require("../assets/img/day_broken-clouds.gif") : require("../assets/img/night_broken-clouds.gif");
        default:
            return isEvening() ? require("../assets/img/day_clear-sky.gif") : require("../assets/img/night_clear-sky.gif");
    }
}

export function isEvening (hours = moment().hours(), threshold = 18) {
    return hours < threshold;
}
