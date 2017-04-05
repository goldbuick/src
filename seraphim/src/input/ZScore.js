import stats from 'simple-statistics';

export default class ZScore {

    static LAG = 5;
    static THRESHOLD = 3.5;
    static INFLUCENCE = 0.5;

    samples = [];

    push(value) {
        if (this.samples.length < ZScore.LAG) {
            this.samples.push(value);
        } else {
            const mean = stats.mean(this.samples);
            const standardDeviation = stats.standardDeviation(this.samples);
            const zScore = stats.zScore(value, mean, standardDeviation);
            console.log(value, zScore);
            this.samples.shift();
            this.samples.push(value);
        }
    }
}