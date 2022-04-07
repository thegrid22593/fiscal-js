"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var percent_1 = require("./percent");
var currency_1 = require("./currency");
var Fiscal = (function () {
    function Fiscal(options) {
        if (options === void 0) { options = {
            currency: {
                languageCode: "en-US",
                currencyCode: "USD"
            }
        }; }
        this.options = options;
    }
    Fiscal.prototype.getDiscountedCashFlowRate = function (rate, year) {
        return Math.pow((1 + rate), year);
    };
    Fiscal.prototype.presentValue = function (terminalValue, rate, numberOfYears) {
        var percentRate = new percent_1.Percent(rate).asDecimal();
        var pv = terminalValue / Math.pow(1 + percentRate, numberOfYears);
        return new currency_1.Currency(Math.round(pv * 100) / 100, this.options.currency);
    };
    Fiscal.prototype.futureValue = function (initialInvestment, rate, numberOfYears) {
        var percentRate = new percent_1.Percent(rate).asDecimal();
        var futureValue = initialInvestment * this.getDiscountedCashFlowRate(percentRate, numberOfYears);
        return new currency_1.Currency(Math.round(futureValue * 100) / 100, this.options.currency);
    };
    Fiscal.prototype.netPresentValue = function (principal, rate, cashFlows) {
        var percentRate = new percent_1.Percent(rate).asDecimal();
        var netPresentValue = principal;
        for (var i = 0; i < cashFlows.length; i++) {
            netPresentValue += (cashFlows[i] / this.getDiscountedCashFlowRate(percentRate, i));
        }
        return new currency_1.Currency(Math.round(netPresentValue * 100) / 100, this.options.currency);
    };
    Fiscal.prototype.compoundInterest = function (principal, rate, numberOfYears) {
        var percentRate = rate / 100;
        var rateTimesYearSum = Math.pow(1 + percentRate, numberOfYears);
        return new currency_1.Currency(principal * rateTimesYearSum, this.options.currency);
    };
    Fiscal.prototype.simpleInterest = function (principal, rate, numberOfYears) {
        var percentRate = rate / 100;
        var finalAmount = principal * (1 + (percentRate * numberOfYears));
        return new currency_1.Currency(finalAmount, this.options.currency);
    };
    Fiscal.prototype.internalRateOfReturn = function (principal, cashFlows) {
        var numberOfCalcs = 1;
        if (principal > 0) {
            principal = -Math.abs(principal);
        }
        function npv(rate) {
            numberOfCalcs++;
            if (numberOfCalcs > 1000) {
                throw new Error('Can\'t find a result');
            }
            var percentRate = (1 + new percent_1.Percent(rate).asDecimal());
            var npv = principal;
            for (var i = 0; i < cashFlows.length; i++) {
                npv += (cashFlows[i] / Math.pow(percentRate, i + 1));
            }
            return npv;
        }
        function findZeroNPV(fn) {
            var x = 1;
            while (fn(x) > 0) {
                x += 1;
            }
            while (fn(x) < 0) {
                x -= 0.01;
            }
            return x + 0.01;
        }
        var rate = Math.round(findZeroNPV(npv) * 100) / 100;
        return new percent_1.Percent(rate);
    };
    Fiscal.prototype.discountedCashFlow = function (principal, cashFlows, rate) {
        var percentRate = new percent_1.Percent(rate).asDecimal();
        var discountedCashFlows = cashFlows.reduce(function (partialSum, cashFlow, index) {
            var year = index + 1;
            return partialSum + (cashFlow / Math.pow(1 + percentRate, year));
        }, 0);
        var terminalValue = discountedCashFlows + principal;
        return new currency_1.Currency(terminalValue, this.options.currency);
    };
    Fiscal.prototype.returnOnInvestment = function (initialInvestment, earnings) {
        var roi = (earnings - Math.abs(initialInvestment)) / Math.abs(initialInvestment) * 100;
        return new percent_1.Percent(Math.round(roi * 100) / 100);
    };
    Fiscal.prototype.compoundedAnnualGrowthRate = function (initialInvestment, terminalValue, numberOfYears) {
        var CAGR = Math.pow((terminalValue / initialInvestment), 1 / numberOfYears) - 1;
        return new percent_1.Percent(Math.round(CAGR * 100));
    };
    Fiscal.prototype.paybackIntervals = function (amountDue, intervalPaymentAmount) {
        return Math.ceil(amountDue / intervalPaymentAmount);
    };
    Fiscal.prototype.amortization = function (principal, rate, totalNumberOfPayments, intervalInMonths, includeInitialPayment) {
        if (intervalInMonths === void 0) { intervalInMonths = false; }
        if (includeInitialPayment === void 0) { includeInitialPayment = false; }
        var periodicInterestRate = new percent_1.Percent(rate / 12).asDecimal();
        if (!intervalInMonths) {
            totalNumberOfPayments = totalNumberOfPayments * 12;
        }
        if (includeInitialPayment) {
            --totalNumberOfPayments;
        }
        var numerator = periodicInterestRate * Math.pow((1 + periodicInterestRate), totalNumberOfPayments);
        var denominator = Math.pow((1 + periodicInterestRate), totalNumberOfPayments) - 1;
        var monthlyPayment = principal * (numerator / denominator);
        return new currency_1.Currency(Math.round(monthlyPayment * 100) / 100, this.options.currency);
    };
    Fiscal.prototype.leverageRatio = function (liabilities, debts, totalIncome) {
        var totalLiabilitiesAndDebt = liabilities + debts;
        return Math.round((totalLiabilitiesAndDebt / totalIncome) * 100) / 100;
    };
    Fiscal.prototype.getSalaryPerYear = function (hourlyRate, taxRate) {
        if (taxRate === void 0) { taxRate = 0; }
        var weeksInYear = 52;
        var workingHoursPerWeek = 40;
        var yearlySalary = (hourlyRate * workingHoursPerWeek) * weeksInYear;
        var taxes = yearlySalary * new percent_1.Percent(taxRate).asDecimal();
        return yearlySalary - taxes;
    };
    Fiscal.prototype.returnAdjustedForInflation = function (inflationRate, returnOnInvestment) {
        var a = 1 + returnOnInvestment / 100;
        var b = 1 + inflationRate / 100;
        var IAR = 100 * ((a / b) - 1);
        return IAR.toFixed(2) + "%";
    };
    Fiscal.prototype.weightedAverageCostOfCapital = function (marketValueOfEquity, marketValueOfDebt, costOfEquity, costOfDebt, corporateTaxRate) {
        var E = marketValueOfEquity;
        var D = marketValueOfDebt;
        var V = E + D;
        var Re = costOfEquity;
        var Rd = costOfDebt;
        var Tc = corporateTaxRate;
        var WACC = ((E / V) * Re / 100) + (((D / V) * Rd / 100) * (1 - Tc / 100));
        return new percent_1.Percent(Math.round(WACC * 1000) / 10);
    };
    ;
    Fiscal.prototype.discountFactor = function (rate, numberOfIntervals) {
        var R = new percent_1.Percent(rate).asDecimal();
        var T = numberOfIntervals;
        var DF = (1 / Math.pow(1 + R, T));
        return new percent_1.Percent(Math.round(DF * 100));
    };
    Fiscal.prototype.capitalAssetPricingModel = function (riskFreeRate, expectedMarketReturn, beta) {
        var ERm = new percent_1.Percent(expectedMarketReturn).asDecimal();
        var Rf = new percent_1.Percent(riskFreeRate).asDecimal();
        var Bi = beta;
        var CAER = Rf + (Bi * (ERm - Rf));
        return new percent_1.Percent(Math.round(CAER * 100));
    };
    Fiscal.prototype.profitabilityIndex = function (principal, rate, cashFlows) {
        var percentRate = new percent_1.Percent(rate).asDecimal();
        var presentValueOfFutureCashFlows = 0;
        for (var i = 0; i < cashFlows.length; i++) {
            presentValueOfFutureCashFlows += cashFlows[0] * Math.pow(1 + percentRate, -(i + 1));
        }
        var PI = Math.round(100 * (presentValueOfFutureCashFlows / principal)) / 100;
        return PI;
    };
    Fiscal.prototype.ruleOf72 = function (rate) {
        return 72 / rate;
    };
    return Fiscal;
}());
exports.default = Fiscal;
//# sourceMappingURL=Fiscal.js.map