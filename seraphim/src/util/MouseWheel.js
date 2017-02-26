import { throttle, debounce } from '../util/timing';

export default class MouseWheel {

    constructor(events) {
        this.events = {};
        Object.keys(events).forEach(key => {
            this.events[key] = throttle(events[key], 400);
        });
    }

    reset = () => {
        this.up = undefined;
        this.down = undefined;
        this.left = undefined;
        this.right = undefined;
    }

    resetDelay = debounce(this.reset, 100)

    handleUp(delta) {
        if ((this.up === undefined || delta > this.up) && this.events.onSwipeUp) {
            this.events.onSwipeUp();
        }
        this.reset();
        this.up = delta;
    }

    handleDown(delta) {
        if ((this.down === undefined || delta > this.down) && this.events.onSwipeDown) {
            this.events.onSwipeDown();
        }
        this.reset();
        this.down = delta;
    }

    handleLeft(delta) {
        if ((this.left === undefined || delta > this.left) && this.events.onSwipeLeft) {
            this.events.onSwipeLeft();
        }
        this.reset();
        this.left = delta;
    }

    handleRight(delta) {
        if ((this.left === undefined || delta > this.left) && this.events.onSwipeLeft) {
            this.events.onSwipeLeft();
        }
        this.reset();
        this.right = delta;
    }

    onWheel = (dx, dy) => {
        dx = Math.round(dx);
        dy = Math.round(dy);
        if (dy < 0) this.handleUp(-dy);
        if (dy > 0) this.handleDown(dy);
        if (dx < 0) this.handleLeft(-dx);
        if (dx > 0) this.handleRight(dx);
        this.resetDelay();
    }

}
