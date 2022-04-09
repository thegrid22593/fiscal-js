import { Percent } from "./percent";
import { Currency } from "./currency";
import {Amortization, IAmortization} from "./amortization";

interface IFiscal {
    amortizationV2: IAmortization;
    presentValue(terminalValue: number, rate: number, numberOfYears: number): Currency;
    futureValue(initialInvestment: number, rate: number, numberOfYears: number): Currency;
    netPresentValue(principal: number, rate: number, cashFlows: number[]): Currency;
    compoundInterest(principal: number, rate: number , numberOfYears: number): Currency;
    simpleInterest(principal: number, rate: number, numberOfYears: number): Currency;
    internalRateOfReturn(principal: number, cashFlows: number[]): Percent;
    discountedCashFlow(principal:number, cashFlows: number[], rate: number): Currency;
    returnOnInvestment(initialInvestment: number, earnings: number): Percent;
    compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): Percent;
    paybackIntervals(amountDue: number, intervalPaymentAmount: number): number;
    amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean, includeInitialPayment: boolean) : Currency;
    leverageRatio(liabilities: number, debts: number, totalIncome: number): number;
    getSalaryPerYear(hourlyRate: number, taxRate: number): Currency;
    getSalaryPerMonth(hourlyRate: number, taxRate: number): Currency;
    getHourlyWage(salary: number): Currency;
    weightedAverageCostOfCapital(marketValueOfEquity: number, marketValueOfDebt: number, costOfEquity: number, costOfDebt: number, corporateTaxRate: number): Percent;
    discountFactor(rate: number, numberOfIntervals: number): Percent;
    capitalAssetPricingModel(riskFreeRate: number, expectedMarketReturn: number, beta: number): Percent;
    profitabilityIndex(principal: number, rate: number, cashFlows: number[]): number;
    ruleOf72(rate: number): number;
    yearOverYear(currentYear: number, pastYear: number): Percent
}

export interface IFormatOptions {
    currencyCode: string;
    languageCode: string;
}

export interface IFiscalOptions {
    format: IFormatOptions
}

export default class Fiscal implements IFiscal {

    private options: IFiscalOptions;
    amortizationV2: IAmortization;

    constructor(options: IFiscalOptions = {
        format: {
            languageCode: "en-US",
            currencyCode: "USD"
        }
    }) {
        this.options = options;
        this.amortizationV2 = new Amortization(this.options);
    }

    private getDiscountedCashFlowRate(rate: number, year: number) {
        return Math.pow((1 + rate), year);
    }

    /**
     * 
     * @param terminalValue 
     * @param rate 
     * @param numberOfYears 
     * @returns Currency
     * 
     * Present value (PV) is the current value of a future sum of money 
     * or stream of cash flows given a specified rate of return.
     */
    public presentValue(terminalValue: number, rate: number, numberOfYears: number): Currency {
        let percentRate = new Percent(rate).asDecimal();
        let pv = terminalValue / Math.pow(1 + percentRate, numberOfYears);
        return new Currency(Math.round(pv * 100) / 100, this.options.format);
    }
    
