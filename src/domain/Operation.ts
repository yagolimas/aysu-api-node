export default abstract class Operation {
    timeHoursTotal: number = 10

    abstract calculate(): number
}

class Calories extends Operation {

    calculate(): number {
        return this.timeHoursTotal / 2
    }
}