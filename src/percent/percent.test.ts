import { Percent } from "./index";

test('a percent can be returned as a string', () => {

    let percent = new Percent(10).asString();

    expect(percent).toBe("10%");

});

test('a percent can be returned as a decimal', () => {

    let percent = new Percent(10).asDecimal();

    expect(percent).toBe(0.1);

});