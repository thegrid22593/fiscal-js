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

    test('With a total payment due of $17,000 paid per month over 60 months with a 2.71% rate, the price of monthly payment should be $303.28', () => {
        let AM = fiscal.amortizationV2.forInterest(23000, 398, 60, true, false);
        expect(AM.asString()).toBe("1.487%");
    });

});
