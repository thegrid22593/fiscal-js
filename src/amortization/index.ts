import {Percent} from "../percent";
import {Currency} from "../currency";
import {IFiscalOptions, IFormatOptions} from "../Fiscal";

export interface IAmortization {
    forInterest(principal: number, payment: number, periods: number, periodsInMonths: boolean, includeInitialPayment: boolean): Percent;
    forPresentValue(payment: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean): Currency;
    forMonthlyPayment(principal: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean) : Currency;
    forNumberOfPeriods(principal: number, rate: number, intervalInMonths: boolean, includeInitialPayment: boolean): number;
    interestPaid(principal: number, payment: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean): Currency;
}

/**
 * Amortization is paying off a debt over time in equal installments.
 * Part of each payment goes toward the loan principal, and part goes toward interest.
 * With mortgage loan amortization, the amount going toward principal starts out small,
 * and gradually grows larger month by month.
 */
export class Amortization implements IAmortization {

    private options: IFiscalOptions;

    constructor(options: IFiscalOptions) {
        this.options = options;
    }

    /**
     *
     * @param principal
     * @param payment
     * @param totalNumberOfPeriods
     * @param periodsInMonths
     * @param includeInitialPayment
     */
    forInterest(principal: number, payment: number, totalNumberOfPeriods: number, periodsInMonths: boolean = false, includeInitialPayment: boolean = false): Percent {
        let periods = totalNumberOfPeriods;
        let years, months;

        if(!periodsInMonths) {
            years = periods;
            months = periods * 12;
        } else {
            years = periods / 12;
            months = periods;
        }

        if(includeInitialPayment) {
            periods--;
        }

        let simpleInterest = (payment * months) - principal;
        let interest = Math.round((simpleInterest * 100) / (principal * years));

        return new Percent(interest);
    }

    /**
     *
     * @param principal
     * @param rate
     * @param totalNumberOfPayments
     * @param intervalInMonths
     * @param includeInitialPayment
     */
    forMonthlyPayment(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false) : Currency {
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
     * @param principal
     * @param rate
     * @param intervalInMonths
     * @param includeInitialPayment
     */
    forNumberOfPeriods(principal: number, rate: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false): number {
        return 0;
    }

    /**
     *
     * @param payment
     * @param rate
     * @param totalNumberOfPeriods
     * @param intervalInMonths
     * @param includeInitialPayment
     */
    forPresentValue(payment: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false): Currency {
        return undefined;
    }

    interestPaid(principal: number, payment: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean): Currency {
        return undefined;
    }

}
