import { Percent } from "./percent";
import { Currency } from "./currency";
interface IFiscal {
    presentValue(terminalValue: number, rate: number, numberOfYears: number): Currency;
    futureValue(initialInvestment: number, rate: number, numberOfYears: number): Currency;
    netPresentValue(principal: number, rate: number, cashFlows: number[]): Currency;
    compoundInterest(principal: number, rate: number, numberOfYears: number): Currency;
    simpleInterest(principal: number, rate: number, numberOfYears: number): Currency;
    internalRateOfReturn(principal: number, cashFlows: number[]): Percent;
    discountedCashFlow(principal: number, cashFlows: number[], rate: number): Currency;
    returnOnInvestment(initialInvestment: number, earnings: number): Percent;
    compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): Percent;
    paybackIntervals(amountDue: number, intervalPaymentAmount: number): number;
    amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean, includeInitialPayment: boolean): Currency;
    leverageRatio(liabilities: number, debts: number, totalIncome: number): number;
    getSalaryPerYear(hourlyRate: number, taxRate: number): Currency;
    getSalaryPerMonth(hourlyRate: number, taxRate: number): Currency;
    getHourlyWage(salary: number): Currency;
    weightedAverageCostOfCapital(marketValueOfEquity: number, marketValueOfDebt: number, costOfEquity: number, costOfDebt: number, corporateTaxRate: number): Percent;
    discountFactor(rate: number, numberOfIntervals: number): Percent;
    capitalAssetPricingModel(riskFreeRate: number, expectedMarketReturn: number, beta: number): Percent;
    profitabilityIndex(principal: number, rate: number, cashFlows: number[]): number;
    ruleOf72(rate: number): number;
    yearOverYear(currentYear: number, pastYear: number): Percent;
    percentOf(percent: number, value: number): Currency;
    returnOnEquity(netIncome: number, shareHoldersEquity: number): Percent;
}
export interface IFormatOptions {
    currencyCode: string;
    languageCode: string;
}
interface IFiscalOptions {
    format: IFormatOptions;
}
export default class Fiscal implements IFiscal {
    private options;
    constructor(options?: IFiscalOptions);
    private getDiscountedCashFlowRate;
    presentValue(terminalValue: number, rate: number, numberOfYears: number): Currency;
    futureValue(initialInvestment: number, rate: number, numberOfYears: number): Currency;
    netPresentValue(principal: number, rate: number, cashFlows: number[]): Currency;
    compoundInterest(principal: number, rate: number, numberOfYears: number): Currency;
    simpleInterest(principal: number, rate: number, numberOfYears: number): Currency;
    internalRateOfReturn(principal: number, cashFlows: number[]): Percent;
    discountedCashFlow(principal: number, cashFlows: number[], rate: number): Currency;
    returnOnInvestment(initialInvestment: number, earnings: number): Percent;
    compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number): Percent;
    paybackIntervals(amountDue: number, intervalPaymentAmount: number): number;
    amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths?: boolean, includeInitialPayment?: boolean): Currency;
    leverageRatio(liabilities: number, debts: number, totalIncome: number): number;
    getSalaryPerYear(hourlyRate: number, taxRate?: number): Currency;
    getSalaryPerMonth(hourlyRate: number, taxRate?: number): Currency;
    getHourlyWage(salary: number): Currency;
    returnAdjustedForInflation(inflationRate: number, returnOnInvestment: number): string;
    weightedAverageCostOfCapital(marketValueOfEquity: number, marketValueOfDebt: number, costOfEquity: number, costOfDebt: number, corporateTaxRate: number): Percent;
    discountFactor(rate: number, numberOfIntervals: number): Percent;
    capitalAssetPricingModel(riskFreeRate: number, expectedMarketReturn: number, beta: number): Percent;
    profitabilityIndex(principal: number, rate: number, cashFlows: number[]): number;
    ruleOf72(rate: number): number;
    yearOverYear(currentYear: number, pastYear: number): Percent;
    percentOf(percent: number, value: number): Currency;
    returnOnEquity(netIncome: number, shareHoldersEquity: number): Percent;
}
export {};
