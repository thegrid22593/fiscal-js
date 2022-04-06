import { Percent } from "./percent";

export interface IFiscal {
    presentValue(terminalValue: number, rate: number, numberOfYears: number): number;
    futureValue(initialIvestment: number, rate: number, numberOfYears: number): number;
    netPresentValue(principal: number, rate: number, cashFlows: number[]): number;
    compountInterest(principal: number, rate: number , numberOfYears: number): string;
    simpleInterest(principal: number, rate: number, numberOfYears: number): string;
    internalRateOfReturn(principal: number, cashflows: number[]): string;
    discountedCashFlow(principal:number, cashflows: number[], rate: number): number;
    returnOnInvestment(initialInvestment: number, earnings: number): string;
    compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): string;
    paybackIntervals(amountDue: number, intervalPaymentAmount: number): number;
    amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean, includeInitialPayment: boolean) : number;
    leverageRatio(liabilities: number, debts: number, totalIncome: number): number;
    getSalaryPerYear(hourlyRate: number, taxRate: number): number;
}

class Fiscal implements IFiscal {

    private getDiscountedCashFlowRate(rate: number, year: number) {
        return Math.pow((1 + rate), year);
    }

    /**
     * 
     * @param terminalValue 
     * @param rate 
     * @param numberOfYears 
     * @returns 
     * 
     * Present value (PV) is the current value of a future sum of money 
     * or stream of cash flows given a specified rate of return.
     */
    public presentValue(terminalValue: number, rate: number, numberOfYears: number) {
        let percentRate = new Percent(rate).asDecimal();
        let pv = terminalValue / Math.pow(1 + percentRate, numberOfYears);
        return Math.round(pv * 100) / 100;
    }
    
