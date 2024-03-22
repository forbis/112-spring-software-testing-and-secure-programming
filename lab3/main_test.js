const { describe, it } = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

// TODO: write your tests here
describe("Calculator Test", () => {
    const calculator = new Calculator();
    it("Calculator.exp() Test", () => {
        let expTestcase = [
            { param: 1, expected: Math.exp(1) },
            { param: 0, expected: Math.exp(0) },
            { param: -1, expected: Math.exp(-1) },
            { param: 'c8763', expected: Error, msg: "unsupported operand type" },
            { param: Infinity, expected: Error, msg: "unsupported operand type" },
            { param: Math.MAX_VALUE, expected: Error, msg: "overflow" },
        ];

        expTestcase.map(({ param, expected, msg }) => {
            if (expected === Error) {
                assert.throws(() => calculator.exp(param), expected, msg);
            }
            else {
                assert.strictEqual(calculator.exp(param), expected);
            }
        });
    });

    it("Calculator.log() Test", () => {
        let logTestcase = [
            { param: 1, expected: Math.log(1) },
            { param: 'c8763', expected: Error, msg: "unsupported operand type" },
            { param: Infinity, expected: Error, msg: "unsupported operand type" },
            { param: -Infinity, expected: Error, msg: "unsupported operand type" },
            { param: 0, expected: Error, msg: "math domain error (1)" },
            { param: -1, expected: Error, msg: "math domain error (2)" },
        ];

        logTestcase.map(({ param, expected, msg }) => {
            if (expected === Error) { 
                assert.throws(() => calculator.log(param), expected, msg);
            }
            else {
                assert.strictEqual(calculator.log(param), expected);
            }
        });
    });
});
