export interface ICurrency {
    asString(): string;
    asNumber(): number;
    asFormattedString(languageCode: string, currencyCode: string): string;
}

export interface ICurrencyOptions {
    languageCode: string;
    currencyCode: string;
}

export class Currency implements ICurrency {

    private readonly currency: number;
    private readonly options: ICurrencyOptions;

    public constructor(currency: number, options: ICurrencyOptions = {
        languageCode: "en-US",
        currencyCode: "USD"
    }) {
        this.currency = currency;
        this.options = options;
    }

    asFormattedString(currencyCode: string = this.options.currencyCode, languageCode: string = this.options.languageCode): string {
        return new Intl.NumberFormat(languageCode, { style: 'currency', currency: currencyCode }).format(this.currency);
    }

    asNumber(): number {
        return this.currency;
    }

    asString(): string {
        return this.currency.toFixed(2);
    }

}
