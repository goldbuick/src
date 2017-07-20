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
        this.events[event] && this.events[event](this.clientX, this.clientY);
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

    handleWheel = (e) => {
        e.preventDefault();

        const deltaX = e.deltaX;
        const deltaY = e.deltaY;
        this.clientX = e.clientX;
        this.clientY = e.clientY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.dxSignal.push(deltaX);
        } else {
            this.dySignal.push(deltaY);
        }

        this.resetPeaks();
    }

}
