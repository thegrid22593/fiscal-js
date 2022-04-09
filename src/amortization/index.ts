import {Percent} from "../percent";
import {Currency} from "../currency";

export interface IAmortization {
    forInterest(principal: number, payment: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean): Percent;
    forPresentValue(payment: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean): Currency;
    forMonthlyPayment(principal: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean, includeInitialPayment: boolean) : Currency;
    forNumberOfPeriods(principal: number, rate: number, intervalInMonths: boolean, includeInitialPayment: boolean): number;
}

/**
 * Amortization is paying off a debt over time in equal installments.
 * Part of each payment goes toward the loan principal, and part goes toward interest.
 * With mortgage loan amortization, the amount going toward principal starts out small,
 * and gradually grows larger month by month.
 */
export class Amortization implements IAmortization {

    constructor() {

    }

    /**
     *
     * @param principal
     * @param payment
     * @param totalNumberOfPeriods
     * @param intervalInMonths
     * @param includeInitialPayment
     */
    forInterest(principal: number, payment: number, totalNumberOfPeriods: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false): Percent {
        return undefined;
    }

    /**
     *
     * @param principal
     * @param rate
     * @param totalNumberOfPeriods
     * @param intervalInMonths
     * @param includeInitialPayment
     */
    forMonthlyPayment(principal: number, rate: number, totalNumberOfPeriods: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false) : Currency {
        return undefined;
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

}
