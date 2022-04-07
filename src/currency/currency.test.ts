import {Currency} from "./index";

describe('currency', function () {

    test('Given a number of 123456.789 passed to Currency it can return a formatted string in US dollars', () => {
        const number = 123456.789;
        let formattedCurrency = new Currency(number).asFormattedString();
        expect(formattedCurrency).toBe("$123,456.79");
    });

    test('Given a number of 123456.789 passed to Currency it can return a formatted string in Euros with the denmark language code', () => {
        const number = 123456.789;
        let formattedCurrency = new Currency(number).asFormattedString("EUR", "de-DE");
        expect(formattedCurrency).toBe("123.456,79 €");
    });

    test('Given a number of 123456.789 passed to Currency it can return a formatted string in Euros with the en-US language code format', () => {
        const number = 123456.789;
        let formattedCurrency = new Currency(number).asFormattedString("EUR");
        expect(formattedCurrency).toBe("€123,456.79");
    });

});
