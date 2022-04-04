class Fiscal {
    constructor(currency = "USD") {
        this.currency = currency;
    }

    // TODO: make private
    makePercentAsDecimal(number) {
        return number / 100;
    }

    // TODO: make private
    getDiscountedCashFlowRate(rate, year) {
        return Math.pow((1 + rate), year);
    }

    presentValue(terminalValue, rate, numberOfYears) {
        let percentRate = this.makePercentAsDecimal(rate);
        let pv = terminalValue / Math.pow(1 + rate, percentRate, numberOfYears);
        return Math.round(pv * 100) / 100;
    }
    
    futureValue(initialIvestment, rate, numberOfYears) {
        let percentRate = this.makePercentAsDecimal(rate);
        let futureValue = initialIvestment * this.getDiscountedCashFlowRate(percentRate, numberOfYears);
        return Math.round(futureValue * 100) / 100;
    }

    // Net Present Value
    netPresentValue(principal, rate, cashFlows) {
        let percentRate = this.makePercentAsDecimal(rate);
        let netPresentValue = principal;
        for(var i = 0; i < cashFlows.length; i++) {
            netPresentValue += (cashFlows[i] / this.getDiscountedCashFlowRate(percentRate, i));
        }
        return Math.round(netPresentValue * 100) / 100;
    }


    calculateCompountInterest(principal, rate, numberOfYears) {
        let percentRate = rate / 100;
        let rateTimesYearSum = Math.pow(1 + percentRate, numberOfYears);
        return (principal * rateTimesYearSum).toFixed(2);
    }

    calculateSimpleInterest(principal, rate, numberOfYears) {
        let percentRate = rate / 100;
        let finalAmount = principal * (1+(percentRate*numberOfYears));
        return finalAmount.toFixed(2);
    }

    // The rate of return that makes the net present value (NPV) = 0 
    calculateInternalRateOfReturn(principal, cashflows, rate = 0) {
        let percentRate = rate / 100;
        
        let discountedCashFlows = cashflows.reduce((partialSum, cashflow, index) => {
            let year = index + 1;
            return partialSum + (cashflow / Math.pow(1+percentRate, year))
        }, 0);

        let npv = discountedCashFlows - principal;
        console.log('npv', rate, Math.abs(npv).toFixed(2));

        if(npv > 1) {
            return this.calculateInternalRateOfReturn(principal, cashflows, rate + 1);
        }

        if(Math.abs(npv).toFixed(2) == "0.00") {
            return rate.toFixed(2) + "%";
        }

        if(Math.abs(npv).toFixed(1) == "0.1" || Math.abs(npv).toFixed(2) != "0.00") {
           return this.calculateInternalRateOfReturn(principal, cashflows, rate + .01);
        }
        
    }

    calculateDiscountValue(value) {

    }

    // TODO: Does too much
    calculateDiscountedCashFlows(principal, cashflows, rate) {
        let percentRate = rate / 100;
        
        let discountedCashFlows = cashflows.reduce((partialSum, cashflow, index) => {
            let year = index + 1;
            return partialSum + (cashflow / Math.pow(1+percentRate, year))
        }, 0);

        let terminalValue = discountedCashFlows + principal;
        return terminalValue;
    }
}

module.exports = new Fiscal();