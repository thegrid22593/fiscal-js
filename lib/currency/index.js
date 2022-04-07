"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
var Currency = (function () {
    function Currency(currency, options) {
        if (options === void 0) { options = {
            languageCode: "en-US",
            currencyCode: "USD"
        }; }
        this.currency = currency;
        this.options = options;
    }
    Currency.prototype.asFormattedString = function (currencyCode, languageCode) {
        if (currencyCode === void 0) { currencyCode = this.options.currencyCode; }
        if (languageCode === void 0) { languageCode = this.options.languageCode; }
        return new Intl.NumberFormat(languageCode, { style: 'currency', currency: currencyCode }).format(this.currency);
    };
    Currency.prototype.asNumber = function () {
        return this.currency;
    };
    Currency.prototype.asString = function () {
        return this.currency.toFixed(2);
    };
    return Currency;
}());
exports.Currency = Currency;
//# sourceMappingURL=index.js.map