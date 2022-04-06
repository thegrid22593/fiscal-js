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

fiscal.futureValue(50000, 10, 5);
// 80525.5
```

## API

### Present Value (PV)
Present value (PV) is the current value of a future sum of money or stream of cash flows given a specified rate of return.

```ts
fiscal.presentValue(terminalValue: number, rate: number, numberOfYears: number)
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
