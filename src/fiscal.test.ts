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

// test('calculating internal rate of return should be 47.23%', () => {

//     let rate = fiscal.calculateInternalRateOfReturn(100, [60, 60, 60, 60]);

//     expect(rate).toBe("47.23%")
// });

test('calculating present value should be equal to 31046.07', () => {

    let pv = fiscal.presentValue(50000, 10, 5);

    expect(pv).toBe(31046.07);

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

test("CAGR: With an initial investment of $50,000 and an ending value of $100,000 over 5 years the compounded annual growth rate should b 15%", () => {

    let CAGR = fiscal.compoundedAnnualGrowthRate(50000, 100000, 5);

    expect(CAGR).toBe("15%");

});

test('PI: With an initial payment due of $23,456, how many payments of $525 per interval until its paid off', () => {

    let PI = fiscal.paybackIntervals(23456, 525)
    
    expect(PI).toBe(45);

});

describe('amortization', () => {
    
    test('With a total payment due of $17,000 paid per month over 5 years with a 2.71% rate, the price of the monthly payment should be $303.28', () => {
        let am = fiscal.amortization(17000, 2.71, 5)
        expect(am).toBe(303.28);
    });

    test('With a total payment due of $17,000 paid per month over 60 months with a 2.71% rate, the price of monthly payment should be $303.28', () => {
        let am = fiscal.amortization(17000, 2.71, 60, true)
        expect(am).toBe(303.28);
    });
    

});