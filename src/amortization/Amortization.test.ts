import Fiscal from "../Fiscal";

const fiscal = new Fiscal();

describe('Amortization: (AM)', () => {

    test('With a total payment due of $23,000 paid per month over 5 years with a 2.71% rate, the price of the monthly payment should be $303.28', () => {
        let AM = fiscal.amortizationV2.forMonthlyPayment(23000, 2.71, 5, false, false);
        expect(AM.asNumber()).toBe(410.32);
    });

    test('With a total payment due of $17,000 paid per month over 60 months with a 2.71% rate, the price of monthly payment should be $303.28', () => {
        let AM = fiscal.amortizationV2.forMonthlyPayment(23000, 2.71, 60, true, false);
        expect(AM.asNumber()).toBe(410.32);
    });

    test('With a down payment of $10,000 paid per year at 2200 over 5 years, the interest rate should be 2%', () => {
        let AM = fiscal.amortizationV2.forInterest(10000, 183.33, 5, false,false);
        expect(AM.asString()).toBe("2%");
    });

    test('With a down payment of $10,000 paid per month at $183.33 over 5 years, the interest rate should be 2%', () => {
        let AM = fiscal.amortizationV2.forInterest(10000, 183.33, 60, true, false);
        expect(AM.asString()).toBe("2%");
    });

});