    /**
     * 
     * @param initialIvestment 
     * @param rate 
     * @param numberOfYears 
     * @returns 
     * 
     * Future value, or FV, is what money is expected to be worth in the future.
     */
    public futureValue(initialIvestment: number, rate: number, numberOfYears: number) {
        let percentRate = new Percent(rate).asDecimal();
        let futureValue = initialIvestment * this.getDiscountedCashFlowRate(percentRate, numberOfYears);
        return Math.round(futureValue * 100) / 100;
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param cashFlows 
     * @returns 
     * 
     * Net present value is the present value of the cash flows at the required 
     * rate of return of your project compared to your initial investment.
     */
    public netPresentValue(principal: number, rate: number, cashFlows: number[]) {
        let percentRate = new Percent(rate).asDecimal();
        let netPresentValue = principal;
        for(var i = 0; i < cashFlows.length; i++) {
            netPresentValue += (cashFlows[i] / this.getDiscountedCashFlowRate(percentRate, i));
        }
        return Math.round(netPresentValue * 100) / 100;
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param numberOfYears 
     * @returns string
     * 
     * Compound interest (or compounding interest) is the interest on a loan or 
     * deposit calculated based on both the initial principal and the accumulated 
     * interest from previous periods.
     */
    public compountInterest(principal: number, rate: number , numberOfYears: number): string {
        let percentRate = rate / 100;
        let rateTimesYearSum = Math.pow(1 + percentRate, numberOfYears);
        return (principal * rateTimesYearSum).toFixed(2);
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param numberOfYears 
     * @returns 
     * 
     * Simple interest is a method to calculate the amount of interest charged 
     * on a sum at a given rate and for a given period of time.
     */
    public simpleInterest(principal: number, rate: number, numberOfYears: number): string {
        let percentRate = rate / 100;
        let finalAmount = principal * (1+(percentRate*numberOfYears));
        return finalAmount.toFixed(2);
    }

    /**
     * 
     * @param principal 
     * @param cashflows 
     * @returns 
     * 
     * The internal rate of return (IRR) is a metric used in financial analysis to estimate the 
     * profitability of potential investments. IRR is a discount rate that makes the net present
     * value (NPV) of all cash flows equal to zero in a discounted cash flow analysis.
     */
    public internalRateOfReturn(principal: number, cashflows: number[]): string {
        let numberOfCalcs = 1;

        if(principal > 0) {
            principal = -Math.abs(principal);
        }

        function npv(rate: number) {
            numberOfCalcs++;
            if (numberOfCalcs > 1000) {
                throw new Error('Can\'t find a result');
            }
            var percentRate = (1 + new Percent(rate).asDecimal());
            var npv = principal;
            for (var i = 0; i < cashflows.length; i++) {
                npv += (cashflows[i] / Math.pow(percentRate, i + 1));
            }
            return npv;
        }

        function findZeroNPV(fn: (rate: number) => number) {
            var x = 1;
            while (fn(x) > 0) {
                x += 1;
            }
            while (fn(x) < 0) {
                x -= 0.01;
            }
            return x + 0.01;
        }

        let rate = Math.round(findZeroNPV(npv) * 100) / 100;

        return new Percent(rate).asString();
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

    /**
     * 
     * @param initialInvestment 
     * @param earnings 
     * @returns 
     * 
     * Return on Investment (ROI) is a popular profitability metric 
     * used to evaluate how well an investment has performed
     */
    public returnOnInvestment(initialInvestment: number, earnings: number): string {
        let roi = (earnings - Math.abs(initialInvestment)) / Math.abs(initialInvestment) * 100;
        return new Percent(Math.round(roi * 100) / 100).asString();
    }
    
    /**
     * 
     * @param initialInvestment 
     * @param terminalValue 
     * @param numberOfYears 
     * @returns string
     * 
     * Compound annual growth rate, or CAGR, is the mean annual growth rate of an 
     * investment over a specified period of time longer than one year.
     */
    public compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): string {
        let CAGR = Math.pow((terminalValue / initialInvestment), 1 / numberOfYears) - 1;
        return new Percent(Math.round(CAGR * 100)).asString();
    }

    public paybackIntervals(amountDue: number, intervalPaymentAmount: number): number {
        return Math.ceil(amountDue / intervalPaymentAmount)
    }
    
    /**
     * 
     * @param principal 
     * @param rate 
     * @param totalNumberOfPayments 
     * @param intervalInMonths 
     * @param includeInitialPayment 
     * @returns number
     * 
     * Amortization is paying off a debt over time in equal installments. 
     * Part of each payment goes toward the loan principal, and part goes toward interest. 
     * With mortgage loan amortization, the amount going toward principal starts out small, 
     * and gradually grows larger month by month.
     */
    public amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false) : number {
        let periodicInterestRate = new Percent(rate / 12).asDecimal();

        if(!intervalInMonths) {
            totalNumberOfPayments = totalNumberOfPayments * 12;
        }

        if(includeInitialPayment) {
            --totalNumberOfPayments;
        }

        let numerator = periodicInterestRate * Math.pow((1 + periodicInterestRate), totalNumberOfPayments);
        let denominator = Math.pow((1 + periodicInterestRate), totalNumberOfPayments) - 1;

        let monthlyPayment = principal * (numerator / denominator);

        return Math.round(monthlyPayment * 100) / 100;
    }

    /**
     * 
     * @param liabilities 
     * @param debts 
     * @param totalIncome 
     * @returns 
     * 
     * The leverage ratio is the proportion of debts that a bank has compared to its equity/capital
     */
    public leverageRatio(liabilities: number, debts: number, totalIncome: number): number {
        let totalLiabilitiesAndDebt = liabilities + debts;
        return Math.round((totalLiabilitiesAndDebt / totalIncome) * 100) / 100;
    }

    /**
     * 
     * @param hourlyRate 
     * @param taxRate 
     * @returns 
     * 
     * Determine your yearly salary based on the hourly rate
     */
    public getSalaryPerYear(hourlyRate: number, taxRate: number = 0): number {
        let weeksInYear = 52;
        let workingHoursPerWeek = 40;

        let yearlySalary = (hourlyRate * workingHoursPerWeek) * weeksInYear;
        let taxes = yearlySalary * new Percent(taxRate).asDecimal();
        return yearlySalary - taxes;
    }

    //TODO: 
        // IIR - with irregular intervals
        // PP
        // PI
        // DF
        // WACC
        // CAPM
        // Stock calcs
        // Hourly Wage Calculation
}

module.exports = new Fiscal();