    /**
     * 
     * @param initialInvestment
     * @param rate 
     * @param numberOfYears 
     * @returns Currency
     * 
     * Future value, or FV, is what money is expected to be worth in the future.
     */
    public futureValue(initialInvestment: number, rate: number, numberOfYears: number): Currency {
        let percentRate = new Percent(rate).asDecimal();
        let futureValue = initialInvestment * this.getDiscountedCashFlowRate(percentRate, numberOfYears);
        return new Currency(Math.round(futureValue * 100) / 100, this.options.format);
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param cashFlows 
     * @returns Currency
     * 
     * Net present value is the present value of the cash flows at the required 
     * rate of return of your project compared to your initial investment.
     */
    public netPresentValue(principal: number, rate: number, cashFlows: number[]): Currency {
        let percentRate = new Percent(rate).asDecimal();
        let netPresentValue = principal;
        for(let i = 0; i < cashFlows.length; i++) {
            netPresentValue += (cashFlows[i] / this.getDiscountedCashFlowRate(percentRate, i));
        }
        return new Currency(Math.round(netPresentValue * 100) / 100, this.options.format);
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param numberOfYears 
     * @returns Currency
     * 
     * Compound interest (or compounding interest) is the interest on a loan or 
     * deposit calculated based on both the initial principal and the accumulated 
     * interest from previous periods.
     */
    public compoundInterest(principal: number, rate: number , numberOfYears: number): Currency {
        let percentRate = rate / 100;
        let rateTimesYearSum = Math.pow(1 + percentRate, numberOfYears);
        return new Currency(principal * rateTimesYearSum, this.options.format);
    }

    /**
     * 
     * @param principal 
     * @param rate 
     * @param numberOfYears 
     * @returns Currency
     * 
     * Simple interest is a method to calculate the amount of interest charged 
     * on a sum at a given rate and for a given period of time.
     */
    public simpleInterest(principal: number, rate: number, numberOfYears: number): Currency {
        let percentRate = rate / 100;
        let finalAmount = principal * (1+(percentRate*numberOfYears));
        return new Currency(finalAmount, this.options.format);
    }

    /**
     *
     * @param principal
     * @param cashFlows
     * @returns Percent
     *
     * The internal rate of return (IRR) is a metric used in financial analysis to estimate the
     * profitability of potential investments. IRR is a discount rate that makes the net present
     * value (NPV) of all cash flows equal to zero in a discounted cash flow analysis.
     */
    public internalRateOfReturn(principal: number, cashFlows: number[]): Percent {
        let numberOfCalcs = 1;

        if(principal > 0) {
            principal = -Math.abs(principal);
        }

        function npv(rate: number) {
            numberOfCalcs++;
            if (numberOfCalcs > 1000) {
                throw new Error('Can\'t find a result');
            }
            let percentRate = (1 + new Percent(rate).asDecimal());
            let npv = principal;
            for (let i = 0; i < cashFlows.length; i++) {
                npv += (cashFlows[i] / Math.pow(percentRate, i + 1));
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

        return new Percent(rate);
    }

    /**
     * 
     * @param principal 
     * @param cashFlows
     * @param rate 
     * @returns Currency
     * 
     * Discounted cash flow (DCF) is a valuation method used to estimate the value of an investment 
     * based on its expected future cash flows. DCF analysis attempts to figure out the value of an 
     * investment today, based on projections of how much money it will generate in the future.
     */
    public discountedCashFlow(principal:number, cashFlows: number[], rate: number): Currency {
        let percentRate = new Percent(rate).asDecimal();
        
        let discountedCashFlows = cashFlows.reduce((partialSum, cashFlow, index) => {
            let year = index + 1;
            return partialSum + (cashFlow / Math.pow(1+percentRate, year))
        }, 0);

        let terminalValue = discountedCashFlows + principal;
        return new Currency(terminalValue, this.options.format);
    }

    /**
     * 
     * @param initialInvestment 
     * @param earnings 
     * @returns Percent
     * 
     * Return on Investment (ROI) is a popular profitability metric 
     * used to evaluate how well an investment has performed
     */
    public returnOnInvestment(initialInvestment: number, earnings: number): Percent {
        let roi = (earnings - Math.abs(initialInvestment)) / Math.abs(initialInvestment) * 100;
        return new Percent(Math.round(roi * 100) / 100);
    }
    
    /**
     * 
     * @param initialInvestment 
     * @param terminalValue 
     * @param numberOfYears 
     * @returns Currency
     * 
     * Compound annual growth rate, or CAGR, is the mean annual growth rate of an 
     * investment over a specified period of time longer than one year.
     */
    public compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): Percent {
        let CAGR = Math.pow((terminalValue / initialInvestment), 1 / numberOfYears) - 1;
        return new Percent(Math.round(CAGR * 100));
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
     * @returns Currency
     * 
     * Amortization is paying off a debt over time in equal installments. 
     * Part of each payment goes toward the loan principal, and part goes toward interest. 
     * With mortgage loan amortization, the amount going toward principal starts out small, 
     * and gradually grows larger month by month.
     */
    public amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false) : Currency {
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

        return new Currency(Math.round(monthlyPayment * 100) / 100, this.options.format);
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
    public getSalaryPerYear(hourlyRate: number, taxRate: number = 0): Currency {
        let weeksInYear = 52;
        let workingHoursPerWeek = 40;

        let yearlySalary = (hourlyRate * workingHoursPerWeek) * weeksInYear;
        let taxes = yearlySalary * new Percent(taxRate).asDecimal();
        return new Currency(yearlySalary - taxes);
    }

    /**
     * 
     * @param hourlyRate 
     * @param taxRate 
     * @returns 
     * 
     * Determine your monthly salary based on the hourly rate
     */
     public getSalaryPerMonth(hourlyRate: number, taxRate: number = 0): Currency {
        let weeksPerMonth = 4;
        let workingHoursPerWeek = 40;

        let monthlySalary = (hourlyRate * workingHoursPerWeek) * weeksPerMonth;
        let taxes = monthlySalary * new Percent(taxRate / 12).asDecimal();
        return new Currency(monthlySalary - taxes);
    }

    /**
     * 
     * @param hourlyRate 
     * @param taxRate 
     * @returns 
     * 
     * Determine your hourly wage based on the salary
     */
     public getHourlyWage(salary: number): Currency {
        let weeksPerYear = 52;
        let workingHoursPerWeek = 40;

        let hourlyWage = (salary / weeksPerYear) / workingHoursPerWeek;
        return new Currency(hourlyWage);
    }

    /**
     * 
     * @param inflationRate 
     * @param returnOnInvestment 
     * @returns 
     * 
     * The inflation-adjusted return is the measure of return that takes into account the time period's inflation rate.
     */
    public returnAdjustedForInflation(inflationRate: number, returnOnInvestment: number): string {
        let a = 1 + returnOnInvestment / 100;
        let b = 1 + inflationRate / 100;
        let IAR = 100 * ((a / b) - 1)
        return IAR.toFixed(2) + "%";
    }

    /**
     *
     * @param marketValueOfEquity
     * @param marketValueOfDebt
     * @param costOfEquity
     * @param costOfDebt
     * @param corporateTaxRate
     * @returns Percent
     *
     * The weighted average cost of capital represents the average cost to attract investors,
     * whether they're bondholders or stockholders. The calculation weights the cost of capital
     * based on how much debt and equity the company uses, which provides a clear hurdle rate
     * for internal projects or potential acquisitions.
     */
    public weightedAverageCostOfCapital(marketValueOfEquity: number, marketValueOfDebt: number, costOfEquity: number, costOfDebt: number, corporateTaxRate: number): Percent {
        let E = marketValueOfEquity;
        let D = marketValueOfDebt;
        let V =  E + D;
        let Re = costOfEquity;
        let Rd = costOfDebt;
        let Tc = corporateTaxRate;

        let WACC = ((E / V) * Re/100) + (((D / V) * Rd/100) * (1 - Tc/100));

        return new Percent(Math.round(WACC * 1000) / 10);
    };

    /**
     *
     * @param rate
     * @param numberOfIntervals
     * @returns Percent
     *
     * Discount Factor is used to calculate what the value of receiving $1
     * at some point in the future would be (the present value, or “PV”)
     * based on the implied date of receipt and the discount rate assumption.
     */
    public discountFactor(rate: number, numberOfIntervals: number): Percent {
        let R = new Percent(rate).asDecimal();
        let T = numberOfIntervals;

        let DF = (1 / Math.pow(1 + R, T));
        return new Percent(Math.round(DF * 100));
    }

    /**
     *
     * @param riskFreeRate
     * @param expectedMarketReturn
     * @param beta
     * @returns Percent
     *
     * The capital asset pricing model provides a formula that calculates the expected return
     * on a security based on its level of risk. The formula for the capital asset pricing model
     * is the risk-free rate plus beta times the difference of the return on the market and the risk-free rate.
     *
     */
    public capitalAssetPricingModel(riskFreeRate: number, expectedMarketReturn: number, beta: number): Percent {
       let ERm = new Percent(expectedMarketReturn).asDecimal();
       let Rf = new Percent(riskFreeRate).asDecimal();
       let Bi = beta;

       let CAER = Rf + (Bi * (ERm - Rf));
       return new Percent(Math.round(CAER * 100));
    }

    /**
     *
     * @param principal
     * @param rate
     * @param cashFlows
     * @returns number
     *
     * The profitability index (PI) is a measure of a project's or investment's attractiveness.
     * The PI is calculated by dividing the present value of future expected cash flows by the
     * initial investment amount in the project.
     */
    public profitabilityIndex(principal: number, rate: number, cashFlows: number[]): number {
        let percentRate = new Percent(rate).asDecimal();
        let presentValueOfFutureCashFlows = 0;

        for(let i = 0; i < cashFlows.length; i++) {
            presentValueOfFutureCashFlows += cashFlows[0] * Math.pow(1 + percentRate, -(i + 1));
        }

        let PI = Math.round(100 * (presentValueOfFutureCashFlows / principal)) / 100;
        return PI;
    }

    /**
     * 
     * @param rate 
     * @returns number
     * 
     * The Rule of 72 is a simple formula used to estimate the length of time required
     *  to double an investment. The rule of 72 is primarily used in off the cuff 
     * situations where an individual needs to make a quick calculation instead 
     * of working out the exact time it takes to double an investment.
     */
    public ruleOf72(rate: number): number {
        return 72 / rate; 
    }

    /**
     * Year over year (YOY) is a financial formula that represents the annual
     * increase or decrease for a particular metric
     *
     */
    public yearOverYear(currentYear: number, pastYear: number): Percent {
        return new Percent((((currentYear - pastYear) / pastYear) * 100));
    }

    // TODO:
        // Version 1.3.0
            // Amortization currently only solves for monthly payment
                // Solve for interest
                    // fiscal.amortization.forInterest()
                // Solve for present value
                    // fiscal.amortization.forPresentValue()
                // Solve for monthly payment
                    // fiscal.amortization.forMonthlyPayment()
                // Solve for number of payments
                    // fiscal.amortization.forNumberOfPeriods

    //TODO: 
        // IIR - with irregular intervals
        // PP
        // Stock calcs
        // Hourly Wage Calculation
}
