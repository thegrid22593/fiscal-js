"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percent = void 0;
var Percent = (function () {
    function Percent(percent) {
        this.setPercent(percent);
    }
    Percent.prototype.setPercent = function (percent) {
        this.percent = percent;
    };
    Percent.prototype.asString = function () {
        return this.percent.toString() + "%";
    };
    Percent.prototype.asDecimal = function () {
        return this.percent / 100;
    };
    return Percent;
}());
exports.Percent = Percent;
//# sourceMappingURL=index.js.map