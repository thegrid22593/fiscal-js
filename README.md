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
**Future Value (FV)**
==fiscal.futureValue(principal: number, rate: number, numberOfIntervals: number)==
```
const fiscal = require('fiscal-js');
//or
import { fiscal } from "fiscal-js";

fiscal.futureValue(50000, 10, 5);
// 80525.5
```
