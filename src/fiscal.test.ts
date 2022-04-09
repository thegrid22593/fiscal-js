import {Currency} from "./currency";

import Fiscal from "./Fiscal";

const fiscal = new Fiscal();

describe('Fiscal Options', () => {

    test('Setting options in the fiscal constructor pipes down to currency', () => {

        let optionsFiscal = new Fiscal({
            format: {
                languageCode: "de-DE",
                currencyCode: "EUR"
            }
        });

        let formattedCurrency = optionsFiscal.compoundInterest(92000, 7.5, 31).asFormattedString();
        expect(formattedCurrency).toBe("865.865,07 €");

    });

    test('With options set in the fiscal constructor, users can still override the settings from the method', () => {

        let optionsFiscal = new Fiscal({
            format: {
                languageCode: "de-DE",
                currencyCode: "EUR"
            }
        });

        let formattedCurrency = optionsFiscal.compoundInterest(92000, 7.5, 31).asFormattedString("USD", "en-US");
        expect(formattedCurrency).toBe("$865,865.07");

    });

});

describe('DCF: Discounted Cash Flow', () => {

    test('Calculating the discounted cash flows should return 278.46', () => {
        let value = fiscal.discountedCashFlow(100, [20, 40, 60, 20, 70], 5);
        expect(value.asString()).toBe("278.46");
    });

});


describe('IRR: Internal Rate of Return', () => {

    test('calculating internal rate of return should be 225.53%', () => {
        let rate = fiscal.internalRateOfReturn(100000, [200000, 300000, 200000, 500000]);
        expect(rate.asString()).toBe("225.53%")
    });

})


describe('PV: Present Value', () => {

    test('Calculating present value of $50,000 with a 10% rate over 10 years should be equal to $31,046.07', () => {
        let PV: Currency = fiscal.presentValue(50000, 10, 5);
        expect(PV.asFormattedString()).toBe("$31,046.07");
    });

});

describe('FV: Future Value', () => {

    test('With an initial investment of $50,000 and a rate of 10% over 5 years the future value is 80525.5 ', () => {
        let FV = fiscal.futureValue(50000, 10, 5);
        expect(FV.asNumber()).toBe(80525.5);
    });

});


describe('NPV: Net Present Value', () => {

    test('With an initial investment of $500,000 and a rate of 10% and cash flows of $200,000 the first year, $300,000 the second year and $200,000 the third year the net present value should equal 39339.67', () => {
        let NPV = fiscal.netPresentValue(-500000, 10, [200000, 300000, 200000]);
        expect(NPV.asNumber()).toBe(138016.53);
    });

});


describe('CI: Compound Interest', () => {

    test('Given a rate of 7.5% over 31 years the principal of $92,000 would be $865,865.07', () => {
        let CI = fiscal.compoundInterest(92000, 7.5, 31);
        expect(CI.asFormattedString()).toBe("$865,865.07")
    });

});

describe('SI: Simple Interest', () => {
    test('Calculating simple interest should equal $305,900.00', () => {
        let SI = fiscal.simpleInterest(92000, 7.5, 31)
        expect(SI.asFormattedString()).toBe("$305,900.00")
    });
});

describe('ROI: Return on Investment', () => {

    test('ROI: With an initial investment of $50,000 and earnings of $200,000 the return on investment should be 300%', () => {
        let ROI = fiscal.returnOnInvestment(-50000, 200000);
        expect(ROI.asString()).toBe("300%");
    });

});

describe("CAGR: Compounded Annual Growth Rate", () => {

    test("With an initial investment of $50,000 and an ending value of $100,000 over 5 years the compounded annual growth rate should b 15%", () => {
        let CAGR = fiscal.compoundedAnnualGrowthRate(50000, 100000, 5);
        expect(CAGR.asString()).toBe("15%");
    });

});

describe('PI: Payback Intervals', () => {

    test('With an initial payment due of $23,456, how many payments of $525 per interval until its paid off', () => {
        let PI = fiscal.paybackIntervals(23456, 525)
        expect(PI).toBe(45);
    });

});

