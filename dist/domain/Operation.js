"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Operation {
    constructor() {
        this.timeHoursTotal = 10;
        this.calcs = new Array();
        this.calcs.push(new Calories());
    }
}
exports.default = Operation;
class Calculate extends Operation {
}
class Calories extends Calculate {
    calculate() {
        return this.timeHoursTotal / 2;
    }
}
