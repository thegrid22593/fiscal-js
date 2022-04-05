import { Percent } from "./percent";

export interface IFiscal {
    presentValue(terminalValue: number, rate: number, numberOfYears: number): number;
    futureValue(initialIvestment: number, rate: number, numberOfYears: number): number;
    netPresentValue(principal: number, rate: number, cashFlows: number[]): number;
    compountInterest(principal: number, rate: number , numberOfYears: number): string;
    simpleInterest(principal: number, rate: number, numberOfYears: number): string;
    internalRateOfReturn(principal: number, cashflows: number[], rate: number): string;
    discountedCashFlow(principal:number, cashflows: number[], rate: number): number;
    returnOnInvestment(initialInvestment: number, earnings: number): string;
    compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): string;
}

class Fiscal implements IFiscal {

    private getDiscountedCashFlowRate(rate: number, year: number) {
        return Math.pow((1 + rate), year);
    }

    public presentValue(terminalValue: number, rate: number, numberOfYears: number) {
        let percentRate = new Percent(rate).asDecimal();
        let pv = terminalValue / Math.pow(1 + percentRate, numberOfYears);
        return Math.round(pv * 100) / 100;
    }
    
    public futureValue(initialIvestment: number, rate: number, numberOfYears: number) {
        let percentRate = new Percent(rate).asDecimal();
        let futureValue = initialIvestment * this.getDiscountedCashFlowRate(percentRate, numberOfYears);
        return Math.round(futureValue * 100) / 100;
    }

    // Net Present Value
    public netPresentValue(principal: number, rate: number, cashFlows: number[]) {
        let percentRate = new Percent(rate).asDecimal();
        let netPresentValue = principal;
        for(var i = 0; i < cashFlows.length; i++) {
            netPresentValue += (cashFlows[i] / this.getDiscountedCashFlowRate(percentRate, i));
        }
        return Math.round(netPresentValue * 100) / 100;
    }

    public compountInterest(principal: number, rate: number , numberOfYears: number): string {
        let percentRate = rate / 100;
        let rateTimesYearSum = Math.pow(1 + percentRate, numberOfYears);
        return (principal * rateTimesYearSum).toFixed(2);
    }

    public simpleInterest(principal: number, rate: number, numberOfYears: number): string {
        let percentRate = rate / 100;
        let finalAmount = principal * (1+(percentRate*numberOfYears));
        return finalAmount.toFixed(2);
    }

    // The rate of return that makes the net present value (NPV) = 0 
    public internalRateOfReturn(principal: number, cashflows: number[], rate: number = 0): string {
        let percentRate = rate / 100;
        
        let discountedCashFlows = cashflows.reduce((partialSum: number, cashflow: number, index: number) => {
            let year = index + 1;
            return partialSum + (cashflow / Math.pow(1+percentRate, year))
        }, 0);

        let npv = discountedCashFlows - principal;

        if(npv > 1) {
            return this.internalRateOfReturn(principal, cashflows, rate + 1);
        }

        if(Math.abs(npv).toFixed(2) == "0.00") {
            return rate.toFixed(2) + "%";
        }

        if(Math.abs(npv).toFixed(1) == "0.1" || Math.abs(npv).toFixed(2) != "0.00") {
           return this.internalRateOfReturn(principal, cashflows, rate + .01);
        }
        
    }

    // TODO: Does too much
    public discountedCashFlow(principal:number, cashflows: number[], rate: number): number {
        let percentRate = new Percent(rate).asDecimal();
        
        let discountedCashFlows = cashflows.reduce((partialSum, cashflow, index) => {
            let year = index + 1;
            return partialSum + (cashflow / Math.pow(1+percentRate, year))
        }, 0);

        let terminalValue = discountedCashFlows + principal;
        return terminalValue;
    }

    public returnOnInvestment(initialInvestment: number, earnings: number): string {
        let roi = (earnings - Math.abs(initialInvestment)) / Math.abs(initialInvestment) * 100;
        return new Percent(Math.round(roi * 100) / 100).asString();
    }
    
    public compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): string {
        let CAGR = Math.pow((terminalValue / initialInvestment), 1 / numberOfYears) - 1;
        return new Percent(Math.round(CAGR * 100)).asString();
    }

    //TODO: 
        // IIR - with irregular intervals
        // PP
        // Amortization
        // PI
        // DF
        // LR
        // WACC
        // Loan Payment
        // CAPM
        // Stock calcs
}

module.exports = new Fiscal();