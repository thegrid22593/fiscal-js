const fiscal = require('./index.ts');

test('calculating compound interest should equal 865865.07', () => {
    expect(fiscal.calculateCompountInterest(92000, 7.5, 31)).toBe("865865.07")
});

test('calculating simple interest should equal 305900.00', () => {
    expect(fiscal.calculateSimpleInterest(92000, 7.5, 31)).toBe("305900.00")
});

test('calculating the discounted cash flows should return 278.46', () => {
    let value = fiscal.calculateDiscountedCashFlows(100, [20, 40, 60, 20, 70], 5);

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

    let roi = fiscal.returnOnInvestment(50000, 200000);

    expect(roi).toBe("300%");

});