import { HeartRate } from './HeartRate'
import Patient from './Patient'

export default class Session {
    
    heartRates: HeartRate[]
    patient: Patient
    ratePerceivedExertion: number
    
    constructor() {
        this.heartRates = []
    }

    setPatient(patient: Patient) {
        this.patient = patient
    }

    setRatePerceivedExertion(ratePerceivedExertion: number) {
        this.ratePerceivedExertion = ratePerceivedExertion
    }

    addHeartRate(heartRate: HeartRate) {
        this.heartRates.push(heartRate)
    }

    getTimeHoursTotal() {
        const lastHeartRateSession = this.heartRates[this.heartRates.length - 1]
        const hoursMinutesSeconds = lastHeartRateSession.time.split(':')
        const hours = Number(hoursMinutesSeconds[0])
        const minutes = Number(hoursMinutesSeconds[1])
        const seconds = Number(hoursMinutesSeconds[2])
        const minutesSecondsConvertHours = (minutes + (seconds / 60)) / 60
        const totalHours = hours + minutesSecondsConvertHours
        return Number(totalHours.toFixed(2))
    }

    getTimeMinutesTotal() {
        const lastHeartRateSession = this.heartRates[this.heartRates.length - 1]
        const hoursMinutesSeconds = lastHeartRateSession.time.split(':')
        const hours = Number(hoursMinutesSeconds[0])
        const minutes = Number(hoursMinutesSeconds[1])
        const seconds = Number(hoursMinutesSeconds[2])
        const minutesTotal = (hours * 60) + minutes + (seconds / 60)
        return Number(minutesTotal.toFixed(2))
    }

    getAvgHeartRate() {
        const totalHeartRates = this.heartRates.reduce((accum, curr) => accum + curr.value, 0)
        return totalHeartRates / this.heartRates.length
    }

    getMaxHeartRate() {
        const valuesHeartRate = this.heartRates.map(heartRate => heartRate.value)
        return Math.max(...valuesHeartRate)
    }

    getMinHeartRate() {
        const valuesHeartRate = this.heartRates.map(heartRate => heartRate.value)
        return Math.min(...valuesHeartRate)
    }

    getMaxVO2Result() {
        const k = 6.1
        const minHeartRate = this.getMinHeartRate()
        const maxHeartRate = this.getMaxHeartRate()
        const maxVO2Result = (k * (maxHeartRate / minHeartRate)) - (k - 1)
        return Number(maxVO2Result.toFixed(2))
    }

    getAvgVO2Result() {
        const k = 6.1
        const minHeartRate = this.getMinHeartRate()
        const avgHeartRate = this.getAvgHeartRate()
        const avgVO2Result = (k * (avgHeartRate / minHeartRate)) - (k - 1)
        return Number(avgVO2Result.toFixed(2))
    }

    getTotalCaloriesResult() {
        let totalCalories = 0
        const avgHeartRateResult = this.getAvgHeartRate()
        const maxVO2Result = this.getMaxVO2Result()
        const totalTimeHours = this.getTimeHoursTotal()
        if (this.patient.genre === 'M') {
            totalCalories = ((-95.7735 + (0.634 * avgHeartRateResult) + (0.404 * maxVO2Result) + (0.394 * this.patient.weight) + (0.271 * this.patient.age))/4.184) * 60 * totalTimeHours
        } else {
            totalCalories = ((-59.3954 + (0.45 * avgHeartRateResult) + (0.380 * maxVO2Result) + (0.103 * this.patient.weight) + (0.274 * this.patient.age))/4.184) * 60 * totalTimeHours
        }
        return Number(totalCalories.toFixed())
    }

    getTrimpResult() {
        const maxHeartRate = this.getMaxHeartRate() - this.patient.age
        const porcentageHeartRate = (101.2133333 / maxHeartRate) * 100
        let intensityZone = 0;
        if (porcentageHeartRate >= 50 && porcentageHeartRate < 59) {
            intensityZone = 1
        }
        else if (porcentageHeartRate >= 60 && porcentageHeartRate < 69) {
            intensityZone = 2
        }
        else if (porcentageHeartRate >= 70 && porcentageHeartRate < 79) {
            intensityZone = 3
        }
        else if (porcentageHeartRate >= 80 && porcentageHeartRate < 89) {
            intensityZone = 4
        }
        else if (porcentageHeartRate >= 90 && porcentageHeartRate < 100) {
            intensityZone = 5
        }
        const totalTime = this.getTimeMinutesTotal()
        const trimpResult = intensityZone * totalTime
        return trimpResult
    }

    /**
     * 1 - Dado um conjunto de intervalos RR, deve-se calcular a raiz quadrada da media da diferenca entre os intervalos
     *   1.1 - Calcular a soma da diferenca dos intervalos RR (intervalo corrente - prox. intervalo) e depois eleva ao quadrado
     *   1.2 - Calcular a media dos intervalos RR baseado na soma gerada
     *   1.3 - Calcular a raiz quadrada do resultado baseado na media
     */
    getRootMeanSquareSuccesiveDifferences() {
        const rrIntervals = this.heartRates
            .filter(heartRate => heartRate.rrInterval && heartRate.rrInterval > 0)
            .map(heartRate => heartRate.rrInterval)
        let sumSquareDiferrences = 0
        rrIntervals.forEach((rrInterval, index) => {
            const nextRRInterval = rrIntervals[index + 1]
            if (rrInterval && nextRRInterval) {
                const squaredDifference = Math.pow((rrInterval - nextRRInterval), 2)
                if (!isNaN(squaredDifference)) {
                    sumSquareDiferrences += squaredDifference
                }
            }
        })
        const mean = sumSquareDiferrences/(rrIntervals.length - 1)
        const rmssdResult = Math.sqrt(mean)
        return Number(rmssdResult.toFixed(2))
    }

    /**
     * 1 - Para cada 5 minutos de sessao, deve-se calcular a media dos intervalos RR
     * 2 - Dado um conjunto de medias dos intervalos RR, deve-se calcular desvio padrao
     *   2.1 - Calcular média das médias do intervalos
     *   2.2 - Calcular variancia dos intervalos em relacao ah media
     *   2.3 - Calcular a raiz quadrada do resultado obtido da variancia
     */
    getStandardDeviationOfNN() {
        let sumRRIntervals = 0, countInterval = 0
        const meansRRIntervals = []
        for (const heartRate of this.heartRates) {
            if (heartRate.rrInterval) {
                countInterval += 1
                sumRRIntervals += heartRate.rrInterval
                const timeSplit = heartRate.time.split(':')
                const minutes =  Number(timeSplit[1])
                if (minutes % 5 === 0) {
                    const mean = sumRRIntervals / countInterval
                    meansRRIntervals.push(mean)
                    countInterval = 0
                    sumRRIntervals = 0
                }
            }
        }
        const meanRRIntervals = meansRRIntervals.reduce((total, meanValueRR) => 
            total + meanValueRR / meansRRIntervals.length, 0)
        const varianceRRIntervals = meansRRIntervals.reduce((total, meanValueRR) => 
            total + Math.pow(meanRRIntervals - meanValueRR, 2) / (meansRRIntervals.length - 1), 0)
        const sdnnResult = Math.sqrt(varianceRRIntervals)
        return Number(sdnnResult.toFixed())
    }
}