describe('AM: Amortization', () => {
    
    test('With a total payment due of $17,000 paid per month over 5 years with a 2.71% rate, the price of the monthly payment should be $303.28', () => {
        let AM = fiscal.amortization(17000, 2.71, 5);
        expect(AM.asNumber()).toBe(303.28);
    });

    test('With a total payment due of $17,000 paid per month over 60 months with a 2.71% rate, the price of monthly payment should be $303.28', () => {
        let AM = fiscal.amortization(17000, 2.71, 60, true);
        expect(AM.asNumber()).toBe(303.28);
    });

});

describe('LR: Leverage Ratio', () => {

    test('Given $17,000 of liabilities and $20,000 of debt with $60,000 of income our leverage ratio should be 0.62', () => {
        let LR = fiscal.leverageRatio(17000, 20000, 60000);
        expect(LR).toBe(0.62);
    });

});

describe('Salary', () => {

    test('Given a $30/hr wage, your salary should be $62,400', () => {
        let salary = fiscal.getSalaryPerYear(30);
        expect(salary.asNumber()).toBe(62400);
    });

    test('Given a $30/hr wage and a 8% tax rate your salary should be', () => {
        let salary = fiscal.getSalaryPerYear(30, 8);
        expect(salary.asNumber()).toBe(57408);
    });

    test('Given a $30/hr wage, your income per month $4,800', () => {
        let salary = fiscal.getSalaryPerMonth(30);
        expect(salary.asNumber()).toBe(4800);
    });

    test('Given a $30/hr wage and a 8% tax rate your income per month should be $4,768', () => {
        let salary = fiscal.getSalaryPerMonth(30, 8);
        expect(salary.asNumber()).toBe(4768);
    });

    test('Given a $62,400 salary per year, the hourly wage for a 40 hour work week should be: $30', () => {
        let salary = fiscal.getHourlyWage(62400);
        expect(salary.asNumber()).toBe(30);
    });

});

describe('IAR: Inflation Adjusted Return', () => {

    test('Given a 2.5% inflation rate, what is the value of a $1,000,000 return 19.71%', () => {
        let IAR = fiscal.returnAdjustedForInflation(3, 23.3);
        expect(IAR).toBe("19.71%");
    });

});

describe('WACC: Weighted Average Cost of Capital', () => {

    test('Given a firms market value of equity to $400,000 and market value of debt to be $600,000 with a 15% cost of equity and 8% cost of debt along with a 2% corporate tax rate should return a 10.7% cost of capital', () => {
        let WACC = fiscal.weightedAverageCostOfCapital(400000, 600000, 15, 8, 2);
        expect(WACC.asString()).toBe("10.7%");
    });

});

describe('Percent Of', () => {

    test('6% of $123,720 should be $7,423.20', () => {
        let PO = fiscal.percentOf(6, 123720);
        expect(PO.asFormattedString()).toBe("$7,423.20");
    });

});

describe('DF: Discount Factor', () => {

    test('Given a rate of 6% and 5 compounding intervals the discount factor should be 0.75', () => {
        let DF = fiscal.discountFactor(6, 5);
        expect(DF.asDecimal()).toBe(0.75);
    });

});

describe('CAPM: Capital Asset Pricing Model', () => {

    test('Given risk free rate of 3% and an expected market return of 9% and a beta of 4 the return should be 0.27', () => {
        let CAER = fiscal.capitalAssetPricingModel(3, 9, 4);
        expect(CAER.asDecimal()).toBe(0.27);
    });

});

describe('PI: Profitability Index', () => {

    test('Given a principal of $10,000 and a rate of 10% and three payments of $5,000 over three years the PI should be 1.24', () => {
        let PI = fiscal.profitabilityIndex(10000, 10, [5000, 5000, 5000]);
        expect(PI).toBe(1.24);
    });

});

describe('Rule of 72', () => {

    test('Given a 6% rate the investment will double in 12 years', () => {
        let a = fiscal.ruleOf72(6);
        expect(a).toBe(12);
    });

});

describe('YoY: Year over Year', () => {

    test('Given a total amount of 2200 in the current year and 2000 in the year prior the YoY growth should be 10%', () => {
        let YoY = fiscal.yearOverYear(2200, 2000);
        expect(YoY.asString()).toBe("10%");
    });

});
