export interface IPercent {
    asString(): string;
    asDecimal(): number;
}

export class Percent implements IPercent {
    
    private percent: number;

    constructor(percent: number) {
        this.setPercent(percent);
    }

    private setPercent(percent: number) {
        this.percent = percent;
    }

    public asString(): string {
        return this.percent.toString() + "%";
    }

    public asDecimal(): number {
        return this.percent / 100;
    }

}