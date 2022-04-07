import { IFormatOptions } from "../Fiscal";
export interface ICurrency {
    asString(): string;
    asNumber(): number;
    asFormattedString(languageCode: string, currencyCode: string): string;
}
export declare class Currency implements ICurrency {
    private readonly currency;
    private readonly options;
    constructor(currency: number, options?: IFormatOptions);
    asFormattedString(currencyCode?: string, languageCode?: string): string;
    asNumber(): number;
    asString(): string;
}
