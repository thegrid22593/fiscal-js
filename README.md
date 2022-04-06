# fiscal-js
A finance calculator inspired by the HP12-c to help you with your fiscal responsibilities and goals.

## Installation
```
npm i fiscal-js --save
```
or
```
yarn add fiscal-js
```

## Usage
```
const fiscal = require('fiscal-js');
//or
import { fiscal } from "fiscal-js";

fiscal.presentValue(50000, 10, 5).asFormattedString();
// $31,046.07
```

## API

### Present Value (PV)
Present value (PV) is the current value of a future sum of money or stream of cash flows given a specified rate of return.

```ts
fiscal.presentValue(terminalValue: number, rate: number, numberOfYears: number): Currency
```

### Future Value (FV)
Future value, or FV, is what money is expected to be worth in the future.
```ts
fiscal.futureValue(principal: number, rate: number, numberOfIntervals: number)
```

### Net Present Value (NPV)
Net present value or (NPV) is the present value of the cash flows at the required rate of return of your project compared to your initial investment.
```ts
fiscal.netPresentValue(principal: number, rate: number, cashFlows: number[])
```

### Compound Interest (CI)
Compound interest (or compounding interest) is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.
```ts
fiscal.compountInterest(principal: number, rate: number , numberOfYears: number)
```

### Simple Interest (SI)
Simple interest is a method to calculate the amount of interest charged on a sum at a given rate and for a given period of time.
```ts
fiscal.simpleInterest(principal: number, rate: number, numberOfYears: number)
```

### Internal Rate of Return (IRR)
The internal rate of return (IRR) is a metric used in financial analysis to estimate the profitability of potential investments. IRR is a discount rate that makes the net present value (NPV) of all cash flows equal to zero in a discounted cash flow analysis.
```ts
fiscal.internalRateOfReturn(principal: number, cashflows: number[])
```

### Discounted Cash Flow (DCF)
Discounted cash flow (DCF) is a valuation method used to estimate the value of an investment based on its expected future cash flows. DCF analysis attempts to figure out the value of an investment today, based on projections of how much money it will generate in the future.
```ts
fiscal.discountedCashFlow(principal:number, cashflows: number[], rate: number)
```

### Return on Investment (ROI)
Return on Investment (ROI) is a popular profitability metric used to evaluate how well an investment has performed
```ts
fiscal.returnOnInvestment(initialInvestment: number, earnings: number)
```

### Compounded Annual Growth Rate (CAGR)
Compound annual growth rate, or CAGR, is the mean annual growth rate of an investment over a specified period of time longer than one year.
```ts
fiscal.compoundedAnnualGrowthRate(initialInvestment: number, terminalValue: number, numberOfYears: number)
```

### Amortiation (AM)
Amortization is paying off a debt over time in equal installments. Part of each payment goes toward the loan principal, and part goes toward interest. With mortgage loan amortization, the amount going toward principal starts out small, and gradually grows larger month by month.
```ts
fiscal.amortization(principal: number, rate: number, totalNumberOfPayments: number, intervalInMonths: boolean = false, includeInitialPayment: boolean = false)
```

### Leverage Ratio (LR)
The leverage ratio is the proportion of debts that a bank has compared to its equity/capital
```ts
fiscal.leverageRatio(liabilities: number, debts: number, totalIncome: number)
```

### Inflation Adjusted Return (IAR)
The inflation-adjusted return is the measure of return that takes into account the time period's inflation rate.
```ts
fiscal.returnAdjustedForInflation(inflationRate: number, returnOnInvestment: number)
```


### Weighted Average Cost of Capital (WACC)
The weighted average cost of capital represents the average cost to attract investors, whether they're bondholders or stockholders. The calculation weights the cost of capital based on how much debt and equity the company uses, which provides a clear hurdle rate for internal projects or potential acquisitions.
```ts
fiscal.weightedAverageCostOfCapital(marketValueOfEquity: number, marketValueOfDebt: number, costOfEquity: number, costOfDebt: number, corporateTaxRate: number): string
```

### Discount Factor (DF)
Discount Factor is used to calculate what the value of receiving $1 at some point in the future would be (the present value, or “PV”) based on the implied date of receipt and the discount rate assumption.
```ts
fiscal.discountFactor(rate: number, numberOfIntervals: number): number
```

### Capital Asset Pricing Model (CAPM)
The capital asset pricing model provides a formula that calculates the expected return on a security based on its level of risk. The formula for the capital asset pricing model is the risk-free rate plus beta times the difference of the return on the market and the risk-free rate.
```ts
fiscal.capitalAssetPricingModel(riskFreeRate: number, expectedMarketReturn: number, beta: number): number
```
