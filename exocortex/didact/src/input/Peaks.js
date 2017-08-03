import stats from 'simple-statistics';

export default class Peaks {

    samples = [];

    constructor(events) {
        this.events = events;
    }

    triggerPeak(value) {
        if (this.events.onPeak) {
            this.events.onPeak(value < 0 ? -1 : 1);
        }
    }

    reset() {
        this.samples = [];
        this.down = false;
        this.peak = undefined;
    }

    push(value) {
        this.samples.push(value);
        const mean = Math.abs(Math.round(stats.mean(this.samples)));

        if (this.peak === undefined) {
            this.triggerPeak(value);
            this.peak = mean;
            this.down = false;
        } else if (mean > this.peak) {
            this.peak = mean;
            if (this.down) {
                this.triggerPeak(value);
                this.down = false;
            }
        } else if (mean < this.peak) {
            this.peak = mean;
            this.down = true;
        }

        if (this.samples.length > 10) this.samples.shift();
    }
}