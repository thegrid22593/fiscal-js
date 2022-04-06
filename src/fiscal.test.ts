import {Currency} from "./currency";

const fiscal = require('./Fiscal.ts');

test('calculating compound interest should equal 865865.07', () => {
    expect(fiscal.compountInterest(92000, 7.5, 31)).toBe("865865.07")
});

test('calculating simple interest should equal 305900.00', () => {
    expect(fiscal.simpleInterest(92000, 7.5, 31)).toBe("305900.00")
});

test('calculating the discounted cash flows should return 278.46', () => {
    let value = fiscal.discountedCashFlow(100, [20, 40, 60, 20, 70], 5);

    expect(value.toFixed(2)).toBe("278.46");
});

test('calculating internal rate of return should be 225.53%', () => {

    let rate = fiscal.internalRateOfReturn(100000, [200000, 300000, 200000, 500000]);

    expect(rate).toBe("225.53%")
});

describe('PV: Present Value', () => {
    test('calculating present value of $50,000 with a 10% rate over 10 years should be equal to $31,046.07', () => {

        let pv: Currency = fiscal.presentValue(50000, 10, 5);

        expect(pv.asFormattedString()).toBe("$31,046.07");

    });
});


test('FV: calculating future value should be equal to 80525.5', () => {

    let pv = fiscal.futureValue(50000, 10, 5);

    expect(pv).toBe(80525.5);

});

test('NPV: With an initial investment of $500,000 and a rate of 10% and cash flows of $200,000 the first year, $300,000 the second year and $200,000 the third year the net present value should equal 39339.67', () => {

    let npv = fiscal.netPresentValue(-500000, 10, [200000, 300000, 200000]);

    expect(npv).toBe(138016.53);

});

test('ROI: With an initial investment of $50,000 and earnings of $200,000 the return on investment should be 300%', () => {

    let roi = fiscal.returnOnInvestment(-50000, 200000);

    expect(roi).toBe("300%");

});

describe("CAGR: Comounded Annual Growth Rate", () => {

    test("With an initial investment of $50,000 and an ending value of $100,000 over 5 years the compounded annual growth rate should b 15%", () => {
        let CAGR = fiscal.compoundedAnnualGrowthRate(50000, 100000, 5);
        expect(CAGR).toBe("15%");
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
        let am = fiscal.amortization(17000, 2.71, 5);
        expect(am).toBe(303.28);
    });

    test('With a total payment due of $17,000 paid per month over 60 months with a 2.71% rate, the price of monthly payment should be $303.28', () => {
        let am = fiscal.amortization(17000, 2.71, 60, true);
        expect(am).toBe(303.28);
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
        expect(salary).toBe(62400);
    });

    test('Given a $30/hr wage and a 8% tax rate your salary should be', () => {
        let salary = fiscal.getSalaryPerYear(30, 8);
        expect(salary).toBe(57408);
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
        expect(WACC).toBe("10.7%");
    });

});

describe('DF: Discount Factor', () => {

    test('Given a rate of 6% and 5 compounding intervals the discount factor should be 0.75', () => {
        let DF = fiscal.discountFactor(6, 5);
        expect(DF).toBe(0.75);
    });

});

describe('CAPM: Capital Asset Pricing Model', () => {

    test('Given risk free rate of 3% and an expected market return of 9% and a beta of 4 the return should be 0.27', () => {
        let CAER = fiscal.capitalAssetPricingModel(3, 9, 4);
        expect(CAER).toBe(0.27);
    });

});
