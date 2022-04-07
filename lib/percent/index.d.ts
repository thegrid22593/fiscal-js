export interface IPercent {
    asString(): string;
    asDecimal(): number;
}
export declare class Percent implements IPercent {
    private percent;
    constructor(percent: number);
    private setPercent;
    asString(): string;
    asDecimal(): number;
}
