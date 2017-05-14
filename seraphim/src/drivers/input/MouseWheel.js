import Peaks from './Peaks';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

export default class MouseWheel {

    constructor(events) {
        this.events = {};
        Object.keys(events).forEach(key => {
            this.events[key] = throttle(events[key], 200);
        });
        this.dxSignal = new Peaks({ onPeak: this.onDxPeak });
        this.dySignal = new Peaks({ onPeak: this.onDyPeak });
    }

    triggerSwipe(event) {
        this.events[event] && this.events[event]();
    }

    resetPeaks = debounce(() => {
        this.dxSignal.reset();
        this.dySignal.reset();
    }, 500)

    onDxPeak = (peak) => {
        this.triggerSwipe(peak < 0 ? 'onSwipeLeft' : 'onSwipeRight'); 
    }

    onDyPeak = (peak) => {
        this.triggerSwipe(peak < 0 ? 'onSwipeUp' : 'onSwipeDown'); 
    }

    onWheel = (dx, dy) => {
        if (Math.abs(dx) > Math.abs(dy)) {
            this.dxSignal.push(dx);
        } else {
            this.dySignal.push(dy);
        }
        this.resetPeaks();
    }

}
