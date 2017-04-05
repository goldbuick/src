import MouseWheel from './MouseWheel';

const userAgent = window.navigator.userAgent;
const iOSdevice = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);

export default class Gesture {

    constructor(events = {}) {
        this.pointers = {};
        this.events = events;
        this.mousewheel = new MouseWheel({
            onSwipeLeft: this.onSwipeLeft,
            onSwipeRight: this.onSwipeRight,
            onSwipeUp: this.onSwipeUp,
            onSwipeDown: this.onSwipeDown,
        });
    }

    triggerSwipe(event) {
        this.events[event] && this.events[event]();
    }

    onSwipeLeft = () => this.triggerSwipe('onSwipeLeft')
    onSwipeRight = () => this.triggerSwipe('onSwipeRight')
    onSwipeUp = () => this.triggerSwipe('onSwipeUp')
    onSwipeDown = () => this.triggerSwipe('onSwipeDown')

    onWheel = (dx, dy) => this.mousewheel.onWheel(dx, dy)

    pointerDelta(id, pressed, x, y) {
        const timestamp = performance.now();

        let pointer = this.pointers[id];
        if (pointer === undefined) {
            let sx = x, sy = y;
            pointer = { x, y, sx, sy, timestamp };
            this.pointers[id] = pointer;
        }

        const sx = pointer.sx;
        const sy = pointer.sy;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        
        pointer.x = x;
        pointer.y = y;

        const delta = timestamp - pointer.timestamp;
        pointer.timestamp = timestamp;
        
        const vx = delta ? dx / delta : 0;
        const vy = delta ? dy / delta : 0;

        if (pressed && !pointer.holding) pointer.holding = 1;
        if (!pressed || dx > 3 || dy > 3) pointer.holding = 0;
        const holding = pointer.holding || 0;

        if (pressed === false) {
            delete this.pointers[id];
        }

        return { sx, sy, dx, dy, vx, vy, holding };
    }

    onPointer = (e, id, pressed, x, y) => {
        if (iOSdevice) e.preventDefault();

        const threshold = 2;
        const { dx, dy, vx, vy, holding } = this.pointerDelta(id, pressed, x, y);

        if (!this.xSwipe && vx < -threshold) {
            this.xSwipe = true;
            this.onSwipeLeft();
        }
        if (!this.xSwipe && vx > threshold) {
            this.xSwipe = true;
            this.onSwipeRight();
        }
        if (vx === 0) this.xSwipe = false;

        if (!this.ySwipe && vy < -threshold) {
            this.ySwipe = true;
            this.onSwipeUp();
        }
        if (!this.ySwipe && vy > threshold) {
            this.ySwipe = true;
            this.onSwipeDown();
        }
        if (vy === 0) this.ySwipe = false;

        if (this.events.onVelocity) {
            this.events.onVelocity(dx, dy, holding && !this.xSwipe && !this.ySwipe);
        }
    }

}
