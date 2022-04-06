export interface ICurrency {
    asString(): string;
    asNumber(): number;
    asFormattedString(languageCode: string, currencyCode: string): string;
}

export class Currency implements ICurrency {

    private readonly currency: number;

    public constructor(currency: number) {
        this.currency = currency;
    }

    asFormattedString(currencyCode: string = "USD", languageCode: string = "en-US"): string {
        return new Intl.NumberFormat(languageCode, { style: 'currency', currency: currencyCode }).format(this.currency);
    }

    asNumber(): number {
        return this.currency;
    }

    asString(): string {
        return this.currency.toFixed(2);
    }

}
